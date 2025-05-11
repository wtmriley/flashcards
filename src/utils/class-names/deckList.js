import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { listDecks, listCards, deleteDeck } from "../api/index.js";
import React from "react";

export const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get location to check for the refresh state
  const location = useLocation();
  const { refresh } = location.state || {}; // This will be true if the refresh state is passed.

  const isRefreshNeeded = location.state?.refresh || false;

  useEffect(() => {
    async function fetchDecksAndCards() {
      try {
        setLoading(true);
        setDecks([]); // Clear the existing decks to force a re-fetch

        const fetchedDecks = await listDecks();
        const fetchedCards = await listCards();

        // Merge the decks and cards:
        const normalizedDecks = fetchedDecks.map((deck) => ({
          ...deck,
          id: deck.id,
        }));
        const normalizedCards = fetchedCards.map((card) => ({
          ...card,
          deckId: card.deckId,
        }));

        const decksWithCards = normalizedDecks.map((deck) => ({
          ...deck,
          cards: normalizedCards.filter((card) => {
            // Ensure both deck.id and card.deckId are strings for comparison
            const deckIdAsString = String(deck.id); 
            const cardDeckIdAsString = String(card.deckId);
        
            console.log(`Checking if card's deckId (${cardDeckIdAsString}) matches deck's id (${deckIdAsString})`);
        
            return cardDeckIdAsString === deckIdAsString;
          }),
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1>Mock Rendering in React</h1>
      <button className="btn btn-primary" onClick={() => navigate("/decks/new")}>
        Create Deck
      </button>

      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <h2>{deck.name}</h2>
            <p>{deck.cards.length} cards</p>
            <p>{deck.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/decks/${deck.id}`, { state: { deck } })}
            >
              View
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/decks/${deck.id}/study`, { state: { cards: deck.cards } })
              }
            >
              Study
            </button>
            <button className="btn btn-danger"
              onClick={async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
                if (confirmDelete) {
                  try {
                    // Log the deck ID to verify it's correct
                    console.log("Deleting deck with ID:", deck.id);
                    
                    await deleteDeck(deck.id, null);  // Pass null for signal or handle abort
                    setDecks((currentDecks) => currentDecks.filter((d) => d.id !== deck.id));
                    alert("Deck deleted successfully!");
                  } catch (error) {
                    console.error("Error deleting deck:", error);
                    alert("Failed to delete the deck. Please try again.");
                  }
                }
              }}>
              Delete
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;
