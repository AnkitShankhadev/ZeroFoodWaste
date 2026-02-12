import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Scale,
  Plus,
  ChevronRight,
  Leaf,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const statusColors: Record<string, string> = {
  CREATED: "bg-green-100 text-green-700",
  available: "bg-green-100 text-green-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  ASSIGNED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  completed: "bg-gray-100 text-gray-700",
};

// Map food types to emojis
const foodTypeEmojis: Record<string, string> = {
  Vegetables: "🥕",
  Bakery: "🍞",
  "Cooked Food": "🍱",
  Dairy: "🥛",
  Fruits: "🍎",
  Packaged: "🥫",
  Grains: "🌾",
  Meat: "🍖",
  Seafood: "🐟",
};

const getTimeRemaining = (expiryDate: string) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  return "Less than 1 hour";
};

const Donations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.getDonations();

        if (response.success && response.data.donations) {
          setDonations(response.data.donations);
        } else {
          throw new Error("Failed to load donations");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load donations. Please try again later.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const types = [...new Set(donations.map((d) => d.foodType))];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.foodType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorId?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || d.foodType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAcceptDonation = async (id: string) => {
    try {
      const response = await api.acceptDonation(id);
      const updated = response.data?.donation;

      toast({
        title: "Donation accepted",
        description: "You have accepted this donation.",
      });

      setDonations((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d)),
      );
    } catch (err: any) {
      toast({
        title: "Could not accept donation",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Food Donations
              </h1>
              <p className="text-muted-foreground">
                Browse available donations near you or create a new listing
              </p>
            </div>
            <Link to="/create-donation">
              <Button variant="hero" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Donation
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
                disabled={isLoading}
              >
                All
              </Button>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  disabled={isLoading}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error Loading Donations
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Donations Grid */}
          {!isLoading && !error && filteredDonations.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation, index) => (
                <motion.div
                  key={donation._id || donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                        {donation.image ||
                          foodTypeEmojis[donation.foodType] ||
                          "🍽️"}
                      </div>
                      <Badge
                        className={
                          statusColors[donation.status] || statusColors.CREATED
                        }
                      >
                        {donation.status === "CREATED"
                          ? "Available"
                          : donation.status.charAt(0).toUpperCase() +
                            donation.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {donation.title || donation.foodType}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {donation.description || "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Scale className="w-4 h-4" />
                        {donation.quantity} {donation.quantityUnit || ""}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {donation.expiryDate
                          ? getTimeRemaining(donation.expiryDate)
                          : "N/A"}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {donation.location?.address || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Donated by
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {donation.donorId?.name || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.role === "NGO" &&
                        donation.status === "CREATED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              handleAcceptDonation(donation._id || donation.id)
                            }
                          >
                            Accept
                          </Button>
                        )}
                      <Link to={`/donations/${donation._id || donation.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredDonations.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No donations found
              </h3>
              <p className="text-muted-foreground mb-6">
                {donations.length === 0
                  ? "No donations available at the moment. Be the first to create one!"
                  : "Try adjusting your filters or create a new donation"}
              </p>
              <Link to="/donations/new">
                <Button variant="hero">Create Donation</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donations;
