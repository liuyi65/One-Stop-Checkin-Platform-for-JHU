import React from "react";

const services = [
    {
        name: "Service 1",
        type: "Type 1",
        price: "$10",
        image: "https://via.placeholder.com/50",
    },
    {
        name: "Service 2",
        type: "Type 2",
        price: "$20",
        image: "https://via.placeholder.com/50",
    },
    {
        name: "Service 3",
        type: "Type 3",
        price: "$30",
        image: "https://via.placeholder.com/50",
    },
];

const Appointment = () => {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Appointment</h2>
            <ul className="space-y-4">
                {services.map((service, index) => (
                    <li key={index} className="flex items-center space-x-4">
                        <img src={service.image} alt={service.name} className="w-12 h-12 rounded-md" />
                        <div>
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p>{service.type}</p>
                            <p className="text-gray-500">{service.price}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Reserve</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appointment;
