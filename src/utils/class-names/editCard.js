import React from "react";

export const EditCard = ({ deckName, deckDescription }) => {
    console.log('EditCard props:', { deckName, deckDescription}); // Log props
    console.log('EditCard component rendered');
    console.log('Deck Name:', deckName);
    console.log('Deck Description:', deckDescription);

    return (
        <div>
            <h1>{deckName}</h1>
            <p>{deckDescription}</p>
            <h2>Card Front</h2>
            <textarea></textarea> <br></br>
            <h2>Card Back</h2>
            <textarea></textarea>
            <br></br>
            <button className="btn btn-primary">Save</button>
            <button className="btn btn-primary">Done</button>
        </div>
        
    );
}

export default EditCard;