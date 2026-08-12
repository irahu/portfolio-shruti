import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Design Skills",
    skills: ["Typography", "Color Theory", "Composition", "Blending", "Visual Storytelling", "Layout Design"],
  },
  {
    title: "Software",
    skills: ["Adobe Photoshop", "Adobe Illustrator", "After Effects", "AI Tools", "Figma", "Canva"],
  },
  {
    title: "Specialties",
    skills: ["Photo Manipulation", "Brochure Design", "Matte Painting", "Color Correction", "2D Animation", "Digital Designs", "Social Media Design", "UI/UX Design"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SkillsSection = () => (
  <section id="skills" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">What I Bring</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">Skills & Expertise</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {skillCategories.map((cat) => (
          <motion.div
            key={cat.title}
            variants={item}
            className="bg-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors shadow-card"
          >
            <h3 className="font-display text-xl font-bold mb-6 text-gradient">{cat.title}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SkillsSection;
