import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Rating from "../HomePage/Rating";

import Reservation from "./Reservation";
import useFetchBusinesses from "../server/FetchBusinesses";
import useFetchAvailableTimeSlots from "../server/FetchAvailableTimeSlots";
import { Modal } from "../../context/Modal"
import ReviewModal from "./ReviewModal";
import Review from "./Review";
import BottomSticky from "../HomePage/BottomSticky";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const RestaurantPage = () =>{


    const {restaurantId} = useParams()
    const showMore = useRef(null)
    const reservationDiv = useRef(null)
    const [readMore, setReadMore] = useState(true)
    const [reviewModal, setReviewModal] = useState(false)
    const [reviewOptionsModal, setReviewOptionsModal] = useState({})
    const [restaurant, setRestaurant] = useState({});
    // const user = useSelector(state => state.session.user)
    // let restaurant = useSelector((state => state.restaurants[restaurantId]))
    // const reviews = useSelector(state => Object.values(state.reviews))
    // const userReview = reviews.filter(review => (review?.user_id == user?.id &&
    //                                             review?.restaurant_id == restaurant?.id ))


    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [seriviceID, setSeriviceID] = useState(-1);


    const handleReserve = (sid) => {
        setIsReservationModalOpen(true);
        setSeriviceID(sid)
    }
    const handleShowMore = () =>{
        if(readMore){
            showMore.current.classList.remove("line-clamp-3")
        }else{
            showMore.current.classList.add("line-clamp-3")
        }
        setReadMore(state => !state)
    }

    const toggleReviewModal = () =>{
        setReviewModal((state) => !state)
    }

    const toggleReviewOptionsModal = (idx) => () => {
        setReviewOptionsModal((state) => ({
          ...state,
          [idx]: !state[idx],
        }));
      };

    //   useEffect(() => {
    //     reviews?.forEach((_, idx) => {
    //       setReviewOptionsModal((state) => ({
    //         ...state,
    //         [idx]: false,
    //       }));
    //     });
    //   }, []);

    const location = useLocation();
    const business = useParams();
    let services = useFetchBusinesses(business.restaurantId); //get services




    return (
        <div className="flex flex-col w-full max-w-screen-2xl m-auto bg-white h-full
                        justify-center font-outfit">
            <div className="flex relative">
                <img style = {{ height:'300px'}} className="w-full h-[460px] object-cover"
                src={"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png"}/>

                <div className="w-[640px] bg-white absolute z-2 top-[410px] left-1/2 transform -translate-x-1/2 rounded-t p-8">
                    <div className="flex items-center">
                        <Row>
                            <Col xs = {12}>
                            <p className="text-5xl font-semibold border-b border-gray-200 pb-10 text-black">
                                {location.state?.bname}
                            </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs = {12}>
                            <div className="flex items-center space-x-2 w-40 h-9 border border-gray-300 rounded ml-8
                                            mb-7 text-red-500 text-sm font-medium hover:border-2 hover:border-red-600">
                                <svg
                                    className="w-6 h-6 ml-2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    focusable="false"><g fill="none"
                                                        fill-rule="evenodd"><path d="M11.1923881,7.19238816 C13.8147448,7.19238816 16.4332749,7.88002892 19.0481719,9.24949945 C20.3663707,9.93987064 21.1923881,11.3049175 21.1923881,12.7929562 L21.1923881,15.1923882 C21.1923881,16.2969577 20.2969576,17.1923882 19.1923881,17.1923882 L15.8386797,17.1923882 C14.9458358,17.1923934 14.1611367,16.600599 13.9157119,15.74215 C13.5311739,14.3971097 13.051748,13.8597684 12.4435462,13.8590555 L12.2445137,13.8590532 C11.9797378,13.8590516 11.9797378,13.8590516 11.1923912,13.8590525 L10.5908984,13.8590535 L9.94238815,13.8590549 C9.36404307,13.8590549 8.89692488,14.3907007 8.48907223,15.7623886 C8.23683842,16.610715 7.45704835,17.1923882 6.57201858,17.1923882 L3.19238815,17.1923882 C2.08781864,17.1923882 1.19238815,16.2969577 1.19238815,15.1923882 L1.19238815,12.7929431 C1.19239394,11.3049036 2.0184157,9.93985867 3.33661714,9.24949272 C5.95150798,7.88002719 8.5700348,7.19238816 11.1923881,7.19238816 Z M3.19238815,12.7929469 L3.19238815,15.1923882 L6.57201858,15.1923839 C7.20290417,13.0705928 8.26739372,11.8590549 9.94238599,11.8590549 L10.5908946,11.8590535 L11.1923885,11.8590525 C11.9797362,11.8590516 11.9797362,11.8590516 12.2445326,11.8590532 L12.4447301,11.8590562 C14.1421938,11.8610438 15.2370999,13.0882166 15.8386738,15.1923882 L19.1923881,15.1923882 L19.1923881,12.7929562 C19.1923881,12.0489367 18.7793784,11.3664115 18.1202811,11.021227 C15.7828612,9.79707646 13.4802133,9.19238816 11.1923881,9.19238816 C8.90456585,9.19238816 6.60192098,9.79707492 4.26450398,11.0212224 C3.60540308,11.3664055 3.19239104,12.0489299 3.19238815,12.7929469 Z" fill="#2D333F" fill-rule="nonzero" transform="translate(11.192388, 12.192388) rotate(-135.000000) translate(-11.192388, -12.192388)"></path></g></svg>
                                <span>XXX-XXX-XXXX</span>
                            </div>
                            </Col>
                        </Row>
                        
                        
                    </div>

                    <div className="flex space-x-5 mt-5 mb-8">
                        {/* <Rating rate={location.state.brate} size="medium"/> */}
                        <p>{location.state?.brate}</p>
                        <p>{location.state?.bdesc}</p>
                        <p>{location.state?.baddr}</p>
                        <p className="text-mg pl-2 flex space-x-2">
                            <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            focusable="false"><g fill="none"
                            fill-rule="evenodd">
                            <path d="M19,4 L5,4 C3.8954305,4 3,4.8954305 3,6 L3,15 C3,16.1045695 3.8954305,17 5,17 L11,17 L15.36,20.63 C15.6583354,20.8784924 16.0735425,20.9318337 16.4250008,20.7668198 C16.776459,20.6018059 17.0006314,20.2482681 17,19.86 L17,17 L19,17 C20.1045695,17 21,16.1045695 21,15 L21,6 C21,4.8954305 20.1045695,4 19,4 Z M19,15 L15,15 L15,17.73 L11.72,15 L5,15 L5,6 L19,6 L19,15 Z" fill="#2D333F" fill-rule="nonzero"></path></g></svg>
                            <p>0 Reviews</p>
                            </p>
                        <p className="text-mg pl-2 flex space-x-2">
                            <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            focusable="false"><g fill="none"
                            fill-rule="evenodd">
                            <path d="M11,2 C12.1045695,2 13,2.8954305 13,4 L13,11 C13,12.1045695 12.1045695,13 11,13 L10,13 L10,21 C10,21.5522847 9.55228475,22 9,22 L8,22 C7.44771525,22 7,21.5522847 7,21 L7,13 L6,13 C4.8954305,13 4,12.1045695 4,11 L4,4 C4,2.8954305 4.8954305,2 6,2 L11,2 Z M11,11 L11,4 L10,4 L10,8.5 C10,8.77614237 9.77614237,9 9.5,9 C9.22385763,9 9,8.77614237 9,8.5 L9,4 L8,4 L8,8.5 C8,8.77614237 7.77614237,9 7.5,9 C7.22385763,9 7,8.77614237 7,8.5 L7,4 L6,4 L6,11 L11,11 Z M19.45,2 C19.7537566,2 20,2.24624339 20,2.55 L20,21 C20,21.5522847 19.5522847,22 19,22 L18,22 C17.4477153,22 17,21.5522847 17,21 L17,17 L16,17 C14.8954305,17 14,16.1045695 14,15 L14,7.45 C14,4.44004811 16.4400481,2 19.45,2 Z M16,15 L18,15 L18,4.32 C16.7823465,4.88673047 16.0026709,6.10692278 16,7.45 L16,15 Z" fill="#2D333F" fill-rule="nonzero"></path></g></svg>
                        </p>
                        <div>
                            {/* <div className="flex ">
                                <button
                                    disabled={userReview.length > 0 ? true : false}
                                    className="w-full border bg-red-600 text-white rounded"
                                    onClick={toggleReviewModal}
                                >
                                    {userReview.length > 0 ? "You have already reviewed this restaurant":"Leave a review"}
                                </button>
                            </div> */}
                            {reviewModal && (
                                <Modal onClose={toggleReviewModal}>
                                    <ReviewModal
                                        restaurant={restaurant}
                                        onClose={toggleReviewModal}
                                        type="create"
                                    />
                                </Modal>
                            )}
                        </div>
                    </div>
                    <div
                    ref={showMore}
                    className="text-md text-gray-600 font-thin line-clamp-3">
                        {restaurant?.description}
                    </div>
                    <button onClick={handleShowMore} className="text-red-400">
                        {readMore ?"+ Read more" : "- Read less"}
                    </button>

                    {/* <div className="mt-16">
                        {reviews.length == 1 &&
                            <p className="pb-5 border-b text-2xl font-semibold"
                        >What {reviews.length} person is saying</p>}
                        {reviews.length > 1 &&
                            <p className="pb-5 border-b text-2xl font-semibold"
                        >What {reviews.length} people are saying</p>}
                        <div>
                            {reviews.map((review, i)=>{
                                return <Review
                                review={review}
                                key={i}
                                toggleReviewOptionsModal={toggleReviewOptionsModal}
                                reviewOptionsModal ={reviewOptionsModal}
                                />
                            })
                            }
                        </div>
                    </div> */}
                    <div className="services-container" style={{ height: "400px", overflowY: "scroll" }}>
                        <div className="flex flex-col space-y-4">
                            {services.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <img src="https://via.placeholder.com/50" alt="Service Image" />
                                    <div className="flex flex-col">
                                        <p className="font-bold">{service?.name}</p>
                                        <p className="text-gray-500 text-sm">{service?.description}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-bold">${service?.base_price}</p>
                                        <button className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg"  onClick={() => handleReserve(service.service_id)}>
                                            Reserve
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                        {isReservationModalOpen && (
                            <div className="fixed z-50 inset-0 flex items-center justify-center">
                                <div className=" inset-0 bg-gray-500 opacity-75"></div>
                                <div ref={reservationDiv} className="w-[320px] h-[330px] z-2 bg-white rounded-t">
                                    <Reservation reservationRef={reservationDiv} restaurant={restaurant} sid = {seriviceID}/>
                                </div>
                            </div>
                        )}
                    </div>
                    <BottomSticky />
                </div>
            </div>
        </div>
    )


}

export default RestaurantPage;