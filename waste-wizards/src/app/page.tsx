import Image from "next/image";
import Navbar from "@/components/Navbar";

// Home Page
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-3xl font-bold">Welcome to Waste Wizard!</h1>
      </div>
    </div>
  );
}