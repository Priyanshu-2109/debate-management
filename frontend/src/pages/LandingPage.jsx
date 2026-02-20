import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LightPillar from "@/components/LightPillar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* LightPillar background */}
      <div className="absolute inset-0">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={8}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/debatehub_logo.png"
            alt="DebateHub Logo"
            className="h-12 w-12 sm:h-16 sm:w-16"
          />
          <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            DebateHub
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
          Where Great
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Minds Collide
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
          Join live debates, challenge your thinking, and sharpen your arguments
          with a community of passionate debaters.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group mt-10 inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-lg sm:text-xl font-semibold shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Let's Debate
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Credit */}
        <p className="absolute bottom-6 left-0 right-0 text-center text-xs sm:text-sm text-gray-500">
          Platform developed by{" "}
          <span className="text-gray-400 font-medium">Priyanshu Chaniyara</span>
        </p>
      </div>
    </div>
  );
}
