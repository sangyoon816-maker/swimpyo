export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6371000;
const WALK_METERS_PER_MINUTE = 67; // ~4km/h average walking pace

/** Great-circle distance between two coordinates, in meters. */
export function getDistanceMeters(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return Math.round(2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export function estimateWalkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / WALK_METERS_PER_MINUTE));
}

/** Populates each item's `distance` (meters) from `origin`, using its lat/lng. */
export function attachDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  origin: Coordinates
): (T & { distance: number })[] {
  return items.map((item) => ({
    ...item,
    distance: getDistanceMeters(origin, { lat: item.latitude, lng: item.longitude }),
  }));
}
