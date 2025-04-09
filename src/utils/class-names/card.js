import { useNavigate } from "react-router-dom";
import CardItem from "./cardItem";
import React from 'react';



export const Card = ({ deckId, deckName, deckDescription, cards, setCards, refreshCards }) => {
    const navigate = useNavigate();
    console.log("Cards received in Card component:", cards);

    const filteredCards = cards.filter(card => card.deckId == deckId);

    console.log("Filtered Cards:", filteredCards);

    const handleCardDelete = (deletedCardId) => {
      setCards(prevCards => prevCards.filter(card => card.id !== deletedCardId));
    };

    return (
    <div>
      <h2>{deckName}</h2>
      <p>{deckDescription}</p>

      <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/edit`)}>Edit Deck</button>
      <button className="btn btn-danger" onClick={() => navigate(`/decks/${deckId}/delete`)}>Delete Deck</button>
      <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/cards/new`)}>Add Card</button>
      <button className="btn btn-primary" onClick={() => navigate(`/decks/${deckId}/study`, { state: { cards } })}>Study</button>
      
      <ul>
        {filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              deckId={deckId}
              onCardDelete={handleCardDelete}
              refreshCards={refreshCards}
            />
          ))
        ) : (
            console.log("Not enough cards")
        )}
      </ul>
    </div>
    );
};

export default Card;
