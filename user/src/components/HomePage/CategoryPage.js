
import { Link } from 'react-router-dom';
import BottomSticky from "./BottomSticky";
import React from "react";

const categories = [
    {
        name: 'Appetizers',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/appetizers'
    },
    {
        name: 'Main Dishes',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/main-dishes'
    },
    {
        name: 'Desserts',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/desserts'
    },
    {
        name: 'Drinks',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/drinks'
    },
    {
        name: 'Seafood',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/seafood'
    },
    {
        name: 'Vegetarian',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/vegetarian'
    },
    {
        name: 'Meat',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/meat'
    },
    {
        name: 'Soup',
        image: 'https://via.placeholder.com/300x200',
        link: '/categories/soup'
    }
];

export default function CategoryPage() {
    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-4xl font-bold mb-8">Categories</h1>
            <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                        <Link to={category.link}>
                            <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-xl mb-2">{category.name}</p>
                                <button className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out">
                                    View More
                                </button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <BottomSticky />
        </div>
    );
}
