// src/ourComponents/Pages/EndTour/EndTour.js
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

import AnimatedLogo from "../../../assets/City_Whisperer_Animation_LargeDashes.mp4";
import StarEmpty from "../../../assets/endTourPhotos/empty-star-icon.png";
import StarFilled from "../../../assets/endTourPhotos/full-star-icon.png";

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

export default function EndTour({
  mode = "endtour", // "endtour" | "contact"
  onSuccessNavigateTo = "/tours", // where to go after submit
}) {
  const navigate = useNavigate();

  // video/audio
  const videoRef = useRef(null);
  const [videoMuted, setVideoMuted] = useState(false);

  // form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sending, setSending] = useState(false);

  // Try to unlock audio on first user interaction (browser autoplay rules)
  useEffect(() => {
    const unlockAudio = async () => {
      if (!videoRef.current) return;

      try {
        if (!videoMuted) videoRef.current.muted = false;
        await videoRef.current.play();
      } catch {
        // ignore
      } finally {
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      }
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep DOM muted flag in sync
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = videoMuted;
  }, [videoMuted]);

  const renderStars = () => {
    const max = Math.max(rating, hoverRating);
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i + 1 <= max ? StarFilled : StarEmpty}
        className="w-6 h-6 cursor-pointer"
        alt={`Star ${i + 1}`}
        onClick={() => setRating(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
      />
    ));
  };

  const handleSubmit = async () => {
    if (sending) return;

    if (!message.trim() || rating === 0) {
      alert("Please leave a message and rating.");
      return;
    }

    const cleanedEmail = userEmail.trim();
    const cleanedName = userName.trim();

    if (cleanedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      alert("Please enter a valid email address (or leave it blank).");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert(
        "EmailJS is not configured. Check env vars and restart dev server."
      );
      return;
    }

    setSending(true);

    const templateParams = {
      source:
        mode === "contact"
          ? "City Whisperer Contact Us"
          : "City Whisperer Tour Feedback",
      rating: `${rating}/5`,
      name: cleanedName || "there",
      time: new Date().toLocaleString(),
      email: cleanedEmail || "",
      message: message.trim(),

      brand_name: "City Whisperer",
      logo_url: "https://citywhisperer-mark.netlify.app/CityWhispererLogo.png",
      logo_display: "block",
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      // ✅ bring back success alert
      alert("Thank you! Your feedback has been sent.");

      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch {}
      }

      setUserName("");
      setUserEmail("");
      setMessage("");
      setRating(0);
      setHoverRating(0);

      navigate(onSuccessNavigateTo);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Something went wrong sending your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="no-content-container mt-36 sm:mt-32 md:mt-60 lg:mt-36 xl:mt-36 pb-8 sm:pb-16 md:pb-24 lg:pb-16 xl:pb-16">
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-amber-300 w-3/4 md:w-1/2 lg:w-1/3 p-4 rounded-lg shadow-xl">
          <div className="mb-4">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              loop
              muted={videoMuted}
              playsInline
            >
              <source src={AnimatedLogo} type="video/mp4" />
            </video>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setVideoMuted((m) => !m)}
                className="text-sm underline text-gray-700"
              >
                {videoMuted ? "Unmute 🔊" : "Mute 🔇"}
              </button>
            </div>

            <p className="text-xs text-gray-700 mt-2">
              Note: If sound doesn’t start immediately, click once anywhere
              (browser autoplay rule).
            </p>
          </div>

          <p className="text-lg font-semibold mb-2 text-center">
            {mode === "contact"
              ? "Contact Us ✉️"
              : "Safe travels! Thank you for exploring with us ✨"}
          </p>

          <div className="flex items-center justify-center mt-1 mb-2">
            {renderStars()}
          </div>

          <div className="text-gray-600 text-xs mb-2 text-center">
            <span>1 - Poor</span> | <span>2 - Fair</span> |{" "}
            <span>3 - Average</span> | <span>4 - Very Good</span> |{" "}
            <span>5 - Excellent</span>
          </div>

          <input
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Your email (optional — if you want a response)"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />

          <textarea
            className="w-full p-2 border rounded-md"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              mode === "contact"
                ? "Write your message here — questions, issues, or ideas."
                : "Write here to tell us what you liked and how we can improve."
            }
            required
          />

          <div className="flex justify-between items-center mt-4">
            <Link to="/tours">
              <button className="text-sm text-gray-700 underline" type="button">
                Skip
              </button>
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending}
              className="inline-block rounded bg-[#E36E43] px-6 py-2 text-xs font-bold text-white uppercase leading-normal transition duration-150 ease-in-out hover:scale-110 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
