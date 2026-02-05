import { useEffect, useMemo, useState } from "react";
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
  ChevronRight,
  Bell,
  Truck,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type DonationStatus =
  | "CREATED"
  | "ACCEPTED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

interface NearbyDonation {
  _id: string;
  foodType: string;
  quantity: string;
  expiryDate: string;
  status: DonationStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    distance?: string;
  };
  donorId?: {
    name: string;
  };
}

interface AcceptedDonation {
  _id: string;
  foodType: string;
  quantity: string;
  donorId?: {
    name: string;
  };
  assignedVolunteer?: {
    name: string;
  };
  status: DonationStatus;
}

const typeColors: Record<string, string> = {
  vegetables: "bg-green-100 text-green-700",
  bakery: "bg-amber-100 text-amber-700",
  cooked: "bg-orange-100 text-orange-700",
  dairy: "bg-blue-100 text-blue-700",
};

const NGODashboard = () => {
  const { user } = useAuth();
  const [nearbyDonations, setNearbyDonations] = useState<NearbyDonation[]>([]);
  const [acceptedDonations, setAcceptedDonations] = useState<
    AcceptedDonation[]
  >([]);
  const [completedDonations, setCompletedDonations] = useState<
    AcceptedDonation[]
  >([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [isLoadingAccepted, setIsLoadingAccepted] = useState(false);
  const [errorNearby, setErrorNearby] = useState<string | null>(null);
  const [errorAccepted, setErrorAccepted] = useState<string | null>(null);

  const lat = user?.location?.lat;
  const lng = user?.location?.lng;

  useEffect(() => {
    const loadNearby = async () => {
      setIsLoadingNearby(true);
      setErrorNearby(null);
      try {
        if (lat == null || lng == null) {
          // Fallback: show all available donations if NGO has no location set
          const response = await api.getDonations({
            status: "CREATED",
            limit: 50,
          });
          setNearbyDonations(response.data?.donations || []);
        } else {
          const response = await api.getNearbyDonations({
            lat,
            lng,
            radius: 10,
            status: "CREATED",
          });
          setNearbyDonations(response.data?.donations || []);
        }
      } catch (err: any) {
        console.error("Failed to load nearby donations:", err);
        const message = err.message || "Failed to load nearby donations";
        setErrorNearby(message);
        toast({
          title: "Could not load nearby donations",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingNearby(false);
      }
    };

    loadNearby();
  }, [lat, lng]);

  useEffect(() => {
    const loadAccepted = async () => {
      setIsLoadingAccepted(true);
      setErrorAccepted(null);
      try {
        const response = await api.getDonations({
          limit: 100,
        });
        const all = response.data?.donations || [];
        const inProgressDonations = all.filter((d: any) => {
          const acceptedBy = d.acceptedBy;
          const isMine =
            acceptedBy &&
            (acceptedBy._id === user?.id || acceptedBy.id === user?.id);
          const inProgress =
            d.status === "ACCEPTED" ||
            d.status === "ASSIGNED" ||
            d.status === "IN_TRANSIT";
          return isMine && inProgress;
        });
        const completedDonationsList = all.filter((d: any) => {
          const acceptedBy = d.acceptedBy;
          const isMine =
            acceptedBy &&
            (acceptedBy._id === user?.id || acceptedBy.id === user?.id);
          return isMine && d.status === "DELIVERED";
        });
        setAcceptedDonations(inProgressDonations);
        setCompletedDonations(completedDonationsList);
      } catch (err: any) {
        console.error("Failed to load NGO donations:", err);
        const message = err.message || "Failed to load NGO donations";
        setErrorAccepted(message);
        toast({
          title: "Could not load NGO donations",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingAccepted(false);
      }
    };

    if (user?.role === "NGO") {
      loadAccepted();
    }
  }, [user]);

  const stats = useMemo(() => {
    const inProgressKg = acceptedDonations.reduce((sum, d) => {
      const num = parseFloat(d.quantity);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    const completedKg = completedDonations.reduce((sum, d) => {
      const num = parseFloat(d.quantity);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    const totalCollectedKg = inProgressKg + completedKg;

    return {
      collectedKg: totalCollectedKg,
      activePickups: acceptedDonations.length,
      peopleFed: totalCollectedKg * 2, // rough estimate
    };
  }, [acceptedDonations, completedDonations]);
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
                  {user?.name || "Your NGO"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {nearbyDonations.length} new donations available nearby
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
                value: `${stats.collectedKg.toFixed(1)} kg`,
                change: "Based on accepted donations",
                icon: Package,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Active Pickups",
                value: stats.activePickups.toString(),
                change: "Accepted and in progress",
                icon: Truck,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                title: "People Fed (est.)",
                value: `${stats.peopleFed}`,
                change: "Estimated at 2 people per kg",
                icon: Users,
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
              {
                title: "Impact Points",
                value: (user?.totalPoints ?? 0).toString(),
                change: "From completed donations",
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
                  Available Donations
                </CardTitle>
                <Link to="/donations">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingNearby ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading nearby donations...
                  </div>
                ) : errorNearby ? (
                  <div className="p-4 text-sm text-red-600">{errorNearby}</div>
                ) : nearbyDonations.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    No available donations at the moment.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {nearbyDonations.map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">
                                {donation.foodType}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={
                                  typeColors[
                                    donation.foodType?.toLowerCase()
                                  ] || "bg-green-100 text-green-700"
                                }
                              >
                                {donation.foodType}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {donation.quantity}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {donation.location?.address ||
                                  "Unknown location"}
                              </span>
                              <span className="flex items-center gap-1 text-amber-600">
                                <Clock className="w-4 h-4" />
                                Expires{" "}
                                {donation.expiryDate
                                  ? `on ${new Date(
                                      donation.expiryDate,
                                    ).toLocaleDateString()} ${new Date(
                                      donation.expiryDate,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}`
                                  : "soon"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              From: {donation.donorId?.name || "Unknown donor"}
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
                )}
              </CardContent>
            </Card>

            {/* Accepted Donations - In Progress */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  In Progress ({acceptedDonations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAccepted ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading accepted donations...
                  </div>
                ) : errorAccepted ? (
                  <div className="p-4 text-sm text-red-600">
                    {errorAccepted}
                  </div>
                ) : acceptedDonations.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    You haven&apos;t accepted any donations yet.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {acceptedDonations.map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">
                                {donation.foodType}
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  donation.status === "ASSIGNED"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : donation.status === "IN_TRANSIT"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-purple-100 text-purple-700 border-purple-200"
                                }
                              >
                                {donation.status === "ASSIGNED"
                                  ? "Volunteer Assigned"
                                  : donation.status === "IN_TRANSIT"
                                    ? "In Transit"
                                    : donation.status === "ACCEPTED"
                                      ? "Awaiting Volunteer"
                                      : donation.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {donation.quantity}
                              </span>
                              {donation.assignedVolunteer?.name && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {donation.assignedVolunteer.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              From: {donation.donorId?.name || "Unknown donor"}
                            </p>
                          </div>
                          <div className="text-right">
                            <Button variant="ghost" size="sm" className="mt-2">
                              Track
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Collections */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Recently Completed ({completedDonations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {completedDonations.length > 0 ? (
                    completedDonations.slice(0, 3).map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-green-50 border border-green-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-foreground">
                            {donation.foodType}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {donation.quantity} from{" "}
                          {donation.donorId?.name || "Unknown donor"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Delivered
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No completed collections yet.
                    </p>
                  )}
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
