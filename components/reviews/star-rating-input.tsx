"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function StarRatingInput({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Rating" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          data-testid={`review-rating-${rating}`}
          role="radio"
          aria-checked={value === rating}
          aria-label={`${rating} stars`}
          disabled={disabled}
          onClick={() => onChange(rating)}
          className="rounded p-1 text-amber-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <Star className={cn("h-6 w-6", rating <= value ? "fill-current" : "fill-none")} />
        </button>
      ))}
    </div>
  );
}
