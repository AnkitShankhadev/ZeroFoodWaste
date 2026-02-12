import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface BadgeLevel {
  type: string;
  name: string;
  icon: string;
  pointsRequired: number;
  description: string;
}

const BadgeShowcase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badgeLevels, setBadgeLevels] = useState<BadgeLevel[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [levelsRes, badgesRes] = await Promise.all([
          api.getBadgeLevels(),
          api.getBadges(),
        ]);

        if (levelsRes.success) {
          setBadgeLevels(levelsRes.data.levels || []);
        }
        if (badgesRes.success) {
          const badgeTypes = new Set(
            badgesRes.data.map((b: any) => b.badgeType.toUpperCase()),
          );
          setEarnedBadges(badgeTypes);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast({
          title: "Error",
          description: "Failed to load badges",
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

  const getProgressPercentage = (pointsRequired: number): number => {
    if (!user?.totalPoints) return 0;
    return Math.min((user.totalPoints / pointsRequired) * 100, 100);
  };

  const earnedCount = earnedBadges.size;
  const totalBadges = badgeLevels.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 mb-4 animate-spin">
            <div className="w-10 h-10 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
          Badge Tiers
        </h2>
        <p className="text-gray-600">
          Unlock prestigious badge tiers by earning points! You've unlocked{" "}
          <span className="font-bold text-yellow-600">{earnedCount}</span> of{" "}
          <span className="font-bold">{totalBadges}</span> badge tiers.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">Your Current Points</p>
            <p className="text-4xl font-bold text-yellow-600">
              {user?.totalPoints || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Badge Progress</p>
            <div className="text-2xl font-bold">
              <span className="text-yellow-600">{earnedCount}</span>
              <span className="text-gray-400">/{totalBadges}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badgeLevels.map((badge, index) => {
          const isEarned =
            user?.totalPoints && user.totalPoints >= badge.pointsRequired;
          const isUnlocked = earnedBadges.has(badge.type.toUpperCase());
          const progress = getProgressPercentage(badge.pointsRequired);
          const pointsNeeded = Math.max(
            0,
            badge.pointsRequired - (user?.totalPoints || 0),
          );

          return (
            <motion.div
              key={badge.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-6 h-full flex flex-col transition-all ${
                  isEarned || isUnlocked
                    ? "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-300 shadow-lg"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                {/* Badge Icon */}
                <motion.div
                  animate={
                    isEarned || isUnlocked
                      ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4 text-center"
                >
                  {badge.icon}
                </motion.div>

                {/* Badge Name and Type */}
                <h3 className="text-xl font-bold mb-1 text-center">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {badge.description}
                </p>

                {/* Status Badge */}
                <div className="mb-4">
                  {isEarned && isUnlocked ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                        ✓ Unlocked
                      </span>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-500">
                        {badge.pointsRequired.toLocaleString()} pts required
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full ${
                        isEarned
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                          : "bg-gradient-to-r from-gray-300 to-gray-400"
                      }`}
                    />
                  </div>
                  {!isEarned && (
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {pointsNeeded.toLocaleString()} pts remaining
                    </p>
                  )}
                </div>

                {/* Points Required */}
                <div className="text-center text-sm mt-auto">
                  <span className="font-semibold">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 How to Earn More Points:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>🎁 Donate food items ({"+5 pts"} per donation)</li>
          <li>✅ Complete deliveries ({"+10 pts"} per pickup)</li>
          <li>🏆 Earn achievements ({"+50 pts"} per achievement)</li>
          <li>⚡ Respond quickly to opportunities (bonus points)</li>
        </ul>
      </div>
    </div>
  );
};

export default BadgeShowcase;
