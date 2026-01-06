

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loadingAnimation from '../../../assets/S-Loop_transnparent.gif'; // Import the loading animation
import '../CreateNewTour/CreateNewTour.css'
// import tempImage from '../../../assets/travelPhotos/billy-huynh-v9bnfMCyKbg-unsplash.jpg'

// Sanitizer function to prevent SQL injection
function sanitizeInput(input) {
  // Escape single quotes by replacing them with double single quotes
  return input.replace(/'/g, "''");
}

const config = {
  openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  apiUrl: process.env.REACT_APP_API_URL,
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  unsplashApiKey: process.env.REACT_APP_UNSPLASH_API_ACCESS_KEY,
  unsplashApiSecretKey: process.env.REACT_APP_UNSPLASH_API_SECRET_KEY,
  pixabayApiKey: process.env.REACT_APP_PIXABAY_API_KEY,
};


// GeneratePOICommentary function with retry and timeout logic
const generatePOICommentary = async (poiName, cityName, countryName) => {
  let retries = 0;

  // Define a function for generating commentary
  const generateCommentary = async (retryCount) => {
    try {
      // Create a promise that wraps the axios request
      const commentaryPromise = new Promise(async (resolve, reject) => {
        // Create a prompt for generating commentary here...
        const prompt = `Provide a 25-word commentary for ${poiName} in ${cityName}, ${countryName}.`;

        const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'user',
          content: 'Provide 25-word descriptions for each point of interest, as if you are a tour guide addressing your tour group. Use this as an example of the tone of voice for the response I want to get.',
        },
        {
          role: 'user',
          content: 'Double check that you ONLY provide JSON format for your response.',
        },
        {
          role: 'assistant',
          content: `As we stand here, gazing up at the towering steel arches of the Sydney Harbour Bridge, let's journey back in time to the early 20th century. Construction of this engineering marvel began in 1924 during the Great Depression, providing much-needed jobs to thousands of workers. It was a time when the idea of spanning the magnificent Sydney Harbour with a bridge seemed audacious, but determination prevailed.
    
          The Sydney Harbour Bridge, often affectionately known as the "Coathanger" due to its distinctive shape, officially opened in 1932. It was an event of immense pride and celebration for the people of Sydney, marking the culmination of years of hard work and ingenuity. Today, it stands as a symbol of resilience and achievement.
    
          This bridge is more than just a feat of engineering; it's a vital artery of Sydney, connecting the city's central business district with the northern suburbs. As we traverse the bridge's pedestrian walkway, you'll be treated to panoramic views of Sydney Harbour, the Sydney Opera House, and the city skyline. It's a vista that takes your breath away and offers countless photo opportunities.
    
          If you're feeling adventurous, you can even climb the Sydney Harbour Bridge with a guided tour. Scaling this iconic structure provides a thrilling and unique perspective of the city and its surroundings. Whether you're a daredevil or simply seeking an unforgettable experience, the bridge climb is an option you won't want to miss.
    
          The Sydney Harbour Bridge is more than just a physical connector; it's a symbol of unity and celebration. Every year, on New Year's Eve, the bridge becomes the centerpiece of one of the world's most spectacular fireworks displays, lighting up the night sky and drawing crowds from near and far.
    
          As we stand here, taking in the breathtaking views and the history that surrounds us, remember that the Sydney Harbour Bridge is more than just steel and concrete. It's a testament to human vision, determination, and the enduring spirit of Sydney.
    
          I want to thank each of you for joining me on this journey across the Sydney Harbour Bridge today. Whether you're a first-time visitor or a seasoned traveler, this bridge offers an experience that leaves an indelible mark on your memories.
    
          So, as we continue to explore the vibrant city of Sydney, carry with you the awe-inspiring views and the sense of connection to this remarkable bridge. May your time in Sydney be filled with wonder and discovery.`
        },
        {
          role: 'user',
          content: 'Do not use the phrase \'Apologies for the confusion earlier—I will provide... or Certainly! Here is a 50-word commentary...\'',
        },
        {
          role: 'user',
          content: 'Do not return anything other than the commentary',
        },

      ],
      max_tokens: 2000,
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
      });

      const commentary = response.data.choices[0]?.message.content;

      console.log('Generated Commentary:', commentary);

      if (commentary) {
        resolve(commentary); // Resolve the promise with commentary if successful
      } else {
        reject('Empty commentary'); // Reject the promise with an error message if commentary is empty
      }
    } catch (error) {
      reject(error); // Reject the promise with the error if there's an issue with the request
    }
  });

  // Use Promise.race to set a timeout of 15 seconds
  const commentaryPromiseWithTimeout = Promise.race([
    commentaryPromise,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Timeout'); // Reject the promise with a timeout error after 15 seconds
      }, 15000); // 15 seconds timeout
    }),
  ]);

  const commentary = await commentaryPromiseWithTimeout;

  return commentary; // Return commentary if successful
} catch (error) {
  console.error(`Error generating commentary for ${poiName}:`, error);
}

