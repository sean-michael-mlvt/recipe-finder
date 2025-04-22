"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import IngredientForm from "@/components/IngredientForm";
import Pantry from "@/components/Pantry";

interface Ingredient {
    _id: string, 
    name: string
}

function PantryPage() {

    const { data: session, status } = useSession();


    // State variables
    const[allIngredients, setAllIngredients] = useState<Ingredient[]>([]);      // For populating form dropdown & search
    const [pantryContents, setPantryContents] = useState<Ingredient[]>([        // For displaying & saving pantry contents
        // { _id: "14412", name: "water" },
        // { _id: "2047", name: "salt" },
        // { _id: "4053", name: "olive oil" }
    ]);       
    
    // Fetch the user's pantry from MongoDB once session is ready
    useEffect(() => {
        const fetchPantry = async () => {
        if (!session?.user?.email) return;

        try {
            const res = await fetch(`/api/pantries?email=${session.user.email}`);

            if (!res.ok) {
            console.error("Failed to fetch pantry:", res.statusText);
            return;
            }

            const data = await res.json();
            if (data.ingredients) {
            setPantryContents(data.ingredients);
            }
        } catch (error) {
            console.error("Error fetching pantry:", error);
        }
        };

        if (status === "authenticated") {
        fetchPantry();
        }
    }, [session, status]);

    // Takes an Ingredient object and adds it to pantryContents if it is not already present
    const addToPantry = (ingredient: Ingredient) => {
        if (!pantryContents.find((item) => {return item._id === ingredient._id})) {
            setPantryContents(prev => [...prev, ingredient]);
        }
    }

    // Removes an ingredient (by id) from pantryContents
    const removeFromPantry = (id: string) => {
        setPantryContents(prev => prev.filter(item => item._id !== id));
    };

    // Fetch .csv file containing the list of popular ingredients to choose from
    useEffect(() => {
        fetch('/data/top-1k-ingredients.csv')
            .then((res) => res.text())
            .then((text) => {                       // text = csv rows split by \n (newline characters)
                
                // Get individual lines
                const lines = text.trim().split("\n");
                
                // Map the name and id to an Ingredient object and add it to a list
                const fetchedIngredients: Ingredient[] = lines.map(line => {
                    const [name, _id] = line.split(';').map(val => val.trim());
                    return {name, _id};
                })

                // Update allIngredients to pass to the IngredientForm
                setAllIngredients(fetchedIngredients);
            }) 
    }, []);

    return(
        <div className="flex flex-col md:flex-row items-center p-5 gap-4 flex-grow">
            {/* <div className="h-50 w-full md:h-full h-[65vh] md:w-5/12 bg-lake-herrick"></div> */}
            <IngredientForm ingredients={allIngredients} pantryItems={pantryContents} onAddIngredient={addToPantry}></IngredientForm>
            <Pantry pantryContents={pantryContents} onRemove={removeFromPantry} ></Pantry>
        </div>
    );
}

export default PantryPage