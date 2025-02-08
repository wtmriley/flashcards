import React, { useState, useEffect, useParams } from 'react';
import { listCards } from '../api/index.js';
import { useNavigate } from "react-router-dom";
import EditCard from './editCard';

export const Card = ({ deckId, deckName, deckDescription }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { cardId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        console.log("deckId received in Card component:", deckId); // ✅ Debugging deckId
        if (!deckId) return;

        const abortController = new AbortController();
        const signal = abortController.signal;

        async function fetchCards() {
            try {
                // Fetch all cards
                const allCards = await listCards(signal);
                console.log("Fetched Cards:", allCards);
                // Filter only the cards belonging to this deck
                const deckCards = allCards.filter(card => card.deckId === parseInt(deckId, 10));
                console.log("Filtered Deck Cards:", deckCards);

                setCards(deckCards);
                setLoading(false);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err);
                    setLoading(false);
                }
            }
        }

        fetchCards();

        return () => abortController.abort();
    }, [deckId]);

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>{deckName}</h2>
            <p>{deckDescription}</p>
            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/edit`)}>Edit</button>
            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/study`)}>Study</button>
            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/cards/new`)}>Add Cards</button>
            <ul>
                {cards.map((card) => (
                    <li key={card.id} className="card">
                        <div className="card-front">
                            <h3>{card.front}</h3>
                        </div>
                        <div className="card-back">
                            <p>{card.back}</p>
                        </div>
                        <div className="card-actions">
                            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/cards/${card.id}/edit`)}>Edit</button>
                            <button className="btn btn-danger">Delete</button>
                        </div>
                        <EditCard 
                            deckName={deckName}
                            deckDescription={deckDescription}
                            cardId={card.id}
                            cardFront={card.front}
                            cardBack={card.back}
                            deckId={deckId}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Card;
