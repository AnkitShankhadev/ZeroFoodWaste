// hooks/useGoogleMapsToken.ts
import { useState, useEffect } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export function useGoogleMapsToken() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Checking Google Maps API Key...");
    
    // Check for API key
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ VITE_GOOGLE_MAPS_API_KEY not found in environment");
      console.log("💡 Add VITE_GOOGLE_MAPS_API_KEY to your .env file");
      setError("Google Maps API key missing. Add VITE_GOOGLE_MAPS_API_KEY to .env file");
      setIsLoaded(true);
      return;
    }

    console.log("✅ API Key found:", GOOGLE_MAPS_API_KEY.substring(0, 10) + "...");

    // ✅ CHECK IF GOOGLE MAPS IS ALREADY LOADED
    if ((window as any).google?.maps) {
      console.log("✅ Google Maps already loaded and ready");
      setIsLoaded(true);
      return;
    }

    // ✅ CHECK IF SCRIPT TAG ALREADY EXISTS
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    
    if (existingScript) {
      console.log("⏳ Google Maps script exists, waiting for it to load...");
      
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds
      
      const checkInterval = setInterval(() => {
        attempts++;
        if ((window as any).google?.maps) {
          console.log("✅ Google Maps loaded successfully");
          setIsLoaded(true);
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          console.error("❌ Google Maps failed to load (timeout after 10s)");
          setError("Google Maps loading timeout");
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    // ✅ LOAD THE SCRIPT FOR THE FIRST TIME
    console.log("📦 Creating Google Maps script tag...");
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("📥 Google Maps script loaded, waiting for API to initialize...");
      
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds
      
      const checkReady = setInterval(() => {
        attempts++;
        if ((window as any).google?.maps) {
          console.log("✅ Google Maps API is ready!");
          setIsLoaded(true);
          clearInterval(checkReady);
        } else if (attempts >= maxAttempts) {
          console.error("❌ Google Maps API not available after script load");
          setError("Google Maps API initialization failed");
          setIsLoaded(true);
          clearInterval(checkReady);
        }
      }, 100);
    };
    
    script.onerror = (e) => {
      console.error("❌ Failed to load Google Maps script:", e);
      console.log("🔍 Possible issues:");
      console.log("   1. Invalid API key");
      console.log("   2. API key doesn't have Maps JavaScript API enabled");
      console.log("   3. Billing not set up in Google Cloud Console");
      console.log("   4. Network/CORS issues");
      setError("Failed to load Google Maps. Check API key and billing.");
      setIsLoaded(true);
    };

    console.log("➕ Appending script to document head...");
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      console.log("🧹 Component unmounting (keeping script for performance)");
    };
  }, []); // Empty deps - run only once

  return { isLoaded, error };
}