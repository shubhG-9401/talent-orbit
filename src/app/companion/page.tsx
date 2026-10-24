import { CompanionAppSimulator } from "@/components/CompanionAppSimulator";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Android Companion Simulator | TalentOrbit",
  description:
    "Companion mobile app simulator with dynamic bottom-bar routing, NFC venue check-in, real-time squad chat, and milestone task management.",
};

export default function CompanionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-white">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <CompanionAppSimulator />
      </main>
    </div>
  );
}
