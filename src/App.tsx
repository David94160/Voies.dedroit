import { Opening } from "./components/Opening";
import { Routes } from "./components/Routes";
import { Letter } from "./components/Letter";
import { Guardrails, Footer } from "./components/Guardrails";

export default function App() {
  return (
    <div className="relative min-h-screen legal-margin">
      {/* grain papier + ambiance */}
      <div className="fixed inset-0 bg-noise-paper pointer-events-none z-50" aria-hidden />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 15% 0%, rgba(27,60,156,0.06), transparent 60%), radial-gradient(ellipse 55% 40% at 95% 100%, rgba(30,125,70,0.05), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <main>
          <Opening />
          <Routes />
          <Letter />
          <Guardrails />
        </main>
        <Footer />
      </div>
    </div>
  );
}
