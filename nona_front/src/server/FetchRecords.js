import { useState, useEffect } from "react";
import BusServerConnector from "../ServerConnector"
const useFetchRecords = (InitialServices) => {
    // const [services, setServices] = useState(InitialServices);
    const [records, setRecords] = useState([]);
    const fetchRecords = async (services) => {
        try {
            let connector = BusServerConnector.getInstance()
            let all = {}
            for(let key in services){
                let service = services[key];
                let id = service.service_id;
                const result = await connector.get_all_orders_by_service(id);
                
                let orders = [];
                for (let i in result) {
                    const service = result[i];
                    const timeElapsed = Date.now();
                    const today = new Date(timeElapsed);
                    const date = new Date(service.starts);
                    if(today > date){
                        const order  = {
                        key: i,
                        order_id: service.order_id,
                        status: service.status,
                        time_slot_id: service.time_slot_id,
                        service_id: service.service_id,
                        starts: service.starts,
                        description: {
                            email: service.email,
                            phone: service.phone,
                            name: service.name,
                            comment: service.comment
                        }
                        }
                        orders.push(order) 
                        console.log('test', orders, order);
                    }
                }
                
                all[id.toString()] = orders;
            }
            console.log(all)
            setRecords(all);
            // const result = await connector.get_all_orders_by_service(id);
            
        } catch (error) {
            console.error("Error fetching data from API:", error);
            setRecords([]);

        }
    };

    return [records, fetchRecords];
};

export default useFetchRecords;