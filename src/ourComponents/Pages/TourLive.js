import axios from "axios";
import Map from "../Map/Map.js";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Pages.css";
import { useEffect, useState } from "react";
import PointOfInterestCard from "./PointOfInterestCard.js";
import { TiArrowBack } from "react-icons/ti";
import "./Pages.css";
import Modal from "./Modal.js";
import loading from "../../assets/S-Loop_transnparent.gif";

const API = process.env.REACT_APP_API_URL;

export default function Tour() {
  const [tour, setTour] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [allPointsOfInterest, setAllPointsOfInterest] = useState([]);
  const [activeMarker, setActiveMarker] = useState("");
  const [modal, setModal] = useState(false);
  const [currentPoi, setCurrentPoi] = useState("");
  const [modalCommentary, setModalCommentary] = useState("");

  const { id } = useParams();
  const navigate = useNavigate(); // ✅ added (ONLY for End Tour)

  useEffect(() => {
    axios
      .get(`${API}/tours/${id}`)
      .then((res) => {
        setTour(res.data);
        setPointsOfInterest(res.data.ordered_points_of_interest);
      })
      .catch((e) => console.warn(e));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${API}/tours/${id}/pointsOfInterest`)
      .then((res) => {
        setAllPointsOfInterest(res.data);
      })
      .catch((e) => console.warn(e));
  }, [id]);

  const currentPointOfInterest = allPointsOfInterest.find(
    (el) => el.poi_name === currentPoi
  );

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // ✅ End Tour action (routes to your EndTour page)
  const handleEndTour = () => {
    navigate("/endtour");
  };

  return pointsOfInterest && allPointsOfInterest && tour ? (
  <div className="min-h-screen pt-[180px] px-4 sm:px-6 lg:px-10">
    {/* Back button */}
    <div className="mb-4">
      <Link
        to="/tours"
        className="inline-flex items-center gap-2 text-sky-950 font-extrabold hover:underline"
      >
        <TiArrowBack />
        ALL TOURS
      </Link>
    </div>

    {/* Header */}
    <div className="text-center mb-6">
      <h1
        className="
          inline-block
          text-3xl sm:text-4xl lg:text-6xl
          font-extrabold
          text-transparent bg-clip-text bg-gradient-to-r to-cyan-600 from-sky-950
          pb-2
          overflow-visible
        "
      >
        {tour.city}
        {tour.state ? `, ${tour.state.toUpperCase()}` : ""}, {tour.country}
      </h1>

      <h4 className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400">
        Welcome to your {tour.tour_name}
      </h4>
    </div>

    {/* Content */}
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
      {/* MAP (mobile first) */}
      <div className="w-full order-1 lg:order-2">
        {pointsOfInterest.length && allPointsOfInterest.length ? (
          <figure className="w-full">
            <div
              className="
                w-full
                rounded-lg
                overflow-hidden
                border border-gray-200
                shadow-sm
                h-[260px]
                sm:h-[320px]
                md:h-[380px]
                lg:h-[500px]
              "
            >
              <Map
                className="w-full h-full"
                activeMarker={activeMarker}
                pointsOfInterest={pointsOfInterest}
                allPointsOfInterest={allPointsOfInterest}
              />
            </div>

            <figcaption className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              {tour.city}
              {tour.state ? `, ${tour.state}` : ""} {tour.country} — Google Images©
            </figcaption>
          </figure>
        ) : null}
      </div>

      {/* POI LIST */}
      <div className="w-full order-2 lg:order-1">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-xl p-4 max-h-[60vh] lg:max-h-[500px] flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-950 mb-3">
            Points of Interest
          </h2>

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto overscroll-contain pr-1">
            <ul className="space-y-2">
              {pointsOfInterest.length &&
                allPointsOfInterest.length &&
                pointsOfInterest.map((poi, index) => {
                  const allPoi = allPointsOfInterest.find(
                    (el) => el.poi_name === poi
                  );
                  if (!allPoi) return null;

                  return (
                    <PointOfInterestCard
                      key={index}
                      poi_id={allPoi.id}
                      name={allPoi.poi_name}
                      img={allPoi.image_url}
                      setActiveMarker={setActiveMarker}
                      toggleModal={toggleModal}
                      setCurrentPoi={setCurrentPoi}
                      setModalCommentary={setModalCommentary}
                    />
                  );
                })}
            </ul>
          </div>

          {/* Footer / END TOUR pinned to bottom */}
          <div className="sticky bottom-0 w-full bg-white/80 dark:bg-gray-900/80 pt-3 pb-4">
            <div className="w-full flex justify-center px-3">
              <button
                type="button"
                onClick={handleEndTour}
                className="
                  w-full max-w-[360px]
                  sm:w-[320px]
                  inline-flex justify-center items-center
                  rounded bg-[#183759]
                  px-6 py-3
                  text-xs font-bold text-[#dbd4db]
                  uppercase leading-normal
                  transition duration-150 ease-in-out
                  hover:scale-105
                "
              >
                END TOUR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* MODAL */}
    {modal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div onClick={toggleModal} className="absolute inset-0 bg-black/50" />
        <Modal
          toggleModal={toggleModal}
          img={currentPointOfInterest?.image_url}
          name={currentPointOfInterest?.poi_name}
          commentary={modalCommentary}
        />
      </div>
    )}
  </div>
) : (
  <div className="min-h-screen flex items-center justify-center">
    <img src={loading} alt="loading..." className="w-40 sm:w-56" />
  </div>
);

}
