const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Starting automatic synchronization of projects data to SQL migration...");

try {
  // 1. Read .env file manually
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error(".env file not found");
  }
  const dotenvContent = fs.readFileSync(envPath, "utf8");
  const env = {};
  dotenvContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value;
    }
  });

  const dbPassword = env.SUPABASE_DB_PASSWORD;
  const projectRef = env.VITE_SUPABASE_PROJECT_ID;

  if (!dbPassword || !projectRef) {
    console.warn("Skipping DB update: SUPABASE_DB_PASSWORD or VITE_SUPABASE_PROJECT_ID not set in .env");
    process.exit(0);
  }

  // 2. Parse projects from PortfolioSection.tsx
  const portfolioPath = path.join(__dirname, '..', 'src', 'components', 'PortfolioSection.tsx');
  if (!fs.existsSync(portfolioPath)) {
    throw new Error("PortfolioSection.tsx not found");
  }
  const portfolioContent = fs.readFileSync(portfolioPath, 'utf8');
  
  const arrayMatch = portfolioContent.match(/const fallbackProjects:\s*Project\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (!arrayMatch) {
    throw new Error("Could not parse fallbackProjects array from PortfolioSection.tsx");
  }

  // Evaluate the parsed string to get a javascript array
  let projects;
  try {
    projects = eval(`(${arrayMatch[1]})`);
  } catch (evalErr) {
    throw new Error("Failed to evaluate projects array: " + evalErr.message);
  }

  if (!Array.isArray(projects)) {
    throw new Error("Parsed projects is not an array");
  }

  // 3. Generate SQL insert values
  const quoteOrNull = (val) => val === null || val === undefined ? "NULL" : `'${val.replace(/'/g, "''")}'`;
  
  const valuesSql = projects.map(p => {
    const title = quoteOrNull(p.title);
    const category = quoteOrNull(p.category);
    const description = quoteOrNull(p.description);
    const tools = p.tools && Array.isArray(p.tools) 
      ? `ARRAY[${p.tools.map(t => `'${t.replace(/'/g, "''")}'`).join(", ")}]` 
      : "DEFAULT";
    const image = quoteOrNull(p.image);
    const link = quoteOrNull(p.link);

    return `(${title}, ${category}, ${description}, ${tools}, ${image}, ${link})`;
  }).join(",\n");

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

-- Create policy for public read access (Anyone can view projects)
DROP POLICY IF EXISTS "Allow public read access" ON public.projects;
CREATE POLICY "Allow public read access" ON public.projects
    FOR SELECT TO public USING (true);

-- Clean existing data to avoid duplicates
TRUNCATE public.projects;

-- Insert projects
INSERT INTO public.projects (title, category, description, tools, image, link)
VALUES
${valuesSql};
`;

  // 4. Update local migration file
  const migrationDir = path.join(__dirname, '..', 'supabase', 'migrations');
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }
  const migrationPath = path.join(migrationDir, '20260715214000_create_projects_table.sql');
  fs.writeFileSync(migrationPath, migrationSql, 'utf8');
  console.log(`Successfully updated migration file at: ${migrationPath}`);

  // 5. Connect and update remote database
  console.log("Updating remote database projects table...");
  const dbUrl = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  
  // Split statements by semicolon + newline to execute them sequentially
  const statements = migrationSql
    .split(/;\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Executing ${statements.length} SQL statements sequentially...`);
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const tempFilePath = path.join(__dirname, `temp_stmt_${i}.sql`);
    fs.writeFileSync(tempFilePath, statement + ';', 'utf8');
    try {
      const cmd = `npx -y supabase db query --file "${tempFilePath}" --db-url "${dbUrl}"`;
      execSync(cmd, { stdio: 'ignore' });
    } catch (cmdErr) {
      console.error(`Failed to execute statement ${i + 1}: ${statement}`);
      throw cmdErr;
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
  console.log("Successfully synchronized database projects table with local configuration!");

} catch (err) {
  console.error("Error during synchronization:", err.message);
  process.exit(1);
}
