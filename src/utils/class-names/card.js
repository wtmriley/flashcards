import { useNavigate } from "react-router-dom";
import CardItem from "./cardItem";
import React from 'react';
import { deleteDeck } from "../api/index.js";

export const Card = ({ deckId, deckName, deckDescription, cards, setCards, refreshCards, deck }) => {
    const navigate = useNavigate();
    console.log("Cards received in Card component:", cards);

    const filteredCards = cards.filter(card => card.deckId == deckId);

    console.log("Filtered Cards:", filteredCards);

    const handleCardDelete = (deletedCardId) => {
      setCards(prevCards => prevCards.filter(card => card.id !== deletedCardId));
    };

    console.log(deckName);
    console.log(cards);

    return (
    <div>
       <nav>
          <a href="/">Home</a> / <span>{deck.name}</span>
        </nav>
        &nbsp;

      <h2>{deckName}</h2>
      <p>{deckDescription}</p>

      <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/edit`)}>Edit Deck</button>
      <button className="btn btn-danger" 
        onClick={async () => {
          const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
          if (confirmDelete) {
            try {
            // Call deleteDeck with the correct deckId
            await deleteDeck(deck.id, null); // Use deck.id to delete the correct deck
            // Optional: Show an alert or notification to confirm the deletion
            alert("Deck deleted successfully!");
            // Redirect to home or another page after deletion
            navigate("/"); // Navigate back to the home page after deletion
          } catch (error) {
            console.error("Error deleting deck:", error);
            alert("Failed to delete the deck. Please try again.");
          }
        }
        }} >
          Delete Deck
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/cards/new`, { state: { deckName: deck.name } })}>Add Card</button>
          <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/study`, { state: { cards } })}>Study</button>
        <ul>
      {console.log("filteredCards:", filteredCards)}
        {filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              deckId={deckId}
              deck={deck}
              deckName={deckName}
              onCardDelete={handleCardDelete}
              refreshCards={refreshCards}
            />
          ))
        ) : (
          <h2>No cards found.</h2>
        )}
      </ul>
    </div>
    );
};

export default Card;
