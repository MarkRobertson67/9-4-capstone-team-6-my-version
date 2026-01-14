// /*global google*/
import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useEffect } from 'react';


const google = window.google = window.google ? window.google : {}

// Do I need activeMarker
export default function Map({ pointsOfInterest, allPointsOfInterest, activeMarker }) {

  const [directionsResponse, setDirectionsResponse] = useState(null)

  const firstPoi = allPointsOfInterest.find((el) => el.poi_name === pointsOfInterest[0])

  // eslint-disable-next-line no-undef
  const directionsService = new google.maps.DirectionsService()
  const calculateRoute = async () => {
    const waypoints = pointsOfInterest.slice(1, -1).map((poi) => {
      const newPointsOfInterest = allPointsOfInterest.find((el) => el.poi_name === poi)
      const locationObj = { location: { lat: Number(newPointsOfInterest.latitude), lng: Number(newPointsOfInterest.longitude) } }
      return locationObj
    })
    const lastPoi = allPointsOfInterest.find((el) => el.poi_name === pointsOfInterest[pointsOfInterest.length - 1])
    const results = await directionsService.route({
      origin: { lat: Number(firstPoi.latitude), lng: Number(firstPoi.longitude) },
      waypoints,
      destination: { lat: Number(lastPoi.latitude), lng: Number(lastPoi.longitude) },
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING
    })
    setDirectionsResponse(results)
  }


  useEffect(() => {
    calculateRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const settingCustomMarker = (img) => {

    const customMarkerIcon = {
      url: img,
      // eslint-disable-next-line no-undef
      scaledSize: new google.maps.Size(40, 40)
    }
    return customMarkerIcon
  }

  return (
    <div position='center' className='lg:h-[300px] lg:w-[600px] max-[760px]:h-24'>
      <GoogleMap
        center={{ lat: Number(firstPoi.latitude), lng: Number(firstPoi.longitude) }}
        zoom={15}
        mapContainerStyle={{ width: '105%', height: '150%' }}
        options={{
          mapTypeControl: false,
        }}
      >
        {
          pointsOfInterest.length && allPointsOfInterest.length &&
          pointsOfInterest.map((poi) => {
            const newPointsOfInterest = allPointsOfInterest.find((el) => el.poi_name === poi)
            return newPointsOfInterest
          }).map(({ latitude, longitude, image_url, poi_name }, index) => <MarkerF key={index} position={{ lat: Number(latitude), lng: Number(longitude) }} icon={settingCustomMarker(image_url)} animation={null} />)
        }
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
      <br />
      <div>
      </div>
    </div>
  )
}
