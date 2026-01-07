// hooks/useGoogleMapsToken.ts
import { useState, useEffect } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export function useGoogleMapsToken() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for API key
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ VITE_GOOGLE_MAPS_API_KEY not found in environment");
      setError("Google Maps API key missing");
      setIsLoaded(true); // Set to true to stop loading
      return;
    }

    // ✅ CHECK IF GOOGLE MAPS IS ALREADY LOADED
    if ((window as any).google?.maps) {
      console.log("✅ Google Maps already loaded");
      setIsLoaded(true);
      return;
    }

    // ✅ CHECK IF SCRIPT TAG ALREADY EXISTS
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    
    if (existingScript) {
      console.log("⏳ Google Maps script exists, waiting for load...");
      
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if ((window as any).google?.maps) {
          console.log("✅ Google Maps loaded");
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!(window as any).google?.maps) {
          console.error("❌ Google Maps failed to load (timeout)");
          setError("Google Maps loading timeout");
          setIsLoaded(true);
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }

    // ✅ LOAD THE SCRIPT FOR THE FIRST TIME
    console.log("📦 Loading Google Maps script...");
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=marker`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("✅ Google Maps script loaded");
      
      // Wait a bit for google.maps to initialize
      const checkReady = setInterval(() => {
        if ((window as any).google?.maps) {
          console.log("✅ Google Maps API ready");
          setIsLoaded(true);
          clearInterval(checkReady);
        }
      }, 50);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if ((window as any).google?.maps) {
          setIsLoaded(true);
        } else {
          console.error("❌ Google Maps API not available after load");
          setError("Google Maps API initialization failed");
          setIsLoaded(true);
        }
      }, 5000);
    };
    
    script.onerror = (e) => {
      console.error("❌ Failed to load Google Maps script:", e);
      setError("Failed to load Google Maps script");
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove the script on cleanup to prevent reload issues
      console.log("🔄 Component unmounting, keeping Google Maps script");
    };
  }, []); // Empty deps - run only once

  return { isLoaded, error };
}