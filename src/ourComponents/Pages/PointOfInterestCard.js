import { Link } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { HiPlay } from "react-icons/hi2";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function PointOfInterestCard({
  poi_id,
  name,
  img,
  setActiveMarker,
  toggleModal,
  setCurrentPoi,
  setModalCommentary,
}) {
  const liClick = async (name) => {
  try {
    const res = await axios.get(`${API}/commentary/poi/${poi_id}`);
    toggleModal();
    setCurrentPoi(name);
    setModalCommentary(
      res.data?.description || "Commentary is still being generated..."
    );
  } catch (err) {
    console.error("Failed to load commentary:", err);
    toggleModal();
    setCurrentPoi(name);
    setModalCommentary("Commentary unavailable right now.");
  }
};

  return (
    <div>
      <li
        className="text-left"
        onMouseOver={() => setActiveMarker(name)}
        onMouseLeave={() => setActiveMarker("")}
        onClick={() => liClick(name)}
      >
        <span className="float-left px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full">
          <h3 className="inline-flex text-xl font-bold">
            <ImLocation />
            {name}
          </h3>

          <section className="border-l-2 border-sky-950 ml-2">
            <p className="ml-3">
              <Link className="inline-flex text-sky-800">
                <HiPlay className="mt-1" /> PLAY COMMENTARY
              </Link>
              &nbsp;
            </p>

            <p className="ml-3 text-gray-500 dark:text-gray-400">
              Click to view details about {name} and proceed with your tour...
            </p>
          </section>
        </span>
      </li>
    </div>
  );
}
