import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type AssignmentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Assignment {
  _id: string;
  status: AssignmentStatus;
  donationId: {
    _id: string;
    foodType: string;
    quantity: string;
    expiryDate: string;
    donorId?: {
      name: string;
      address?: string;
      phone?: string;
      location?: {
        address?: string;
      };
    };
    acceptedBy?: {
      name: string;
      location?: {
        address?: string;
      };
      phone?: string;
    };
  };
  assignedAt: string;
  completedAt?: string;
}

interface AvailableTask {
  _id: string;
  foodType: string;
  quantity: string;
  status: string;
  donorId: {
    name: string;
    phone?: string;
    location?: {
      address?: string;
    };
    address?: string;
  };
  acceptedBy: {
    name: string;
    phone?: string;
    location?: {
      address?: string;
    };
  };
  createdAt: string;
}

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableTasks, setAvailableTasks] = useState<AvailableTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [isAcceptingTask, setIsAcceptingTask] = useState(false);
  const [isMarkingPickedUp, setIsMarkingPickedUp] = useState(false);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

  useEffect(() => {
    const loadAssignments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getMyAssignments();
        setAssignments(response.data?.assignments || []);
      } catch (err: any) {
        console.error("Failed to load assignments:", err);
        const message = err.message || "Failed to load your tasks";
        setError(message);
        toast({
          title: "Could not load your deliveries",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const loadAvailableTasks = async () => {
      setIsLoadingTasks(true);
      setTaskError(null);
      try {
        const response = await api.getAvailableTasks();
        setAvailableTasks(response.data?.donations || []);
      } catch (err: any) {
        console.error("Failed to load available tasks:", err);
        const message = err.message || "Failed to load available tasks";
        setTaskError(message);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    if (user?.role === "VOLUNTEER") {
      loadAssignments();
      loadAvailableTasks();
    }
  }, [user]);

  const currentTask = useMemo(() => {
    return (
      assignments.find((a) => a.status === "IN_PROGRESS") ||
      assignments.find((a) => a.status === "PENDING")
    );
  }, [assignments]);

  const completedToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return assignments
      .filter((a) => {
        if (a.status !== "COMPLETED" || !a.completedAt) return false;
        const completedDate = new Date(a.completedAt);
        return completedDate >= today;
      })
      .slice(0, 5)
      .map((a) => ({
        id: a._id,
        title: a.donationId?.foodType || "Food Delivery",
        quantity: a.donationId?.quantity || "N/A",
        points: 50, // Points per task - adjust based on your system
      }));
  }, [assignments]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveriesToday = assignments.filter((a) => {
      if (a.status !== "COMPLETED" || !a.completedAt) return false;
      const completedDate = new Date(a.completedAt);
      return completedDate >= today;
    }).length;

    const totalDeliveries = assignments.filter(
      (a) => a.status === "COMPLETED",
    ).length;

    return {
      deliveriesToday,
      totalDeliveries,
    };
  }, [assignments]);

  const handleMarkPickedUp = async () => {
    if (!currentTask) return;

    setIsMarkingPickedUp(true);
    try {
      // Update assignment status to IN_PROGRESS
      await api.updateAssignmentStatus(currentTask._id, "IN_PROGRESS");

      toast({
        title: "Marked as picked up!",
        description: "Good luck with your delivery!",
      });

      // Reload assignments to reflect the updated status
      const response = await api.getMyAssignments();
      setAssignments(response.data?.assignments || []);
    } catch (err: any) {
      toast({
        title: "Failed to update status",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsMarkingPickedUp(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!currentTask) return;

    setIsMarkingCompleted(true);
    try {
      // Complete the assignment
      await api.completeAssignment(currentTask._id);

      toast({
        title: "Delivery completed!",
        description: "Great job! Points have been added to your account.",
      });

      // Reload assignments
      const response = await api.getMyAssignments();
      setAssignments(response.data?.assignments || []);

      // Reload available tasks
      const tasksResponse = await api.getAvailableTasks();
      setAvailableTasks(tasksResponse.data?.donations || []);
    } catch (err: any) {
      toast({
        title: "Failed to complete delivery",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const handleAcceptTask = async (donationId: string) => {
    setIsAcceptingTask(true);
    try {
      await api.acceptTask(donationId);
      toast({
        title: "Task accepted!",
        description: "Check your current delivery section.",
      });

      // Reload both assignments and available tasks
      const assignmentsResponse = await api.getMyAssignments();
      setAssignments(assignmentsResponse.data?.assignments || []);

      const tasksResponse = await api.getAvailableTasks();
      setAvailableTasks(tasksResponse.data?.donations || []);
    } catch (err: any) {
      toast({
        title: "Failed to accept task",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAcceptingTask(false);
    }
  };

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
                  Hey, {user?.name || "Volunteer"}! 🚴
                </h1>
                <p className="text-muted-foreground mt-1">
                  {currentTask
                    ? "You have an active delivery"
                    : "No active deliveries right now"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Today's Earnings
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.deliveriesToday * 50} pts
                </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Deliveries Today",
                value: stats.deliveriesToday.toString(),
                change: "Goal: 5 deliveries",
                icon: Package,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Total Deliveries",
                value: stats.totalDeliveries.toString(),
                change: "All time",
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                title: "Impact Points",
                value: (user?.totalPoints ?? 0).toString(),
                change: "Earned from completed tasks",
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
                      {currentTask
                        ? currentTask.status.replace("_", " ")
                        : "None"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Loading your tasks...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  ) : !currentTask ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        You currently have no active delivery. Check available
                        tasks below.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {currentTask.donationId.foodType}
                          </h3>
                          <p className="text-muted-foreground">
                            {currentTask.donationId.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Assigned
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {new Date(
                              currentTask.assignedAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
                              {currentTask.donationId.donorId?.name || "Donor"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {currentTask.donationId.donorId?.location
                                ?.address ||
                                currentTask.donationId.donorId?.address ||
                                "Pickup address not available"}
                            </p>
                            {currentTask.donationId.donorId?.phone && (
                              <a
                                href={`tel:${currentTask.donationId.donorId.phone}`}
                                className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                {currentTask.donationId.donorId.phone}
                              </a>
                            )}
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
                              {currentTask.donationId.acceptedBy?.name || "NGO"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {currentTask.donationId.acceptedBy?.location
                                ?.address || "Drop-off address not available"}
                            </p>
                            {currentTask.donationId.acceptedBy?.phone && (
                              <a
                                href={`tel:${currentTask.donationId.acceptedBy.phone}`}
                                className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                {currentTask.donationId.acceptedBy.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 gap-2">
                          <Navigation className="w-4 h-4" />
                          Navigate
                        </Button>
                        {currentTask.status === "PENDING" ? (
                          <Button
                            variant="hero"
                            className="flex-1 gap-2"
                            onClick={handleMarkPickedUp}
                            disabled={isMarkingPickedUp}
                          >
                            {isMarkingPickedUp ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Picking up...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Mark as Picked Up
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="hero"
                            className="flex-1 gap-2"
                            onClick={handleMarkCompleted}
                            disabled={isMarkingCompleted}
                          >
                            {isMarkingCompleted ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Completing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Mark as Completed
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
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
                    <p className="text-4xl font-bold text-foreground">
                      {stats.deliveriesToday}/5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Deliveries completed
                    </p>
                  </div>
                  <Progress
                    value={Math.min(100, (stats.deliveriesToday / 5) * 100)}
                    className="h-3 mb-4"
                  />
                  <p className="text-sm text-center text-muted-foreground">
                    {stats.deliveriesToday >= 5
                      ? "Goal achieved! 🎉"
                      : `Complete ${5 - stats.deliveriesToday} more to earn a bonus! 🎉`}
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
                  {completedToday.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No deliveries completed yet today
                    </p>
                  ) : (
                    completedToday.map((task) => (
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
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Available Tasks */}
            <Card className="border-border/50 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Available Tasks from NGOs
                </CardTitle>
                <Link to="/map">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View on map
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Loading available tasks...
                    </p>
                  </div>
                ) : taskError ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-destructive">{taskError}</p>
                  </div>
                ) : availableTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No available tasks right now. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableTasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {task.foodType}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {task.quantity}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            +50 pts
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {task.donorId?.name || "Donor"} (
                              {task.donorId?.location?.address ||
                                task.donorId?.address ||
                                "Address not available"}
                              )
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">
                              {task.acceptedBy?.name || "NGO"} (
                              {task.acceptedBy?.location?.address ||
                                "Address not available"}
                              )
                            </span>
                          </p>
                          {task.donorId?.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              <a
                                href={`tel:${task.donorId.phone}`}
                                className="text-primary hover:underline"
                              >
                                {task.donorId.phone}
                              </a>
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          onClick={() => handleAcceptTask(task._id)}
                          disabled={isAcceptingTask}
                        >
                          {isAcceptingTask ? (
                            <>
                              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                              Accepting...
                            </>
                          ) : (
                            "Accept Task"
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
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
