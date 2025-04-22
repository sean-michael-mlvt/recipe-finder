"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import applePie from '@/assets/apple_pie.png';
import pumpkinPie from '@/assets/pumpkin-pie-shot-copy-580x435.jpg';



//Array for holding recipes (right now just has placeholders)
const recipes = [
  {
    title: 'Pumpkin Pie',
    image: pumpkinPie,
    userIngredients: ['Flour', 'Sugar', 'Ginger', 'Pumpkin'],
    otherIngredients: ['Cinnamon', 'Nutmeg'],
  },
  {
    title: 'Apple Pie',
    image: applePie,
    userIngredients: ['Flour', 'Sugar', 'Apples'],
    otherIngredients: ['Cinnamon', 'Blueberries'],
  },
  {
    title: 'Apple Pie',
    image: applePie,
    userIngredients: ['Flour', 'Sugar', 'Apples'],
    otherIngredients: ['Cinnamon', 'Blueberries'],
  }
];

function SavedRecipes() {

    return(
        //Main part of the page
        <div className="min-h-screen p-8 bg-white-900 text-black">
            <div className="p-8 bg-gray-100 rounded-2xl shadow-md">

            {/*Top "Saved RECIPES" Header with "Find More" button*/}
            <div className="flex justify-between items-center mb-4">
                <div>
                <h2 className="text-xl font-bold">SAVED RECIPES</h2>
                <p className="text-gray-600">These are the recipes that you've saved</p>
                </div>
                <Link href="/new-recipes">
                    <button className="bg-bulldog-red text-white px-4 py-2 font-bold cursor-pointer">
                        FIND MORE RECIPES
                    </button>
                </Link>
            </div>
            
            {/*Grid for holding cards*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/*Making each Recipe Card*/}
                {recipes.map((recipe, index) => (
                <div key={index} className="flex border-2 border-red-500 p-4 rounded-md items-center gap-4 bg-white shadow">
                    <Image
                    src={recipe.image}
                    alt={recipe.title}
                    width={128}
                    height={128}
                    className="rounded object-cover"
                    />
                    <div className="flex-1">
                    <h3 className="text-lg font-bold">{recipe.title.toUpperCase()}</h3>
                    <p><strong>Your Ingredients Used:</strong> {recipe.userIngredients.join(', ')}</p>
                    <p><strong>Other Ingredients Used:</strong> {recipe.otherIngredients.join(', ')}</p>
                    </div>
                    <button className="text-red-500 text-xl">⭐</button> {/*Right now just has a star, may want to update to bookmark symbol in the future*/}
                </div>
                ))}

            </div>
            </div>
        </div>
        );

}

export default SavedRecipes