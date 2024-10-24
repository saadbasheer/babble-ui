"use client";
import Particles from "@/components/Particles";
import RecordingComponent from "@/components/Recording";
import { useEffect, useState } from "react";

export default function StartPage() {
  const [showRecording, setShowRecording] = useState(false);

  useEffect(() => {
    // Short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setShowRecording(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen relative z-20 bg-[#2F4858]">
      <Particles className="absolute z-1 w-full h-full  bg-[#2F4858]" />
      {showRecording && <RecordingComponent />}
    </div>
  );
}