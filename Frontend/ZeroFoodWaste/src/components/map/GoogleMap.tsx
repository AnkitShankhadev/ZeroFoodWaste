import { useEffect, useRef, useState, useCallback } from "react";
import type { MapMarker } from "@/hooks/useMapData";
import { Loader2 } from "lucide-react";

interface GoogleMapProps {
  markers: MapMarker[];
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick: (marker: MapMarker) => void;
  selectedMarkerId?: string;
}

export function GoogleMapComponent({ 
  markers, 
  userLocation, 
  onMarkerClick,
  selectedMarkerId 
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const listenersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const initializeMap = useCallback(() => {
    console.log("🔄 Attempting map initialization...");
    
    // Check if container exists
    if (!mapContainerRef.current) {
      console.log("❌ Map container not ready");
      return false;
    }

    // Check if Google Maps is loaded
    const google = (window as any).google;
    if (!google || !google.maps) {
      console.log("❌ Google Maps API not loaded yet");
      return false;
    }

    try {
      // Force container height
      mapContainerRef.current.style.width = '100%';
      mapContainerRef.current.style.height = '100%';
      mapContainerRef.current.style.minHeight = '500px';
      
      const center = userLocation || { lat: 27.7172, lng: 85.3240 };

      mapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: true,
      });

      console.log("✅ MAP INITIALIZED SUCCESSFULLY!");
      setStatus('ready');
      return true;
      
    } catch (error) {
      console.error("❌ MAP CREATION FAILED:", error);
      setStatus('error');
      return false;
    }
  }, [userLocation]);

  // Initialize map with retry logic
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tryInit = () => {
      if (status === 'loading' && attempts < maxAttempts) {
        attempts++;
        console.log(`Initialization attempt ${attempts}/${maxAttempts}`);
        const success = initializeMap();
        
        if (!success && attempts < maxAttempts) {
          timeoutId = setTimeout(tryInit, 500);
        } else if (!success) {
          console.error("❌ Failed to initialize map after maximum attempts");
          setStatus('error');
        }
      }
    };

    timeoutId = setTimeout(tryInit, 300);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initializeMap, status]);

  // Cleanup all markers and listeners on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up map resources...");
      
      const google = (window as any).google;
      
      // Remove all event listeners
      if (google?.maps?.event) {
        listenersRef.current.forEach((listener) => {
          try {
            google.maps.event.removeListener(listener);
          } catch (e) {
            console.warn("Failed to remove listener:", e);
          }
        });
      }
      listenersRef.current = [];

      // Remove all markers
      markersRef.current.forEach((marker) => {
        try {
          marker?.setMap(null);
        } catch (e) {
          console.warn("Failed to remove marker:", e);
        }
      });
      markersRef.current = [];

      // Remove user marker
      if (userMarkerRef.current) {
        try {
          userMarkerRef.current.setMap(null);
        } catch (e) {
          console.warn("Failed to remove user marker:", e);
        }
        userMarkerRef.current = null;
      }

      // Clear map instance
      mapInstanceRef.current = null;
    };
  }, []);

  // Add/update markers when data changes
  useEffect(() => {
    if (status !== 'ready' || !mapInstanceRef.current) {
      return;
    }

    const google = (window as any).google;
    
    if (!google?.maps) {
      return;
    }

    console.log(`📍 Updating ${markers.length} markers...`);
    
    // Remove old listeners
    if (google.maps.event) {
      listenersRef.current.forEach((listener) => {
        try {
          google.maps.event.removeListener(listener);
        } catch (e) {
          console.warn("Failed to remove listener:", e);
        }
      });
    }
    listenersRef.current = [];

    // Remove old markers
    markersRef.current.forEach((marker) => {
      try {
        marker.setMap(null);
      } catch (e) {
        console.warn("Failed to remove marker:", e);
      }
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      try {
        const gMarker = new google.maps.Marker({
          position: { lat: markerData.latitude, lng: markerData.longitude },
          map: mapInstanceRef.current,
          title: markerData.title,
          icon: getCustomMarkerIcon(markerData.type, markerData.id === selectedMarkerId),
          optimized: false,
        });

        // Add click listener
        const listener = google.maps.event.addListener(gMarker, 'click', () => {
          onMarkerClick(markerData);
        });

        markersRef.current.push(gMarker);
        listenersRef.current.push(listener);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });

    console.log("✅ Markers updated successfully");
  }, [markers, selectedMarkerId, onMarkerClick, status]);

  // Update user location marker
  useEffect(() => {
    if (status !== 'ready' || !mapInstanceRef.current || !userLocation) {
      return;
    }

    const google = (window as any).google;
    
    if (!google?.maps) {
      return;
    }

    console.log("📍 Updating user location...");

    try {
      if (userMarkerRef.current) {
        // Update existing marker position
        userMarkerRef.current.setPosition(userLocation);
      } else {
        // Create new user marker
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          map: mapInstanceRef.current,
          icon: getUserMarkerIcon(),
          title: "Your Location",
        });
      }

      // Center map on user location
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(13);
    } catch (error) {
      console.error("Error updating user location:", error);
    }
  }, [userLocation, status]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-2">Initializing Map...</p>
          <p className="text-gray-500">Google Maps is loading</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🗺️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Map Failed to Load</h2>
          <p className="text-gray-700 mb-6">Unable to initialize Google Maps</p>
          <div className="space-y-2 mb-6 text-sm text-gray-600 text-left bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">Troubleshooting:</p>
            <p>• Check if VITE_GOOGLE_MAPS_API_KEY is set in .env</p>
            <p>• Open browser console (F12) for detailed errors</p>
            <p>• Verify API key has Maps JavaScript API enabled</p>
            <p>• Check for billing issues in Google Cloud Console</p>
            <p>• Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Map container
  return (
    <div className="absolute inset-0 min-h-[500px]">
      <div 
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}

// Helper function to create custom marker icons
function getCustomMarkerIcon(
  type: "donation" | "ngo" | "volunteer", 
  isSelected: boolean
): string {
  const icons = { 
    donation: "🍎", 
    ngo: "🏢", 
    volunteer: "🚴" 
  };
  
  const colors = { 
    donation: "#10b981", 
    ngo: "#3b82f6", 
    volunteer: "#f59e0b" 
  };

  const svg = `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      ${isSelected ? `<circle cx="22" cy="22" r="22" fill="${colors[type]}" opacity="0.3"/>` : ''}
      <circle cx="22" cy="22" r="20" fill="${colors[type]}"/>
      <circle cx="22" cy="22" r="12" fill="white"/>
      <text x="22" y="27" font-size="18" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${colors[type]}">${icons[type]}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Helper function to create user location marker icon
function getUserMarkerIcon(): string {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#3b82f6" opacity="0.4"/>
      <circle cx="20" cy="20" r="14" fill="#3b82f6" stroke="white" stroke-width="3"/>
      <circle cx="20" cy="20" r="6" fill="white"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}