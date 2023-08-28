import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NearestRestaurant from "./NearestRestaurant";
import {allrest} from "./restaurants";
import BottomSticky from "../HomePage/BottomSticky";

const NearestRestos = () =>{
    const restaurants = allrest
    return (
        <div className="w-full max-w-screen-2xl m-auto bg-white">
            <div className="">
                <p className="p-5 border-b text-2xl font-semibold text-center">
                   Nearest Restaurants
                </p>
                <div className="flex flex-col m-auto">
                    {restaurants?.map((restaurant, idx) =>{
                        return <NearestRestaurant restaurant={restaurant} key={idx}/>
                    })
                    }
                </div>
            </div>
            <BottomSticky />
        </div>

    )
}

export default NearestRestos;