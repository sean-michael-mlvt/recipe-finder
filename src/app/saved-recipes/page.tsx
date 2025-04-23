"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // Import useSession
import { useRouter } from 'next/navigation';
import type { ISavedRecipeItem } from '@/models/SavedRecipesSchema'; // Import the type (adjust path)

// Assume the original component name was SavedRecipes
function SavedRecipes() {
    const { data: session, status } = useSession(); // Get session data and status
    const router = useRouter(); // Keep router if needed for redirects
    const [savedRecipes, setSavedRecipes] = useState<ISavedRecipeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State to track which recipe is being deleted
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    // --- Functionality from previous version (Keep these) ---

    // Function to fetch saved recipes
    const fetchSavedRecipes = useCallback(async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/saved-recipes?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch recipes (${response.status})`);
            }
            const data = await response.json();
            setSavedRecipes(data.recipes || []); // Ensure it's an array
        } catch (err: any) {
            console.error("Error fetching saved recipes:", err);
            setError(err.message || "Could not load saved recipes.");
            setSavedRecipes([]); // Clear recipes on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to fetch data when session loads
    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
            return;
        }
        if (status === 'authenticated' && session?.user?.email) {
            fetchSavedRecipes(session.user.email);
        } else if (status === 'unauthenticated') {
            // If user logs out or isn't logged in
            setIsLoading(false);
            setError("Please log in to view your saved recipes.");
            setSavedRecipes([]); // Clear any potential stale data
        }
        // Note: If status remains 'unauthenticated', error message will persist.
    }, [status, session, fetchSavedRecipes]);

    // Function to handle deleting a recipe
    const handleRemoveRecipe = async (recipeIdToRemove: string | number) => {
        if (!session?.user?.email) {
            setError("You must be logged in to remove recipes.");
            return;
        }
        if (!recipeIdToRemove) return;

        // Optional: Add confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to remove this recipe?");
        if (!confirmDelete) {
            return;
        }

        setDeletingId(recipeIdToRemove);
        setError(null); // Clear previous errors specific to loading

        try {
            const response = await fetch('/api/saved-recipes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: session.user.email,
                    recipeId: recipeIdToRemove,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to remove recipe (${response.status})`);
            }

            // Update local state on success
            setSavedRecipes(prevRecipes =>
                prevRecipes.filter(recipe => recipe.recipeId !== recipeIdToRemove)
            );

        } catch (err: any) {
            console.error("Error removing recipe:", err);
            // Display error specific to the delete action
            setError(err.message || "Could not remove recipe.");
        } finally {
            setDeletingId(null); // Finish deleting process
        }
    };

    // --- Render Logic (Using Original Structure) ---

    const renderContent = () => {
        // 1. Handle Loading State
        if (isLoading) {
            // You can put this message inside the grid area or replace the grid
            return <div className="text-center p-4">Loading recipes...</div>;
        }

        // 2. Handle Error State (General fetch error or not logged in)
        // If there's an error AND we don't have recipes (or aren't logged in) show error
        if (error && (savedRecipes.length === 0 || status !== 'authenticated')) {
             return <div className="text-center p-4 text-red-600">Error: {error}</div>;
        }

        // 3. Handle Not Authenticated (if not already caught by error state)
         if (status !== 'authenticated') {
            return <div className="text-center p-4">Please log in to view your saved recipes.</div>;
         }

        // 4. Handle No Saved Recipes
        if (savedRecipes.length === 0) {
            return <div className="text-center p-4">You haven't saved any recipes yet.</div>;
        }

        // 5. Render the grid with fetched recipes
        return (
            // Original Grid Structure
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRecipes.map((recipe) => {
                     const isDeleting = deletingId === recipe.recipeId;
                     return (
                        // Original Card Structure
                        <div key={recipe.recipeId} className="flex border-2 border-red-500 p-4 rounded-md items-center gap-4 bg-white shadow">
                            {/* Use fetched image */}
                            <Image
                                src={recipe.image}
                                alt={recipe.title}
                                width={128} // Original dimensions
                                height={128}
                                className="rounded object-cover" // Original classes
                            />
                            {/* Use fetched title */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{recipe.title.toUpperCase()}</h3>
                                {/* Remove static ingredients or replace with relevant fetched data if available */}
                                {/* <p><strong>Your Ingredients Used:</strong> ... </p> */}
                                {/* <p><strong>Other Ingredients Used:</strong> ... </p> */}
                                {/* Show error specific to deleting this item */}
                                {isDeleting && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            {/* Original Button Structure + Functionality */}
                            <button
                                onClick={() => handleRemoveRecipe(recipe.recipeId)}
                                disabled={isDeleting} // Disable only when deleting this item
                                className={`text-red-500 text-xl ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`} // Original classes + disabled style
                                title="Remove recipe"
                            >
                                {/* Show loading indicator or original star */}
                                {isDeleting ? '...' : '⭐'}
                            </button>
                        </div>
                     );
                })}
            </div>
        );
    };

    return (
        // Original Main structure
        <div className="min-h-screen p-8 bg-white-900 text-black"> {/* Assuming bg-white-900 was a typo and meant bg-white or similar */}
            <div className="p-8 bg-gray-100 rounded-2xl shadow-md">

                {/* Original Top Header Structure */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold">SAVED RECIPES</h2>
                        <p className="text-gray-600">These are the recipes that you've saved</p>
                         {/* Optional: Show recipe count if logged in and loaded */}
                         {status === 'authenticated' && !isLoading && savedRecipes.length > 0 &&
                            <p className="text-sm text-gray-500">Showing {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''}.</p>
                         }
                    </div>
                    {/* Original Link/Button */}
                    <Link href="/new-recipes">
                        <button className="bg-bulldog-red text-white px-4 py-2 font-bold cursor-pointer">
                            FIND MORE RECIPES
                        </button>
                    </Link>
                </div>

                {/* Render loading/error/empty/grid content */}
                {renderContent()}

                {/* Display general errors that occurred during delete below the grid */}
                {error && !isLoading && <div className="text-center p-4 text-red-600 mt-4">Error: {error}</div>}

            </div>
        </div>
    );
}

// Use the original export name
export default SavedRecipes;