import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, CheckCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Accepted Donations", value: "45", icon: Package, color: "text-blue-500" },
  { label: "Active Volunteers", value: "12", icon: Users, color: "text-green-500" },
  { label: "Completed", value: "38", icon: CheckCircle, color: "text-purple-500" },
  { label: "Locations Served", value: "8", icon: MapPin, color: "text-yellow-500" },
];

export function NGODashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
          <p className="text-muted-foreground">Manage accepted donations and coordinate with volunteers</p>
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
              <CardTitle>Pending Acceptances</CardTitle>
              <CardDescription>Donations waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Fresh Vegetables</p>
                      <p className="text-sm text-muted-foreground">10 kg • 2 km away</p>
                    </div>
                    <Button size="sm">Accept</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>Donations assigned to volunteers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Cooked Food</p>
                      <p className="text-sm text-muted-foreground">Assigned to Sarah Wilson</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      In Progress
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

