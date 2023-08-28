import { useState, useEffect } from "react";
import BusServerConnector from "../ServerConnector"
const useFetchOrderedSlots = () => {
    const [orders, setOrders] = useState([]);
    async function fetchOrderedSlots (service_id){
        try {

            let connector = BusServerConnector.getInstance()
            let ordered = await connector.get_ordered_time_by_date(service_id)
            console.log("FetchOrderedSlots")
            setOrders(ordered['ordered_time_slots']);
            return ordered['ordered_time_slots'];
        } catch (error) {
            console.error("Error fetching data from API:", error);
            setOrders([]);

        }
    };

    return [orders, fetchOrderedSlots];
};

export default useFetchOrderedSlots;