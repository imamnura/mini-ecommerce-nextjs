import type { Product } from "./types";

export function getMockLocation(product: Product): string {
  const locations = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Medan"];
  return locations[product.id % locations.length];
}
