/**
 * Reverse Geocoding Utility
 * Converts latitude/longitude to human-readable address
 * and fetches coordinates from address search
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Reverse geocode coordinates to address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns {Promise<string>} - Human-readable address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        }
      }
    );

    if (!response.ok) throw new Error('Reverse geocoding failed');

    const data = await response.json();
    
    if (data.address) {
      // Format address to be more user-friendly
      const parts = [];
      
      // Try to get area/suburb first, then city/town
      if (data.address.suburb) parts.push(data.address.suburb);
      else if (data.address.village) parts.push(data.address.village);
      else if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
      
      if (data.address.city) parts.push(data.address.city);
      else if (data.address.town) parts.push(data.address.town);
      else if (data.address.county) parts.push(data.address.county);
      
      if (data.address.state) parts.push(data.address.state);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback to display_name if structured address not available
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to coordinates
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * Geocode address to coordinates
 * @param address - Address or location name
 * @returns {Promise<{lat: number, lng: number, address: string}>}
 */
export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lng: number;
  address: string;
}> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en',
        }
      }
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    if (data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      // Get formatted address
      const formattedAddress = await reverseGeocode(lat, lng);
      
      return {
        lat,
        lng,
        address: formattedAddress || result.display_name,
      };
    }

    throw new Error('Address not found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Geocoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get current location with reverse geocoding
 * @returns {Promise<{lat: number, lng: number, address: string}>}
 */
export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
  address: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          resolve({
            lat: latitude,
            lng: longitude,
            address,
          });
        } catch (error) {
          // Still resolve with coordinates if reverse geocoding fails
          resolve({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(new Error(`Unable to get location: ${error.message}`));
      }
    );
  });
}
