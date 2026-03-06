// Client-side geolocation: Browser API → IP fallback → random

export interface GeoLocation {
  latitude: number;
  longitude: number;
  source: "browser" | "ip" | "random";
}

export async function getBrowserLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: "browser",
        }),
      reject,
      { timeout: 8000, maximumAge: 300000 }
    );
  });
}

export async function getIpLocation(): Promise<GeoLocation> {
  const res = await fetch("https://ip-api.com/json/?fields=status,lat,lon");
  if (!res.ok) throw new Error(`IP lookup HTTP ${res.status}`);
  const data = await res.json();
  if (data.status === "success") {
    return { latitude: data.lat, longitude: data.lon, source: "ip" };
  }
  throw new Error("IP lookup failed");
}

export function getRandomLocation(): GeoLocation {
  // Weighted toward populated latitudes
  return {
    latitude: (Math.random() - 0.5) * 120,
    longitude: (Math.random() - 0.5) * 360,
    source: "random",
  };
}

export async function getLocation(useBrowser: boolean): Promise<GeoLocation> {
  if (useBrowser) {
    try {
      return await getBrowserLocation();
    } catch {
      // Fall through to IP
    }
  }

  try {
    return await getIpLocation();
  } catch {
    return getRandomLocation();
  }
}
