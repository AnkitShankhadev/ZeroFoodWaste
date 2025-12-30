import { motion } from "framer-motion";
import { Camera, MapPin, Truck, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "List Your Food",
    description: "Snap a photo, add details about quantity and expiry. It takes less than a minute.",
    color: "from-green-400 to-green-600",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Get Matched",
    description: "Our system instantly finds nearby NGOs who can collect and distribute your donation.",
    color: "from-blue-400 to-blue-600",
  },
  {
    number: "03",
    icon: Truck,
    title: "Easy Pickup",
    description: "A volunteer picks up the food at your convenience. Track the entire journey.",
    color: "from-purple-400 to-purple-600",
  },
  {
    number: "04",
    icon: Heart,
    title: "Make Impact",
    description: "Your food reaches those in need. Earn points and see your contribution grow.",
    color: "from-amber-400 to-amber-600",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-green-50/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Donate Food in{" "}
            <span className="text-primary">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've made it incredibly easy to share your surplus food and make a difference in someone's life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-300 to-transparent" />
              )}

              <div className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center text-sm shadow-md">
                  {step.number}
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-md`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
