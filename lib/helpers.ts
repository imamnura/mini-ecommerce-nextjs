import type { Product } from "./types";
import { LOCATIONS } from "./constants";

export function getMockLocation(product: Product): string {
  return LOCATIONS[product.id % LOCATIONS.length];
}
