import { createFileRoute } from "@tanstack/react-router";
import { BookingFlow } from "@/components/book/booking-flow";

export const Route = createFileRoute("/book")({ component: BookPage });

function BookPage() {
  return <BookingFlow />;
}
