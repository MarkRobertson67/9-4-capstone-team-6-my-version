import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loadingAnimation from "../../../assets/S-Loop_transnparent.gif";
import "../CreateNewTour/CreateNewTour.css";
import NoTourImageAvailable from "../../../assets/NoTourImageAvailale.png";
import NoPOIImageAvailable from "../../../assets/NoPOIImageAvailable.png";

// Sanitizer function to prevent SQL injection
function sanitizeInput(input) {
  if (input == null) return "";
  return String(input).replace(/'/g, "''");
}

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  unsplashApiKey: process.env.REACT_APP_UNSPLASH_API_ACCESS_KEY,
  unsplashApiSecretKey: process.env.REACT_APP_UNSPLASH_API_SECRET_KEY,
  pixabayApiKey: process.env.REACT_APP_PIXABAY_API_KEY,
};

/**
 * Calls backend: POST /ai/generate-commentary
 * Adds retry + 15s timeout
 */

const generatePOICommentary = async (
  poiName,
  cityName,
  countryName,
  {
    maxAttempts = 5,
    timeoutMs = 15000,
    baseDelayMs = 800, // backoff base
  } = {}
) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Attempt ${attempt}/${maxAttempts}: Generating commentary for "${poiName}" in ${cityName}, ${countryName}...`
      );

      const request = axios.post(
        `${config.apiUrl}/ai/generate-commentary`,
        { poiName, cityName, countryName },
        { headers: { "Content-Type": "application/json" } }
      );

      const res = await Promise.race([
        request,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs)
        ),
      ]);

      const commentary = res?.data?.commentary;

      if (commentary && String(commentary).trim().length > 0) {
        console.log("Generated Commentary:", commentary);
        return commentary;
      }

      throw new Error("Empty commentary");
    } catch (err) {
      console.error(
        `Commentary attempt ${attempt} failed for "${poiName}":`,
        err?.message || err
      );

      // If last attempt, stop.
      if (attempt === maxAttempts) break;

      // Backoff before retry (800ms, 1600ms, 2400ms, ...)
      const delay = baseDelayMs * attempt;
      await sleep(delay);
    }
  }

  console.error(
    `Failed to generate commentary for "${poiName}" after ${maxAttempts} attempts.`
  );
  return "";
};

// Insert POI into DB
const insertPointOfInterest = async (
  poi,
  newTourId,
  coordinates,
  image_url
) => {
  console.log("Inserting Point of Interest:", poi);
  console.log("New Tour ID:", newTourId);
  console.log("Coordinates:", coordinates);
  console.log("Image URL:", image_url);

  try {
    const response = await axios.post(
      `${config.apiUrl}/pointofinterest`,
      {
        poi_name: poi,
        tour_id: newTourId,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
        image_url: image_url,
        created_at: new Date().toISOString(),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const poiId = response.data.id;
    console.log(
      `Point of Interest "${poi}" added successfully:`,
      response.data
    );
    return poiId;
  } catch (error) {
    console.error(`Error adding Point of Interest "${poi}":`, error);
    return null;
  }
};

// Unsplash image for POI (with local fallback)
const getImageFromUnsplash = async (poi, cityName) => {
  try {
    const query = `${encodeURIComponent(poi)} ${encodeURIComponent(cityName)}`;

    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${config.unsplashApiKey}&count=1&order_by=relevant&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${config.unsplashApiSecretKey}`,
        },
      }
    );

    const url = response.data.results[0]?.urls?.regular || "";

    // ✅ If no Unsplash result, return local fallback
    return url || NoPOIImageAvailable;
  } catch (error) {
    console.error(`Error fetching image for ${poi} from Unsplash:`, error);

    // ✅ If request fails, return local fallback
    return NoPOIImageAvailable;
  }
};

