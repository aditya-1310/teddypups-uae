import { ChatScene } from "@/components/home/ChatScene";
import { DuskScene } from "@/components/home/DuskScene";
import { HeroScene } from "@/components/home/HeroScene";
import { HomeScene } from "@/components/home/HomeScene";
import { MeetScene } from "@/components/home/MeetScene";
import { NightScene } from "@/components/home/NightScene";
import { PassportScene } from "@/components/home/PassportScene";
import { PathsScene } from "@/components/home/PathsScene";
import { PawTrail } from "@/components/home/PawTrail";
import { PupCompanion } from "@/components/home/PupCompanion";

export default function HomePage() {
  return (
    <>
      <div className="tp-page">
        <HeroScene />
        <MeetScene />
        <PathsScene />
        <ChatScene />
        <PassportScene />
        <DuskScene />
        <NightScene />
        <HomeScene />
      </div>
      <div className="pup-probe" aria-hidden="true" />
      <PawTrail />
      <PupCompanion />
    </>
  );
}
