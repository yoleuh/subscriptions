import dynamic from "next/dynamic";

const SubscriptionCalendar = dynamic(
  () => import("../components/SubscriptionCalendar"),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <SubscriptionCalendar />
    </main>
  );
}
