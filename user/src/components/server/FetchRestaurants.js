import { useState, useEffect } from "react";

const useFetchRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const test = [{name:"KFC", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
        num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070", id: 0 },
        {name:"KFC2", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
            num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 1 },
        {name:"fsdfsd", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
            num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 2 },
        {name:"KFC3", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
            num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 3 },]

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(
                    "http://api.magicspica.com/api/businesses"
                );
                const data = await response.json();
                console.log(data)
                setRestaurants(data);
            } catch (error) {
                console.error("Error fetching data from API:", error);
                setRestaurants([])
            }
        };
        fetchRestaurants();
    }, []);

    return restaurants;
};

export default useFetchRestaurants;