retries++;
console.log(`Attempt ${retryCount + 1}: Retrying...`);
return generateCommentary(retryCount + 1); // Retry by calling the function recursively
};

while (retries < 5) { // Set the maximum number of retries to 5
console.log(`Attempt ${retries + 1}: Generating commentary for "${poiName}" in ${cityName}, ${countryName}...`);
const commentary = await generateCommentary(retries);

if (commentary) {
  return commentary; // Return commentary if successful
}

retries++;
}

console.error(`Failed to generate commentary for ${poiName} after 5 retries.`);
return ''; // Return an empty string if retries are exhausted
};


// Define the insertPointOfInterest function
const insertPointOfInterest = async (poi, newTourId, coordinates, image_url) => {
  // Extract just the name from the poi parameter
  // const poiName = poi.split(' (')[0];

  console.log('Inserting Point of Interest:', poi);
  console.log('New Tour ID:', newTourId);
  console.log('Coordinates:', coordinates);
  console.log('Image URL:', image_url);

  try {
    // Insert the POI data into the database
    const response = await axios.post(`${config.apiUrl}/pointofinterest`, {
      poi_name: poi,
      tour_id: newTourId,
      latitude: coordinates.latitude || null,
      longitude: coordinates.longitude || null,
      image_url: image_url,
      created_at: new Date().toISOString(), // Set the created_at timestamp
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Get the ID of the newly inserted POI
    const poiId = response.data.id;

    console.log(`Point of Interest "${poi}" added successfully:`, response.data);

    // Return the poiId obtained from the response
    // return response.data.poiId;
    return poiId;

  } catch (error) {
    console.error(`Error adding Point of Interest "${poi}":`, error);
  }
};


// Define the getImageFromUnsplash function
const getImageFromUnsplash = async (poi, cityName) => {
  try {
    // Create a query string that includes POI, cityName, and country
    const query = `${encodeURIComponent(poi)} ${encodeURIComponent(cityName)}`;

    console.log('POI:', poi);
    console.log(query);

    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${config.unsplashApiKey}&count=1&order_by=relevant&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${config.unsplashApiSecretKey}`,
        },
      }
    );

    // Extract the photo URL from the response
    const photoUrl = response.data.results[0]?.urls?.regular || '';

    return photoUrl;
  } catch (error) {
    console.error(`Error fetching image for ${poi} from Unsplash:`, error);
    return ''; // Return an empty string in case of an error
  }
};


// Define the fetchCityPhoto function
const fetchCityPhoto = async (cityName, setCityPhoto) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&client_id=${config.unsplashApiKey}&count=1&order_by=relevant&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${config.unsplashApiSecretKey}`,
        },
      }
    );

    // Extract the photo URL from the response
    const photoUrl = response.data.results[0]?.urls?.regular || '';

    setCityPhoto(photoUrl); // Set the city photo URL in state

    return photoUrl;
  } catch (error) {
    console.error('Error fetching city photo:', error);
    return ''; // Return an empty string in case of an error
  }
};


