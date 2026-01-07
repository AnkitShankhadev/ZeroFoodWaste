import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Plus, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function DonationsPage() {
  const [search, setSearch] = useState("");
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const response = await api.getDonations();
        if (response.success && response.data.donations) {
          setDonations(response.data.donations);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load donations");
        toast({
          title: "Error",
          description: "Failed to load donations. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter((donation) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      donation.foodType?.toLowerCase().includes(searchLower) ||
      donation.location?.address?.toLowerCase().includes(searchLower) ||
      donation.donor?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Donations</h1>
            <p className="text-muted-foreground">Find food donations near you</p>
          </div>
          <Link to="/create-donation">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Donation
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by food type, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No donations found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation, index) => (
              <motion.div
                key={donation._id || donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{donation.foodType || "Food Donation"}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        donation.status === "CREATED" ? "bg-green-100 text-green-700" :
                        donation.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
                        donation.status === "ASSIGNED" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <CardDescription>{donation.quantity} {donation.quantityUnit || ""}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {donation.location?.address && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {donation.location.address}
                      </div>
                    )}
                    {donation.expiryDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    {donation.donor?.name && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Donor: </span>
                        <span className="font-medium">{donation.donor.name}</span>
                      </div>
                    )}
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

