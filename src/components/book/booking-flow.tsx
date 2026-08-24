import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { BookingProgress } from "@/components/book/progress";
import { StepServices } from "@/components/book/step-services";
import { scheduleReady, StepSchedule } from "@/components/book/step-schedule";
import { detailsReady, StepDetails } from "@/components/book/step-details";
import { paymentReady, StepPay } from "@/components/book/step-pay";
import { Button } from "@/components/ui/button";
import { MoonMark } from "@/components/spa/moon-mark";
import { spa } from "@/lib/spa-config";
import { bookingTotals, useBookingStore } from "@/lib/booking-store";
import { formatPrice } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  const selectedIds = useBookingStore((s) => s.selectedIds);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const durationHours = useBookingStore((s) => s.durationHours);
  const locationType = useBookingStore((s) => s.locationType);
  const client = useBookingStore((s) => s.client);
  const paymentMethod = useBookingStore((s) => s.paymentMethod);
  const depositOnly = useBookingStore((s) => s.depositOnly);
  const card = useBookingStore((s) => s.card);
  const transferAcknowledged = useBookingStore((s) => s.transferAcknowledged);
  const policyAccepted = useBookingStore((s) => s.policyAccepted);
  const confirmBooking = useBookingStore((s) => s.confirmBooking);
  const resetFlow = useBookingStore((s) => s.resetFlow);

  const { dueNow } = bookingTotals(selectedIds, depositOnly, durationHours);

  const canContinue =
    step === 1
      ? selectedIds.length > 0
      : step === 2
        ? scheduleReady(date, time, locationType, durationHours)
        : step === 3
          ? detailsReady(
              client.name,
              client.phone,
              client.email,
              client.address,
              locationType,
            )
          : paymentReady(paymentMethod, card, transferAcknowledged) &&
            policyAccepted;

  function goBack() {
    if (step === 1) {
      void navigate({ to: "/" });
      return;
    }
    setStep((s) => (s - 1) as Step);
  }

  function goNext() {
    if (!canContinue) {
      const messages: Record<Step, string> = {
        1: "Select a service to continue.",
        2: "Choose date, time, duration, and location.",
        3: "Complete your details to continue.",
        4: "Complete payment details and accept the policies.",
      };
      toast.message(messages[step]);
      return;
    }
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    void submit();
  }

  async function submit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const booking = confirmBooking();
    if (!booking) {
      setSubmitting(false);
      toast.error("We couldn’t complete that booking. Please review your details.");
      return;
    }
    const id = booking.id;
    resetFlow();
    await navigate({ to: "/confirmed", search: { id } });
  }

  return (
    <div className="page-shell">
      <header className="sticky top-0 z-30 border-b border-plum/8 bg-cream/85 backdrop-blur-md">
        <div className="narrow flex h-14 items-center justify-between px-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-plum"
          >
            <ChevronLeft className="size-4" />
            Back
          </button>
          <Link to="/" className="flex items-center gap-2">
            <MoonMark className="size-7" />
            <span className="font-serif text-base font-semibold text-plum-deep">
              {spa.wordmark}
            </span>
          </Link>
          <span className="w-16" />
        </div>
      </header>

      <main className="narrow px-5 pt-6 pb-32">
        <BookingProgress step={step} />
        <div className="mt-8">
          {step === 1 ? <StepServices /> : null}
          {step === 2 ? <StepSchedule /> : null}
          {step === 3 ? <StepDetails /> : null}
          {step === 4 ? <StepPay /> : null}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-plum/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="narrow flex items-center justify-between gap-3 px-5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium tabular-nums text-plum-deep">
              {selectedIds.length
                ? step === 4
                  ? `Due now ${formatPrice(dueNow)}`
                  : `${selectedIds.length} selected`
                : "No services yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {step === 4 ? "Secure your appointment" : "You can go back anytime"}
            </p>
          </div>
          <Button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className="min-w-[8.5rem]"
          >
            {submitting
              ? "Confirming…"
              : step === 4
                ? "Secure my appointment"
                : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
