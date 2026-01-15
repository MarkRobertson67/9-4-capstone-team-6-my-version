import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useScroll } from "framer-motion";
import JosephPhoto from "../../../assets/aboutPhotos/JosephR.png";
import RaydelysPhoto from "../../../assets/aboutPhotos/Raydelys.jpg";
import JacquelinePhoto from "../../../assets/aboutPhotos/JacquelineP.png";
import MarkPhoto from "../../../assets/aboutPhotos/Mark.jpg";
import githubJPEG from "../../../assets/aboutPhotos/github.jpeg";
import linkedinPNG from "../../../assets/aboutPhotos/linkedin.png";
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
    mt-[50px] sm:mt-[50px] lg:mt-[75px]
  "
    >
      <div className="w-full max-w-5xl">
        {/* CONTENT PANEL */}
        <div className="p-2 sm:p-4">
          <div
            className="
            rounded-2xl
            bg-white/90
            backdrop-blur-md
            p-4 sm:p-6
            w-full
            max-w-3xl
            mx-auto
            shadow-xl
          "
          >
            {/* City Whisperer */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h1 className="luxury-font text-sky-950 text-3xl sm:text-4xl mb-2">
                  City Whisperer
                </h1>

                <p className="text-sm sm:text-base font-medium text-sky-900 leading-relaxed">
                  Introduced in August 2023 as a capstone project, City
                  Whisperer redefines the way travelers experience cities. This
                  app empowers tourists with pre-planned walking routes and
                  points of interest, complemented by audio commentary,
                  facilitating efficient and immersive city exploration. By
                  providing valuable insights and a user-friendly interface,
                  City Whisperer enhances the overall travel experience,
                  enabling users to make the most of their visits while enjoying
                  the freedom of self-guided tours.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 flex items-start gap-3">
              <div className="flex-1">
                <h2 className="luxury-font text-sky-950 text-2xl sm:text-3xl mb-2">
                  The Features
                </h2>

                <p className="text-sm sm:text-base font-medium text-sky-900 leading-relaxed">
                  City Whisperer features AI-generated walking tours,
                  customizable filters, and seamless Google Maps integration.
                  Explore cities like never before and enjoy audio commentary
                  through Text-to-Speech (TTS), with more features planned for
                  the future.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="mt-6 flex items-start gap-3">
              <div className="flex-1">
                <h2 className="luxury-font text-sky-950 text-2xl sm:text-3xl mb-2">
                  Our Mission
                </h2>

                <p className="text-sm sm:text-base font-medium text-sky-900 leading-relaxed">
                  Our mission is to empower travelers to explore cities at their
                  own pace. We focus on personalization, discovery, and
                  accessibility — helping users uncover hidden gems and connect
                  deeply with the culture and history of every destination.
                </p>
              </div>
            </div>

            {/* Team */}
            <div className="mt-6 flex items-start gap-3">
              <div className="flex-1">
                <h2 className="luxury-font text-sky-950 text-2xl sm:text-3xl mb-2">
                  Our Development Team
                </h2>

                <p className="text-sm sm:text-base font-medium text-sky-900 leading-relaxed">
                  Our team is a passionate group of full-stack developers
                  working together to redefine city exploration through
                  thoughtful design and AI-powered experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <div className="mt-6 w-full max-w-3xl flex flex-col gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/95 p-4 sm:p-6 shadow-lg"
              >
                <h4 className="text-xl sm:text-2xl font-bold text-sky-950">
                  {member.name}
                </h4>

                <div className="mt-4 flex justify-center">
                  <motion.img
                    src={member.photo}
                    alt={member.name}
                    className="rounded-xl object-cover"
                    style={{ width: 160, height: 160 }}
                    initial={{ opacity: 0, y: 80 }}
                    animate={scrollControls}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="mt-4 text-sm sm:text-base font-medium text-sky-900 leading-relaxed">
                  {member.bio}
                </p>

                <div className="mt-4 flex gap-4">
                  <Link to={member.github} target="_blank">
                    <img src={githubJPEG} alt="GitHub" width={32} />
                  </Link>
                  <Link to={member.linkedin} target="_blank">
                    <img src={linkedinPNG} alt="LinkedIn" width={36} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

export default About;
