import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Bell,
  Truck,
  Eye,
} from "lucide-react";

const availableDonations = [
  {
    id: 1,
    title: "Fresh Vegetables",
    quantity: "25 kg",
    donor: "Green Restaurant",
    distance: "1.2 km",
    expiry: "2 hours",
    type: "vegetables",
  },
  {
    id: 2,
    title: "Bread & Pastries",
    quantity: "15 kg",
    donor: "City Bakery",
    distance: "0.8 km",
    expiry: "4 hours",
    type: "bakery",
  },
  {
    id: 3,
    title: "Cooked Rice & Curry",
    quantity: "30 portions",
    donor: "Hotel Paradise",
    distance: "2.5 km",
    expiry: "1 hour",
    type: "cooked",
  },
];

const acceptedDonations = [
  {
    id: 1,
    title: "Dairy Products",
    quantity: "10 kg",
    donor: "Farm Fresh",
    volunteer: "Mike Johnson",
    status: "in_transit",
    eta: "15 mins",
  },
  {
    id: 2,
    title: "Fruits Basket",
    quantity: "20 kg",
    donor: "Fruit Market",
    volunteer: "Sarah Lee",
    status: "picking_up",
    eta: "30 mins",
  },
];

const typeColors = {
  vegetables: "bg-green-100 text-green-700",
  bakery: "bg-amber-100 text-amber-700",
  cooked: "bg-orange-100 text-orange-700",
  dairy: "bg-blue-100 text-blue-700",
};

const NGODashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Food For All NGO
                </h1>
                <p className="text-muted-foreground mt-1">
                  3 new donations available nearby
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2">
                <Bell className="w-5 h-5" />
                <span className="sr-only md:not-sr-only">Notifications</span>
                <Badge className="bg-destructive text-destructive-foreground ml-1">
                  5
                </Badge>
              </Button>
              <Link to="/map">
                <Button variant="hero" size="lg" className="gap-2">
                  <MapPin className="w-5 h-5" />
                  View Map
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Food Collected",
                value: "1,250 kg",
                change: "+18% this month",
                icon: Package,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Active Pickups",
                value: "4",
                change: "2 in transit",
                icon: Truck,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                title: "People Fed",
                value: "3,500+",
                change: "This month",
                icon: Users,
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
              {
                title: "Collection Rate",
                value: "94%",
                change: "+5% improvement",
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-100",
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Donations */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Available Nearby
                </CardTitle>
                <Link to="/donations">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {availableDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {donation.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={
                                typeColors[
                                  donation.type as keyof typeof typeColors
                                ]
                              }
                            >
                              {donation.type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {donation.quantity}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {donation.distance}
                            </span>
                            <span className="flex items-center gap-1 text-amber-600">
                              <Clock className="w-4 h-4" />
                              Expires in {donation.expiry}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {donation.donor}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="hero" size="sm">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accepted Donations - In Progress */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {acceptedDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {donation.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={
                                donation.status === "in_transit"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-purple-100 text-purple-700 border-purple-200"
                              }
                            >
                              {donation.status === "in_transit"
                                ? "In Transit"
                                : "Picking Up"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {donation.quantity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {donation.volunteer}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {donation.donor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">
                            ETA: {donation.eta}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            Track
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Collections */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Recent Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Rice & Grains",
                      quantity: "50 kg",
                      donor: "Wholesale Market",
                      date: "Today",
                    },
                    {
                      title: "Fresh Fruits",
                      quantity: "30 kg",
                      donor: "Organic Farms",
                      date: "Yesterday",
                    },
                    {
                      title: "Prepared Meals",
                      quantity: "100 portions",
                      donor: "Grand Hotel",
                      date: "Yesterday",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-green-50 border border-green-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-foreground">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} from {item.donor}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.date}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NGODashboard;
