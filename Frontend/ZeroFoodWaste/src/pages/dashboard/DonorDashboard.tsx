import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Package, Award, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Donations", value: "24", icon: Package, color: "text-blue-500" },
  { label: "Points Earned", value: "580", icon: Award, color: "text-yellow-500" },
  { label: "Food Saved", value: "120 kg", icon: TrendingUp, color: "text-green-500" },
  { label: "Active Donations", value: "3", icon: MapPin, color: "text-purple-500" },
];

export function DonorDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Donor Dashboard</h1>
          <p className="text-muted-foreground">Manage your food donations and track your impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Fresh Vegetables</p>
                      <p className="text-sm text-muted-foreground">10 kg • Created 2 days ago</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/create-donation">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Donation
                </Button>
              </Link>
              <Link to="/donations">
                <Button className="w-full" variant="outline">
                  Browse All Donations
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button className="w-full" variant="outline">
                  View Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

