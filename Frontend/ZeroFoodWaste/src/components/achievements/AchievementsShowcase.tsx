import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  _id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  pointsAwarded: number;
  earnedAt: string | null;
  targetValue?: number;
  currentValue?: number;
}

interface Badge {
  _id: string;
  badgeType: string;
  badgeName: string;
  icon: string;
  earnedAt: string;
}

const AchievementsShowcase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"achievements" | "badges">(
    "achievements",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [achievementsRes, badgesRes] = await Promise.all([
          api.getAchievements(),
          api.getBadges(),
        ]);

        if (achievementsRes.success) {
          setAchievements(achievementsRes.data);
        }
        if (badgesRes.success) {
          setBadges(badgesRes.data);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast({
          title: "Error",
          description: "Failed to load achievements",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  const earnedCount = achievements.filter((a) => a.earnedAt).length;
  const totalAchievements = achievements.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 animate-spin">
            <div className="w-10 h-10 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Achievements & Badges
        </h2>
        <p className="text-gray-600">
          Earn badges and achievements by completing actions! You've earned{" "}
          <span className="font-bold text-purple-600">{badges.length}</span>{" "}
          badges and{" "}
          <span className="font-bold text-purple-600">{earnedCount}</span> of{" "}
          <span className="font-bold">{totalAchievements}</span> achievements.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("achievements")}
          className={`pb-3 px-4 font-medium transition-all ${
            activeTab === "achievements"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>🏆 Achievements ({earnedCount})</span>
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`pb-3 px-4 font-medium transition-all ${
            activeTab === "badges"
              ? "border-b-2 border-pink-600 text-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>✨ Badges ({badges.length})</span>
        </button>
      </div>

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-4 h-full transition-all cursor-pointer hover:shadow-lg ${
                  achievement.earnedAt
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                    : "bg-gray-50 border-gray-200 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  {!achievement.earnedAt && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm font-semibold">
                      +{achievement.pointsAwarded} pts
                    </span>
                  </div>
                  {achievement.earnedAt && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full"
                    >
                      ✓ Earned
                    </motion.div>
                  )}
                </div>

                {achievement.earnedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(achievement.earnedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <div>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Earn badges by accumulating points! Each
              badge tier unlocks at specific point milestones:
              <br />
              🥉 Bronze (100 pts) • 🥈 Silver (500 pts) • 🥇 Gold (1000 pts) •
              💎 Platinum (2500 pts) • 👑 Diamond (5000 pts)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <motion.div
                  key={badge._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 h-full flex flex-col items-center text-center">
                    <div className="text-6xl mb-4">{badge.icon}</div>
                    <h3 className="font-bold text-lg mb-1">
                      {badge.badgeName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 capitalize">
                      {badge.badgeType}
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full"
                    >
                      ⭐ Unlocked
                    </motion.div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">
                  No badges earned yet
                </p>
                <p className="text-gray-500 text-sm">
                  Start taking action to earn your first badge! You need 100
                  points to unlock 🥉 Bronze.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Points</p>
            <p className="text-2xl font-bold text-purple-600">
              {user?.totalPoints || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Achievements</p>
            <p className="text-2xl font-bold text-purple-600">
              {earnedCount}/{totalAchievements}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
            <p className="text-2xl font-bold text-pink-600">{badges.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-2xl font-bold text-pink-600">
              {Math.round(
                ((earnedCount + badges.length) / (totalAchievements + 6)) * 100,
              )}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsShowcase;
