import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readDeck } from "../api/index.js";

export const Study = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const data = await readDeck(deckId, abortController.signal);
        setDeck(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Not enough cards.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDeck();
    return () => abortController.abort();
  }, [deckId]);

  if (loading) return <p>Loading deck...</p>;

  if (!deck) return <p>Deck not found.</p>;

  if (deck.cards.length <= 2) {
    return (
      <div className="study-container">
        <nav>
          <a href="/">Home</a> / <span>{deck.name}</span> / Study
        </nav>
        <h2>{`Study: ${deck.name}`}</h2>
        <p>Not enough cards.</p>
        <button onClick={() => navigate(`/decks/${deckId}/cards/new`)} className="btn btn-primary">
          Add Cards
        </button>
      </div>
    );
  }

  const cards = deck.cards; // Use the cards from the loaded deck.
  const currentCard = cards[currentIndex];

  const handleButtonClick = () => {
    if (!showBack) {
      setShowBack(true);
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= cards.length) {
        setIsFinished(true);
      } else {
        setCurrentIndex(nextIndex);
        setShowBack(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowBack(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="study-container">
        <nav>
          <a href="/">Home</a> / <span>{deck.name}</span> / Study
        </nav>
        <h2>{`Study: ${deck.name}`}</h2>
        <p>Deck Complete! You've gone through all the cards.</p>
        <button onClick={handleRestart} className="btn btn-primary">
          Restart Deck
        </button>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          Return Home
        </button>
      </div>
    );
  }


  return (
    <div className="study-container">
      <nav>
        <a href="/">Home</a> / <span>{deck.name}</span> / Study
      </nav>

      <h2>{`Study: ${deck.name}`}</h2>

      <p>{`Card ${currentIndex + 1} of ${cards.length}`}</p>
      
      <div className="card">
        {showBack ? <p>{currentCard.back}</p> : <h3>{currentCard.front}</h3>}
      </div>

      <button onClick={handleButtonClick} className="btn btn-primary">
        {showBack ? "Next" : "Flip"}
      </button>

      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        Back to Deck
      </button>
    </div>
  );
};

export default Study;
