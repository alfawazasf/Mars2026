/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// Using standard Material Symbols for some icons to match the design exactly
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [results, setResults] = useState({ yes: 0, no: 0, total: 0 });
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "SYNC_VOTES" || message.type === "VOTE_UPDATE") {
        const yes = message.votes.yes || 0;
        const no = message.votes.no || 0;
        setResults({
          yes,
          no,
          total: yes + no
        });
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, 8));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const handleVote = (choice: "yes" | "no") => {
    setVote(choice);
  };

  const submitVote = () => {
    if (vote && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "VOTE", optionId: vote }));
      nextSlide();
    }
  };

  const resetPresentation = () => {
    setCurrentSlide(0);
    setVote(null);
  };

  const resetVotes = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "RESET_VOTES" }));
    }
    setVote(null);
  };

  const slides = [
    // Slide 1: Title Screen
    <div key="title" className="relative flex min-h-screen w-full flex-col bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(10, 6, 5, 0.4), rgba(10, 6, 5, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDjr8zl1V-iKJNT9qG7SKhK5Un4CkKU3dLVnPRzVVQD8DfoCWxbox2y5tEOg5eJ_sSPuCH75ogJSyi_utB6rpQ63RhwQS8CLnYhpl_V79yJqnScK3c0dCrzICh4lh0o2anzB7boaEDaHER4z8110139YklGHKSUXWFEqQt2yaFVmO7sOrgnU7sca2ipnQgdwo2Z5h909pSDG57_ByAtXFIUUEOWyNWFlALIIrjvviAzjd4p_vVjuVEY71qm44lwyytyp32jqaWp6S0)' }}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center z-10">
        <div className="max-w-[1000px] mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-mars-primary/30 bg-mars-primary/10 text-mars-primary text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
              Mission Protocol: Alpha
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
            className="text-white tracking-tight text-4xl md:text-7xl font-bold leading-[1.05] font-display"
          >
            The Importance of <br/>
            <span className="mars-gradient-text">Colonizing Mars:</span> <br/>
            A Pathway to Our Future
          </motion.h1>
          <div className="w-24 h-1 bg-mars-primary mx-auto rounded-full"></div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <button 
              onClick={nextSlide}
              className="group relative flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-mars-primary text-white gap-4 text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-mars-primary/40"
            >
              <span className="relative z-10">Start Presentation</span>
              <MaterialIcon name="arrow_right_alt" className="relative z-10 transition-transform group-hover:translate-x-2" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </motion.div>
        </div>
      </div>
      <div className="p-10 flex justify-between items-end z-10">
        <div className="flex items-center gap-3 opacity-80">
          <MaterialIcon name="rocket_launch" className="text-mars-primary text-2xl" />
          <span className="text-sm font-bold tracking-widest uppercase">Interplanetary Expedition</span>
        </div>
        <div className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] opacity-60">
          Project Mars // 2026
        </div>
      </div>
    </div>,

    // Slide 2: Earth's Challenges
    <div key="challenges" className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 77, 41, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255, 77, 41, 0.08) 0%, transparent 40%), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAD3q2p52Uy2VVVCewPs3sv32S65jGkJaiCFKm-1fofufmjHrijVTBZsQlyXBtzAjW9jR0i8G9A3PHvYKm9SCR-lLZizb83TQNNkIX9OchCFS7azXR_juxn_Eb6MRw_BiCD2r04snjx6vYmSPeYP_diholxbXtBBPeXssKpEcPWGQhIu9jlI4QhRh9zdIdC3NkVvL3ROT_oPTv546-8G33ZXQW8hjnj9mRonWRke4O61WitnGwRLgeY8TxfRZn2NZuAnY9Wn_z-DHk)' }}>
      <main className="w-full max-w-5xl">
        <div className="glass-panel rounded-3xl p-8 md:p-16 shadow-2xl relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? 'w-8 bg-mars-primary shadow-[0_0_10px_rgba(255,77,41,0.5)]' : 'w-1.5 bg-mars-primary/20'}`} />
            ))}
          </div>
          <div className="text-center mb-12 mt-4">
            <span className="inline-block px-4 py-1 border border-mars-primary/30 text-mars-primary rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              Slide 02: The Necessity
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
              Earth's Challenges
            </h1>
            <div className="w-16 h-1 bg-mars-primary mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-3xl text-center space-y-10">
              <div className="flex justify-center">
                <div className="p-5 bg-mars-primary/10 rounded-2xl border border-mars-primary/20">
                  <MaterialIcon name="public_off" className="text-mars-primary text-5xl" />
                </div>
              </div>
              <p className="text-lg md:text-xl leading-relaxed font-light text-slate-200">
                Earth is experiencing <span className="text-mars-primary font-medium">serious climate change</span> and <span className="text-mars-primary font-medium">rapid loss of biodiversity</span>. 
                These global problems are connected and they threaten nature, food supplies, and the future stability of human life. 
              </p>
              <p className="text-base md:text-lg leading-relaxed text-slate-400 font-light italic">
                As these environmental problems become worse, exploring places beyond Earth, such as <span className="text-white font-medium">Mars</span>, becomes a strategic option to help protect the future of humanity.
              </p>
              <div className="pt-4">
                <span className="text-mars-primary/60 text-sm font-medium tracking-wider uppercase">— (Taylor, 2025)</span>
              </div>
            </div>
            <div className="mt-16 flex flex-col items-center gap-6">
              <button onClick={nextSlide} className="group flex items-center gap-4 px-8 py-3 bg-mars-primary text-white rounded-full hover:scale-105 active:scale-95 transition-all font-bold text-base shadow-[0_0_30px_rgba(255,77,41,0.3)] hover:shadow-[0_0_40px_rgba(255,77,41,0.5)]">
                Next Slide
                <MaterialIcon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium tracking-widest uppercase">
                <MaterialIcon name="arrow_back" className="text-lg" />
                Previous
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>,

    // Slide 3: Human Survival
    <div key="survival" className="min-h-screen flex flex-col p-8 md:p-12 lg:p-16 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuBLk3H1GZSshBs_kFlPmFGqsmsDo0nySqy4IzoR0ZBLK46avhVqLmuxcIEIbT5TaVUxiSes3005qDGijASJF2J47DDeLm6SB6MvBjHyr6nhxndH6doE-uM7-ZoOgm1hD4smsWVq2JW0aTyE3st82glv6eDeSA9FiEHIZrpPwpHp1kM_6WQQk0wiQbNc8urA8SfUIujOLHLZSYLdLqXyYNFoznUgp0I2oQG1i2iBjQRd74wydOvWcYNKB525CQdDccsUZ2uiP6f6eN0)' }}>
      <div className="flex justify-between items-center opacity-60">
        <div className="flex items-center gap-2">
          <MaterialIcon name="rocket_launch" className="text-mars-primary" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Mars Mission: Phase 1</span>
        </div>
        <div className="text-xs uppercase tracking-[0.3em]">Slide 03 / 09</div>
      </div>
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 inline-flex p-3 bg-mars-primary/20 rounded-full border border-mars-primary/30 backdrop-blur-sm">
            <MaterialIcon name="public_off" className="text-mars-primary text-3xl" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight text-white drop-shadow-2xl">
            Human Survival
          </h1>
          <div className="space-y-8 text-lg md:text-xl leading-relaxed text-slate-200 font-light max-w-3xl mx-auto">
            <p className="drop-shadow-md">
              In the past, Earth has faced huge disasters like asteroid impacts and pandemics. Building a colony on Mars could protect humanity in case of a global disaster.
            </p>
            <p className="drop-shadow-md">
              It would help save human life and our knowledge. If humans live on more than one planet, our chances of survival become much higher.
            </p>
            <p className="text-base font-medium italic text-mars-primary/80 mt-12">
              — (Bostrom, 2002)
            </p>
          </div>
        </div>
      </main>
      <footer className="mt-auto flex flex-col items-center gap-8 pb-4">
        <div className="flex items-center gap-8">
          <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium tracking-widest uppercase">
            <MaterialIcon name="arrow_back" className="text-lg" />
            Previous
          </button>
          <button onClick={nextSlide} className="group min-w-[200px] bg-mars-primary hover:bg-orange-500 text-white h-12 px-8 rounded-full font-bold text-base transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(226,88,34,0.3)] hover:shadow-[0_0_45px_rgba(226,88,34,0.5)]">
            Next Slide
            <MaterialIcon name="arrow_forward" className="transition-transform group-hover:translate-x-2" />
          </button>
        </div>
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 2 ? 'w-8 bg-mars-primary' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
      </footer>
    </div>,

    // Slide 4: Extinction Risks
    <div key="risks" className="min-h-screen flex items-center justify-center p-4 lg:p-12" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, #4a1d13 0%, transparent 50%), radial-gradient(circle at 10% 10%, #1a0b08 0%, transparent 40%)' }}>
      <main className="w-full max-w-6xl glass-panel bg-black/40 border border-white/10 rounded-3xl shadow-2xl flex flex-col relative py-12 md:py-16">
        <div className="absolute top-8 left-12 flex items-center gap-4 z-10">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === 3 ? 'w-12 bg-mars-primary' : 'w-6 bg-white/20'}`} />
            ))}
          </div>
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Slide 04 / 09</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-12 py-16 text-center z-10">
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              EXTINCTION RISKS
            </h1>
            <div className="h-1 w-24 bg-mars-primary mx-auto rounded-full"></div>
          </div>
          <div className="max-w-4xl mb-12">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              Humanity faces serious global risks such as nuclear war, uncontrolled artificial intelligence, pandemics, and asteroid impacts. According to risk theories, even a small chance of a global disaster is enough to justify taking strong preventive action. <span className="text-white font-medium italic">Creating a permanent settlement on Mars could reduce the risk of complete human extinction.</span>
            </p>
            <p className="text-mars-primary/80 text-sm mt-6 font-bold tracking-widest uppercase">
              — Nick Bostrom, 2002
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            {[
              { name: "Nuclear War", icon: "warning", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuChjH-2FY2AvwzJz45M64oy4TJlDCd37i5h9Kn0BVD5tAYlNkqdWE2lb5GIfFs1Y_TLjRQPsBBbsFpBTUpxnJxkRnBlfNsnau3QPCQZyTaNt6V9-qa4HgvZtYVj81lMDApMEK35RMJo9pVVmMhcNtpJ0pni2YmL3Yno-K0obdEJCer3IulU00RDkYcEBL8FB2t3r3v906pM8M9jtruf-w6IneaFTXAP8IVmimRout60Z-dS6Gtb-YoGM-zywpHN6AZ54ItXN8N5y3A" },
              { name: "Uncontrolled AI", icon: "memory", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFFrF8IcPI-RmkmE9xWsbzcUANNsqCVeTFWCqP5KhNqjRBm9wWjdVOjp6QNcik10jQ69nloF0qGHOS5LHQlaMNYr8HtGhZkYfFOFSd4x0VOoaM_rQF4GEmYuB53go0kBjVZm8FhjBcGZwbbwjewrMjkHznDdJGB-9A3kr2zMSVXhELtb5NWLpT6iGHtpaARIlE41JtV2GXu4e_o2Pxt2sVJ5z_oiDSo03dsDaNp1_ONVrHeF-shh4oqZdQoNydbK5FALIbCGqdEr4" },
              { name: "Global Pandemics", icon: "coronavirus", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjNSk2sf_LdE3GhepyYCMKEyAGdQucqW3LbskCbofdieKETA4ki8Js7bPxFqaLEN4oviVyRU2FRgnzhKFvd5GyoVOyS4uePIS1KNBgmgi1GkOTvRYdltJmh8oAaWdluYOgpR1ZFR0CGfrX00Gc70z4U1l1_CvItm7CCj5YQEBaA6I1NowDfkRrtlueNGzg04sK2tGMEtMivl2UKxj8C2Cp65xKRIWWQEb_s9H51mNG2YvFv93LwMeUbJI46rGQ6dqHY0h2l9T-I9Q" },
              { name: "Asteroid Impacts", icon: "asterisk", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQpUI67gyjPK9kVXLx1PQEg8OAI0BxtyEIz5jZirXZdreWwN-IoYP_w9-EW-TBncVdrInx9weMhE9LRQ3eVSiq6uDa1eyFMkK76Aq8z-El4HYSjRHVbucklzead6FkEkYa2Zqz5JfuqWqfq9TQXjnNUFAdSDzeiVGn_xz4HULEef9c5aGNFXgKgxgMUOIKeqTeo-OGaKgkgWo83oI4s9Spg7CXXgT4U9knS4ZtzpWPHXpibyZSpkUzvRYTgP5ZAXy1cN0Fn5pfTek" }
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-white/5 border border-white/10 transition-all hover:border-mars-primary/50">
                <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <MaterialIcon name={item.icon} className="text-mars-primary text-xl mb-1" />
                  <h3 className="text-white font-bold text-sm tracking-tight">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-12 pt-0 flex flex-col items-center gap-6 z-10">
          <button onClick={nextSlide} className="group flex items-center justify-center gap-3 bg-mars-primary hover:bg-white text-white hover:text-mars-primary px-8 py-3 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,77,0,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            <span>NEXT SLIDE</span>
            <MaterialIcon name="arrow_right_alt" className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium tracking-widest uppercase">
            <MaterialIcon name="arrow_back" className="text-lg" />
            Previous
          </button>
        </div>
      </main>
    </div>,

    // Slide 5: Technological Innovation
    <div key="innovation" className="font-display text-slate-100 antialiased min-h-screen flex items-center justify-center bg-cover bg-center py-12" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 0, 0.1) 0%, transparent 70%), url(https://www.transparenttextures.com/patterns/dust.png)' }}>
      <div className="relative w-full max-w-6xl mx-auto px-6">
        <main className="flex flex-col items-center justify-center text-center">
          <div className="w-full flex flex-col items-center">
            <div className="mb-12">
              <span className="text-mars-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Slide 05 / 09</span>
              <h1 className="text-3xl lg:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-mars-primary">
                Technological Innovation
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Advancing humanity through space exploration breakthroughs and the pursuit of a multi-planetary future.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-12">
              {[
                { name: "Renewable Energy", icon: "solar_power", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1cMKxjwZWJqZ1Qzv5bJjlIoddUmrSfqHbVDR96gU0ZveTFt-nw2NWZlGmA424IiRpuSZ-bRx5CCWkxj07AJRGNeXQ1CifsHwvO7LAhqKhhGmXsehV3YrcMt3zjZJQx3MEQ5jxSTTfFsu8EZHIdkC8WwdvMtp57V01AWNyaYLiCuXuiSJA0BTO2ASib031jPlG_cQwNyc6SfTNq7lTS42sd0q_Y3TCyVtQ65qqUR-R4E3LgP8s4mlg-IQIuk5y3yktGYhEEeLrPho" },
                { name: "Life Support", icon: "ecg_heart", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADP4C7y6VKO8WvUjGKUleE9xMVAz-6XEpfu1cwF4AwvJqAtrGOEeoDtVBvGH54fDb12ifdh814YkKSrkSmMd3CYdOnw6_d9n_qyYRoRK9vVlATpsPRwoLnoosC2WHIsa8ULHVP8Dyi8ThEJCu2CSv4xDIhUvIMSN4qEZB0nP86NxmfqD6kUzaQ4Wrh07SP4V0zO0eZnw4OpWNK9uYcPgWYXp_5Xz35dHOB3p9ZehUh3FCHIXpZTWcmdwovvn2aQcMbuKGI4s5h6kU" },
                { name: "Water Recycling", icon: "water_drop", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtQyOcyxWznWCQnrVo1ZdmM2ejPpURzHK4OrPDl6WpVi44qB2mmpakHYMSRSKSb0EYAev-FoMfoN2xaPSFGXHkyZ8_F8OYsq1gXfvHnBoHVtTxnKHQ6DFdGo54QzpyR7JYPSas2fyQdozk-46k3vbZLvpFXNxyimh1Tk-Aqzz0uPz64ffYsbhzKiB5BlsIdW9a4DB3iBvsaA4eSgEKQ64S0Yh1eyTR2i1BYmBS-83Rr8dgG-hI6O9JTfzzPuq7DdEuVSkqotVfVfw" },
                { name: "Advanced Materials", icon: "location_chip", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5eiKZ29vKwLGO5rOBc8skGwXAzJjvD0BAa3rHXbVrdhDLYxrdAGy1ZRLjKAGpQH9-xJFkV1FNOze0a5yi6Cp7vzE9LKL-DjCkdGkEhdRZdXPaGjjMVfAgl5n20FR3OSl8wgVjIZpcxuGlMgbVG7-ZcqaIXIilNePybznZXS7gFx7Q1M53dric-O3Q1-EWCGGOGz-cZsYFNIgOAN3uIU9Q_py8sdkaGPGxguCdEbzbSteHYm7TVh52KH_SbKM9-M6LmDcXGC_L0QU" }
              ].map((item, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-xl aspect-square bg-mars-dark border border-white/10">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `linear-gradient(to top, rgba(10, 5, 4, 0.9), transparent), url(${item.img})` }}></div>
                  <div className="absolute bottom-6 left-6 text-left">
                    <MaterialIcon name={item.icon} className="text-mars-primary mb-2 text-3xl" />
                    <p className="text-white text-lg font-bold">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10 mb-12 max-w-3xl">
              <p className="text-lg lg:text-xl text-slate-200 leading-relaxed mb-6">
                Space exploration has often led to important technological breakthroughs. Colonizing Mars would require new developments in <span className="text-mars-primary font-semibold">renewable energy</span>, <span className="text-mars-primary font-semibold">life support systems</span>, <span className="text-mars-primary font-semibold">water recycling</span>, <span className="text-mars-primary font-semibold">advanced materials</span>, and <span className="text-mars-primary font-semibold">medicine</span>. 
              </p>
              <p className="text-sm text-slate-500 italic uppercase tracking-wider">
                Source: Ekvall, 2021; Greenblatt & Anzaldúa, 2019
              </p>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-8">
                <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium tracking-widest uppercase">
                  <MaterialIcon name="arrow_back" className="text-lg" />
                  Previous
                </button>
                <button onClick={nextSlide} className="group relative flex items-center gap-4 bg-mars-primary px-8 py-3 rounded-full text-white font-bold text-base hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,77,0,0.3)] hover:shadow-[0_0_50px_rgba(255,77,0,0.5)]">
                  Next Slide
                  <MaterialIcon name="arrow_forward" className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${i === 4 ? 'w-12 bg-mars-primary shadow-[0_0_10px_rgba(255,77,0,0.8)]' : 'w-2 bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>,

    // Slide 6: Scientific Discovery
    <div key="science" className="min-h-screen flex flex-col bg-mars-dark text-slate-100 font-display">
      <header className="flex items-center justify-between border-b border-slate-800 px-10 py-4 sticky top-0 bg-mars-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4 text-mars-primary">
          <MaterialIcon name="rocket_launch" className="text-3xl" />
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight">Mars Colonization</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <a className="text-slate-400 hover:text-mars-primary text-sm font-medium transition-colors" href="#">Overview</a>
            <a className="text-mars-primary text-sm font-medium" href="#">Science</a>
            <a className="text-slate-400 hover:text-mars-primary text-sm font-medium transition-colors" href="#">Technology</a>
            <a className="text-slate-400 hover:text-mars-primary text-sm font-medium transition-colors" href="#">Future</a>
          </nav>
          <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-mars-primary text-white text-sm font-bold transition-transform active:scale-95">
            <span className="truncate">Get Involved</span>
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-4xl flex flex-col gap-3 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-mars-primary">Mission Progress</span>
              <h1 className="text-slate-100 text-2xl md:text-4xl font-black leading-tight tracking-tight mt-1">Scientific Discovery</h1>
            </div>
            <p className="text-slate-400 text-sm font-medium">Slide 6 of 9</p>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-mars-primary rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
          </div>
        </div>
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group flex flex-col gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-mars-primary/50 transition-all">
            <div className="w-full aspect-video rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-mars-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img alt="Geological Insights" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWrACTklHGuSecY75SmXLdL5ieydMBwy6Zyj_DwDoFjX7EPJsma7F2WLT7X11nNXSPmVfeByd-Ng2QQ4kpXpthaFqVNpZ7N4EjTWOHBcoEfg3MMF3LcXx8jRpUdARax7DFkqRrF5PzY6wM2gylB0unGX_DlF_eaIb_GELDUUOY7ongPJjIiQ7Semtwh_z_4HjBTi4Cgb_wH97DRxia73iUdEGPkLDzFPq0hayA5sq9qa8GVj-CfaAPU76mJOY19TVg70cOKfgs-Q" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-2 text-mars-primary">
              <MaterialIcon name="landscape" />
              <h3 className="text-lg font-bold">Geological Insights</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Analyzing Martian soil and rock formations to trace the history of water. By studying the stratigraphy of Valles Marineris, we unlock billions of years of planetary history.
            </p>
          </div>
          <div className="group flex flex-col gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-mars-primary/50 transition-all">
            <div className="w-full aspect-video rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-mars-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img alt="Search for Life" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLVFGvPcdXRRlAMbqdByK6ZkE1VAmUMK7GgZUUoXsuSiZj5-g4j6UKj2z4NBBmuG6t2ToSkGI6jF-Hmu_QrvuheEyjA1-4y3cFfQAds1QH48ylIlrwCJLpaOvb-u0RSfth9OBUkMv9b_FG6bKnH3_G6z9rbrCE_1f6YdfdR5MmGcxXvJzZJ1sFpo_4QTSkJLAQydZfped5Do7BiDxdDcTfyVTDmkamw_-zbv5x3vpzxRwwXbSjDoeOwbfYveRjzypEXVSvou7G9tM" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-2 text-mars-primary">
              <MaterialIcon name="biotech" />
              <h3 className="text-lg font-bold">Search for Life</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Investigating biosignatures in ancient lakebeds and subsurface ice. Our rovers are equipped with Raman spectrometers to detect organic compounds buried beneath the regolith.
            </p>
          </div>
          <div className="group flex flex-col gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-mars-primary/50 transition-all">
            <div className="w-full aspect-video rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-mars-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img alt="Planetary Evolution" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCddaqRck4xxa3EDHLbgotSLXyHjoKJkCluy_RI8i-GesJgWPnsoL5xuL3OA3XovRMnUW9t_3bHGZsGmK74Qfduv6wi8I9YFnY1F78M00b-KXKYCif9DJj-ZRkzG5vmkUg-zwb06L8rCqgKNMMbaQJGE7nnYyrVFuNMKoYLmjLWyv3yvZjweriwmxC6TYnKS0hcSh6OxOUb71nPRLGkd7x6ZsdPmUJP92kb34CF7OL46fE0aL3K6G65YRJbtaCXbFEz5aFfJfxZyBA" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-2 text-mars-primary">
              <MaterialIcon name="public" />
              <h3 className="text-lg font-bold">Planetary Evolution</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Comparing Mars and Earth to predict the long-term future of our planet. Understanding how Mars lost its atmosphere helps us safeguard Earth's own climate future.
            </p>
          </div>
        </div>
        <div className="w-full max-w-4xl bg-mars-primary/5 border border-mars-primary/20 rounded-2xl p-6 md:p-12 mb-16 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Inspiration & Global Unity</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-mars-primary/20 flex items-center justify-center text-mars-primary">
                <MaterialIcon name="groups" />
              </div>
              <div>
                <h4 className="font-bold mb-2">International Teamwork</h4>
                <p className="text-slate-400 text-sm">
                  Mars represents a borderless frontier. Agencies from across the globe collaborate on data sharing, resource management, and mission logistics.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-mars-primary/20 flex items-center justify-center text-mars-primary">
                <MaterialIcon name="lightbulb" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Future Generations</h4>
                <p className="text-slate-400 text-sm">
                  The colonization effort inspires millions of students to pursue STEM fields, fostering a new era of human ingenuity and cosmic curiosity.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevSlide} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors font-medium text-sm">
            <MaterialIcon name="arrow_back" />
            Previous
          </button>
          <button onClick={nextSlide} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-mars-primary text-white hover:opacity-90 transition-all font-bold shadow-lg shadow-mars-primary/20 text-sm">
            Next Slide
            <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </main>
      <footer className="py-8 px-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/20">
        <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">© 2026 Mars Colonization Initiative | Scientific Division</p>
        <div className="flex gap-6">
          <a className="text-slate-500 hover:text-mars-primary transition-colors" href="#"><MaterialIcon name="language" /></a>
          <a className="text-slate-500 hover:text-mars-primary transition-colors" href="#"><MaterialIcon name="share" /></a>
          <a className="text-slate-500 hover:text-mars-primary transition-colors" href="#"><MaterialIcon name="info" /></a>
        </div>
      </footer>
    </div>,

    // Slide 7: Sustainability & Ethics
    <div key="ethics" className="min-h-screen flex flex-col bg-mars-dark text-slate-100 font-display">
      <nav className="border-b border-slate-800 bg-mars-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-mars-primary p-1.5 rounded-lg text-white flex items-center justify-center">
              <MaterialIcon name="rocket_launch" className="text-xl" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mars Frontier</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-mars-primary transition-colors" href="#">Mission</a>
            <a className="text-sm font-medium hover:text-mars-primary transition-colors text-mars-primary" href="#">Sustainability</a>
            <a className="text-sm font-medium hover:text-mars-primary transition-colors" href="#">Technology</a>
            <a className="text-sm font-medium hover:text-mars-primary transition-colors" href="#">Ethics</a>
          </div>
          <button className="bg-mars-primary hover:bg-mars-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
            Join Mission
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="w-full flex flex-col items-center text-center space-y-4 mb-12">
          <div className="flex items-center gap-2 text-mars-primary font-semibold text-sm uppercase tracking-widest">
            <span className="h-px w-8 bg-mars-primary"></span>
            Slide 07: Foundations
            <span className="h-px w-8 bg-mars-primary"></span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Sustainability and <br/>
            <span className="text-mars-primary">Ethical Concerns</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-base">
            Building a future that lasts and respects the cosmos through responsible stewardship and equitable resource management.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:border-mars-primary/50 transition-all">
            <div className="w-16 h-16 rounded-full bg-mars-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MaterialIcon name="rebase_edit" className="text-mars-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Closed-Loop Systems</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pioneering absolute circularity where every drop of water, molecule of air, and scrap of waste is regenerated into vital life-support.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:border-mars-primary/50 transition-all">
            <div className="w-16 h-16 rounded-full bg-mars-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MaterialIcon name="eco" className="text-mars-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sustainable Agriculture</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Implementing advanced hydroponics and Martian regolith regeneration to ensure food security without depleting finite resources.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:border-mars-primary/50 transition-all">
            <div className="w-16 h-16 rounded-full bg-mars-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MaterialIcon name="balance" className="text-mars-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ethical Frameworks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Committing to planetary protection, social justice, and ensuring equitable access for all future generations of Martian citizens.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-mars-primary"></div>
            <p className="text-base leading-relaxed italic text-slate-300 px-4">
              "Colonizing Mars requires a commitment to planetary protection and obligations to future generations. We must ensure social justice and equitable access in the new frontier."
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-mars-primary transition-colors font-semibold">
              <MaterialIcon name="arrow_back" />
              Previous
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`rounded-full transition-all ${i === 6 ? 'w-8 h-2 bg-mars-primary' : 'w-2 h-2 bg-slate-700'}`} />
              ))}
            </div>
            <button onClick={nextSlide} className="bg-mars-primary hover:bg-mars-primary/90 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-3 transition-all shadow-lg shadow-mars-primary/20 text-sm">
              Next Slide
              <MaterialIcon name="arrow_forward" />
            </button>
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Mars Colonization Initiative. For humanity's future.</p>
          <div className="flex gap-6">
            <a className="text-slate-500 hover:text-mars-primary text-sm transition-colors" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-mars-primary text-sm transition-colors" href="#">Ethical Guidelines</a>
            <a className="text-slate-500 hover:text-mars-primary text-sm transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>,
    <div key="voting" className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-12 bg-cover bg-center py-20" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 12, 0.7), rgba(10, 10, 12, 0.4)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDROeACOhETuwdazOlfNvJ35pSfTY8fe4AgswCYovBrgn4i8HQHTigrWudnob9u5HoLsY7_yyUrKhgk3xk9e4fH-Yu3ZSScVCJCDjx4GUEJVtfYIBYGVgU45c9sfo7WJfvTuV2AX0ikAzKrgH2OLYQ7cCv9mL3okl5Pipi2gNopjnEoXjOeQQ6MyZiK3h-RnraYGjJ00BSdh0qlhwcEDQpgVaYaJdxuMWSAsoYk5SVuAXfJgzBFlFzOURauC-v6jtXQ8ywtn9VcbNc)' }}>
      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Slide 08 / 09</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-mars-primary font-bold">Public Sentiment</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-mars-primary rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-6 font-display uppercase">
            Are you in favor of <span className="text-mars-primary">Mars colonization?</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto font-light">
            Your response helps shape the narrative of the International Space Agency's long-term exploration goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          <button 
            onClick={() => handleVote("yes")}
            className={`flex flex-col items-center p-10 rounded-2xl border-2 glass-panel transition-all duration-300 ${vote === "yes" ? 'border-mars-primary bg-mars-primary/10 shadow-[0_0_25px_rgba(255,77,41,0.2)]' : 'border-white/10 hover:bg-mars-primary/5'}`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${vote === "yes" ? 'bg-mars-primary text-white' : 'bg-mars-primary/20 text-mars-primary'}`}>
              <MaterialIcon name="rocket" className="text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Yes, I support it</h3>
            <p className="text-slate-400 text-center leading-relaxed font-light">
              Humanity must become a multi-planetary species to ensure survival and push the boundaries of science.
            </p>
            <div className="mt-8">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${vote === "yes" ? 'border-mars-primary' : 'border-slate-500'}`}>
                {vote === "yes" && <div className="w-2.5 h-2.5 rounded-full bg-mars-primary"></div>}
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleVote("no")}
            className={`flex flex-col items-center p-10 rounded-2xl border-2 glass-panel transition-all duration-300 ${vote === "no" ? 'border-mars-primary bg-mars-primary/10 shadow-[0_0_25px_rgba(255,77,41,0.2)]' : 'border-white/10 hover:bg-mars-primary/5'}`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${vote === "no" ? 'bg-mars-primary text-white' : 'bg-white/5 text-slate-400'}`}>
              <MaterialIcon name="public_off" className="text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">No, I have concerns</h3>
            <p className="text-slate-400 text-center leading-relaxed font-light">
              Our primary responsibility is to solve environmental and social challenges on Earth before expanding.
            </p>
            <div className="mt-8">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${vote === "no" ? 'border-mars-primary' : 'border-slate-500'}`}>
                {vote === "no" && <div className="w-2.5 h-2.5 rounded-full bg-mars-primary"></div>}
              </div>
            </div>
          </button>
        </div>
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={submitVote}
            disabled={!vote}
            className={`group relative flex items-center justify-center gap-4 rounded-full h-12 px-8 text-white text-base font-bold transition-all ${vote ? 'bg-mars-primary hover:shadow-[0_0_40px_rgba(255,77,41,0.5)] hover:scale-105 active:scale-95' : 'bg-slate-700 cursor-not-allowed opacity-50'}`}
          >
            <span className="uppercase tracking-widest">Submit and View Results</span>
            <MaterialIcon name="arrow_forward_ios" className="text-2xl transition-transform group-hover:translate-x-2" />
          </button>
          <button onClick={prevSlide} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium tracking-widest uppercase">
            <MaterialIcon name="arrow_back" className="text-lg" />
            Previous
          </button>
          <div className="flex items-center gap-2 text-slate-500 text-sm opacity-60">
            <MaterialIcon name="verified_user" className="text-sm" />
            <span className="uppercase tracking-tighter">Secure anonymous data transmission encrypted by MarsNet</span>
          </div>
        </div>
      </main>
    </div>,

    // Slide 10: Results Screen
    <div key="results" className="min-h-screen flex flex-col bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(10, 5, 3, 0.4), rgba(10, 5, 3, 0.9)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuBcgOpgDnwcCAlhV7rTmqAciAeaiVQ2wd_EA0v-94AxHVZYbeOdGtCd0PvVmVjMKOglyfEJOuifwOSDsiwaVLU9SD93T_FqKGBoGtkGOzzRVm9C58edxWeCNiDY92WbSUlEbGDn9A7YAorYz5xpxdl0PVlsjWsS_DxW-GjuLl8Vn2RDpzz_DN7ib44vxkfFnIxQHtkHjngpMClEfYUkvq0yric3174fOLBPoAHQH4o7-qxS-yD_XV8S1n7TER8o9RdBkNikPqwbPJo)' }}>
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="flex justify-center mb-8 flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-white/10"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Slide 09 / 09</span>
              <div className="h-px w-8 bg-white/10"></div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/50 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-400">Live Results</span>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                Community Results
              </h1>
              <div className="flex items-center justify-center gap-4 text-slate-400">
                <div className="h-px w-12 bg-slate-700"></div>
                <span className="text-sm font-medium tracking-widest uppercase italic">Global Consensus Protocol</span>
                <div className="h-px w-12 bg-slate-700"></div>
              </div>
            </div>
            <div className="space-y-16">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-mars-primary text-xs font-bold tracking-widest uppercase">Affirmative</span>
                    <h3 className="text-xl font-bold flex items-center gap-3 italic text-white">
                      Support Colonization
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-mars-primary italic">
                      {results.total > 0 ? Math.round((results.yes / results.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${results.total > 0 ? (results.yes / results.total) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-mars-primary to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,77,0,0.5)]" 
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1 text-slate-400">
                    <span className="text-xs font-bold tracking-widest uppercase opacity-60">Dissenting</span>
                    <h3 className="text-xl font-bold italic">
                      Oppose Colonization
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-slate-600 italic">
                      {results.total > 0 ? Math.round((results.no / results.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${results.total > 0 ? (results.no / results.total) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-slate-800 rounded-full" 
                  />
                </div>
              </div>
            </div>
            <div className="mt-16 flex justify-center gap-12 text-slate-500 border-t border-white/5 pt-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest mb-1">Time Elapsed</span>
                <span className="font-bold text-white tracking-wider tabular-nums">08:14:22</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest mb-1">Status</span>
                <span className="font-bold text-yellow-400 tracking-wider uppercase">Active</span>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button 
              onClick={prevSlide}
              className="group relative px-4 py-1.5 border-2 border-white text-white font-black uppercase italic tracking-tighter text-xs rounded-none transition-all hover:bg-slate-700 hover:border-slate-700 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <MaterialIcon name="arrow_back" className="text-sm font-black" />
                Previous Slide
              </span>
              <div className="absolute inset-0 bg-slate-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button 
              onClick={resetPresentation}
              className="group relative px-4 py-1.5 bg-white text-black font-black uppercase italic tracking-tighter text-xs rounded-none transition-all hover:bg-mars-primary hover:text-white overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <MaterialIcon name="restart_alt" className="text-sm font-black" />
                Return to Start
              </span>
              <div className="absolute inset-0 bg-mars-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button 
              onClick={resetVotes}
              className="group relative px-4 py-1.5 border-2 border-white text-white font-black uppercase italic tracking-tighter text-xs rounded-none transition-all hover:bg-red-600 hover:border-red-600 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <MaterialIcon name="delete" className="text-sm font-black" />
                Reset the Vote
              </span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </main>
      <div className="fixed top-8 left-8 text-mars-primary/30 pointer-events-none select-none">
        <div className="text-[10px] font-mono leading-tight">
          LAT: 18.65° N<br/>
          LONG: 226.2° E<br/>
          TEMP: -63°C
        </div>
      </div>
      <div className="fixed top-8 right-8 text-mars-primary/30 pointer-events-none select-none text-right">
        <div className="text-[10px] font-mono leading-tight">
          SIGNAL: 4.2 LY<br/>
          BUFFER: 100%<br/>
          DECRYPT: ACTIVE
        </div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-mars-dark selection:bg-mars-primary selection:text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
