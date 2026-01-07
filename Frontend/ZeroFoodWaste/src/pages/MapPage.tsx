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
  Navigation, 
  Clock,
  Scale,
  ChevronRight,
  X,
  Loader2,
  RefreshCw
} from "lucide-react";
import { GoogleMapComponent } from "@/components/map/GoogleMap";
import { useGoogleMapsToken } from "@/hooks/useGoogleMapsToken";
import { useMapData, type MapMarker } from "@/hooks/useMapData";
import { toast } from "@/hooks/use-toast";

const MapPage = () => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filterType, setFilterType] = useState<"all" | "donation" | "ngo" | "volunteer">("all");

  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMapsToken();
  const { markers, isLoading: dataLoading, error: dataError, refetch } = useMapData();

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to Kathmandu if geolocation fails
          setUserLocation({ lat: 27.7172, lng: 85.3240 });
        }
      );
    } else {
      // Default to Kathmandu if geolocation not supported
      setUserLocation({ lat: 27.7172, lng: 85.3240 });
    }
  }, []);

  const filteredMarkers = markers.filter((m) => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (searchQuery) {
      return m.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const calculateDistance = (marker: MapMarker) => {
    if (!userLocation) return null;
    const R = 6371; // Earth's radius in km
    const dLat = ((marker.latitude - userLocation.lat) * Math.PI) / 180;
    const dLon = ((marker.longitude - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((marker.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing map data...",
      description: "Loading latest donations and locations",
    });
    refetch();
  };

  // Show loading while maps or data is loading
  if (!mapsLoaded || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {!mapsLoaded ? "Loading Google Maps..." : "Loading map data..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error if maps failed to load
  if (mapsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-destructive mb-2 font-semibold">Map Unavailable</p>
            <p className="text-muted-foreground text-sm mb-4">
              {mapsError}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 h-screen flex flex-col">
        <div className="flex-1 relative">
          <GoogleMapComponent
            markers={filteredMarkers}
            userLocation={userLocation}
            onMarkerClick={setSelectedMarker}
            selectedMarkerId={selectedMarker?.id}
          />

          {/* Search and Filters Overlay */}
          <div className="absolute top-4 left-4 right-4 z-30">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card/95 backdrop-blur shadow-lg border-0"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "secondary"}
                  onClick={() => setFilterType("all")}
                  className="h-12 shadow-lg"
                >
                  All ({markers.length})
                </Button>
                <Button
                  variant={filterType === "donation" ? "default" : "secondary"}
                  onClick={() => setFilterType("donation")}
                  className="h-12 shadow-lg"
                >
                  🍎 Donations ({markers.filter(m => m.type === "donation").length})
                </Button>
                <Button
                  variant={filterType === "ngo" ? "default" : "secondary"}
                  onClick={() => setFilterType("ngo")}
                  className="h-12 shadow-lg"
                >
                  🏢 NGOs ({markers.filter(m => m.type === "ngo").length})
                </Button>
                <Button
                  variant={filterType === "volunteer" ? "default" : "secondary"}
                  onClick={() => setFilterType("volunteer")}
                  className="h-12 shadow-lg"
                >
                  🚴 Volunteers ({markers.filter(m => m.type === "volunteer").length})
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="h-12 shadow-lg"
                  title="Refresh map data"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Data Error Banner */}
          {dataError && (
            <div className="absolute top-20 left-4 right-4 z-30">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="text-destructive">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-destructive">Error loading map data</p>
                    <p className="text-xs text-muted-foreground">{dataError}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* No Markers Message */}
          {!dataError && markers.length === 0 && (
            <div className="absolute top-20 left-4 right-4 z-30">
              <div className="bg-card/95 backdrop-blur border border-border rounded-lg p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No locations found on the map</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-30">
            <div className="bg-card/95 backdrop-blur rounded-xl shadow-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-3">Legend</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">🍎</div>
                  <span className="text-sm text-muted-foreground">Donations ({markers.filter(m => m.type === "donation").length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">🏢</div>
                  <span className="text-sm text-muted-foreground">NGOs ({markers.filter(m => m.type === "ngo").length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs">🚴</div>
                  <span className="text-sm text-muted-foreground">Volunteers ({markers.filter(m => m.type === "volunteer").length})</span>
                </div>
                {userLocation && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white"></div>
                    <span className="text-sm text-muted-foreground">You</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected marker details */}
          {selectedMarker && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4"
            >
              <div className="bg-card rounded-2xl shadow-xl border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      selectedMarker.type === "donation" 
                        ? "bg-green-100" 
                        : selectedMarker.type === "ngo"
                        ? "bg-blue-100"
                        : "bg-amber-100"
                    }`}>
                      {selectedMarker.type === "donation" ? "🍎" : selectedMarker.type === "ngo" ? "🏢" : "🚴"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedMarker.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {calculateDistance(selectedMarker) || "Location available"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMarker(null)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {selectedMarker.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedMarker.description}
                  </p>
                )}

                {selectedMarker.type === "donation" && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {selectedMarker.foodType && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {selectedMarker.foodType}
                      </Badge>
                    )}
                    {selectedMarker.quantity && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Scale className="w-3 h-3 mr-1" />
                        {selectedMarker.quantity} {selectedMarker.quantityUnit || "units"}
                      </Badge>
                    )}
                    {selectedMarker.expiryDate && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Expires {new Date(selectedMarker.expiryDate).toLocaleDateString()}
                      </Badge>
                    )}
                    {selectedMarker.status && (
                      <Badge variant="outline">
                        {selectedMarker.status}
                      </Badge>
                    )}
                  </div>
                )}

                {selectedMarker.donor?.name && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Donated by <span className="font-medium">{selectedMarker.donor.name}</span>
                  </p>
                )}

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.latitude},${selectedMarker.longitude}`,
                        "_blank"
                      );
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                  <Button variant="default" className="flex-1">
                    {selectedMarker.type === "donation" ? "Accept" : "Contact"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MapPage;