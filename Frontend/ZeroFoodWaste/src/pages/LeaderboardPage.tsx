import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import AchievementsShowcase from "@/components/achievements/AchievementsShowcase";
import {
  Trophy,
  Star,
  TrendingUp,
  Gift,
  Building2,
  Users,
  Loader,
} from "lucide-react";

type TabType = "donors" | "ngos" | "volunteers";

interface LeaderboardEntry {
  rank: number;
  userId: { _id?: string; name: string; email: string; profileImage?: string };
  totalPoints: number;
  donationsCount?: number;
  pickupsCount?: number;
  collectionsCount?: number;
}

interface UserRank {
  rank: number | null;
  totalPoints: number;
  totalUsers: number;
  percentile: string;
  donationsCount?: number;
  pickupsCount?: number;
  achievementsCount?: number;
  badgesCount?: number;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

const roleMap: Record<TabType, string> = {
  donors: "DONOR",
  ngos: "NGO",
  volunteers: "VOLUNTEER",
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("donors");
  const [timeframe, setTimeframe] = useState("monthly");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const role = roleMap[activeTab];
        const response = await api.get<{
          success: boolean;
          data: { leaderboard: LeaderboardEntry[] };
        }>(`/leaderboard?role=${role}&limit=10`);
        setLeaderboardData(response.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeTab]);

  // Fetch user's rank
  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        if (!user) return;
        const response = await api.get<{ success: boolean; data: UserRank }>(
          "/leaderboard/my-rank",
        );
        setUserRank(response.data);
      } catch (err) {
        console.error("Error fetching user rank:", err);
      }
    };

    fetchUserRank();
  }, [user]);

  // Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        if (!user) return;
        const response = await api.get<{
          success: boolean;
          data: { achievements: Achievement[] };
        }>("/achievements");
        setAchievements(response.data.achievements || []);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      }
    };

    fetchAchievements();
  }, [user]);

  const tabs = [
    { id: "donors" as TabType, label: "Donors", icon: Gift },
    { id: "ngos" as TabType, label: "NGOs", icon: Building2 },
    { id: "volunteers" as TabType, label: "Volunteers", icon: Users },
  ];

  const getLeaderboardTitle = () => {
    const titles: Record<TabType, string> = {
      donors: "Donors",
      ngos: "NGOs",
      volunteers: "Volunteers",
    };
    return titles[activeTab];
  };

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
              Celebrate our top contributors making a difference in fighting
              food waste
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                label: "Total Saved",
                value:
                  leaderboardData.length > 0
                    ? `${(leaderboardData.reduce((sum, item) => sum + (item.totalPoints || 0), 0) / 100).toFixed(0)} kg`
                    : "0 kg",
                icon: "🌱",
              },
              {
                label: "Active Users",
                value: userRank?.totalUsers?.toLocaleString() || "0",
                icon: "👥",
              },
              {
                label: "Your Points",
                value: userRank?.totalPoints?.toLocaleString() || "0",
                icon: "🎁",
              },
              {
                label: "Your Rank",
                value: userRank?.rank ? `#${userRank.rank}` : "—",
                icon: "📊",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="text-xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
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
                  <h3 className="font-semibold text-foreground">
                    Top {getLeaderboardTitle()}
                  </h3>
                  <div className="flex gap-2">
                    {["all-time"].map((tf) => (
                      <Button
                        key={tf}
                        variant={timeframe === tf ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTimeframe(tf)}
                      >
                        {tf.charAt(0).toUpperCase() +
                          tf.slice(1).replace("-", " ")}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="divide-y divide-border">
                  {loading ? (
                    <div className="p-8 text-center">
                      <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Loading leaderboard...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <p className="text-red-600">{error}</p>
                    </div>
                  ) : leaderboardData.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No leaderboard data available
                      </p>
                    </div>
                  ) : (
                    leaderboardData.map((item, index) => (
                      <motion.div
                        key={`${item.userId._id || item.userId.email}-${item.rank}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                          item.rank <= 3
                            ? "bg-gradient-to-r from-amber-50/50 to-transparent"
                            : ""
                        }`}
                      >
                        {/* Rank */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            item.rank === 1
                              ? "bg-amber-100 text-amber-600"
                              : item.rank === 2
                                ? "bg-gray-100 text-gray-600"
                                : item.rank === 3
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.rank <= 3
                            ? ["🥇", "🥈", "🥉"][item.rank - 1]
                            : item.rank}
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {item.userId.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {activeTab === "donors" &&
                              `${item.donationsCount || 0} donations`}
                            {activeTab === "ngos" &&
                              `${item.collectionsCount || 0} collections`}
                            {activeTab === "volunteers" &&
                              `${item.pickupsCount || 0} pickups`}
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className="font-bold text-foreground">
                            {item.totalPoints?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                            <TrendingUp className="w-3 h-3" />
                            ~trending
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
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
                    <h3 className="font-semibold text-foreground">
                      Your Achievements
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievements.length > 0
                        ? `${achievements.filter((a) => a.earnedAt).length} of ${achievements.length} unlocked`
                        : "0 achievements"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No achievements yet. Keep contributing!
                      </p>
                    </div>
                  ) : (
                    achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                          achievement.earnedAt
                            ? "bg-green-50 border border-green-200"
                            : "bg-muted/50 opacity-60"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                            achievement.earnedAt ? "bg-green-100" : "bg-muted"
                          }`}
                        >
                          {achievement.icon || "🏅"}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              achievement.earnedAt
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {achievement.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.earnedAt && (
                          <Badge className="bg-green-100 text-green-700">
                            Unlocked
                          </Badge>
                        )}
                      </motion.div>
                    ))
                  )}
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
