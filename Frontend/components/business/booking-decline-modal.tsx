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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BookingDeclineModalProps {
  isOpen: boolean;
  bookingId: string;
  customerName: string;
  service: string;
  onClose: () => void;
  onConfirm: (bookingId: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function BookingDeclineModal({
  isOpen,
  bookingId,
  customerName,
  service,
  onClose,
  onConfirm,
  isLoading = false,
}: BookingDeclineModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    // Validate reason
    if (!reason || reason.trim() === "") {
      setError("Please provide a reason for declining this booking");
      return;
    }

    if (reason.trim().length < 5) {
      setError("Please provide a detailed reason (at least 5 characters)");
      return;
    }

    try {
      await onConfirm(bookingId, reason);
      setReason("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to decline booking");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason("");
      setError("");
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decline Booking Request</AlertDialogTitle>
          <AlertDialogDescription>
            Booking for <span className="font-semibold">{service}</span> from{" "}
            <span className="font-semibold">{customerName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Declining</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you're declining this booking request. This will be sent to the customer..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="min-h-24 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be professional and helpful - the customer will receive this message
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
            disabled={isLoading || !reason}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Declining..." : "Decline & Notify"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
