"use client";

import { useMemo } from "react";

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  location?: string;
  minRating?: number;
}

interface Props {
  productsCategories: string[];
  value: FilterState;
  onChange: (value: FilterState) => void;
}

export default function Filter({ productsCategories, value, onChange }: Props) {
  const uniqueCategories = useMemo(() => {
    Array.from(new Set(productsCategories));
  }, [productsCategories]);

  const handleChange = (patch: Partial<FilterState>) => {
    onChange({ ...value, ...patch });
  };

  return <div>Filter Component</div>;
}
