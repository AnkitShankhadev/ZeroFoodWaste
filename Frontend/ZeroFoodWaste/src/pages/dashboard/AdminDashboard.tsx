import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Users", value: "1,234", icon: Users, color: "text-blue-500" },
  { label: "Total Donations", value: "456", icon: Package, color: "text-green-500" },
  { label: "Active Admins", value: "5", icon: Shield, color: "text-purple-500" },
  { label: "Growth Rate", value: "+12%", icon: TrendingUp, color: "text-yellow-500" },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">View All Users</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Moderation</CardTitle>
              <CardDescription>Review and moderate donations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Moderate Donations</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Open Settings</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

