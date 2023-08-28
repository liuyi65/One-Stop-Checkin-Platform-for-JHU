import { useState, useEffect } from "react";
import BusServerConnector from "../ServerConnector"
const useFetchServices = () => {
    const [services, setServices] = useState([]);
    useEffect(() => {
        const fetchServices = async () => {
            try {
                let connector = BusServerConnector.getInstance()
                const result = await connector.get_services_with_all();
                let services = [];

                const dayMap = {
                    "sunday": 0,
                    "monday": 1,
                    "tuesday": 2,
                    "wednesday": 3,
                    "thursday": 4,
                    "friday": 5,
                    "saturday": 6
                  };
                for(let key in result){
                    const service = result[key];
                    const timeElapsed = Date.now();
                    const today = new Date(timeElapsed);
                    console.log("key is ", result)
                    const day = today.getDay(); //6
                    let slots = []
                    for(let k in service["weekly_time_slots"]){
                        const planday = dayMap[service["weekly_time_slots"][k]['weekday']]
                        console.log('compare',day, planday);
                        if(day == planday){
                            const slot = service["weekly_time_slots"][k]['hour'];

                            for(let i = 0; i < service["weekly_time_slots"][k]['slots']; i++){
                                slots.push(slot);
                            }
                        }
                    }
                    services.push({name: service.name, service_id: service.service_id, description: service.description, price: service.base_price, available_slots: slots})
                }
                console.log('called get_services_with_all',services)
                setServices(services);
            } catch (error) {
                console.error("Error fetching data from API:", error);
                setServices([]);

            }
        };

        fetchServices();
    }, []);
    return services;
};

export default useFetchServices;