// Define the insertCommentary function
const insertCommentary = async (poiId, commName, description) => {

  console.log(`Adding commentary for "${commName}"...`);

  try {
    // Insert the commentary data into the database
    const response = await axios.post(`${config.apiUrl}/commentary`, {
      poi_id: poiId,
      comm_name: commName,
      description: description,
      created_at: new Date().toISOString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`Commentary "${commName}" added successfully:`, response.data);

  } catch (error) {
    console.error(`Error adding Commentary "${commName}":`, error);
  }
};


export default function CreateNewTour() {
  // Initialize state variables using the useState hook
  const [tour, setTour] = useState({
    country: '',
    region: '',
    state: '',
    city: '',
    duration: '',
    difficulty: '',
    theme: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [cityPhoto, setCityPhoto] = useState('');
  const navigate = useNavigate();


  const parsePointsOfInterestAndCoordinates = (generatedTour) => {
    const bulletPattern = /^(\d+)\.\s(.+?)\s\((-?\d+\.\d+)°\s([NS]),\s(-?\d+\.\d+)°\s([EW])\)/gm;
    const matches = [];
    
    console.log(generatedTour, bulletPattern)
    let match;

    while ((match = bulletPattern.exec(generatedTour)) !== null) {
      console.log(match)
      const poi = match[2];
      const latitude = parseFloat(match[3]);
      const latitudeDirection = match[4];
      const longitude = parseFloat(match[5]);
      const longitudeDirection = match[6];

      const latitudeSign = latitudeDirection === 'N' ? 1 : -1;
      const longitudeSign = longitudeDirection === 'E' ? 1 : -1;

      const adjustedLatitude = latitude * latitudeSign;
      const adjustedLongitude = longitude * longitudeSign;

      const coordinates = { latitude: adjustedLatitude, longitude: adjustedLongitude };

      matches.push({ poi, coordinates });
      console.log(`This is the Parsed poi: ${poi}`);
      console.log(`Coordinates: Latitude ${adjustedLatitude}, Longitude ${adjustedLongitude}`);
    }
    return matches;
  };


// Function to generate a walking tour with retry and timeout logic
const generateWalkingTour = async () => {
  let retries = 1;

  // Define a function for generating the tour
  const generateTour = async () => {
    try {
      setIsLoading(true); // Set loading to true

      // Log that the function is being called
      console.log('generateWalkingTour function called');

      // Sanitize the input values
      const sanitizedCity = sanitizeInput(tour.city);
      const sanitizedRegion = sanitizeInput(tour.region);
      const sanitizedState = sanitizeInput(tour.state);
      const sanitizedCountry = sanitizeInput(tour.country);
      const sanitizedDuration = sanitizeInput(tour.duration);
      const sanitizedDifficulty = sanitizeInput(tour.difficulty);
      const sanitizedTheme = sanitizeInput(tour.theme);

      // Determine the maximum allowed points of interest based on tour duration
      let maxPointsOfInterest;
      if (sanitizedDuration === '2 hours') {
        maxPointsOfInterest = 7;
      } else if (sanitizedDuration === 'Half-day') {
        maxPointsOfInterest = 15;
      } else if (sanitizedDuration === 'Full-day') {
        maxPointsOfInterest = 25;
      } else {
        // Handle other duration options or invalid inputs, somehow.
        console.error('Invalid duration or duration not specified.');
        setIsLoading(false);
        return;
      }

      console.log(`Maximum allowed points of interest for ${sanitizedDuration}: ${maxPointsOfInterest}`);

      // Construct the prompt dynamically with the maximum allowed points of interest
      const prompt = `Walking Tour in ${sanitizedCity}, ${sanitizedRegion}, ${sanitizedState}, ${sanitizedCountry}\nTour Duration: ${sanitizedDuration}\nMaximum Points of Interest: ${maxPointsOfInterest}\nDifficulty Level: ${sanitizedDifficulty}\nTour Theme: ${sanitizedTheme}`;

      console.log(sanitizedCountry)
      console.log(prompt)

      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Create a self-guided walking tour that starts at the first point of interest, continues to each point of interest, and returns to the first point of interest. Provide a circular tour route and list the points of interest on that route with their coordinates. Ensure that the last point in the list connects back to the first point to complete the tour loop. Do not include any additional information beyond the points of interest and their coordinates.',
          },
          {
            role: 'user',
            content: `Provide a clear and efficient route and ensure that the tour route is truly circular so that the first point of interest is also the last point of interest. Use only N, S, E, and W for directions. Do not use negative numbers. Minimize unnecessary backtracking or overlaps between adjacent locations`,
          },
          {
            role: 'user',
            content: `Tour Location: ${sanitizedCity}, ${sanitizedRegion}, ${sanitizedState}, ${sanitizedCountry}\nTour Duration: ${sanitizedDuration}\nMaximum Points of Interest: ${maxPointsOfInterest}\nDifficulty Level: ${sanitizedDifficulty}\nTour Theme: ${sanitizedTheme}`,
          },
          {
            role: 'user',
            content: `Use the following format for the response, where each point of interest is listed with its coordinates (latitude and longitude):`,
          },
          {
            role: 'user',
            content: `1. Plaça de Catalunya (41.3879° N, 2.1699° E)\n2. La Rambla (41.3799° N, 2.1732° E)\n3. Palau Güell (41.3752° N, 2.1749° E)\n4. Plaça Reial (41.3755° N, 2.1759° E)\n5. Barcelona Cathedral (41.3834° N, 2.1765° E)\n6. (Continue listing all points of interest)\n7. Plaça de Catalunya (41.3879° N, 2.1699° E) `,
          },
          {
            role: 'user',
            content: `If a point of interest has no coordinates, use the following placeholder: "coordinates": { "latitude": 50.5000, "longitude": -50.5000 }`,
          },
          {
            role: 'user',
            content: 'Limit the response to no more than 25 points of interest and coordinates.',
          },
          {
            role: 'user',
            content: `Return no more than the maximum allowed points of interest: ${maxPointsOfInterest}.`,
          },
          {
            role: 'user',
            content: `Tour must start and end at the same points of interest.`,
          },
        ],

      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
      });

      const generatedTour = response.data.choices[0]?.message.content;

      console.log('Generated Tour: ', generatedTour)
      console.log('Response.data: ', response.data)
      console.log('response.data.choices[0]?.message.content:', response.data.choices[0]?.message.content)

      // Parse points of interest and extract coordinates from the generated tour content
      const pointsOfInterestWithCoordinates = parsePointsOfInterestAndCoordinates(generatedTour);

      // Separate the points of interest and coordinates into two arrays
      const pointsOfInterest = pointsOfInterestWithCoordinates.map((poi) => poi.poi);
      const coordinates = pointsOfInterestWithCoordinates.map((poi) => poi.coordinates);

      // Sanitize each point of interest
      const sanitizedPointsOfInterest = pointsOfInterest.map(sanitizeInput);

      console.log('Points of Interest: ', sanitizedPointsOfInterest);
      console.log('Coordinates: ', coordinates);

      return { generatedTour, sanitizedPointsOfInterest, coordinates };
    } catch (error) {
      console.error('Error:', error);
      // Set loading to false in case of an error
      setIsLoading(false); 
      return null;
    }
  };

  let tourData = null;

  while (retries < 6) { // Set the maximum number of retries to 5
    console.log(`Attempt ${retries}: Generating tour...`);
    tourData = await generateTour();

    // If the tour is generated successfully and sanitizedPointsOfInterest is not empty, break the loop
    if (tourData && tourData.sanitizedPointsOfInterest.length > 0) {
      // Set loading to false if the tour data is successfully generated
      // setIsLoading(false);
      break;
    }
    retries++;
  }

  if (!tourData || tourData.sanitizedPointsOfInterest.length === 0) {
    console.error(`Failed to generate tour after 5 retries.`);
    setIsLoading(false); // Set loading to false if retries are exhausted
    return null; // Return null if retries are exhausted or no points of interest were generated
  }
  return tourData;
};

  // Event handler for dropdown select
  const handleDropdownChange = (event) => {
    const { id, value } = event.target;
    setTour({ ...tour, [id]: value });
  };

  // Event handler for text input
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setTour({ ...tour, [name]: value });
  };


  // Function to generate a tour name
  const generateTourName = () => {
    const { city, country, theme, duration, difficulty } = tour;
    const name = `${city}, ${country} ${theme} tour - lasting ${duration} with ${difficulty} difficulty.`;
    console.log('Generated Tour Name:', name);
    return name;
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true before starting API calls

    let generatedWalkingTour = await generateWalkingTour();

    if (!generatedWalkingTour) {
      console.error('Walking tour generation failed.');
      return;
    }

    // Sanitize points of interest with coordinates
    const { sanitizedPointsOfInterest, coordinates } = generatedWalkingTour;

    // Fetch the city photo
    const cityPhoto = await fetchCityPhoto(tour.city, setCityPhoto);

    // ... (creating a new tour object)
    const newTour = {
      country: sanitizeInput(tour.country),
      region: sanitizeInput(tour.region),
      state: sanitizeInput(tour.state),
      city: sanitizeInput(tour.city),
      duration: sanitizeInput(tour.duration),
      difficulty: sanitizeInput(tour.difficulty),
      theme: sanitizeInput(tour.theme),
      tour_name: generateTourName(),
      image_url: cityPhoto,
      ordered_points_of_interest: sanitizedPointsOfInterest, // Use pointsOfInterest from tourContent
    };

    try {
      const response = await axios.post(`${config.apiUrl}/tours`, newTour, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Tour added successfully:', response.data);

      // Get the ID of the newly inserted tour
      const newTourId = response.data.id;

      // Iterate through the points of interest and insert them
      for (let i = 0; i < sanitizedPointsOfInterest.length; i++) {
        const poi = sanitizedPointsOfInterest[i];
        const poiCoordinates = coordinates[i]; // Get the corresponding coordinates
        console.log('POI added successfully:', poi);

        let poiImageUrl = ''; // Initialize with an empty string

        try {
          // Attempt to fetch the image URL for the current POI from Unsplash
          const poiCoordinates = coordinates[i]; // Get the corresponding coordinates
          poiImageUrl = await getImageFromUnsplash(poi, tour.city, poiCoordinates);
        } catch (imageError) {
          console.error(`Error fetching image for ${poi} from Unsplash:`, imageError);
        }

        // Insert the POI data into the database
        const poiId = await insertPointOfInterest(poi, newTourId, poiCoordinates, poiImageUrl);

        // Generate commentary for the POI
        const commentary = await generatePOICommentary(poi, tour.city, tour.country);


        // Now, insert commentary associated with this POI using the POI name as commentary name
        const commName = poi; // Use the POI name as the commentary name
        const description = commentary; // Use the generated commentary as the description
        await insertCommentary(poiId, commName, description);
      }
      setIsLoading(false);

      //Navigate to the LiveTour
      console.log(`This is the navigate: /tours/${newTourId}`);

      navigate(`/tours/${newTourId}`);

    } catch (error) {
      console.error('Error adding tour:', error);
    }
  };

  return (

    <div className="min-h-screen gradient-day-to-night"
      style={{ paddingTop: '175px' }}
    >
      <div className="">
        <h1 className="luxury-font text-3xl text-center mb-4 font-extrabold text-sky-950 drop-shadow-lg">
          Ready to Explore?
        </h1>
        <p className="generator-directions text-lg font-semibold text-sky-950 drop-shadow-lg">

          Explore the world and create your own adventure! Whether you're a history buff, a foodie, or an outdoor enthusiast, there's a unique journey waiting for you. Uncover hidden gems, savor local flavors, and embark on unforgettable experiences.
        </p>
        <div className="content-container background-image rounded-lg">
          <div className="flex items-center justify-evenly">
            <div className="fields-container rounded-lg">
              {/* City Input */}
              <div className="field mb-3">
                <input
                  type="text"
                  className="input rounded-lg border"
                  placeholder="Enter a City to Explore"
                  name="city"
                  value={tour.city}
                  onChange={handleTextChange}
                />
              </div>

              {/* Region Input */}
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

              {/* State Input */}
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

              {/* Country Input */}
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

              {/* Duration Dropdown */}
              <div className="field mb-3">
                <select
                  className="input rounded-lg border"
                  value={tour.duration}
                  onChange={handleDropdownChange}
                  id="duration"
                >
                  <option value="" disabled>Select Day Duration</option>
                  <option value="Full-day">Full-day</option>
                  <option value="Half-day">Half-day</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>

              {/* Difficulty Dropdown */}
              <div className="field mb-3">
                <select
                  className="input rounded-lg border"
                  value={tour.difficulty}
                  onChange={handleDropdownChange}
                  id="difficulty"
                >
                  <option value="" disabled>Select Walking Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Theme Dropdown */}

              <div className="field mb-16">
                <select
                  className="input rounded-lg border"
                  value={tour.theme}
                  onChange={handleDropdownChange}
                  id="theme"
                >
                  <option value="" disabled>Select Tour Theme</option>
                  <option value="Historic">Historic</option>
                  <option value="Scenic">Scenic</option>
                  <option value="Fun">Fun</option>
                  <option value="Museums">Museums</option>
                  <option value="Pubs">Pubs</option>
                </select>

              
                {/* Generate Button */}
                <div className="mb-3 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!tour.city || isLoading}
                    type="button"
                    className="mt-6 inline-block rounded bg-[#183759] px-6 py-2 text-xs font-bold text-[#dbd4db] uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] hover:scale-110"
                  >
                    Generate Walking Tour
                  </button>
                </div>
              </div>
            </div>
            {isLoading && cityPhoto && (
          <div className=' max-w-xl flex items-center'>
            {cityPhoto && (

               <img src={cityPhoto} alt={`${tour.city}`} className='max-w-xlmax-h-[550px]' />
            )}
                </div>

            ) }

                {/* Loading animation */}
        {isLoading ? (
          // Conditional rendering for loading animation
          <div className="loading-logo text-center fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50">
            <p>Loading...</p>

            <div style={{ margin: '16px 0' }}>
              <div className="flex justify-center items-center h-screen">
                <img src={loadingAnimation} alt="Loading..." className={cityPhoto ? "w-1/4 mr-28":"w-1/4"} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
