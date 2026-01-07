import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Plus,
  Package,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Trophy,
  Star,
  Leaf,
} from "lucide-react";

const recentDonations = [
  {
    id: 1,
    title: "Fresh Vegetables",
    quantity: "15 kg",
    status: "completed",
    date: "2024-01-15",
    ngo: "Food For All",
  },
  {
    id: 2,
    title: "Bread & Pastries",
    quantity: "8 kg",
    status: "picked_up",
    date: "2024-01-14",
    ngo: "Community Kitchen",
  },
  {
    id: 3,
    title: "Cooked Meals",
    quantity: "20 portions",
    status: "accepted",
    date: "2024-01-13",
    ngo: "Hunger Relief",
  },
  {
    id: 4,
    title: "Dairy Products",
    quantity: "10 kg",
    status: "pending",
    date: "2024-01-12",
    ngo: null,
  },
];

const achievements = [
  { id: 1, name: "First Donation", icon: Star, unlocked: true },
  { id: 2, name: "100kg Saved", icon: Trophy, unlocked: true },
  { id: 3, name: "Regular Donor", icon: Award, unlocked: true },
  { id: 4, name: "500kg Hero", icon: Leaf, unlocked: false },
];

const statusColors = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  accepted: "bg-blue-100 text-blue-700 border-blue-200",
  picked_up: "bg-purple-100 text-purple-700 border-purple-200",
  completed: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  picked_up: "Picked Up",
  completed: "Completed",
};

const DonorDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, John! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your donations
              </p>
            </div>
            <Link to="/donations/new">
              <Button variant="hero" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                New Donation
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Donated",
                value: "245 kg",
                change: "+12% this month",
                icon: Package,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Active Donations",
                value: "3",
                change: "2 awaiting pickup",
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-100",
              },
              {
                title: "Completed",
                value: "28",
                change: "5 this week",
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                title: "Impact Points",
                value: "1,250",
                change: "Rank #42",
                icon: TrendingUp,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Donations */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Recent Donations</CardTitle>
                  <Link to="/donations">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentDonations.map((donation, index) => (
                      <motion.div
                        key={donation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium text-foreground">
                                {donation.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[
                                    donation.status as keyof typeof statusColors
                                  ]
                                }
                              >
                                {
                                  statusLabels[
                                    donation.status as keyof typeof statusLabels
                                  ]
                                }
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {donation.quantity}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(donation.date).toLocaleDateString()}
                              </span>
                              {donation.ngo && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {donation.ngo}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements & Progress */}
            <div className="space-y-6">
              {/* Level Progress */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-green-600 text-white text-2xl font-bold mb-2">
                      12
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Level 12 Donor
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Progress to Level 13
                      </span>
                      <span className="font-medium">750/1000 pts</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Achievements</CardTitle>
                  <Link to="/leaderboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex flex-col items-center p-3 rounded-xl ${
                          achievement.unlocked
                            ? "bg-primary/10"
                            : "bg-muted opacity-50"
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${
                            achievement.unlocked
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-xs text-center mt-1 text-muted-foreground">
                          {achievement.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <Link to="/donations/new" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Donation
                      </Button>
                    </Link>
                    <Link to="/map" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        View Nearby NGOs
                      </Button>
                    </Link>
                    <Link to="/leaderboard" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Check Leaderboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonorDashboard;
