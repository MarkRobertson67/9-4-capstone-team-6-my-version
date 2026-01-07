import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { HiPlay, HiMiniPause, HiStop } from "react-icons/hi2";
import "./Pages.css";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

// Prefer “nice” female-ish voices if present (varies by OS/browser)
const PREFERRED_VOICE_NAME_HINTS = [
  "Nicky", // macOS/iOS
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

  // Only consider English voices first (change if you want Spanish, etc.)
  const english = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;

  // Try preferred name hints
  for (const hint of PREFERRED_VOICE_NAME_HINTS) {
    const found = pool.find((v) => (v.name || "").toLowerCase().includes(hint.toLowerCase()));
    if (found) return found;
  }

  // Fallback: pick a “premium / enhanced / natural” if it exists
  const premium = pool.find((v) =>
    /premium|enhanced|natural/i.test(`${v.name} ${v.voiceURI}`)
  );
  if (premium) return premium;

  // Final fallback: first in pool
  return pool[0];
}

export default function Modal({ toggleModal, img, name, commentary }) {
  const utterRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  // Load voices (important: async + can change after first call)
  useEffect(() => {
    if (!synth) return;

    const load = () => {
      const v = synth.getVoices();
      setVoices(v);

      // set a default voice once voices exist
      if (!selectedVoiceURI && v.length) {
        const best = pickBestVoice(v);
        if (best) setSelectedVoiceURI(best.voiceURI);
      }
    };

    load();

    // Some browsers fire this when voices become available
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

  // Cancel speech when modal unmounts/closes
  useEffect(() => {
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = () => {
    if (!synth) return;

    // If already speaking, resume if paused
    if (synth.speaking) {
      if (synth.paused) synth.resume();
      return;
    }

    // Create a fresh utterance each time (more reliable)
    const u = new SpeechSynthesisUtterance(commentary || "");
    utterRef.current = u;

    // Voice
    if (selectedVoice) u.voice = selectedVoice;

    // Natural-ish settings (tweak to taste)
    u.rate = 0.95;  // 0.9–1.05 tends to sound human
    u.pitch = 1.1;  // slightly higher reads less robotic
    u.volume = 1.0;

    // Optional: ensure English pronunciation
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
    <div className="modal-content content-center object-center">
      <h1 className="text-4xl font-bold dark:text-white text-sky-950 mb-2">{name}</h1>

      <div className="flex justify-center">
        <img src={img} alt="img" className="w-[500px] rounded-lg h-[290px] mb-2" />
      </div>

      {/* Voice picker (optional but helps a lot) */}
      <div className="flex justify-center mb-2">
        <select
          className="border rounded px-2 py-1 text-sm"
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

      <p className="ml-3 inline-flex text-sky-800 text-lg">
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

      <div className="max-h-[170px] overflow-y-auto mt-[5px] mb-[10px]">
        <p className="text-gray-500 dark:text-gray-400 h-[150px]">{commentary}</p>
      </div>

      <button onClick={handleClose} className="close-modal">
        <AiOutlineCloseSquare />
      </button>
    </div>
  );
}
