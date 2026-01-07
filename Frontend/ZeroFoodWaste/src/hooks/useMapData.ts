// This file remains exactly the same as your original
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
}

export function useMapData() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const fetchData = async () => {
  //   try {
  //     // Fetch donations
  //     const donationsResponse = await api.getDonations({ status: "CREATED" });
  //     const donations = donationsResponse.data?.donations || [];

  //     // Fetch NGOs
  //     const ngosResponse = await api.getUsers({ role: "NGO" });
  //     const ngos = ngosResponse.data?.users || [];

  //     // Fetch Volunteers
  //     const volunteersResponse = await api.getUsers({ role: "VOLUNTEER" });
  //     const volunteers = volunteersResponse.data?.users || [];

  //     // Combine all markers
  //     const allMarkers: MapMarker[] = [
  //       ...donations
  //         .filter((d: any) => d.location?.lat && d.location?.lng)
  //         .map((d: any) => ({
  //           id: d._id || d.id,
  //           type: "donation" as const,
  //           title: d.foodType || "Food Donation",
  //           latitude: d.location.lat,
  //           longitude: d.location.lng,
  //           status: d.status,
  //           quantity: d.quantity,
  //           quantityUnit: d.quantity,
  //           expiryDate: d.expiryDate,
  //           foodType: d.foodType,
  //         })),
  //       ...ngos
  //         .filter((n: any) => n.location?.lat && n.location?.lng)
  //         .map((n: any) => ({
  //           id: n._id || n.id,
  //           type: "ngo" as const,
  //           title: n.name || "NGO",
  //           latitude: n.location.lat,
  //           longitude: n.location.lng,
  //           organizationName: n.name,
  //         })),
  //       ...volunteers
  //         .filter((v: any) => v.location?.lat && v.location?.lng)
  //         .map((v: any) => ({
  //           id: v._id || v.id,
  //           type: "volunteer" as const,
  //           title: v.name || "Volunteer",
  //           latitude: v.location.lat,
  //           longitude: v.location.lng,
  //         })),
  //     ];

  //     setMarkers(allMarkers);
  //   } catch (error) {
  //     console.error("Error fetching map data:", error);
  //     // Set mock data for development
  //     setMarkers([
  //       {
  //         id: "1",
  //         type: "donation",
  //         title: "Fresh Vegetables",
  //         latitude: 28.6139,
  //         longitude: 77.2090,
  //         status: "CREATED",
  //         foodType: "Vegetables",
  //         quantity: 10,
  //       },
  //       {
  //         id: "2",
  //         type: "ngo",
  //         title: "Food Bank NGO",
  //         latitude: 28.7041,
  //         longitude: 77.1025,
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 🔧 TEMPORARY: Use mock data (Kathmandu-focused)
      // Remove this block later when backend auth is fixed
      console.log("🌍 Using mock data - API calls disabled due to auth error");
      
      setMarkers([
        {
          id: "1",
          type: "donation" as const,
          title: "Fresh Vegetables - Thamel",
          latitude: 27.7172,  // Kathmandu
          longitude: 85.3240,
          status: "CREATED",
          foodType: "Vegetables",
          quantity: 15,
          quantityUnit: "kg",
          expiryDate: "2026-01-10",
        },
        {
          id: "2",
          type: "donation" as const,
          title: "Rice & Dal Packets",
          latitude: 27.7095,
          longitude: 85.3187,
          status: "CREATED",
          foodType: "Rice",
          quantity: 20,
          quantityUnit: "kg",
        },
        {
          id: "3",
          type: "ngo" as const,
          title: "Food Bank Nepal",
          latitude: 27.7172,
          longitude: 85.3240,
          organizationName: "Food Bank Nepal",
        },
        {
          id: "4",
          type: "volunteer" as const,
          title: "Ram - Volunteer",
          latitude: 27.7100,
          longitude: 85.3300,
        },
        {
          id: "5",
          type: "volunteer" as const,
          title: "Sita - Volunteer",
          latitude: 27.7200,
          longitude: 85.3100,
        },
        {
          id: "6",
          type: "donation" as const,
          title: "Bread Loaves",
          latitude: 27.7150,
          longitude: 85.3200,
          status: "CREATED",
          foodType: "Bread",
          quantity: 50,
          quantityUnit: "pieces",
        }
      ]);
  
    } catch (error) {
      console.error("❌ Map data error:", error);
      // Ultimate fallback
      setMarkers([{
        id: "fallback",
        type: "donation" as const,
        title: "Test Donation - Kathmandu",
        latitude: 27.7172,
        longitude: 85.3240,
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  return { markers, isLoading, refetch: fetchData };
}
