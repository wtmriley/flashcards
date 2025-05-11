import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { updateDeck, readDeck } from "../api/index.js";
import '../../App.css';

export const EditDeck = () => {
    const navigate = useNavigate();
    const { deckId } = useParams();

    const location = useLocation();
    const { deckName } = location.state || {};

    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeck = async () => {
            setLoading(true);
            try {
                const deck = await readDeck(deckId);  // 🔹 Fetch deck from API
                if (deck) {
                    setUpdatedName(deck.name);  // Set form inputs
                    setUpdatedDescription(deck.description);
                } else {
                    throw new Error("Deck not found.");
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedDeck = {
            id: deckId,
            name: updatedName,
            description: updatedDescription
        };

        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await updateDeck(updatedDeck, signal);
            console.log("Updated Deck Response:", response);
            navigate(`/decks/${deckId}`);
        } catch (err) {
            if (error.name === "AbortError") {
                console.log("Aborted");
            } else {
                console.error("Error updating deck:", err);
            }
        }
        console.log("Updated Deck:", updatedDeck);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <nav>
                <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{deckName}</Link> / Edit Card
            </nav>
            &nbsp; 
            <h2>Edit Deck</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary" >Save</button>
            </form> 
        </div>
    );
}

export default EditDeck;