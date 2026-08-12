import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id?: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  image: string;
  link: string;
}

const fallbackProjects: Project[] = [
  {
    title: "Brand Identity – Luxe Studio",
    category: "Branding",
    description: "Complete brand identity design including logo, color palette, and brand guidelines for a luxury design studio.",
    tools: ["Adobe Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Graphic Design Collection",
    category: "Graphic Design",
    description: "A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.",
    tools: ["Adobe Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Social Media Campaign",
    category: "Social Media",
    description: "Series of social media creatives for a lifestyle brand's seasonal campaign across Instagram and Facebook.",
    tools: ["Photoshop", "Illustrator"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Digital Design Collection",
    category: "Digital Designs",
    description: "A series of digital designs blending typography, illustration, and photo manipulation for web and social media.",
    tools: ["Photoshop", "Illustrator"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Event Poster Series",
    category: "Poster Design",
    description: "A collection of event posters featuring bold typography, vibrant color grading, and dynamic compositions.",
    tools: ["Photoshop", "Illustrator"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "AI Generated Artworks",
    category: "AI Generations",
    description: "A collection of AI-generated visuals crafted through prompt engineering and creative direction, refined for cohesive, on-brand results.",
    tools: ["Midjourney", "Photoshop"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Branding & Visual Identity Design – Zuni",
    category: "Graphic Design",
    description: "A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.",
    tools: ["Adobe Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
  {
    title: "Branding ",
    category: "Branding graphic design",
    description: "A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.",
    tools: ["Adobe Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    link: "https://www.behance.net",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching projects from Supabase:", error);
        } else if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">Selected Work</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Portfolio</h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, idx) => (
            <motion.a
              key={project.title + "-" + idx}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-glow transition-shadow duration-300 cursor-pointer block"
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="text-primary" size={28} />
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{project.category}</span>
                <h3 className="font-display text-lg font-semibold mt-1 mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tools && project.tools.map((tool) => (
                    <span key={tool} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;

