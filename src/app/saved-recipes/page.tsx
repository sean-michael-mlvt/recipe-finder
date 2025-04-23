"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { ISavedRecipeItem } from '@/models/SavedRecipesSchema';

// Assume the original component name was SavedRecipes
function SavedRecipes() {
    const { data: session, status } = useSession();
    const router = useRouter(); // Keep router if needed for redirects
    const [savedRecipes, setSavedRecipes] = useState<ISavedRecipeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<string | number | null>(null);

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
            setSavedRecipes([]);
        }

    }, [status, session, fetchSavedRecipes]);

    // Function to handle deleting a recipe
    const handleRemoveRecipe = async (recipeIdToRemove: string | number) => {
        if (!session?.user?.email) {
            setError("You must be logged in to remove recipes.");
            return;
        }
        if (!recipeIdToRemove) return;

        const confirmDelete = window.confirm("Are you sure you want to remove this recipe?");
        if (!confirmDelete) {
            return;
        }

        setDeletingId(recipeIdToRemove);
        setError(null);

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


    const renderContent = () => {
        // 1. Handle Loading State
        if (isLoading) {
            return <div className="text-center p-4">Loading recipes...</div>;
        }

        if (error && (savedRecipes.length === 0 || status !== 'authenticated')) {
             return <div className="text-center p-4 text-red-600">Error: {error}</div>;
        }

        //Handle Not Authenticated
         if (status !== 'authenticated') {
            return <div className="text-center p-4">Please log in to view your saved recipes.</div>;
         }

        if (savedRecipes.length === 0) {
            return <div className="text-center p-4">You haven't saved any recipes yet.</div>;
        }

        // 5. Render the grid with fetched recipes
        return (

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
                                width={128} 
                                height={128}
                                className="rounded object-cover" // Original classes
                            />
                            {/* Use fetched title */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{recipe.title.toUpperCase()}</h3>

                                {isDeleting && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <button
                                onClick={() => handleRemoveRecipe(recipe.recipeId)}
                                disabled={isDeleting} // Disable only when deleting this item
                                className={`text-red-500 text-xl ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`} // Original classes
                                title="Remove recipe"
                            >
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
        <div className="min-h-screen p-8 bg-white-900 text-black">
            <div className="p-8 bg-gray-100 rounded-2xl shadow-md">

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold">SAVED RECIPES</h2>
                        <p className="text-gray-600">These are the recipes that you've saved</p>
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

                {renderContent()}
                {error && !isLoading && <div className="text-center p-4 text-red-600 mt-4">Error: {error}</div>}

            </div>
        </div>
    );
}

export default SavedRecipes;