"use client";

import { useState } from "react";

interface Ingredient {
    id: string, 
    name: string
}

interface IngredientFormProps {
    ingredients: Ingredient[];
    pantryItems: Ingredient[];
    onAddIngredient: (ingredient: Ingredient) => void;
};

/**
 * This component is used to search new ingredients and add them to the pantry.
 * 
 * @param ingredients The list of all ingredient objects to populate the search list with
 * @param pantryItems The current ingredients in the pantry
 * @param onAddIngredient The callback to add a new ingredient to the current pantry 
 */
function IngredientForm({ingredients, pantryItems, onAddIngredient}: IngredientFormProps) {

    // State of the search input
    const [search, setSearch] = useState('');

    // List of Ingredients which contain the current search input
    const filtered = ingredients.filter(
        (i) => { 
            return i.name.toLowerCase().includes(search.toLowerCase()) && 
            !pantryItems.some(inPantry => inPantry.id === i.id);
        }
    );

    return (

        <div className="w-full md:h-full h-[70vh] md:w-5/12 flex flex-col md:p-5">

            <h1 className="text-4xl mb-5">EDIT YOUR PANTRY</h1>

            <div className="bg-lake-herrick p-7 flex flex-col h-full rounded-lg">
                <input type="text" placeholder="Search Ingredients..." value={search} 
                    onChange={(e) => setSearch(e.target.value)} className="w-full bg-white p-4 border rounded mb-6 rounded-xl border-none"
                />
                <div className="flex-grow overflow-auto p-1">
                    <ul className="space-y-2 max-h-100">
                        {filtered.slice(0, 50).map((ingredient) => (
                            <li key={ingredient.id}>
                                <button
                                    className="w-full text-left px-4 py-4 bg-gray-100 hover:bg-gray-200 rounded-md text-oswald text-xl"
                                    onClick={() => onAddIngredient(ingredient)}
                                    >
                                    + {ingredient.name.toUpperCase()}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    );
}

export default IngredientForm

