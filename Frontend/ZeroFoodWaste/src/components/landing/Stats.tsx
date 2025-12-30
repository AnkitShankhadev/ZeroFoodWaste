import { motion } from "framer-motion";
import { Scale, Users, Building2, Leaf } from "lucide-react";

const stats = [
  { 
    icon: Scale, 
    value: "50,000+", 
    label: "Kg Food Saved", 
    detail: "From going to waste",
    iconColor: "text-white"
  },
  { 
    icon: Users, 
    value: "10,000+", 
    label: "Active Users", 
    detail: "Donors & volunteers",
    iconColor: "text-white"
  },
  { 
    icon: Building2, 
    value: "250+", 
    label: "NGO Partners", 
    detail: "Across the country",
    iconColor: "text-white"
  },
  { 
    icon: Leaf, 
    value: "100T", 
    label: "CO2 Saved", 
    detail: "Environmental impact",
    iconColor: "text-white"
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-[#16A34A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Impact in Numbers</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Together, our community is making a real difference in fighting food waste and hunger.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-sm font-semibold mb-1 text-white">{stat.label}</div>
                <div className="text-xs text-white/80">{stat.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
