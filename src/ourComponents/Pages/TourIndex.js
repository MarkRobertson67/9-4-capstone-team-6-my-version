import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TourCard from "./TourCard";

const API = process.env.REACT_APP_API_URL;

export default function TourIndex() {
  const [tours, setTours] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const scrollerRef = useRef(null);

  // Protect seed tours (assumes seed tours are ids 1-5)
  const isSeedTour = useMemo(() => {
    const seedIds = new Set([1, 2, 3, 4, 5]);
    return (tour) => seedIds.has(Number(tour.id));
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/tours`)
      .then((res) => setTours(res.data))
      .catch((e) => console.warn("Error fetching tours:", e));
  }, []);

  // Keep expand/collapse animation
  const cardVariants = {
    expanded: { width: 520 },
    collapsed: { width: 224 },
  };

  // Scroll by ~5 cards at a time
  const scrollByCards = (direction = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = 224 * 5;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const handleDelete = async (e, tourId) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (e?.preventDefault) e.preventDefault();

    try {
      const res = await axios.delete(`${API}/tours/${tourId}`);
      console.log("Deleted:", res.data);
      setTours((prev) => prev.filter((t) => Number(t.id) !== Number(tourId)));

      // if we deleted the expanded one, close
      setExpandedIndex((prev) => (prev === null ? null : prev));
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Delete failed. Check console/network tab.");
    }
  };

  /**
   * Ensure expanded card is fully visible in the scroller.
   * This runs after the expand happens (we delay slightly so width animation starts).
   */
  const ensureCardFullyVisible = (cardEl) => {
    const scroller = scrollerRef.current;
    if (!scroller || !cardEl) return;

    const sRect = scroller.getBoundingClientRect();
    const cRect = cardEl.getBoundingClientRect();

    // If card overflows left, scroll left
    if (cRect.left < sRect.left) {
      const delta = sRect.left - cRect.left + 16; // padding
      scroller.scrollBy({ left: -delta, behavior: "smooth" });
    }

    // If card overflows right, scroll right
    if (cRect.right > sRect.right) {
      const delta = cRect.right - sRect.right + 16; // padding
      scroller.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  const handleShowClick = (index, cardEl) => {
    setExpandedIndex((prev) => (prev === index ? null : index));

    // After state change, wait a tick for layout/animation and then ensure visibility
    setTimeout(() => ensureCardFullyVisible(cardEl), 180);
  };

  return (
    <section className="gradient-day-to-night pt-[210px] pb-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold luxury-font drop-shadow-lg">
          Discover the World's Wonders
        </h1>
        <br />
        <h2 className="text-3xl font-light text-sky-950 drop-shadow-lg italic">
          Our Prepackaged Tour Catalog
        </h2>
      </div>

      {/* Carousel wrapper MUST be relative so arrows position correctly */}
      <div className="relative max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                     bg-white/80 hover:bg-white text-gray-900
                     rounded-full w-12 h-12 shadow-lg
                     flex items-center justify-center"
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                     bg-white/80 hover:bg-white text-gray-900
                     rounded-full w-12 h-12 shadow-lg
                     flex items-center justify-center"
          aria-label="Scroll right"
        >
          ›
        </button>

        {/* Horizontal scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto overscroll-x-contain
                     scroll-smooth snap-x snap-mandatory
                     py-2 px-2
                     [scrollbar-width:thin]"
        >
          {tours.map((tour, index) => {
            const expanded = index === expandedIndex;

            // If this is the last or 2nd-to-last card, snap it to the right
            // so expansion feels like it grows leftward.
            const nearEnd = index >= tours.length - 2;

            return (
              <motion.div
                key={tour.id}
                className={`relative snap-center flex-shrink-0 cursor-pointer
                           h-[500px] bg-cover bg-center rounded-[20px]
                           overflow-hidden ${nearEnd ? "snap-end" : ""}`}
                variants={cardVariants}
                initial="collapsed"
                animate={expanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.45 }}
                style={{ backgroundImage: `url(${tour.image_url})` }}
                // use currentTarget so we can pass the element to ensureCardFullyVisible
                onClick={(e) => handleShowClick(index, e.currentTarget)}
              >
                {/* DELETE BUTTON (only if not seed) */}
                {!isSeedTour(tour) && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, tour.id)}
                    className="absolute top-3 right-3 z-40
                               bg-red-600/90 hover:bg-red-600 text-white
                               text-xs font-bold px-3 py-2 rounded-lg shadow-lg"
                    title="Delete tour"
                  >
                    Delete
                  </button>
                )}

                {/* Footer overlay */}
                <div className="h-full flex flex-col justify-end">
                  <div className="rounded-b-[20px] bg-gray-800 bg-opacity-75 min-h-[110px] px-3 py-3 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-white text-center">
                      {tour.city}
                      {tour.state ? `, ${tour.state}` : ""}
                      {tour.country ? `, ${tour.country}` : ""}
                    </h3>

                    {expanded && (
                      <div
                        className="mt-2 text-gray-200 text-center"
                        onClick={(e) => e.stopPropagation()} // allow clicking link without collapsing
                      >
                        <TourCard tour={tour} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
