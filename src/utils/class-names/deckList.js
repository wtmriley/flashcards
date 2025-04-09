import { useNavigate  } from "react-router-dom";
import { useEffect, useState } from "react";
import { listDecks, listCards } from "../api/index.js"
import React from "react";


export const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDecksAndCards() {
      try {
        setLoading(true);
        const fetchedDecks = await listDecks();
        const fetchedCards = await listCards();

        // Merge the decks and cards:
        // For each deck, filter the cards that have a matching deckId.
        // Use String() to ensure the types match.
        const normalizedDecks = fetchedDecks.map((deck) => ({
          ...deck,
          id: deck.id
        }));
        const normalizedCards = fetchedCards.map((card) => ({
          ...card,
          deckId: card.deckId
        }));

        const decksWithCards = normalizedDecks.map((deck) => ({
          ...deck,
          cards: normalizedCards.filter((card) => card.deckId == deck.id)
        }));

        setDecks(decksWithCards);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDecksAndCards();
  }, []);

  return (
    <div className="container">
      <h1>Mock Rendering in React</h1>
      <button className="btn btn-primary" onClick={() => navigate("/decks/new")}>Create Deck</button>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <h2>{deck.name}</h2>
            <p>{deck.cards.length} cards</p>
            <p>{deck.description}</p>
            <button className="btn btn-primary" 
            onClick={() => navigate(`/decks/${deck.id}`, { state: { deck } })}>
              View
              </button>
            <button className="btn btn-primary"
            onClick={() => navigate(`/decks/${deck.id}/study`, { state: { cards: deck.cards } } )}>
              Study
              </button>
            <button className="btn btn-danger ">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;