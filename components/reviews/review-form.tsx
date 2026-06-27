"use client";

import { useState } from "react";
import type { ReviewCreatePayload } from "@/lib/reviews/types";
import { StarRatingInput } from "./star-rating-input";

type Props = {
  onSubmit: (payload: ReviewCreatePayload) => Promise<void>;
};

export function ReviewForm({ onSubmit }: Props) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ rating, title, comment });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form data-testid="review-form" onSubmit={handleSubmit} className="space-y-4">
      <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />
      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input
          value={title}
          data-testid="review-title"
          onChange={(event) => setTitle(event.target.value)}
          maxLength={150}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Comment</span>
        <textarea
          value={comment}
          data-testid="review-comment"
          onChange={(event) => setComment(event.target.value)}
          maxLength={3000}
          rows={5}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        data-testid="review-submit"
        disabled={submitting}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Submitting" : "Submit review"}
      </button>
    </form>
  );
}
