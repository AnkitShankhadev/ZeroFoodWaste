import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-10 rounded-bl-full" />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of food heroes who are already saving meals and fighting hunger. 
                Every donation counts, and together we can create a world with zero food waste.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=register&role=donor">
                  <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                    Become a Donor
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/auth?mode=register&role=ngo">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Register as NGO
                  </Button>
                </Link>
                <Link to="/auth?mode=register&role=volunteer">
                  <Button variant="soft" size="xl" className="w-full sm:w-auto">
                    Join as Volunteer
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required • Free forever for donors
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
