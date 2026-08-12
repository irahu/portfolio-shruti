const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require("dotenv");

console.log(
  "Starting automatic synchronization of projects data to SQL migration..."
);

try {
  // ============================================================
  // 1. Load environment variables
  // ============================================================

  const envPath = path.join(__dirname, "..", ".env");

  /*
   * Local development:
   * If .env exists, load it.
   *
   * Vercel:
   * .env normally does not exist.
   * Vercel provides environment variables through process.env.
   */
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("Loaded environment variables from .env");
  } else {
    console.log(
      ".env not found. Using environment variables from deployment environment."
    );
  }

  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  const projectRef = process.env.VITE_SUPABASE_PROJECT_ID;

  if (!dbPassword || !projectRef) {
    console.warn(
      "Skipping DB update: SUPABASE_DB_PASSWORD or VITE_SUPABASE_PROJECT_ID is not configured."
    );

    process.exit(0);
  }

  console.log("Supabase environment variables loaded successfully.");

  // ============================================================
  // 2. Read PortfolioSection.tsx
  // ============================================================

  const portfolioPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "PortfolioSection.tsx"
  );

  if (!fs.existsSync(portfolioPath)) {
    throw new Error("PortfolioSection.tsx not found");
  }

  const portfolioContent = fs.readFileSync(portfolioPath, "utf8");

  /*
   * Find:
   *
   * const fallbackProjects: Project[] = [
   *    ...
   * ];
   *
   * The regex captures the array between [ and ].
   */
  const arrayMatch = portfolioContent.match(
    /const\s+fallbackProjects\s*:\s*Project\[\]\s*=\s*(\[[\s\S]*?\]);/
  );

  if (!arrayMatch) {
    throw new Error(
      "Could not parse fallbackProjects array from PortfolioSection.tsx"
    );
  }

  console.log("Successfully found fallbackProjects array.");

  // ============================================================
  // 3. Convert projects array
  // ============================================================

  let projects;

  try {
    projects = eval(`(${arrayMatch[1]})`);
  } catch (evalErr) {
    throw new Error(
      "Failed to evaluate projects array: " + evalErr.message
    );
  }

  if (!Array.isArray(projects)) {
    throw new Error("Parsed fallbackProjects is not an array");
  }

  console.log(`Found ${projects.length} projects.`);

  // ============================================================
  // 4. Generate SQL values
  // ============================================================

  const quoteOrNull = (val) => {
    if (val === null || val === undefined) {
      return "NULL";
    }

    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const valuesSql = projects
    .map((p) => {
      const title = quoteOrNull(p.title);
      const category = quoteOrNull(p.category);
      const description = quoteOrNull(p.description);

      const tools =
        p.tools && Array.isArray(p.tools)
          ? `ARRAY[${p.tools
              .map(
                (t) => `'${String(t).replace(/'/g, "''")}'`
              )
              .join(", ")}]`
          : "DEFAULT";

      const image = quoteOrNull(p.image);
      const link = quoteOrNull(p.link);

      return `(${title}, ${category}, ${description}, ${tools}, ${image}, ${link})`;
    })
    .join(",\n");

  // ============================================================
  // 5. Generate migration SQL
  // ============================================================

  const migrationSql = `CREATE TABLE IF NOT EXISTS public.projects (
id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
title text NOT NULL,
category text,
description text,
tools text[] DEFAULT '{}'::text[],
image text,
link text,
created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Allow public read access" ON public.projects;

CREATE POLICY "Allow public read access" ON public.projects
FOR SELECT TO public USING (true);

-- Clean existing data to avoid duplicates
TRUNCATE public.projects;

-- Insert projects
INSERT INTO public.projects
(title, category, description, tools, image, link)
VALUES
${valuesSql};
`;

  // ============================================================
  // 6. Update local migration file
  // ============================================================

  const migrationDir = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations"
  );

  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }

  const migrationPath = path.join(
    migrationDir,
    "20260715214000_create_projects_table.sql"
  );

  fs.writeFileSync(
    migrationPath,
    migrationSql,
    "utf8"
  );

  console.log(
    `Successfully updated migration file at: ${migrationPath}`
  );

  // ============================================================
  // 7. Create Supabase database URL
  // ============================================================

  console.log("Updating remote database projects table...");

  const dbUrl =
    `postgresql://postgres.${projectRef}:` +
    `${encodeURIComponent(dbPassword)}` +
    `@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

  // ============================================================
  // 8. Split SQL statements
  // ============================================================

  const statements = migrationSql
    .split(/;\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(
    `Executing ${statements.length} SQL statements sequentially...`
  );

  // ============================================================
  // 9. Execute SQL statements
  // ============================================================

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    const tempFilePath = path.join(
      __dirname,
      `temp_stmt_${i}.sql`
    );

    fs.writeFileSync(
      tempFilePath,
      statement + ";",
      "utf8"
    );

    try {
      const cmd =
        `npx -y supabase db query ` +
        `--file "${tempFilePath}" ` +
        `--db-url "${dbUrl}"`;

      console.log(`Executing SQL statement ${i + 1}...`);

      execSync(cmd, {
        stdio: "inherit",
      });

      console.log(
        `SQL statement ${i + 1} executed successfully.`
      );

    } catch (cmdErr) {
      console.error(
        `Failed to execute SQL statement ${i + 1}.`
      );

      console.error("Statement:");

      console.error(statement);

      throw cmdErr;

    } finally {
      // Always delete temporary SQL file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  // ============================================================
  // 10. Finished
  // ============================================================

  console.log(
    "Successfully synchronized database projects table with local configuration!"
  );

} catch (err) {
  console.error(
    "Error during synchronization:",
    err.message
  );

  process.exit(1);
}