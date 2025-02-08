import React, { useState, useEffect } from 'react';
import { listDecks } from '../api/index.js';
import Card from './card';
import { useParams } from 'react-router-dom';

export const Deck = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Deck ID from useParams:", deckId);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const fetchedDecks = await listDecks();
        console.log("Fetched Decks:", fetchedDecks);
        const selectedDeck = fetchedDecks.find(deck => deck.id === Number(deckId));
        
        console.log("Deck ID from URL:", deckId, "Type:", typeof deckId);
        console.log("Parsed deckId:", Number(deckId), "Found Deck:", selectedDeck);
        
        if (!selectedDeck) throw new Error("Deck not found");

        setDeck(selectedDeck);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchDecks();
  }, [deckId]);

  if (loading) return <div>Loading deck...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!deck) return <div>No deck found.</div>;

  return (
    <div>
      <Card deckId={deck.id} deckName={deck.name} deckDescription={deck.description}/>
    </div>
  );
};

export default Deck;