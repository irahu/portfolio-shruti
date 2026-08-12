import { motion } from "framer-motion";
import { Palette, Camera, Share2, Brush, Film, Sun, Mountain, TreePine } from "lucide-react";

const services = [
  { icon: Palette, title: "Poster Design", desc: "Eye-catching posters for events, campaigns, and promotions." },
  { icon: Camera, title: "Photo Manipulation", desc: "Surreal, creative composites that tell powerful visual stories." },
  { icon: Share2, title: "Social Media Creatives", desc: "Scroll-stopping content designed for engagement and reach." },
  { icon: Brush, title: "Branding", desc: "Complete brand identity from logo to guidelines." },
  { icon: Film, title: "Digital Designs\u00a0", desc: "Dynamic animations and title sequences that captivate." },
  { icon: Sun, title: "Color Correction", desc: "Professional color grading for photos and video." },
  { icon: Mountain, title: "Matte Painting", desc: "Photorealistic digital environments and landscapes." },
  { icon: TreePine, title: "UI/UX Design", desc: "Immersive world-building for games and film." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const ServicesSection = () => (
  <section id="services" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">What I Offer</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">Services</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={item}
            className="group p-6 bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-glow text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-primary flex items-center justify-center">
              <service.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;
