import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { updateCard, readCard } from "../api/index.js";
import '../../App.css';

export const EditCard = () => {
    const navigate = useNavigate();
    const { cardId, deckId } = useParams();

    const location = useLocation();
    const { deckName } = location.state || {}; 

    const [updatedFront, setUpdatedFront] = useState("");
    const [updatedBack, setUpdatedBack] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCard = async () => {
            setLoading(true);
            try {
                const card = await readCard(cardId);  // Fetch card from API
                if (card) {
                    setUpdatedFront(card.front);  // Set form inputs
                    setUpdatedBack(card.back);
                } else {
                    throw new Error("Card not found.");
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [cardId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Updated Card Data:", { id: cardId, front: updatedFront, back: updatedBack, deckId });
        setLoading(true);

        const updatedCard = {
            id: cardId,
            front: updatedFront,
            back: updatedBack,
            deckId: deckId,
        };

        console.log("cardId:", cardId);  // Check if cardId is correctly set
        console.log("deckId:", deckId);

        try {
            await updateCard(updatedCard);  // Call the updateCard function
            alert("Card updated successfully!");

            navigate(`/decks/${deckId}`, { 
                state: { refresh: true } 
            }); 

        } catch (error) {
            setError(error);
            setLoading(false);
            alert("Failed to update card.");
        }
    };

    if (loading) return <div>Loading card...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            <nav>
                <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{deckName}</Link> / Edit Card
            </nav>
            &nbsp;
            <h2>Edit Card</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Front:</label>
                    <br />
                    <input
                        type="text"
                        id="editFront"
                        value={updatedFront}
                        onChange={(e) => setUpdatedFront(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label >Back:</label>
                    <br />
                    <textarea
                        type="text"
                        id="editBack"
                        value={updatedBack}
                        onChange={(e) => setUpdatedBack(e.target.value)}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary" >Save Changes</button>
            </form>
        </div>
    );
};



export default EditCard;