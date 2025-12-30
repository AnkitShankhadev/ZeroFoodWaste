import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-soft" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-32 right-[20%] w-20 h-20 bg-green-300/40 rounded-2xl rotate-12"
        animate={{ y: [0, -20, 0], rotate: [12, 20, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-[15%] w-16 h-16 bg-amber-300/40 rounded-full"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Join 10,000+ food heroes
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Turn Surplus Into{" "}
              <span className="text-gradient-primary">Smiles</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with local NGOs and volunteers to donate excess food before it goes to waste. 
              Together, we can end hunger and save the planet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth/register">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  Start Donating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
             
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {[
                { value: "50K+", label: "Meals Saved" },
                { value: "500+", label: "Active Donors" },
                { value: "100+", label: "NGO Partners" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-card rounded-3xl shadow-xl p-8 border border-border">
                <div className="aspect-square bg-gradient-soft rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow">
                      <span className="text-5xl">🍎</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Fresh Produce Available</h3>
                    <p className="text-muted-foreground text-sm mb-4">5kg of vegetables • Expires in 2 days</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      3 NGOs nearby
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 top-20 bg-card rounded-xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Donation Accepted!</p>
                    <p className="text-xs text-muted-foreground">FoodBank NGO • 2 min ago</p>
                  </div>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -left-4 bottom-20 bg-card rounded-xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Super Donor</p>
                    <p className="text-xs text-amber-600">50 donations milestone!</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
