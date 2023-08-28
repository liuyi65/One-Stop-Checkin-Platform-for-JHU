import { useState, useEffect } from "react";

const useFetchBusinesses = (service_id) => {
    const [businesses, setBusinesses] = useState([]);
    const restaurantSample = {name:"KFC", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
        num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070", id: 0, description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore " +
            "magna aliqua. Proin fermentum leo vel orci porta non pulvinar neque laoreet. At elementum eu facilisis sed " +
            "odio morbi. Ut sem nulla pharetra diam sit amet. Eu tincidunt tortor aliquam nulla facilisi cras fermentum. " +
            "Vitae auctor eu augue ut lectus arcu bibendum at. Sed risus ultricies tristique nulla. Ut faucibus pulvinar " +
            "elementum integer enim neque. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Ut " +
            "placerat orci nulla pellentesque dignissim enim sit amet venenatis.\n" +
            "\n" }


    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await fetch(
                    `http://api.magicspica.com/api/businesses/${service_id}/services`
                );
                const data = await response.json();
                console.log(data)
                setBusinesses(data);
            } catch (error) {
                console.error("Error fetching data from API:", error);
                setBusinesses([])

            }
        };

        fetchBusinesses();
    }, [service_id]);

    return businesses;
};

export default useFetchBusinesses;
