"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingCompletionModalProps {
  isOpen: boolean;
  bookingId: string;
  bookingService: string;
  onClose: () => void;
  onConfirm: (bookingId: string, amount: number) => Promise<void>;
  isLoading?: boolean;
}

export function BookingCompletionModal({
  isOpen,
  bookingId,
  bookingService,
  onClose,
  onConfirm,
  isLoading = false,
}: BookingCompletionModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    // Validate amount
    if (!amount || amount.trim() === "") {
      setError("Please enter the amount received");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await onConfirm(bookingId, numAmount);
      setAmount("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to complete booking");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAmount("");
      setError("");
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Mark booking for <span className="font-semibold">{bookingService}</span> as completed
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Received (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount received from customer"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
              disabled={isLoading}
              min="0"
              step="0.01"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Enter the total amount received from the customer
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !amount}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Saving..." : "Complete & Save"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
