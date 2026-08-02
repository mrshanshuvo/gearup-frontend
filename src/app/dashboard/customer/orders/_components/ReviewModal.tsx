"use client";

import React, { useState } from "react";
import { Star, Loader2, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/useReview";
import { toast } from "sonner";

interface ReviewModalProps {
  gearItemId: string;
  gearName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({
  gearItemId,
  gearName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) {
      toast.error("Please select a rating of at least 1 star");
      return;
    }

    try {
      await createReview.mutateAsync({
        gearItemId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Thank you! Your review has been submitted successfully.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Leave a Review
              </h3>
              <p className="text-[11px] text-slate-500">
                {gearName
                  ? `Equipment: ${gearName}`
                  : "Share your rental experience"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600"
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Input */}
          <div className="space-y-2 text-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              {rating === 5 && "Excellent Equipment! 🌟"}
              {rating === 4 && "Very Good 👌"}
              {rating === 3 && "Average Performance 👍"}
              {rating === 2 && "Fair / Needs Improvement 😐"}
              {rating === 1 && "Poor Quality 👎"}
            </p>
          </div>

          {/* Comment Area */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the equipment performance, condition, and service?"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReview.isPending}
              className="cursor-pointer bg-amber-500 font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600"
            >
              {createReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
