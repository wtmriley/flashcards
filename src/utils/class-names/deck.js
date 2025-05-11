import React, { useState, useEffect } from 'react';
import Card from './card';
import '../../App.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { readDeck, listCards } from '../api/index.js';


export const Deck = () => {
  const { deckId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialDeck = location.state?.deck || null;
  const [deck, setDeck] = useState(initialDeck);
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(!initialDeck);
  const [error, setError] = useState(null);

  const removeCardFromList = (cardId) => {
    setCards((prevCards) => prevCards.filter(card => card.id !== cardId));

    fetchDeckAndCards();
  };

  const fetchDeckAndCards = async () => {
    setLoading(true);
    try {
      const fetchedDeck = await readDeck(deckId);

      console.log("Fetched deck:", fetchedDeck);

      if (!fetchedDeck) throw new Error("Deck not found.");

      let deckCards = fetchedDeck.cards || [];

      // If the deck doesn't include cards, fetch all and filter manually
      if (deckCards.length == 0) {
        const allCards = await listCards();
        deckCards = allCards.filter(
          (card) => card.deckId == deckId
        );
      }
      
      console.log("Fetched cards:", deckCards);

      setDeck({ ...fetchedDeck, cards: deckCards });
      setCards(deckCards);

      console.log("Fetched deck:", fetchedDeck.name);
      console.log("Cards array length:", deckCards.length);
      console.log("Cards:", deckCards);

    } catch (err) {
      console.error("Error fetching deck:", err);
      navigate("*");
      
    } finally {
      setLoading(false);
    }
  };

  console.log("Deck in state:", deck);

  useEffect(() => {
    console.log("Location state on mount:", location.state);
    if (!deck || location.state?.refresh) {
      fetchDeckAndCards().then(() => {
        // Clear refresh state after fetching data
        if (location.state?.refresh) {
          navigate(`/decks/${deckId}`, { replace: true, state: {} });
        }
      });
    }
  }, [deckId, location.state?.refresh]);  

  if (!deck) console.log("No deck found.");

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Card
        deckId={deck.id}
        deck={deck}
        deckName={deck.name}
        deckDescription={deck.description}
        cards={deck.cards || [] }
        onCardDelete={removeCardFromList}
        refreshCards={fetchDeckAndCards}
      />
    </div>
  );
};

export default Deck;