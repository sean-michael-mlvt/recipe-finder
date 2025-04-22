"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Ingredient {
    id: string, 
    name: string
}

interface PantryProps {
    pantryContents: Ingredient[];
    onRemove: (id: string) => void;
}

/**
 * This component displays the Ingredients found in pantryContents, with the ability to remove 
 * ingredients, save the pantry, and move to new-recipes page to see recipes based on your pantry.
 * 
 * @param pantryContents A list of Ingredient objects to display
 * @param onRemove A callback to remove an ingredient (pass in its id) from the pantryContents 
 *  
 */
function Pantry({pantryContents, onRemove}: PantryProps) {

    const router = useRouter();
    const { data: session } = useSession();

    // Function to be called when Save Pantry button is clicked
    const handleSavePantry = () => {
        console.log("PANTRY CONTENTS:");
        console.log(pantryContents);


    }

    // Function to be called when View Recipes button is clicked
    const handleViewRecipes = () => {
        router.push('/new-recipes');
    };

    return (
        <div className="w-full md:h-full h-[65vh] md:w-7/12 bg-white flex flex-col p-1 md:p-5 gap-5">

            {/* Pantry Items Container */}
            <div className="flex-grow bg-light-stegman border-2 border-solid border-black rounded p-5">

                {/* Grid for item layout, map individual items to divs with x buttons */}
                <div className="flex flex-wrap gap-3">
                    {pantryContents.map((ingredient) => (
                        <div
                        key={ingredient.id}
                        className="flex items-center gap-2 border-2 border-black rounded-[12px] px-3 pl-4 py-2 text-black text-lg relative group bg-white text-oswald"
                        >
                            {ingredient.name.toUpperCase()}

                            {/* X button for removing item */}
                            <button
                                onClick={() => onRemove(ingredient.id)}
                                className="text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                aria-label={`Remove ${ingredient.name}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Buttons */}
            <span className="flex justify-center md:justify-end gap-5">
                <button className="cursor-pointer text-2xl text-white text-oswald px-6 py-3 bg-lake-herrick" 
                    onClick={handleSavePantry}
                >
                    SAVE PANTRY
                </button>
                <button className="cursor-pointer text-2xl text-white text-oswald px-6 py-3 bg-bulldog-red"
                    onClick={handleViewRecipes}
                >
                    VIEW RECIPES
                </button>
            </span>
        </div>
    );

}

export default Pantry
