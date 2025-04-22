"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Recipe = {
  id: number;
  title: string;
  image: string;
  usedIngredients: { name: string }[];
  missedIngredients: { name: string }[];
};

const pantry = ['apples', 'sugar', 'flour', 'pumpkin']; // Example pantry



function NewRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]); // save recipe IDs
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const query = pantry.join(',');
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=6&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
        );
  
        if (!res.ok) {
          throw new Error(`API request failed: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Spoonacular API response:", data);
  
        // ✅ Ensure `data` is an array before setting state
        if (!Array.isArray(data)) {
          console.error("Unexpected API response:", data);
          setRecipes([]); // Set empty array to prevent crashes
          return;
        }
  
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]); // Avoid `map` errors by ensuring an empty array on failure
      }
    };
  
    fetchRecipes();
    
  }, []);

  const toggleSave = (id: number) => {
    setSavedRecipes(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <div className="p-8 bg-gray-100 rounded-2xl shadow-md">

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">NEW RECIPES</h2>
            <p className="text-gray-600">These recipes use ingredients from your pantry</p>
          </div>
          <Link href="/saved-recipes">
            <button className="bg-bulldog-red text-white px-4 py-2 font-bold cursor-pointer">
              SAVED RECIPES
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex border-2 border-red-500 p-4 rounded-md items-center gap-4 bg-white shadow">
              <Image
                src={recipe.image}
                alt={`Image of ${recipe.title}`}
                width={128}
                height={128}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{recipe.title.toUpperCase()}</h3>
                <p><strong>Your Ingredients Used:</strong> {recipe.usedIngredients.map(i => i.name).join(', ')}</p>
                <p><strong>Other Ingredients Used:</strong> {recipe.missedIngredients.map(i => i.name).join(', ')}</p>
              </div>
              <button onClick={() => toggleSave(recipe.id)} className="text-gray-600 text-xl">
                {savedRecipes.includes(recipe.id) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewRecipes;
