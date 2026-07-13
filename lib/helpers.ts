import { LOCATIONS } from "./constants";
import type { Product } from "./types";

export function getMockLocation(product: Product): string {
  return LOCATIONS[product.id % LOCATIONS.length];
}