// City photo (with local fallback)
const fetchCityPhoto = async (cityName, setCityPhoto) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        cityName
      )}&client_id=${
        config.unsplashApiKey
      }&count=1&order_by=relevant&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${config.unsplashApiSecretKey}`,
        },
      }
    );

    const url = response.data.results[0]?.urls?.regular || "";

    const finalUrl = url || NoTourImageAvailable;
    setCityPhoto(finalUrl);

    return finalUrl;
  } catch (error) {
    console.error("Error fetching city photo:", error);

    setCityPhoto(NoTourImageAvailable);
    return NoTourImageAvailable;
  }
};

// Insert commentary into DB
const insertCommentary = async (poiId, commName, description) => {
  console.log(`Adding commentary for "${commName}"...`);

  try {
    const response = await axios.post(
      `${config.apiUrl}/commentary`,
      {
        poi_id: poiId,
        comm_name: commName,
        description: description,
        created_at: new Date().toISOString(),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(`Commentary "${commName}" added successfully:`, response.data);
  } catch (error) {
    console.error(`Error adding Commentary "${commName}":`, error);
  }
};

export default function CreateNewTour() {
  const [tour, setTour] = useState({
    country: "",
    region: "",
    state: "",
    city: "",
    duration: "",
    difficulty: "",
    theme: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [cityPhoto, setCityPhoto] = useState(null);
  const navigate = useNavigate();
  const [isFetchingImage, setIsFetchingImage] = useState(false);

  // Parse: "1. Place (41.0000° N, 2.0000° E)"
  const parsePointsOfInterestAndCoordinates = (generatedTour) => {
    const bulletPattern =
      /^(\d+)\.\s(.+?)\s\((\d+(?:\.\d+)?)°\s([NS]),\s(\d+(?:\.\d+)?)°\s([EW])\)/gm;

    const matches = [];
    let match;

    while ((match = bulletPattern.exec(generatedTour)) !== null) {
      const poi = match[2];
      const latitude = parseFloat(match[3]);
      const latitudeDirection = match[4];
      const longitude = parseFloat(match[5]);
      const longitudeDirection = match[6];

      const latitudeSign = latitudeDirection === "N" ? 1 : -1;
      const longitudeSign = longitudeDirection === "E" ? 1 : -1;

      const adjustedLatitude = latitude * latitudeSign;
      const adjustedLongitude = longitude * longitudeSign;

      matches.push({
        poi,
        coordinates: {
          latitude: adjustedLatitude,
          longitude: adjustedLongitude,
        },
      });
    }

    return matches;
  };

  /**
   * Calls backend: POST /ai/generate-tour
   */
  const generateWalkingTour = async () => {
    let retries = 1;

    const generateTour = async () => {
      try {
        setIsLoading(true);

        const sanitizedCity = sanitizeInput(tour.city);
        const sanitizedRegion = sanitizeInput(tour.region);
        const sanitizedState = sanitizeInput(tour.state);
        const sanitizedCountry = sanitizeInput(tour.country);
        const sanitizedDuration = sanitizeInput(tour.duration);
        const sanitizedDifficulty = sanitizeInput(tour.difficulty);
        const sanitizedTheme = sanitizeInput(tour.theme);

        let maxPointsOfInterest;
        if (sanitizedDuration === "2 hours") maxPointsOfInterest = 7;
        else if (sanitizedDuration === "Half-day") maxPointsOfInterest = 15;
        else if (sanitizedDuration === "Full-day") maxPointsOfInterest = 25;
        else {
          console.error("Invalid duration or duration not specified.");
          setIsLoading(false);
          return null;
        }

        console.log(
          `Maximum allowed points of interest for ${sanitizedDuration}: ${maxPointsOfInterest}`
        );

        // ✅ backend call (no OpenAI key in frontend)
        const response = await axios.post(
          `${config.apiUrl}/ai/generate-tour`,
          {
            tour: {
              city: sanitizedCity,
              region: sanitizedRegion,
              state: sanitizedState,
              country: sanitizedCountry,
              duration: sanitizedDuration,
              difficulty: sanitizedDifficulty,
              theme: sanitizedTheme,
            },
            maxPointsOfInterest,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const generatedTour = response.data?.generatedTour || "";

        console.log("Generated Tour:", generatedTour);

        const pointsOfInterestWithCoordinates =
          parsePointsOfInterestAndCoordinates(generatedTour);

        const pointsOfInterest = pointsOfInterestWithCoordinates.map(
          (p) => p.poi
        );
        const coordinates = pointsOfInterestWithCoordinates.map(
          (p) => p.coordinates
        );

        const sanitizedPointsOfInterest = pointsOfInterest.map(sanitizeInput);

        return { generatedTour, sanitizedPointsOfInterest, coordinates };
      } catch (error) {
        console.error("Error generating tour:", error);
        setIsLoading(false);
        return null;
      }
    };

    let tourData = null;

    while (retries < 6) {
      console.log(`Attempt ${retries}: Generating tour...`);
      tourData = await generateTour();

      if (tourData && tourData.sanitizedPointsOfInterest.length > 0) break;
      retries++;
    }

    if (!tourData || tourData.sanitizedPointsOfInterest.length === 0) {
      console.error(`Failed to generate tour after 5 retries.`);
      setIsLoading(false);
      return null;
    }

    return tourData;
  };

  const handleDropdownChange = (event) => {
    const { id, value } = event.target;
    setTour({ ...tour, [id]: value });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setTour({ ...tour, [name]: value });
  };

  const generateTourName = () => {
    const { city, country, theme, duration, difficulty } = tour;
    return `${city}, ${country} ${theme} tour - lasting ${duration} with ${difficulty} difficulty.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setIsFetchingImage(true);
    setCityPhoto(null); // reset so skeleton shows, not fallback

    const generatedWalkingTour = await generateWalkingTour();
    if (!generatedWalkingTour) {
      console.error("Walking tour generation failed.");
      setIsLoading(false);
      setIsFetchingImage(false);
      return;
    }

    const { sanitizedPointsOfInterest, coordinates } = generatedWalkingTour;

    const cityPhotoUrl = await fetchCityPhoto(tour.city, setCityPhoto);

    const newTour = {
      country: sanitizeInput(tour.country),
      region: sanitizeInput(tour.region),
      state: sanitizeInput(tour.state),
      city: sanitizeInput(tour.city),
      duration: sanitizeInput(tour.duration),
      difficulty: sanitizeInput(tour.difficulty),
      theme: sanitizeInput(tour.theme),
      tour_name: generateTourName(),
      image_url: cityPhotoUrl,
      ordered_points_of_interest: sanitizedPointsOfInterest,
    };

    try {
      const response = await axios.post(`${config.apiUrl}/tours`, newTour, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Tour added successfully:", response.data);

      const newTourId = response.data.id;

      for (let i = 0; i < sanitizedPointsOfInterest.length; i++) {
        const poi = sanitizedPointsOfInterest[i];
        const poiCoordinates = coordinates[i];

        let poiImageUrl = "";
        try {
          poiImageUrl = await getImageFromUnsplash(poi, tour.city);
        } catch (imageError) {
          console.error(
            `Error fetching image for ${poi} from Unsplash:`,
            imageError
          );
        }

        const poiId = await insertPointOfInterest(
          poi,
          newTourId,
          poiCoordinates,
          poiImageUrl
        );

        if (!poiId) continue;

        const commentary = await generatePOICommentary(
          poi,
          tour.city,
          tour.country
        );

        if (commentary && commentary.trim().length > 0) {
          await insertCommentary(poiId, poi, commentary);
        } else {
          console.warn(`Skipping commentary insert for "${poi}" (empty).`);
        }
      }

      setIsLoading(false);
      navigate(`/tours/${newTourId}`);
    } catch (error) {
      console.error("Error adding tour:", error);
      setIsLoading(false);
      setIsFetchingImage(false);
    }
  };

  return (
    <div
      className="
    gradient-day-to-night
    min-h-screen
    w-screen
    relative left-1/2 right-1/2
    -ml-[50vw] -mr-[50vw]
    pt-[200px]
  "
    >
      <div className="">
        <h1 className="luxury-font text-3xl text-center mb-4 font-extrabold text-sky-950 drop-shadow-lg">
          Ready to Explore?
        </h1>

        <p className="generator-directions text-lg font-semibold text-sky-950 drop-shadow-lg">
          Explore the world and create your own adventure! Whether you're a
          history buff, a foodie, or an outdoor enthusiast, there's a unique
          journey waiting for you. Uncover hidden gems, savor local flavors, and
          embark on unforgettable experiences.
        </p>

        <div className="content-container background-image rounded-lg">
          {/* ✅ items-start + self-start + !mt-0 kills any CSS top margin mismatch */}
          <div className="flex items-start justify-evenly gap-20">
            {/* FORM COLUMN */}
            <div className="self-start !mt-0 !pt-0">
              <div className="fields-container rounded-lg !mt-0 !pt-5">
                <div className="field mb-0">
                  <input
                    type="text"
                    className="input rounded-lg border"
                    placeholder="Enter a City to Explore"
                    name="city"
                    value={tour.city}
                    onChange={handleTextChange}
                  />
                </div>

                <div className="field mb-3">
                  <input
                    type="text"
                    className="input rounded-lg border"
                    placeholder="Borough/Region if applicable"
                    name="region"
                    value={tour.region}
                    onChange={handleTextChange}
                  />
                </div>

                <div className="field mb-3">
                  <input
                    type="text"
                    className="input rounded-lg border"
                    placeholder="State/County/Province if applicable"
                    name="state"
                    value={tour.state}
                    onChange={handleTextChange}
                  />
                </div>

                <div className="field mb-3">
                  <input
                    type="text"
                    className="input rounded-lg border"
                    placeholder="Enter the Country"
                    name="country"
                    value={tour.country}
                    onChange={handleTextChange}
                  />
                </div>

                <div className="field mb-3">
                  <select
                    className="input rounded-lg border"
                    value={tour.duration}
                    onChange={handleDropdownChange}
                    id="duration"
                  >
                    <option value="" disabled>
                      Select Day Duration
                    </option>
                    <option value="Full-day">Full-day</option>
                    <option value="Half-day">Half-day</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>

                <div className="field mb-3">
                  <select
                    className="input rounded-lg border"
                    value={tour.difficulty}
                    onChange={handleDropdownChange}
                    id="difficulty"
                  >
                    <option value="" disabled>
                      Select Walking Difficulty
                    </option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="field mb-0">
                  <select
                    className="input rounded-lg border"
                    value={tour.theme}
                    onChange={handleDropdownChange}
                    id="theme"
                  >
                    <option value="" disabled>
                      Select Tour Theme
                    </option>
                    <option value="Historic">Historic</option>
                    <option value="Scenic">Scenic</option>
                    <option value="Fun">Fun</option>
                    <option value="Museums">Museums</option>
                    <option value="Pubs">Pubs</option>
                  </select>

                  <div className="mb-3 text-center">
                    <button
                      onClick={handleSubmit}
                      disabled={!tour.city || isLoading}
                      type="button"
                      className="mt-6 inline-block rounded bg-[#183759] px-6 py-2 text-xs font-bold text-[#dbd4db] uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:scale-110"
                    >
                      Generate Walking Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW COLUMN */}
            {isLoading && (
              <div className="self-start !mt-0 !pt-0 w-[420px] flex flex-col items-center">
                {cityPhoto ? (
                  <img
                    src={cityPhoto}
                    alt={tour.city ? `${tour.city}` : "Tour image"}
                    className="w-[420px] max-h-[550px] rounded-lg object-cover !mt-0"
                    onError={(e) => {
                      e.currentTarget.src = NoTourImageAvailable;
                    }}
                  />
                ) : (
                  <div className="w-[420px] h-[300px] rounded-lg bg-gray-300/60 animate-pulse" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen overlay ONLY while fetching the image */}
      {isFetchingImage && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-800/50">
          <div className="mt-[320px] flex flex-col items-center">
            <div className="rounded-md bg-yellow-100/90 border border-yellow-300 px-4 py-3 text-xs text-yellow-900 text-center animate-pulse max-w-md">
              ⏳ Please be patient while your tour is being created.
              <br />
              This process can take several minutes as we generate
              <br />
              the tour and detailed commentary for each stop.
            </div>

            <img
              src={loadingAnimation}
              alt="Loading..."
              className="w-1/4 mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
