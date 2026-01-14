import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useScroll } from "framer-motion";
import JosephPhoto from "../../../assets/aboutPhotos/JosephR.png";
import RaydelysPhoto from "../../../assets/aboutPhotos/Raydelys.jpg";
import JacquelinePhoto from "../../../assets/aboutPhotos/JacquelineP.png";
import MarkPhoto from "../../../assets/aboutPhotos/Mark.jpg";
import githubJPEG from "../../../assets/aboutPhotos/github.jpeg";
import linkedinPNG from "../../../assets/aboutPhotos/linkedin.png";
import marker from "../../../assets/aboutPhotos/markerSite.png";
import "../About/About.css";

function About() {
  const teamMembers = [
    {
      name: "Mark Roberston",
      photo: MarkPhoto,
      bio: `I'm currently a Full Stack Web Development Fellow at Pursuit, a 12-month, Google-funded software engineering fellowship with a 9% acceptance rate. I also enjoy movies, Formula 1, travel, and playing with my German Shepherd.

          With financial markets experience and would enjoy working for a financial firm.`,

      github: "https://github.com/MarkRobertson67",
      linkedin: "https://www.linkedin.com/in/mark-robertson-ny-uk/",
    },

    {
      name: "Raydelys Morrobel Reyes",
      photo: RaydelysPhoto,
      bio: `Presently, I hold the title of a Full Stack Web Development Fellow at Pursuit, a prestigious 12-month software engineering fellowship with funding from Google. With an acceptance rate of just 9%.

         My ultimate goal is to become a skilled software engineer capable of tackling real-world challenges.`,
      github: "https://github.com/arerimr",
      linkedin: "https://www.linkedin.com/in/raydelysmr",
    },

    {
      name: "Jacqueline Pasaoa",
      photo: JacquelinePhoto,
      bio: `I am a full stack developer that studied under Pursuit. I underwent comprehensive training to master both front-end and back-end technologies. I love to travel, eat ice cream, and to learn more coding languages. I hope to travel to more cities from my travel bucketlist in the near future.`,
      github: "https://github.com/jkpasaoa",
      linkedin: "https://www.linkedin.com/in/jacquelinepasaoa/",
    },
    {
      name: "Joseph Rodriguez",
      photo: JosephPhoto,
      bio: `I am Joseph Rodriguez, a compassionate and driven junior full stack developer. With a passion for technology and empathy for users, I excel in creating innovative solutions. Continuously seeking growth and learning, I aim to make a positive impact in the ever-changing world of software development.`,
      github: "https://github.com/jRodriguezIV",
      linkedin: "https://www.linkedin.com/in/josephrodrigueziv/",
    },
  ];
  const { scrollY } = useScroll();

  const scrollContainerRef = useRef(null);
  const scrollControls = useAnimation();

  useEffect(() => {
    const scrollTrigger = 200;

    const handleScroll = () => {
      if (scrollY.get() >= scrollTrigger) {
        scrollControls.start({ opacity: 1, y: 0 }); // animation when scrolled past the trigger point
      } else {
        scrollControls.start({ opacity: 0, y: 100 }); // Reset animation when not scrolled past the trigger point
      }
    };

    scrollY.on("change", handleScroll);

    return () => {
      scrollY.clearListeners("change");
    };
  }, [scrollControls, scrollY]);

  return (
    <div
      className="
    about-background
    home-content
    min-h-screen
    w-screen
    relative left-1/2 right-1/2
    -ml-[50vw] -mr-[50vw]
    flex justify-center
    mt-16 lg:mt-24
  "
    >
      <div className="container mx-auto px-4">
        <div className="about p-4">
          <div className="app-summary-container bg-cyan-200 rounded-lg">
            <img src={marker} alt="markerPin" className="markerPin" />
            &nbsp;&nbsp;&nbsp;
            <strong className="luxury-font font-size text-sky-950 drop-shadow-lg">
              City Whisperer
            </strong>
            <br />
            <p className="text-lg font-medium p text-sky-950 drop-shadow-lg">
              Introduced in August 2023 as a capstone project, redefines the way
              travelers experience cities. This app empowers tourists with
              pre-planned walking routes and points of interest, complemented by
              audio commentary, facilitating efficient and immersive city
              exploration. By providing valuable insights and a user-friendly
              interface, City Whisperer enhances the overall travel experience,
              enabling users to make the most of their visits while enjoying the
              freedom of self-guided tours. It's the perfect companion for
              travelers seeking both convenience and adventure on their
              journeys.
            </p>
            <br />
            <img src={marker} alt="markerPin" className="markerPin" />
            &nbsp;&nbsp;&nbsp;
            <strong className="luxury-font font-size text-sky-950 drop-shadow-lg">
              The Features
            </strong>
            <p className="text-lg p font-medium text-sky-950 drop-shadow-lg">
              City Whisperer features include AI-generated walking tours,
              customizable filters, and seamless Google Maps integration, you
              can explore cities like never before. Enjoy audio commentary
              through Text-to-Speech (TTS). And in the later future the team
              will integrate secure and convenient login options for all users.
            </p>
            <br />
            <img src={marker} alt="markerPin" className="markerPin" />
            &nbsp;&nbsp;&nbsp;
            <strong className="luxury-font font-size text-sky-950 drop-shadow-lg">
              Our Mission
            </strong>
            <br />
            <p className="text-lg p font-medium text-sky-950 drop-shadow-lg">
              Our mission is to empower travelers to experience cities like
              never before. We believe in enhancing the journey by offering
              self-guided walking tours that are not only informative but also
              deeply personalized. Our goal is to provide users with the freedom
              to explore at their own pace, uncover hidden gems, and connect
              with the culture and history of the places they visit. We're
              dedicated to curating an ever-growing library of AI-generated
              tours, fostering a sense of discovery, and making travel more
              accessible and enriching for everyone. City Whisperer is on a
              mission to redefine city exploration, one step at a time.
            </p>
            <br />
            <img src={marker} alt="markerPin" className="markerPin" />
            &nbsp;&nbsp;&nbsp;
            <strong className="luxury-font font-size text-sky-950 drop-shadow-lg">
              Our Development Team
            </strong>
            <br />
            <p className="text-lg p font-medium text-sky-950 drop-shadow-lg">
              Our team is a dynamic and passionate group of full-stack
              developers, each bringing their unique skills and backgrounds to
              the project. Together, this dedicated team is committed to
              redefining city exploration through AI-generated walking tours,
              making travel more enriching and accessible for all.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="team-container rounded-lg">
            <img
              src={marker}
              alt="markerPin"
              className="markerPin"
              style={{ width: "24px", height: "24px" }}
            />
            &nbsp;
            <h1 className="font-bold text-xl text-center my-0 dancing-script text-sky-950 drop-shadow-lg p-2">
              Meet the Team
            </h1>
          </div>
          <div className="team-members mt-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-card">
                <h5 className="text-3xl font-bold leading-tight text-sky-950">
                  {member.name}
                </h5>
                <div className="mt-4 relative overflow-hidden bg-cover bg-no-repeat centered-photo">
                  <motion.img
                    className="rounded-lg medium-photo"
                    src={member.photo}
                    style={{ height: "200px", width: "200px" }}
                    alt={member.name}
                    initial={{ opacity: 0, y: 100 }} // Initial animation state
                    animate={scrollControls} // the animation controls
                    transition={{ duration: 0.5 }} // Animation duration
                  />
                </div>
                <div className="p-4">
                  <div
                    ref={scrollContainerRef}
                    className="scrollable-content" //custom styling for scrolling content
                  >
                    <motion.p
                      className="text-base bio-paragraph font-semibold text-sky-950"
                      initial={{ opacity: 0, y: 100 }}
                      animate={scrollControls}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={{ textAlign: "left" }}
                    >
                      {member.bio}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 100 }} // Initial animation state
                      animate={scrollControls} // animation controls
                      transition={{ duration: 0.5, delay: 0.4 }} // Animation duration and delay
                    >
                      <Link
                        to={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
                      >
                        <img src={githubJPEG} alt="github Logo" width={36} />
                      </Link>
                      <Link
                        to={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
                      >
                        <img src={linkedinPNG} alt="LinkedIn Logo" width={40} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
