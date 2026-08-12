import { motion } from "framer-motion";

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">Get to Know Me</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">About Me</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-lg">
            Creative and detail-oriented <span className="text-foreground font-medium">Graphic Designer</span> with professional experience of 1 year,&nbsp; specializing in&nbsp;<span className="text-primary font-medium">Graphic Design and 2D&nbsp;animation</span>. Proven ability to develop visually compelling designs that align with brand identity and project goals.
          </p>
          <p>
            Holds a Bachelor's degree in Computer Applications from Chandigarh University and a Diploma in Designing from Briliko Institute of Multimedia, with post graduation in Animation and VFX from Asian International University.
          </p>
          <p>
            Skilled in visual storytelling, digital design tools, and Microsoft 365, with a strong focus on adaptability, collaboration, and delivering innovative solutions that contribute to organizational success.
          </p>
        </motion.div>

        {/* Design Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 bg-card rounded-xl border border-border"
        >
          <h3 className="font-display text-2xl font-bold mb-4 text-gradient">My Design Philosophy</h3>
          <p className="text-muted-foreground leading-relaxed">
            My design philosophy centers on purposeful creativity—every visual element should serve a clear function while telling a compelling story. I believe strong design is not just aesthetically pleasing but also communicates effectively, solves problems, and connects emotionally with its audience. I focus on balance, hierarchy, color psychology, and composition to ensure that each design is both visually striking and strategically aligned with the client's goals.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Continuous learning and experimentation are essential to my process, allowing me to evolve with design trends while maintaining originality. For me, design is not just about creating visuals; it's about crafting meaningful experiences that leave a lasting impact.
          </p>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="font-display text-2xl font-bold mb-6">Education</h3>
          <div className="space-y-4">
            {[
              { degree: "PG in Animation & VFX", school: "Asian International University", year: "Completed" },
              { degree: "Diploma in Designing", school: "Briliko Institute of Multimedia", year: "Completed" },
              { degree: "BCA – Computer Applications", school: "Chandigarh University", year: "Completed" },
            ].map((edu) => (
              <div key={edu.degree} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-gradient-primary shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.school} • {edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
