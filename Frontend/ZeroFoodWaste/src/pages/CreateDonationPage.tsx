import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function CreateDonationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    expiryDate: "",
    description: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    console.log("Donation created:", formData);
    navigate("/donations");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/donations" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donations
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Food Donation</CardTitle>
            <CardDescription>Share your surplus food with those in need</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Food Type</label>
                <Input
                  placeholder="e.g., Fresh Vegetables, Cooked Food, Fruits"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <Input
                  placeholder="e.g., 10 kg, 50 plates"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Expiry Date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter your address or location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Additional details about the food..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Images (Optional)</label>
                <Button type="button" variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/donations")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Donation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

