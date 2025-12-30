import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Pickups", value: "32", icon: Truck, color: "text-blue-500" },
  { label: "Completed", value: "28", icon: CheckCircle, color: "text-green-500" },
  { label: "In Progress", value: "2", icon: Clock, color: "text-yellow-500" },
  { label: "Points Earned", value: "420", icon: Award, color: "text-purple-500" },
];

export function VolunteerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">Manage your pickup assignments and track your contributions</p>
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
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>Pickups you're currently handling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Fresh Vegetables</p>
                      <p className="text-sm text-muted-foreground">10 kg • 3 km away</p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Completions</CardTitle>
              <CardDescription>Your latest successful pickups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Cooked Food</p>
                      <p className="text-sm text-muted-foreground">Completed 1 day ago</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

