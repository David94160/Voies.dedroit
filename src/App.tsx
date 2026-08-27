import { Background, CommandBar, Footer } from "./components/Chrome";
import { Briefing } from "./components/Briefing";
import { Doctrine } from "./components/Doctrine";
import { Matrix } from "./components/Matrix";
import { Fortress } from "./components/Fortress";
import { CtrWar } from "./components/CtrWar";
import { Forensics } from "./components/Forensics";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <CommandBar />
      <main>
        <Briefing />
        <Doctrine />
        <Matrix />
        <Fortress />
        <CtrWar />
        <Forensics />
      </main>
      <Footer />
    </div>
  );
}
