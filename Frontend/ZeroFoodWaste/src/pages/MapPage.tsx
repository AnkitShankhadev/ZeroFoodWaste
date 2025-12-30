import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";

export function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Mock Map - Replace with actual map component (Google Maps, Mapbox, etc.) */}
        <div className="w-full h-[calc(100vh-4rem)] bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="h-16 w-16 text-primary mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Interactive Map View</h3>
                <p className="text-muted-foreground">
                  Map integration coming soon. Connect with Google Maps or Mapbox API.
                </p>
              </div>
            </div>
          </div>

          {/* Mock markers */}
          {[
            { lat: 28.6139, lng: 77.2090, label: "Donation 1" },
            { lat: 28.7041, lng: 77.1025, label: "Donation 2" },
            { lat: 19.0760, lng: 72.8777, label: "Donation 3" },
          ].map((marker, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${30 + i * 20}%`,
                top: `${40 + i * 15}%`,
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
                <Card className="absolute top-6 left-1/2 -translate-x-1/2 w-48 z-20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{marker.label}</CardTitle>
                    <CardDescription className="text-xs">Fresh Vegetables</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

