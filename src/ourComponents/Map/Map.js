import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";



export default function Map({ pointsOfInterest = [], allPointsOfInterest = [], activeMarker }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const firstPoi = useMemo(() => {
    if (!pointsOfInterest.length || !allPointsOfInterest.length) return null;
    return allPointsOfInterest.find((el) => el.poi_name === pointsOfInterest[0]) || null;
  }, [pointsOfInterest, allPointsOfInterest]);

  // Build directions service only when google is available
  const directionsService = useMemo(() => {
    if (!window.google?.maps) return null;
    return new window.google.maps.DirectionsService();
  }, []);

  const calculateRoute = async () => {
    if (!directionsService || !firstPoi) return;

    const waypoints = pointsOfInterest.slice(1, -1).map((poi) => {
      const p = allPointsOfInterest.find((el) => el.poi_name === poi);
      return {
        location: { lat: Number(p.latitude), lng: Number(p.longitude) },
      };
    });

    const lastPoi =
      allPointsOfInterest.find(
        (el) => el.poi_name === pointsOfInterest[pointsOfInterest.length - 1]
      ) || null;

    if (!lastPoi) return;

    const results = await directionsService.route({
      origin: { lat: Number(firstPoi.latitude), lng: Number(firstPoi.longitude) },
      destination: { lat: Number(lastPoi.latitude), lng: Number(lastPoi.longitude) },
      waypoints,
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    setDirectionsResponse(results);
  };

  useEffect(() => {
    calculateRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directionsService, firstPoi]);

  const settingCustomMarker = (img) => {
    if (!window.google?.maps) return undefined;
    return {
      url: img,
      scaledSize: new window.google.maps.Size(40, 40),
    };
  };

  if (!firstPoi) return null;

  return (
    // ✅ THIS is the key: Map fills the wrapper from Tour.js
    <div className="w-full h-full">
      <GoogleMap
        center={{ lat: Number(firstPoi.latitude), lng: Number(firstPoi.longitude) }}
        zoom={15}
        // ✅ Make map size purely controlled by parent
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{ mapTypeControl: false }}
      >
        {pointsOfInterest.length &&
          allPointsOfInterest.length &&
          pointsOfInterest
            .map((poi) => allPointsOfInterest.find((el) => el.poi_name === poi))
            .filter(Boolean)
            .map(({ latitude, longitude, image_url }, index) => (
              <MarkerF
                key={index}
                position={{ lat: Number(latitude), lng: Number(longitude) }}
                icon={settingCustomMarker(image_url)}
                animation={null}
              />
            ))}

        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </div>
  );
}
