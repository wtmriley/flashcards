import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateCard, createCard, readDeck } from "../api/index.js";

const AddCards = () => {
    const navigate = useNavigate();
    const { cardId, deckId } = useParams();
    const isNew = !cardId;

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
                setDeck(deckData);

                if (!isNew) {
                    const foundCard = deckData.cards.find(card => String(card.id) === String(cardId));
                    if (foundCard) {
                        setUpdatedFront(foundCard.front);
                        setUpdatedBack(foundCard.back);
                    } else {
                        setError("Card not found.");
                    }
                }

            } catch (err) {
                if (err.name !== "AbortError") {
                    setError("Failed to load deck.");
                }
            }
        };
    
        loadDeck();
        return () => abortController.abort();
    }, [deckId, cardId, isNew]);
    

    console.log("Card ID:", cardId);
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
            if (isNew) {
                await createCard(cardData);
            } else {
                await updateCard({ ...cardData, id: cardId });
            }
            navigate(`/decks/${deckId}`);
        } catch (err) {
            setError("Failed to save card.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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