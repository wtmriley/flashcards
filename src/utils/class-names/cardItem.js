import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteCard } from "../api/index.js";

const CardItem = ({ card, deckId, refreshCards }) => {

  console.log("Card ID:", card.id); // ✅ now this will work
  console.log("Deck ID:", deckId);

  const navigate = useNavigate();

  console.log(card.id);

  const handleDelete = async () => {
    try {
      await deleteCard(card.id);
      refreshCards();  
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/decks/${deckId}/cards/${card.id}/edit`, {
      state: { front: card.front, back: card.back }
    });
  };

  return (
    <li className="card">
      <div className="card-front">
        <h3>{card.front}</h3>
        </div>
        <div className="card-back">
        <p>{card.back}</p>
      </div>
      <div className="card-actions">
          <button
            className="btn btn-primary"
            onClick={handleEdit}>
              Edit Card
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}>
            Delete
          </button>
        </div>
    </li>
    );
};

export default CardItem;

