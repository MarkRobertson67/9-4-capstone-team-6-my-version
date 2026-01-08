import React, { useEffect } from "react";
import video1 from "../../assets/LandingPageVideo.mp4";
import video2 from "../../assets/Page2_WebPage_Landscape.mp4";
import image1 from "../../assets/travelPhotos/cristina-gottardi--YzMZYqwoH4-unsplash (1).jpg";
import image2 from "../../assets/travelPhotos/dan-novac-1naE8177_bI-unsplash.jpg";
import image3 from "../../assets/travelPhotos/bjorn-agerbeek-ak8uY9rVDOs-unsplash.jpg";
import image4 from "../../assets/travelPhotos/timo-stern-iUBgeNeyVy8-unsplash.jpg";

// import image4 from "../../assets/travelPhotos/dan-novac-1naE8177_bI-unsplash.jpg";
// import image5 from "../../assets/travelPhotos/billy-huynh-v9bnfMCyKbg-unsplash.jpg"
import { Carousel, Ripple, initTE } from "tw-elements";
// import { useLocation } from "react-router-dom";
// import { useState } from "react"

export default function Home() {
  // const [isMuted, setIsMuted] = useState(false);

  // const toggleMute = () => {
  //   setIsMuted(!isMuted);
  // };

  // const location = useLocation();
  // const [ loaded, setLoaded] = useState(false)

  useEffect(() => {
    initTE({ Carousel, Ripple });
  }, []);

  return (
    <div>
      <div
        id="carouselExampleCaptions"
        className="relative shadow-2xl max-[760px]:mt-16"
        data-te-carousel-init
      >
        <div
          className="absolute bottom-5 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0 max-[760px]:px-[25%] max-[760px]:mb-0 max-[760px]:mx-0"
          data-te-carousel-indicators
        >
          <button
            type="button"
            data-te-target="#carouselExampleCaptions"
            data-te-slide-to="0"
            data-te-carousel-active
            className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-te-target="#carouselExampleCaptions"
            data-te-slide-to="1"
            className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
            aria-label="Slide 2"
          ></button>
        </div>
        <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
          <div
            className="relative float-left -mr-[100%] hidden w-full !transform-none opacity-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
            data-te-carousel-fade
            data-te-carousel-item
            data-te-carousel-active
          >
            <div className="relative h-[100vh] w-full overflow-hidden">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls
              >
                <source src={video1} type="video/mp4" />
              </video>
            </div>

            <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
              {/* <h5 class="text-xl">First slide label</h5> */}
              {/* <p>Some representative placeholder content for the first slide.</p> */}
            </div>
          </div>
          <div
            className="relative float-left -mr-[100%] hidden w-full !transform-none opacity-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
            data-te-carousel-fade
            data-te-carousel-item
          >
            <div className="relative h-[100vh] w-full overflow-hidden">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls
              >
                <source src={video2} type="video/mp4" />
              </video>
            </div>

            <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
              {/* <h5 class="text-xl">Second slide label</h5> */}
              {/* <p>Some representative placeholder content for the second slide.</p> */}
            </div>
          </div>
        </div>
        <button
          className="absolute bottom-[100px] left-0 top-[100px] z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
          type="button"
          data-te-target="#carouselExampleCaptions"
          data-te-slide="prev"
        >
          <span className="inline-block h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </span>
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Previous
          </span>
        </button>
        <button
          className="absolute bottom-[100px] right-0 top-[100px] z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
          type="button"
          data-te-target="#carouselExampleCaptions"
          data-te-slide="next"
        >
          <span className="inline-block h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Next
          </span>
        </button>
      </div>

      {/* partition 1 */}
      <div className="h-screen flex items-center justify-center shadow-2xl">
        <div className="flex w-screen justify-between max-[760px]:flex-col-reverse">
          <div className="flex flex-col items-center justify-center text-[#183759] font-serif drop-shadow-lg">
            <div className="text-3xl md:text-4xl font-bold max-[760px]:mt-20">
              Customize your Experience
            </div>
            <div className="w-6/12 pt-5 text-sm md:text-base max-[760px]:mt-3">
              You can use our Web App with the help of ChatGpt and Google Maps
              to create your own personal tour anywhere you want!
            </div>
            <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="mt-6 inline-block rounded bg-[#183759] px-6 pb-2 pt-2.5 text-xs font-bold text-[#dbd4db] uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] hover:scale-110"
            >
              Create New Tour
            </button>
          </div>
          <div className="md:inline-block md:w-11/12 shadow-lg">
            <img
              className="w-full rounded-lg shadow-2xl"
              src={image1}
              alt="Venice"
            />
          </div>
        </div>
      </div>

      {/* partition 2 */}
      <div className="w-screen h-screen relative">
        <div className="h-[90%] max-[760px]:h-auto shadow-2xl overflow-hidden">
          <img
            src={image2}
            alt="WanderLust"
            className="object-fill shadow-2xl translate-y-[-8vh]"
          />
        </div>

        <div className="">
          <div className="absolute bottom-40 text-3xl max-[760px]:text-xl mx-40 px-14 py-10 max-[760px]:mx-5 max-[760px]:py-5 text-[#183759] rounded-lg bg-[#e8e2eac7] font-normal max-[760px]:mt-0 shadow-md font-serif">
            Discover hidden gems and explore iconic landmarks like a local. Our
            ChatGPT-powered virtual tour guide will chat with you, offering
            recommendations, historical tidbits, and insider tips along the way
          </div>
        </div>
      </div>

      {/* partition 3 */}
      <div className=" w-screen h-screen relative shadow-inner bg-[#efe3e0] rounded-br-full">
        <div className="absolute max-[760px]:w-screen max-[760px]:text-4xl max-[760px]:top-[21.7%]  top-[43.4%] w-1/2 text-[#cdc6cd] font-semibold text-7xl  drop-shadow-[4px_4px_rgba(24,55,89,.9)] z-10">
          Freedom of Choice
        </div>
        <img
          className="w-1/2 max-[760px]:w-screen max-[760px]:h-[50%] h-screen object-center inline-block shadow-md"
          src={image3}
          alt="Ibiza"
        />
        <div className="w-1/2 max-[760px]:w-screen max-[760px]:text-4xl  max-[760px]:mt-28 inline-block text-[#183759] font-serif text-7xl shadow-2xl bg-clouds">
          Peace of Mind
        </div>
      </div>

      {/* partition 4 */}
      <div className="h-screen pt-0">
        <div className="bg-blackbg h-5/6 max-[760px]:h-5/6 max-[760px]:w-screen mt-[15%] max-[760px]: mx-40 max-[760px]:mx-0 max-[760px]:r-0 rounded-3xl shadow-2xl">
          <img
            src={image4}
            alt="FindYourWay"
            className="w-1/4 max-[760px]:w-2/4 object-center inline-block rounded-lg mt-[3%]"
          />
          <div
            className="mx-[12%] my-[3%] max-[760px]:mx-[0] 
          max-[760px]:mt-38 text-[#ffffff] font-serif text-3xl font-medium"
          >
            Embark on endless journeys with{" "}
            <span className="text-[#295583] font-semibold">CityWhisperer</span>{" "}
            and let your curiosity guide you. Join us in discovering the world,
            one step at a time.
          </div>
        </div>
      </div>
    </div>
  );
}

// import './Pages.css';

// export default function Home() {
//   return (
//     <div>
//       <p className="home-content">Home</p>
//     </div>
//   );
// }
