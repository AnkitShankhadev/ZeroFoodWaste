import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface MapMarker {
  id: string;
  type: "donation" | "ngo" | "volunteer";
  title: string;
  latitude: number;
  longitude: number;
  status?: string;
  quantity?: number;
  quantityUnit?: string;
  expiryDate?: string;
  foodType?: string;
  organizationName?: string;
  description?: string;
  donor?: {
    name: string;
  };
}

export function useMapData() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🌍 Fetching map data from backend...");

      // Fetch all data in parallel
      const [donationsResponse, ngosResponse, volunteersResponse] = await Promise.allSettled([
        api.getDonations({ status: "CREATED" }),
        api.getUsers({ role: "NGO" }),
        api.getUsers({ role: "VOLUNTEER" }),
      ]);

      const allMarkers: MapMarker[] = [];

      // Process donations
      if (donationsResponse.status === "fulfilled" && donationsResponse.value.success) {
        const donations = donationsResponse.value.data?.donations || [];
        console.log(`📦 Loaded ${donations.length} donations`);
        
        donations.forEach((d: any) => {
          // Check for location data in multiple formats
          const lat = d.location?.lat || d.location?.latitude || d.latitude;
          const lng = d.location?.lng || d.location?.longitude || d.longitude;
          
          if (lat && lng) {
            allMarkers.push({
              id: d._id || d.id,
              type: "donation",
              title: d.title || d.foodType || "Food Donation",
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              status: d.status,
              quantity: d.quantity,
              quantityUnit: d.quantityUnit,
              expiryDate: d.expiryDate,
              foodType: d.foodType,
              description: d.description,
              donor: d.donor,
            });
          }
        });
      } else {
        console.warn("⚠️ Failed to load donations:", donationsResponse);
      }

      // Process NGOs
      if (ngosResponse.status === "fulfilled" && ngosResponse.value.success) {
        const ngos = ngosResponse.value.data?.users || [];
        console.log(`🏢 Loaded ${ngos.length} NGOs`);
        
        ngos.forEach((n: any) => {
          const lat = n.location?.lat || n.location?.latitude || n.latitude;
          const lng = n.location?.lng || n.location?.longitude || n.longitude;
          
          if (lat && lng) {
            allMarkers.push({
              id: n._id || n.id,
              type: "ngo",
              title: n.name || "NGO",
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              organizationName: n.name,
              description: n.description,
            });
          }
        });
      } else {
        console.warn("⚠️ Failed to load NGOs:", ngosResponse);
      }

      // Process Volunteers
      if (volunteersResponse.status === "fulfilled" && volunteersResponse.value.success) {
        const volunteers = volunteersResponse.value.data?.users || [];
        console.log(`🚴 Loaded ${volunteers.length} volunteers`);
        
        volunteers.forEach((v: any) => {
          const lat = v.location?.lat || v.location?.latitude || v.latitude;
          const lng = v.location?.lng || v.location?.longitude || v.longitude;
          
          if (lat && lng) {
            allMarkers.push({
              id: v._id || v.id,
              type: "volunteer",
              title: v.name || "Volunteer",
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              description: v.description,
            });
          }
        });
      } else {
        console.warn("⚠️ Failed to load volunteers:", volunteersResponse);
      }

      console.log(`✅ Total markers loaded: ${allMarkers.length}`);
      
      // If we have no markers at all, show error
      if (allMarkers.length === 0) {
        console.warn("⚠️ No markers with valid coordinates found");
        setError("No locations found on the map");
      }
      
      setMarkers(allMarkers);

    } catch (error) {
      console.error("❌ Map data error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load map data";
      setError(errorMessage);
      
      // Set empty array instead of mock data
      setMarkers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { markers, isLoading, error, refetch: fetchData };
}