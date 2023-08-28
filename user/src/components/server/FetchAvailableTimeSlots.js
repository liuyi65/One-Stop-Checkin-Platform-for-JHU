import { useState, useEffect } from "react";

const useFetchAvailableTimeSlots = (service_id) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const test = [
        { name: 'Service 1', type: 'Type 1', price: '$10' },
        { name: 'Service 2', type: 'Type 2', price: '$15' },
        { name: 'Service 3', type: 'Type 3', price: '$20' },
        { name: 'Service 4', type: 'Type 3', price: '$20' },
        { name: 'Service 5', type: 'Type 3', price: '$20' },
        { name: 'Service 5', type: 'Type 3', price: '$20' },
        { name: 'Service 5', type: 'Type 3', price: '$20' },
        { name: 'Service 5', type: 'Type 3', price: '$20' },
        { name: 'Service 5', type: 'Type 3', price: '$20' },
    ];

    useEffect(() => {
        const fetchAvailableTimeSlots = async () => {
            try {
                const response = await fetch(
                    `http://api.magicspica.com/api/services/${service_id}/available_time_slots`
                );
                const data = await response.json();
                console.log(data)
                setTimeSlots(data);
            } catch (error) {
                console.error("Error fetching data from API:", error);
                setTimeSlots([]);
            }
        };

        fetchAvailableTimeSlots();
    }, [service_id]);

    return timeSlots;
};

export default useFetchAvailableTimeSlots;
