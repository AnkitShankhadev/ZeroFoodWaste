import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Bike,
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Navigation,
  ChevronRight,
  Trophy,
  Star,
  Phone,
  Building2,
  ArrowRight,
  Timer,
} from "lucide-react";

const currentTask = {
  id: 1,
  title: "Fresh Vegetables Pickup",
  quantity: "25 kg",
  pickup: {
    name: "Green Restaurant",
    address: "123 Main Street, Downtown",
    phone: "+1 234 567 890",
  },
  dropoff: {
    name: "Food For All NGO",
    address: "456 Community Center Road",
    phone: "+1 234 567 891",
  },
  status: "picking_up",
  distance: "2.5 km total",
  estimatedTime: "20 mins",
};

const availableTasks = [
  {
    id: 2,
    title: "Bread & Pastries",
    quantity: "15 kg",
    pickup: "City Bakery",
    dropoff: "Hunger Relief",
    distance: "3.2 km",
    reward: 50,
  },
  {
    id: 3,
    title: "Dairy Products",
    quantity: "10 kg",
    pickup: "Farm Fresh",
    dropoff: "Community Kitchen",
    distance: "1.8 km",
    reward: 35,
  },
  {
    id: 4,
    title: "Cooked Meals",
    quantity: "40 portions",
    pickup: "Hotel Paradise",
    dropoff: "Street Care",
    distance: "4.5 km",
    reward: 75,
  },
];

const completedToday = [
  { id: 1, title: "Rice Delivery", quantity: "30 kg", points: 60 },
  { id: 2, title: "Fruits Basket", quantity: "20 kg", points: 45 },
];

const VolunteerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Bike className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Hey, Mike! 🚴
                </h1>
                <p className="text-muted-foreground mt-1">
                  You have an active delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Today's Earnings
                </p>
                <p className="text-2xl font-bold text-primary">105 pts</p>
              </div>
              <Link to="/map">
                <Button variant="hero" size="lg" className="gap-2">
                  <Navigation className="w-5 h-5" />
                  Open Map
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Deliveries Today",
                value: "2",
                change: "Goal: 5 deliveries",
                icon: Package,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Total Deliveries",
                value: "156",
                change: "All time",
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                title: "Avg. Delivery Time",
                value: "18 min",
                change: "-2 min from last week",
                icon: Timer,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                title: "Volunteer Rank",
                value: "#12",
                change: "Top 5%",
                icon: Trophy,
                color: "text-amber-600",
                bg: "bg-amber-100",
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
            {/* Current Task */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                      Active Delivery
                    </CardTitle>
                    <Badge className="bg-primary text-primary-foreground">
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {currentTask.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {currentTask.quantity} • {currentTask.distance}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="text-lg font-semibold text-primary">
                        {currentTask.estimatedTime}
                      </p>
                    </div>
                  </div>

                  {/* Route visualization */}
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      {/* Pickup */}
                      <div className="flex-1 p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-amber-700">
                            PICKUP
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground">
                          {currentTask.pickup.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {currentTask.pickup.address}
                        </p>
                        <a
                          href={`tel:${currentTask.pickup.phone}`}
                          className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {currentTask.pickup.phone}
                        </a>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center py-8">
                        <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      </div>

                      {/* Dropoff */}
                      <div className="flex-1 p-4 rounded-xl bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-green-700">
                            DROP-OFF
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground">
                          {currentTask.dropoff.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {currentTask.dropoff.address}
                        </p>
                        <a
                          href={`tel:${currentTask.dropoff.phone}`}
                          className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {currentTask.dropoff.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </Button>
                    <Button variant="hero" className="flex-1 gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Mark as Picked Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress & Stats */}
            <div className="space-y-6">
              {/* Daily Progress */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Daily Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-foreground">2/5</p>
                    <p className="text-sm text-muted-foreground">
                      Deliveries completed
                    </p>
                  </div>
                  <Progress value={40} className="h-3 mb-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    Complete 3 more to earn a bonus! 🎉
                  </p>
                </CardContent>
              </Card>

              {/* Completed Today */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Completed Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedToday.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.quantity}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        +{task.points} pts
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Available Tasks */}
            <Card className="border-border/50 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Available Tasks Nearby
                </CardTitle>
                <Link to="/map">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View on map
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {task.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {task.quantity}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          +{task.reward} pts
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {task.pickup} → {task.dropoff}
                        </p>
                        <p className="flex items-center gap-2">
                          <Navigation className="w-3 h-3" />
                          {task.distance}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        Accept Task
                      </Button>
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

export default VolunteerDashboard;
