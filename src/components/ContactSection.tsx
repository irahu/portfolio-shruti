import { motion } from "framer-motion";
import { Mail, Linkedin, Phone, MapPin, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const RESUME_BUCKET = "resume";
const RESUME_FILE = "shruti-resume.pdf";

const handleDownload = async () => {
  const { data } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(RESUME_FILE);
  try {
    const response = await fetch(data.publicUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = RESUME_FILE;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback if fetch fails
    window.open(data.publicUrl, "_blank");
  }
};

const ContactSection = () => (
  <section id="contact" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">Let's Work Together</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">Get in Touch</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <a
            href="mailto:shrutiofficial0518@gmail.com"
            className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Mail size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">shrutiofficial0518@gmail.com</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/shruti-singh-659318222"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Linkedin size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">LinkedIn</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">Shruti Singh</p>
            </div>
          </a>

          <a
            href="tel:+919417238279"
            className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Phone size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">+91 9417238279</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
              <p className="text-sm font-medium">Bangalore, India</p>
            </div>
          </div>
        </div>

        {/* Resume download */}
        <div className="text-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-glow"
          >
            <Download size={18} />
            Download Resume
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ContactSection;
