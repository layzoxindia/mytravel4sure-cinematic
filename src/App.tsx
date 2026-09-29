import { useEffect, useMemo, useState } from "react";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";
import logoUrl from "../assets/mytravel4sure-logo.png";

type DestinationKey = "kashmir" | "maldives" | "bali" | "dubai";
type Moment = { title: string; kicker: string; image: string };
type Destination = {
  name: string; region: string; line: string; description: string;
  hot: string; mid: string; cool: string; moments: Moment[];
};

const DESTINATIONS: Record<DestinationKey, Destination> = {
  kashmir: {
    name: "Kashmir", region: "India", line: "closer to the sky.",
    description: "Glacial light, glassy water and alpine silence — preview the mood before you plan the route.",
    hot: "#F7FBFF", mid: "#8EDBFF", cool: "#2F6A8C",
    moments: [
      { title: "Dal Lake", kicker: "drift into morning", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=2400&q=90" },
      { title: "Gulmarg", kicker: "walk into white", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90" },
      { title: "Pahalgam", kicker: "follow the valley", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=90" }
    ]
  },
  maldives: {
    name: "Maldives", region: "Indian Ocean", line: "where time floats.",
    description: "Warm water, reef light and uninterrupted horizon — enter the pace before you choose the stay.",
    hot: "#F2FFFF", mid: "#5CF1EE", cool: "#08798A",
    moments: [
      { title: "Lagoon", kicker: "arrive over water", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=90" },
      { title: "Reef", kicker: "go below the blue", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=90" },
      { title: "Sunset", kicker: "stay for last light", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=90" }
    ]
  },
  bali: {
    name: "Bali", region: "Indonesia", line: "breathe differently.",
    description: "Jungle depth, temple smoke and salt air — feel the rhythm before the itinerary exists.",
    hot: "#F8FFF5", mid: "#8DFFB7", cool: "#1E6A42",
    moments: [
      { title: "Jungle", kicker: "wake under green", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=90" },
      { title: "Temple", kicker: "enter the ritual", image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=2400&q=90" },
      { title: "Coast", kicker: "chase the last sun", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=90" }
    ]
  },
  dubai: {
    name: "Dubai", region: "UAE", line: "tomorrow after dark.",
    description: "Desert scale, impossible skyline and electric night — move between two worlds in one trip.",
    hot: "#FFF9E7", mid: "#FFC15E", cool: "#A64819",
    moments: [
      { title: "Desert", kicker: "cross the gold", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2400&q=90" },
      { title: "Skyline", kicker: "enter the future", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=90" },
      { title: "Night", kicker: "stay after dark", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=90" }
    ]
  }
};

const keys = Object.keys(DESTINATIONS) as DestinationKey[];

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return narrow;
}

export default function App() {
  const narrow = useNarrow();
  const [selected, setSelected] = useState<DestinationKey>("kashmir");
  const [entered, setEntered] = useState(false);
  const [moment, setMoment] = useState(0);
  const destination = DESTINATIONS[selected];
  const visual = destination.moments[moment];

  const shaderProps = useMemo(() => ({
    hotColor: destination.hot, midColor: destination.mid, coolColor: destination.cool
  }), [destination]);

  const choose = (key: DestinationKey) => {
    setSelected(key); setMoment(0); setEntered(false);
  };

  const whatsapp = () => {
    const message = "Hi MyTravel4Sure, I want to plan " + destination.name +
      ". Visual experience selected: " + visual.title + ".";
    window.open("https://wa.me/919810958069?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-[100svh] w-full overflow-hidden">
        <BlackHoleHeroSection
          distance={24}
          elevation={narrow ? -7 : -5.5}
          fov={narrow ? 58 : 42}
          glow={narrow ? 0.82 : 1.05}
          steps={narrow ? 190 : 300}
          resolution={narrow ? 0.56 : 0.72}
          maxDpr={narrow ? 1.25 : 1.75}
          focus={narrow ? [0.5, 0.76] : [0.72, 0.46]}
          scrim={narrow ? "top" : "left"}
          scrimStrength={0.9}
          {...shaderProps}
        >
          <div className="pointer-events-none flex h-full flex-col justify-between px-5 pb-6 pt-5 sm:px-8 lg:px-14 lg:py-8">
            <header className="pointer-events-auto flex items-center justify-between gap-4">
              <img src={logoUrl} alt="MyTravel4Sure" className="h-12 w-auto rounded-full bg-white/95 px-3 py-1.5 shadow-2xl sm:h-14" />
              <div className="flex items-center gap-2">
                <button onClick={() => setEntered(false)} className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/75 backdrop-blur-xl transition hover:bg-white/10 sm:block">Destination portal</button>
                <button onClick={whatsapp} className="rounded-full bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:scale-[1.03] sm:px-5">Build this journey</button>
              </div>
            </header>

            <div className="pointer-events-auto mb-[10vh] max-w-4xl sm:mb-[8vh] lg:mb-[7vh]">
              <div className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.28em] text-white/55 sm:text-[10px]">
                <span className="h-px w-10 bg-white/45" />
                MyTravel4Sure / {entered ? visual.title : "Destination Portal"}
              </div>

              <h1 className="max-w-4xl text-[15vw] font-light leading-[0.78] tracking-[-0.075em] sm:text-[11vw] lg:text-[8.6vw]">
                {entered ? visual.title : destination.name}
                <span className="mt-3 block font-serif text-[0.47em] italic tracking-[-0.05em] text-white/80">
                  {entered ? visual.kicker : destination.line}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/58 sm:text-base">
                {entered
                  ? "You are inside the " + visual.title + " visual layer of " + destination.name + ". Move between moments below, then carry the one you like into your trip enquiry."
                  : destination.description}
              </p>

              {!entered ? (
                <div className="mt-8">
                  <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.23em] text-white/45">Choose your world</div>
                  <div className="flex max-w-3xl gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {keys.map((key) => (
                      <button key={key} onClick={() => choose(key)}
                        className={"min-w-max rounded-full border px-4 py-2.5 text-xs font-semibold transition " +
                          (selected === key ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10")}>
                        {DESTINATIONS[key].name}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setEntered(true)} className="mt-4 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-black">
                    Enter {destination.name} →
                  </button>
                </div>
              ) : (
                <div className="mt-8 grid max-w-3xl grid-cols-1 border-y border-white/15 sm:grid-cols-3">
                  {destination.moments.map((item, index) => (
                    <button key={item.title} onClick={() => setMoment(index)}
                      className={"border-b border-white/10 px-4 py-4 text-left transition sm:border-b-0 sm:border-r " +
                        (index === moment ? "bg-white/12" : "hover:bg-white/5")}>
                      <span className="block text-[8px] uppercase tracking-[0.2em] text-white/38">0{index + 1} / {destination.name}</span>
                      <strong className="mt-1 block text-sm">{item.title}</strong>
                      <span className="mt-1 block text-[10px] text-white/48">{item.kicker}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </BlackHoleHeroSection>

        {entered && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-screen transition-all duration-700"
            style={{
              backgroundImage: "linear-gradient(120deg, transparent 35%, rgba(255,255,255,.08)), url(" + visual.image + ")",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage: "radial-gradient(circle at 70% 50%, black, transparent 68%)",
              WebkitMaskImage: "radial-gradient(circle at 70% 50%, black, transparent 68%)"
            }}
          />
        )}
      </section>
    </main>
  );
}
