import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import "../../App.css";
import { createDeck } from "../api/index.js";

export const AddDeck = () => {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission for creating a new deck
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const deckData = {
      name: deckName,
      description: deckDescription,
    };

    try {
      // Call the API to create a new deck
      const newDeck = await createDeck(deckData);
      console.log("New Deck Created:", newDeck);
      // Navigate to the newly created deck's page, passing deck data in state
      navigate(`/decks/${newDeck.id}`, { state: { deck: newDeck, refresh: true } });
    } catch (err) {
      setError("Failed to save deck.");
      console.error("Error creating deck:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Create Deck</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Description:</label>
          <br />
          <textarea
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default AddDeck;
