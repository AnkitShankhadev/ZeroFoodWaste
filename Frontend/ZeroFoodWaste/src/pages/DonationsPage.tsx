import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data
const mockDonations = [
  {
    id: 1,
    foodType: "Fresh Vegetables",
    quantity: "10 kg",
    location: "New Delhi, India",
    expiryDate: "2024-12-31",
    status: "CREATED",
    donor: "John Doe",
  },
  {
    id: 2,
    foodType: "Cooked Food",
    quantity: "50 plates",
    location: "Gurgaon, India",
    expiryDate: "2024-12-30",
    status: "ACCEPTED",
    donor: "Jane Smith",
  },
  {
    id: 3,
    foodType: "Fruits",
    quantity: "5 kg",
    location: "Mumbai, India",
    expiryDate: "2025-01-02",
    status: "CREATED",
    donor: "Mike Johnson",
  },
];

export function DonationsPage() {
  const [search, setSearch] = useState("");

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{donation.foodType}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      donation.status === "CREATED" ? "bg-green-100 text-green-700" :
                      donation.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                  <CardDescription>{donation.quantity}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {donation.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Expires: {donation.expiryDate}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Donor: </span>
                    <span className="font-medium">{donation.donor}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

