import React, { useState, useEffect } from 'react';
import TourCard from './TourCard';
import axios from 'axios';
import { motion } from 'framer-motion';

const API = process.env.REACT_APP_API_URL;

export default function TourIndex() {
    const [tours, setTours] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null)

    const handleShowClick = (index) => {
        setExpandedIndex(index === expandedIndex ? -1 : index)
    }

    const cardVariants = {
        expanded: {
            width: "900px"
        },
        collapsed: {
            width: "170px"
        }
    }

    useEffect(() => {
        axios.get(`${API}/tours`)
            .then((res) => {
                console.log("API Response:", res.data); // Debugging response
                setTours(res.data);
            })
            .catch((e) => console.warn("Error fetching tours:", e));
    }, []);
    

    useEffect(() => {
        if (tours.length > 0) {
            console.log(tours);
        }
    }, [tours])

    return (
        <div>
            <br></br>
            <br></br>
            <section className='pt-[150px] pb-[100px] gradient-day-to-night'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <h1 className='text-3xl font-extrabold luxury-font drop-shadow-lg'>
                        Discover the World's Wonders
                    </h1>
                    <br />
                    <h1 className='text-3xl font-light text-sky-950 drop-shadow-lg italic'>
                        Our Prepackaged Tour Catalog
                    </h1>
                    <p className='mt-4 text-xl text-gray-300'></p>
                </div>
                <div className='ml-8 mr-8 mt-12 flex flex-col md:flex-row justify-center items-center gap-5 overflow-x-auto overscroll-none'>
                    {
                        tours.map((tour, index) => {
                            return <motion.div
                                key={index}
                                className={`card cursor-pointer h-[500px] bg-cover bg-center rounded-[20px] ${index === expandedIndex ? 'expanded' : ''}`}
                                variants={cardVariants}
                                initial='collapsed'
                                animate={index === expandedIndex ? 'expanded' : 'collapsed'}
                                transition={{ duration: 0.5 }}
                                onClick={() => handleShowClick(index)}
                                style={{
                                    backgroundImage: `url(${tour.image_url})`,
                                }}
                            >
                                <div className='card-content h-full flex flex-col justify-end'>
                                    <div className='card-footer rounded-b-[20px] bg-gray-800 bg-opacity-75 min-h-[100px] flex flex-col items-center justify-center'>
                                        <h1 className='text-xl font-bold text-white text-center'>{tour.city}, {tour.state ? `${tour.state},` : null} {tour.country}</h1>
                                        {index === expandedIndex && (
                                            <div className='mt-2 text-gray-300 text-center'>{<TourCard tour={tour} key={tour.id} />}</div>
                                        )

                                        }
                                    </div>
                                </div>
                            </motion.div>
                        })
                    }
                </div>
            </section>
        </div>
    )
}
