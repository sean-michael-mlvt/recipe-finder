"use client";

function Pantry() {
    return(
        <div className="flex flex-col md:flex-row items-center p-5 gap-5 flex-grow">
            <div className="h-50 w-full md:h-full h-[65vh] md:w-1/2 bg-blue-400"></div>
            <div className="h-50 w-full md:h-full h-[65vh] md:w-1/2 bg-gray-300"></div>
        </div>
    );
}

export default Pantry