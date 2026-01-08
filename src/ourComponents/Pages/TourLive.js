import axios from 'axios'
import Map from '../Map/Map.js'
import { Link, useParams } from 'react-router-dom';
import './Pages.css';
import { useEffect, useState } from 'react';
import PointOfInterestCard from './PointOfInterestCard.js';
import { TiArrowBack } from 'react-icons/ti'
import './Pages.css';
import Modal from './Modal.js';
import loading from '../../assets/S-Loop_transnparent.gif'

const API = process.env.REACT_APP_API_URL;

export default function Tour() {
    const [tour, setTour] = useState([])
    const [pointsOfInterest, setPointsOfInterest] = useState([])
    const [allPointsOfInterest, setAllPointsOfInterest] = useState([])
    const [activeMarker, setActiveMarker] = useState('')
    const [modal, setModal] = useState(false)
    const [currentPoi, setCurrentPoi] = useState('')
    const [modalCommentary, setModalCommentary] = useState('')

    const { id } = useParams()

    useEffect(() => {
        axios.get(`${API}/tours/${id}`)
            .then((res) => {
                setTour(res.data)
                setPointsOfInterest(res.data.ordered_points_of_interest)
            })
            .catch((e) => console.warn(e))
    }, [id])

    useEffect(() => {
        axios.get(`${API}/tours/${id}/pointsOfInterest`)
            .then((res) => {
                setAllPointsOfInterest(res.data)
            })
            .catch((e) => console.warn(e))
    }, [id])

    const currentPointOfInterest = allPointsOfInterest.find((el) => el.poi_name === currentPoi)

    const toggleModal = () => {
        setModal(!modal)
    }

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }


    return (
        pointsOfInterest && allPointsOfInterest && tour ? (
            <div className='max-[760px]:pt-[180px]max-[760px]:flex tourLive ml-0 mt-[-30px]'>

                <div className="relative h-10 w-[200px] ...">
                    <button className="absolute inline-flex ml-[80px] mt-[55px] left-0 top-0 h-16 w-[200px] font-extrabold text-sky-950 ..."><Link className="inline-flex" to='/tours'>{<TiArrowBack />} ALL TOURS</Link></button>
                </div>
                <div className="flex flex-col  items-center h-screen pt-4 ">
                    <h1 className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r to-cyan-600 from-sky-950'>{tour.city}, {tour.state ? `${tour.state.toUpperCase()},` : null} {tour.country}</h1>
                    <div>
                        <h4 className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Welcome to your {tour.tour_name}</h4>
                    </div>
                    <br />
                    <div className="lg:grid lg:grid-cols-2 gap-5 max-[760px]:flex-col-reverse ml-[-110px] h-auto justify-center">
                        <div className='sticky overflow-y-scroll h-4/6 max-[760px]:h-2/6 overscroll-contain shadow-2xl max-h-[685px]'>
                            <h2 className="text-4xl font-bold dark:text-white text-sky-950">Points of Interest:</h2>
                            <ul>
                                {
                                    pointsOfInterest.length && allPointsOfInterest.length && pointsOfInterest.map((poi, index) => {
                                        const allPoi = allPointsOfInterest.find((el) => el.poi_name === poi)
                                        return <PointOfInterestCard poi_id={allPoi.id} name={allPoi.poi_name} img={allPoi.image_url} key={index} setActiveMarker={setActiveMarker} toggleModal={toggleModal} setCurrentPoi={setCurrentPoi} setModalCommentary={setModalCommentary} />
                                    })
                                }
                            </ul>
                        </div>
                        <div className=''>
                        <figure>
                            {
                                pointsOfInterest.length && allPointsOfInterest.length &&
                                <Map className="rounded-lg " activeMarker={activeMarker} pointsOfInterest={pointsOfInterest} allPointsOfInterest={allPointsOfInterest} />
                            }
                            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">{tour.city}, {tour.state ? `${tour.state},` : null} {tour.country} Google Images©</figcaption>
                        </figure>
                            </div>
                    </div>
                    {
                        modal &&
                        <div className='modal mt-[120px]'>
                            <div onClick={toggleModal} className='overlay'></div>
                            <Modal toggleModal={toggleModal}
                                img={currentPointOfInterest.image_url}
                                name={currentPointOfInterest.poi_name}
                                commentary={modalCommentary}
                            />
                        </div>
                    }
                </div>
            </div>

        ) : <div className='w-[550px] mt-16 ml-[30%]'><img src={loading} alt='loading...' /></div>
    )
}
