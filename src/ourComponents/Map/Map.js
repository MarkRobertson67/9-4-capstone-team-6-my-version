// /*global google*/
import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      <p>
        <button className='mt-2 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'><Link className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0' to={'/endtour'}>END TOUR</Link></button>
      </p>
      <br />
      <div>
      </div>
    </div>
  )
}
