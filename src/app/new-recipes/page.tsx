"use client";

// import statements
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ISavedRecipeItem } from '@/models/SavedRecipesSchema';

// Type for recipes fetched from Spoonacular
type SpoonacularRecipe = {
    id: number;
    title: string;
    image: string;
    usedIngredients: { name: string }[];
    missedIngredients: { name: string }[];
};

const defaultPantry = ['apples', 'sugar', 'flour', 'pumpkin']; // Example fallback pantry

function NewRecipes() {
    const { data: session, status } = useSession();
    const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);

    // Use a Set for efficient lookup of saved recipe IDs
    const [savedRecipeIds, setSavedRecipeIds] = useState<Set<number>>(new Set());
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [isLoadingSavedStatus, setIsLoadingSavedStatus] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [togglingSaveId, setTogglingSaveId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const RESULTS_PER_PAGE = 10;

    // --- Fetch Initial Saved Recipes ---
    const fetchInitialSavedState = useCallback(async (email: string) => {
        // Reset state before fetching
        setIsLoadingSavedStatus(true);
        try {
            const response = await fetch(`/api/saved-recipes?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                console.error(`Failed to fetch saved recipes status (${response.status})`);
                 setSavedRecipeIds(new Set());
                 return;
            }
            const data = await response.json();
            if (data.recipes && Array.isArray(data.recipes)) {
                const ids = new Set(data.recipes.map((r: ISavedRecipeItem) => Number(r.recipeId)));
                setSavedRecipeIds(ids);
            } else {
                 setSavedRecipeIds(new Set()); // checking in case format is wrong
            }
        } catch (err) {
            console.error("Error fetching initial saved recipe state:", err);
             setSavedRecipeIds(new Set());
        } finally {
            setIsLoadingSavedStatus(false);
        }
    }, []);


    //Fetch Recipes from Spoonacular based on Pantry
    const fetchSpoonacularRecipes = useCallback(async () => {
        setIsLoadingRecipes(true);
        setError(null);

        let pantryIngredients = defaultPantry;

        if (session?.user?.email) {
            try {
                const pantryRes = await fetch(`/api/pantries?email=${encodeURIComponent(session.user.email)}`);
                if (pantryRes.ok) {
                    const pantryData = await pantryRes.json();
                    if (pantryData.ingredients && Array.isArray(pantryData.ingredients) && pantryData.ingredients.length > 0) {
                        pantryIngredients = pantryData.ingredients.map((item: any) => item.name || item).filter(Boolean);
                    } else {
                         console.log("Using default pantry (user pantry empty or invalid format).");
                    }
                } else {
                     console.warn(`Failed to fetch user pantry (${pantryRes.status}), using default.`);
                }
            } catch (error) {
                console.error("Failed to fetch user pantry, using default:", error);
            }
        } else {
             console.log("User not logged in, using default pantry.");
        }

        // calling upon spoonacular API and setting a limit to 10 recipes on the page
        try {
            const query = pantryIngredients.join(',');
            const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
            if (!apiKey) {
                throw new Error("Spoonacular API key is not configured.");
            }
            const offset = page * RESULTS_PER_PAGE;
const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=${RESULTS_PER_PAGE}&offset=${offset}&ranking=2&ignorePantry=true&apiKey=${apiKey}`;


            const res = await fetch(spoonacularUrl);

            // error handling to make sure in case the API fails
            if (!res.ok) {
                throw new Error(`Spoonacular API request failed: ${res.status} - ${res.statusText}`);
            }
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected API response format from Spoonacular:", data);
                throw new Error("Received invalid data format from recipe API.");
            }
            setRecipes(data);
        } catch (err: any) {
            console.error("Error fetching recipes from Spoonacular:", err);
            setError(err.message || "Could not load recipes.");
            setRecipes([]);
        } finally {
            setIsLoadingRecipes(false);
        }
    }, [session, page]);


    //Effect to trigger fetches based on session status
    useEffect(() => {
        fetchSpoonacularRecipes();
        if (status === 'authenticated' && session?.user?.email) {
            fetchInitialSavedState(session.user.email);
        } else if (status === 'unauthenticated') {
            setSavedRecipeIds(new Set());
            setIsLoadingSavedStatus(false);
        }
    }, [status, session, fetchSpoonacularRecipes, fetchInitialSavedState]);


    //Handle Save/Unsave Click
    const handleToggleSave = async (recipe: SpoonacularRecipe) => {
        if (status !== 'authenticated' || !session?.user?.email) {
            alert("Please log in to save recipes.");
            return;
        }
        if (!recipe || !recipe.id) return;

        setTogglingSaveId(recipe.id);
        setError(null);

        const isCurrentlySaved = savedRecipeIds.has(recipe.id);
        const method = isCurrentlySaved ? 'DELETE' : 'POST';
        let requestBody;

        if (isCurrentlySaved) {
            requestBody = JSON.stringify({
                email: session.user.email,
                recipeId: recipe.id,
            });
        } else {
            const recipeToSave: ISavedRecipeItem = {
                recipeId: recipe.id,
                title: recipe.title,
                image: recipe.image,
            };
            requestBody = JSON.stringify({
                email: session.user.email,
                recipe: recipeToSave,
            });
        }

        try {
            const response = await fetch('/api/saved-recipes', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isCurrentlySaved ? 'remove' : 'save'} recipe (${response.status})`);
            }

            // Update Local State if it is working
            setSavedRecipeIds(prev => {
                const newSet = new Set(prev);
                if (isCurrentlySaved) {
                    newSet.delete(recipe.id);
                } else {
                    newSet.add(recipe.id);
                }
                return newSet;
            });

        } catch (err: any) {
            console.error(`Error ${isCurrentlySaved ? 'removing' : 'saving'} recipe:`, err);
            setError(err.message || `Could not ${isCurrentlySaved ? 'remove' : 'save'} recipe.`);
        } finally {
            setTogglingSaveId(null);
        }
    };


    const renderRecipeGrid = () => {
        if (isLoadingRecipes || isLoadingSavedStatus) { // Wait for both recipes and initial saved status
            return <div className="text-center p-4">Loading recipes...</div>;
        }
        if (error && recipes.length === 0) {
            return <div className="text-center p-4 text-red-600">Error: {error}</div>;
        }
        if (recipes.length === 0) {
            return <div className="text-center p-4">No recipes found based on your pantry ingredients. Try adding more items to your pantry!</div>;
        }

        // Display recipes
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map((recipe) => {
                    const isSaved = savedRecipeIds.has(recipe.id);
                    const isSaving = togglingSaveId === recipe.id;

                    return (
                        // Original Card Structure
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
                                {togglingSaveId === recipe.id && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            <button
                                onClick={() => handleToggleSave(recipe)}
                                disabled={isSaving}
                                className={`text-xl ${isSaved ? 'text-yellow-400' : 'text-gray-600'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isSaved ? "Remove from Saved Recipes" : "Save Recipe"}
                            >
                                {isSaving ? '...' : (isSaved ? '★' : '☆')}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };


    return (
        // Original Outer Structure
        <div className="min-h-screen p-8 bg-white text-black">
            <div className="p-8 bg-gray-100 rounded-2xl shadow-md">
                {/* Original Header */}
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

               {/* Render Recipe Grid */}
{renderRecipeGrid()}

{/* Pagination Buttons */}
<div className="flex justify-between items-center mt-6">
  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="bg-gray-200 text-black px-4 py-2 rounded disabled:opacity-50"
  >
    ← Previous
  </button>
  <span className="text-gray-600 font-medium">Page {page + 1}</span>
  <button
    onClick={() => setPage(prev => prev + 1)}
    className="bg-gray-200 text-black px-4 py-2 rounded"
  >
    Next →
  </button>
</div>

{error && recipes.length > 0 && (
  <div className="text-center p-4 text-red-600 mt-4">Error: {error}</div>
)}

            </div>
        </div>
    );
}

export default NewRecipes;