import { motion } from "framer-motion";
import { 
  Gift, 
  MapPin, 
  Users, 
  Trophy, 
  Bell, 
  BarChart3,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Gift,
    title: "Easy Donations",
    description: "List your surplus food in seconds. Add photos, quantities, and expiry dates with our intuitive interface.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: MapPin,
    title: "Smart Matching",
    description: "Our algorithm connects you with nearby NGOs and volunteers for quick, efficient food rescue.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Community Network",
    description: "Join a growing community of donors, NGOs, and volunteers working together to end food waste.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Collect points, unlock badges, and climb the leaderboard as you make a positive impact.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Stay informed with instant notifications about donation status, pickups, and achievements.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Track your contribution with detailed dashboards showing meals saved and environmental impact.",
    color: "bg-teal-100 text-teal-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Make a Difference</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed to make food donation simple, 
            rewarding, and impactful for everyone involved.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
