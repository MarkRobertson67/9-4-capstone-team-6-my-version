// src/ourComponents/Pages/TourIndex.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TourCard from "./TourCard";
import loadingAnimation from "../../assets/S-Loop_transnparent.gif";

const API = process.env.REACT_APP_API_URL;

export default function TourIndex() {
  const [tours, setTours] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollerRef = useRef(null);

  // Protect seed tours (assumes seed tours are ids 1-5)
  const isSeedTour = useMemo(() => {
    const seedIds = new Set([1, 2, 3, 4, 5]);
    return (tour) => seedIds.has(Number(tour.id));
  }, []);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    axios
      .get(`${API}/tours`)
      .then((res) => {
        if (!isMounted) return;
        setTours(res.data);
      })
      .catch((e) => {
        if (!isMounted) return;
        console.warn("Error fetching tours:", e);
        setError("Failed to load tours. Please try again.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep expand/collapse animation
  const cardVariants = {
    expanded: { width: 520 },
    collapsed: { width: 224 },
  };

  // Arrow scroll by ~5 cards
  const scrollByCards = (direction = 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const step = 224 * 5; // collapsedWidth * 5
    scroller.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const handleDelete = async (e, tourId) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (e?.preventDefault) e.preventDefault();

    try {
      const res = await axios.delete(`${API}/tours/${tourId}`);
      console.log("Deleted:", res.data);

      setTours((prev) => prev.filter((t) => Number(t.id) !== Number(tourId)));
      // Close expansion (simplest; avoids edge cases if you delete expanded)
      setExpandedIndex(null);
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Delete failed. Check console/network tab.");
    }
  };

  const ensureCardFullyVisible = (cardEl) => {
    const scroller = scrollerRef.current;
    if (!scroller || !cardEl) return;

    const sRect = scroller.getBoundingClientRect();
    const cRect = cardEl.getBoundingClientRect();

    const leftBuffer = 24;
    const rightBuffer = 24;

    const viewLeft = sRect.left;
    const viewRight = sRect.right;

    const cardLeft = cRect.left;
    const cardRight = cRect.right;

    // If card is clipped on the LEFT, scroll left just enough
    if (cardLeft < viewLeft + leftBuffer) {
      const delta = viewLeft + leftBuffer - cardLeft;
      scroller.scrollBy({ left: -delta, behavior: "smooth" });
    }

    // If card is clipped on the RIGHT, scroll right just enough
    if (cardRight > viewRight - rightBuffer) {
      const delta = cardRight - (viewRight - rightBuffer);
      scroller.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  /**
   * Expanding animates width over ~450ms.
   * If we check only once, it can be jittery.
   * So we re-check a few times while the animation runs.
   */
  const ensureDuringAnimation = (cardEl) => {
    const times = [0, 120, 240, 360, 480];
    times.forEach((ms) => {
      setTimeout(() => ensureCardFullyVisible(cardEl), ms);
    });
  };

  const handleShowClick = (index, cardEl) => {
  setExpandedIndex((prev) => {
    const next = prev === index ? null : index;

    if (next === index && cardEl) {
      setTimeout(() => {
        // MOBILE ONLY
        if (window.innerWidth < 1024) {
          const rect = cardEl.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const viewportCenterX = window.innerWidth / 2;

          window.scrollBy({
            left: cardCenterX - viewportCenterX,
            behavior: "smooth",
          });
        } else {
          // desktop behavior stays exactly the same
          ensureDuringAnimation(cardEl);
        }
      }, 50);
    }

    return next;
  });
};


  return (
    <section
      className="
    gradient-day-to-night
    pt-[200px] pb-[100px]
    w-screen
    relative left-1/2 right-1/2
    -ml-[50vw] -mr-[50vw]
  "
    >
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

        {/* Responsive scroller: vertical on mobile, horizontal on lg+ */}
        <div
          ref={scrollerRef}
          className="
    grid grid-cols-1 gap-6
    overflow-visible

    lg:flex lg:gap-5
    lg:overflow-x-auto lg:overscroll-x-contain
    lg:scroll-smooth lg:snap-x lg:snap-mandatory
    lg:py-2 lg:px-2
    lg:[scrollbar-width:thin]
  "
        >
          {/* LOADING */}
          {loading && (
            <div className="w-full flex items-center justify-center py-16 sm:py-20">
              <div className="flex flex-col items-center px-4">
                <div className="rounded-md bg-yellow-100/90 border border-yellow-300 px-4 py-3 text-xs sm:text-sm text-yellow-900 text-center animate-pulse max-w-md">
                  ⏳ Loading tours...
                  <br />
                  Please wait while we fetch the latest tours.
                </div>

                <img
                  src={loadingAnimation}
                  alt="Loading..."
                  className="w-28 sm:w-36 mt-4"
                />
              </div>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="w-full text-center py-24 text-white/90">
              {error}
            </div>
          )}

          {/* TOURS */}
          {!loading &&
            !error &&
            tours.map((tour, index) => {
              const expanded = index === expandedIndex;

              return (
                <motion.div
                  key={tour.id}
                  className="
                  relative cursor-pointer
                  mx-auto lg:mx-0

                  w-[92%] max-w-[420px]          /* mobile: card-like width, not full screen */
                  sm:w-[420px]                  /* tablet+ */
                  h-[420px] sm:h-[500px]

                  bg-cover bg-center rounded-[20px]
                  overflow-hidden

                  lg:snap-start lg:flex-shrink-0
                  max-lg:!w-[92%] max-lg:!max-w-[420px]
                  "

                  variants={cardVariants}
                  initial="collapsed"
                  animate={expanded ? "expanded" : "collapsed"}
                  transition={{ duration: 0.45 }}
                  style={{ backgroundImage: `url(${tour.image_url})` }}
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
                          onClick={(e) => e.stopPropagation()}
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
