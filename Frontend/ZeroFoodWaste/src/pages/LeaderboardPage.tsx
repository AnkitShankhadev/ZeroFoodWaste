import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Medal, 
  Crown,
  Star,
  TrendingUp,
  Gift,
  Building2,
  Users,
  Calendar
} from "lucide-react";

const leaderboardData = {
  donors: [
    { rank: 1, name: "Green Garden Restaurant", points: 12500, donations: 156, badge: "🥇", trend: "+5" },
    { rank: 2, name: "Fresh Mart Supermarket", points: 10200, donations: 134, badge: "🥈", trend: "+3" },
    { rank: 3, name: "Sweet Delights Bakery", points: 8900, donations: 98, badge: "🥉", trend: "+2" },
    { rank: 4, name: "City Hotel & Restaurant", points: 7500, donations: 89, badge: "⭐", trend: "+1" },
    { rank: 5, name: "Organic Farms Co.", points: 6800, donations: 76, badge: "⭐", trend: "0" },
    { rank: 6, name: "Downtown Cafe", points: 5400, donations: 65, badge: "⭐", trend: "+4" },
    { rank: 7, name: "Quick Bites Restaurant", points: 4900, donations: 58, badge: "⭐", trend: "-1" },
    { rank: 8, name: "Morning Fresh Dairy", points: 4200, donations: 52, badge: "⭐", trend: "+2" },
  ],
  ngos: [
    { rank: 1, name: "Food Bank Central", points: 15000, collections: 210, badge: "🥇", trend: "+3" },
    { rank: 2, name: "Meals on Wheels", points: 12300, collections: 178, badge: "🥈", trend: "+1" },
    { rank: 3, name: "Community Kitchen", points: 9800, collections: 145, badge: "🥉", trend: "+2" },
    { rank: 4, name: "Hope Foundation", points: 8100, collections: 120, badge: "⭐", trend: "0" },
    { rank: 5, name: "Helping Hands NGO", points: 6500, collections: 98, badge: "⭐", trend: "+1" },
  ],
  volunteers: [
    { rank: 1, name: "Sarah Johnson", points: 5200, deliveries: 86, badge: "🥇", trend: "+2" },
    { rank: 2, name: "Mike Chen", points: 4800, deliveries: 78, badge: "🥈", trend: "+4" },
    { rank: 3, name: "Emily Davis", points: 4200, deliveries: 69, badge: "🥉", trend: "+1" },
    { rank: 4, name: "David Wilson", points: 3600, deliveries: 58, badge: "⭐", trend: "-1" },
    { rank: 5, name: "Lisa Martinez", points: 3100, deliveries: 51, badge: "⭐", trend: "+3" },
  ],
};

const achievements = [
  { id: 1, title: "First Donation", icon: "🎉", description: "Make your first donation", unlocked: true },
  { id: 2, title: "Helping Hand", icon: "🤝", description: "Complete 10 donations", unlocked: true },
  { id: 3, title: "Food Hero", icon: "🦸", description: "Save 100kg of food", unlocked: true },
  { id: 4, title: "Community Star", icon: "⭐", description: "Get 50 thank you notes", unlocked: false },
  { id: 5, title: "Super Saver", icon: "🏆", description: "Save 500kg of food", unlocked: false },
  { id: 6, title: "Legend", icon: "👑", description: "Reach #1 on leaderboard", unlocked: false },
];

type TabType = "donors" | "ngos" | "volunteers";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("donors");
  const [timeframe, setTimeframe] = useState("monthly");

  const tabs = [
    { id: "donors" as TabType, label: "Donors", icon: Gift },
    { id: "ngos" as TabType, label: "NGOs", icon: Building2 },
    { id: "volunteers" as TabType, label: "Volunteers", icon: Users },
  ];

  const currentData = leaderboardData[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mb-6 shadow-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Leaderboard & Achievements
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrate our top contributors making a difference in fighting food waste
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Saved", value: "50,000 kg", icon: "🌱" },
              { label: "Active Users", value: "10,234", icon: "👥" },
              { label: "Donations Today", value: "156", icon: "🎁" },
              { label: "Your Rank", value: "#42", icon: "📊" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-border">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary bg-green-50/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Timeframe selector */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Top {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                  <div className="flex gap-2">
                    {["weekly", "monthly", "all-time"].map((tf) => (
                      <Button
                        key={tf}
                        variant={timeframe === tf ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTimeframe(tf)}
                      >
                        {tf.charAt(0).toUpperCase() + tf.slice(1).replace("-", " ")}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="divide-y divide-border">
                  {currentData.map((item, index) => (
                    <motion.div
                      key={item.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                        item.rank <= 3 ? "bg-gradient-to-r from-amber-50/50 to-transparent" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        item.rank === 1 ? "bg-amber-100 text-amber-600" :
                        item.rank === 2 ? "bg-gray-100 text-gray-600" :
                        item.rank === 3 ? "bg-orange-100 text-orange-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.rank <= 3 ? item.badge : item.rank}
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {activeTab === "donors" && `${item.donations} donations`}
                          {activeTab === "ngos" && `${item.collections} collections`}
                          {activeTab === "volunteers" && `${item.deliveries} deliveries`}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="font-bold text-foreground">{item.points.toLocaleString()}</div>
                        <div className={`text-sm flex items-center justify-end gap-1 ${
                          parseInt(item.trend) > 0 ? "text-green-600" : 
                          parseInt(item.trend) < 0 ? "text-red-600" : "text-muted-foreground"
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          {item.trend}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your Achievements</h3>
                    <p className="text-sm text-muted-foreground">3 of 6 unlocked</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        achievement.unlocked 
                          ? "bg-green-50 border border-green-200" 
                          : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        achievement.unlocked ? "bg-green-100" : "bg-muted"
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {achievement.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-green-100 text-green-700">Unlocked</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeaderboardPage;
