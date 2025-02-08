import { useNavigate } from "react-router-dom";
import { useEffect, useState, React } from "react";
import { listDecks } from "../api/index.js";


export const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDecks() {
      const fetchedDecks = await listDecks();
      setDecks(fetchedDecks);
    }
    fetchDecks();
  }, []);

  return (
    <div className="container">
      <h1>Decks List</h1>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <h2>
              {deck.name}
            </h2>
            <p>{deck.description}</p>
            <p>{deck.cards.length} cards</p>
            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deck.id}`)}>View</button>
            <button className="btn btn-primary" onClick={() => navigate(`/decks/${deck.id}/study`)}>Study</button>
            <button className="btn btn-danger ">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;