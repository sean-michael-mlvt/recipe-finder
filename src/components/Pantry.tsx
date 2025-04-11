"use client";

interface Ingredient {
    id: string, 
    name: string
}

interface PantryProps {
    pantryContents: Ingredient[];
    onRemove: (id: string) => void;
}

function Pantry({pantryContents, onRemove}: PantryProps) {

    return (
        <div className="w-full md:h-full h-[65vh] md:w-7/12 bg-white flex flex-col p-1 md:p-5 gap-5">

            {/* Pantry Items Container */}
            <div className="flex-grow bg-light-stegman border-2 border-solid border-black rounded p-5">
                <div className="flex flex-wrap gap-3">
                    {pantryContents.map((ingredient) => (
                        <div
                        key={ingredient.id}
                        className="flex items-center gap-2 border-2 border-black rounded-[12px] px-4 py-2 text-black text-lg relative group bg-white"
                        >
                        {ingredient.name}
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

            {/* Buttons */}
            <span className="flex justify-end gap-5">
                <button className="cursor-pointer text-2xl text-white text-oswald px-6 py-3 bg-lake-herrick">
                    SAVE PANTRY
                </button>
                <button className="cursor-pointer text-2xl text-white text-oswald px-6 py-3 bg-bulldog-red">
                    VIEW RECIPES
                </button>
            </span>
        </div>
    );

}

export default Pantry
