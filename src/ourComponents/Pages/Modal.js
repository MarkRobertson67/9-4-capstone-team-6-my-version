import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { HiPlay, HiMiniPause, HiStop } from "react-icons/hi2";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

// Prefer “nice” female-ish voices if present (varies by OS/browser)
const PREFERRED_VOICE_NAME_HINTS = [
  "Nicky",
  "Victoria",
  "Karen",
  "Moira",
  "Tessa",
  "Serena",
  "Google UK English Female",
  "Google US English",
  "Microsoft Zira",
  "Microsoft Jenny",
  "Microsoft Aria",
  "Microsoft Sonia",
];

function pickBestVoice(voices) {
  if (!voices || voices.length === 0) return null;

  const english = voices.filter((v) =>
    (v.lang || "").toLowerCase().startsWith("en")
  );
  const pool = english.length ? english : voices;

  for (const hint of PREFERRED_VOICE_NAME_HINTS) {
    const found = pool.find((v) =>
      (v.name || "").toLowerCase().includes(hint.toLowerCase())
    );
    if (found) return found;
  }

  const premium = pool.find((v) =>
    /premium|enhanced|natural/i.test(`${v.name} ${v.voiceURI}`)
  );
  if (premium) return premium;

  return pool[0];
}

export default function Modal({ toggleModal, img, name, commentary }) {
  const utterRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  useEffect(() => {
    if (!synth) return;

    const load = () => {
      const v = synth.getVoices();
      setVoices(v);

      if (!selectedVoiceURI && v.length) {
        const best = pickBestVoice(v);
        if (best) setSelectedVoiceURI(best.voiceURI);
      }
    };

    load();
    synth.onvoiceschanged = load;

    return () => {
      synth.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedVoice = useMemo(() => {
    if (!voices.length) return null;
    return voices.find((v) => v.voiceURI === selectedVoiceURI) || null;
  }, [voices, selectedVoiceURI]);

  const stopSpeech = () => {
    if (!synth) return;
    synth.cancel();
  };

  useEffect(() => {
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = () => {
    if (!synth) return;

    if (synth.speaking) {
      if (synth.paused) synth.resume();
      return;
    }

    const u = new SpeechSynthesisUtterance(commentary || "");
    utterRef.current = u;

    if (selectedVoice) u.voice = selectedVoice;

    u.rate = 0.95;
    u.pitch = 1.1;
    u.volume = 1.0;
    u.lang = selectedVoice?.lang || "en-US";

    synth.speak(u);
  };

  const pauseSpeech = () => {
    if (!synth) return;
    if (synth.speaking && !synth.paused) synth.pause();
  };

  const handleClose = () => {
    stopSpeech();
    toggleModal();
  };

  return (
    <div
      className="
        fixed left-1/2 z-[60]
        w-[92vw] max-w-[760px]
        rounded-2xl
        bg-white/95
        shadow-2xl
        px-4 pt-5 pb-4
      "
      style={{
        // ✅ move down a bit (mobile + desktop)
        top: "58%",
        transform: "translate(-50%, -50%)",
        // ✅ keep inside viewport
        maxHeight: "84vh",
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute right-3 top-3 text-3xl text-sky-950 hover:opacity-80"
      >
        <AiOutlineCloseSquare />
      </button>

      {/* Title */}
      <h1 className="text-center font-bold text-sky-950 mb-3 text-[22px] sm:text-3xl leading-tight">
        {name}
      </h1>

      {/* Image */}
      <div className="flex justify-center">
        <img
          src={img}
          alt="img"
          className="
            w-full max-w-[520px]
            rounded-xl object-cover
            h-[180px] sm:h-[240px] md:h-[290px]
            mb-3
          "
        />
      </div>

      {/* Voice picker */}
      <div className="flex justify-center mb-2">
        <select
          className="border rounded px-2 py-1 text-sm w-full max-w-[260px]"
          value={selectedVoiceURI}
          onChange={(e) => setSelectedVoiceURI(e.target.value)}
        >
          {voices
            .filter((v) => (v.lang || "").toLowerCase().startsWith("en"))
            .map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
        </select>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <p className="inline-flex text-sky-800 text-base sm:text-lg">
          <Link onClick={speak} className="inline-flex text-sky-800">
            <HiPlay className="mt-1" /> PLAY
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="inline-flex text-sky-800" onClick={pauseSpeech}>
            <HiMiniPause className="mt-1" /> PAUSE
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link onClick={stopSpeech} className="inline-flex text-sky-800">
            <HiStop className="mt-1" /> STOP
          </Link>
        </p>
      </div>

      {/* Commentary (responsive scroll area) */}
      <div
        className="mt-3 overflow-y-auto pr-1"
        style={{
          // ✅ adapts to screen; keeps modal from growing too tall
          maxHeight: "22vh",
        }}
      >
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {commentary}
        </p>
      </div>
    </div>
  );
}
