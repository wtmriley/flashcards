import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateCard, createCard, readDeck } from "../api/index.js";

const AddCards = ({ deckName }) => {
    const navigate = useNavigate();
    const { deckId } = useParams();

    const [updatedFront, setUpdatedFront] = useState("");
    const [updatedBack, setUpdatedBack] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the existing card data when component mounts
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
    
        const loadDeck = async () => {
            try {
                const deckData = await readDeck(deckId, abortController.signal);
                setDeck(deckData);  // Set deck data for navigation
            } catch (err) {
                setError("Failed to load deck data.");
            }
            
        };
    
        loadDeck();
        return () => abortController.abort();
    }, [deckId]);
    
    console.log("Deck ID:", deckId);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const cardData = {
            deckId,
            front: updatedFront,
            back: updatedBack,
        };

        try {
            await createCard(cardData);
            navigate(`/decks/${deckId}`, { state: { refresh: true } });
        } catch (err) {
            setError("Failed to save card.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <nav>
                <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{deck?.name}</Link> / Add Card
            </nav>
            &nbsp;

            <h1>{deck?.name}: Add Card</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Front:</label>
                    <br />
                    <textarea
                        id="editFront"
                        value={updatedFront}
                        onChange={(e) => setUpdatedFront(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Back:</label>
                    <br />
                    <textarea
                        id="editBack"
                        value={updatedBack}
                        onChange={(e) => setUpdatedBack(e.target.value)}
                    />
                </div>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
};

export default AddCards;