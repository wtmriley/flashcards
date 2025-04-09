import React from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Route, Routes } from "react-router-dom";
import Deck from "../utils/class-names/deck";
import { useEffect, useState } from "react";
import { listDecks } from "../utils/api";
import DeckList from "../utils/class-names/deckList";
import EditCard from "../utils/class-names/editCard";
import Card from "../utils/class-names/card";
import Study from "../utils/class-names/study";
import AddCards from "../utils/class-names/addCards";
import EditDeck from "../utils/class-names/editDeck";
import NewDeck from "../utils/class-names/newDeck";

function Layout() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await listDecks(); 
        setDecks(data);

      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    }
    fetchDecks();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<DeckList decks={decks} />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="/decks/:deckId/edit" element={<EditDeck />} />
          <Route path ="/decks/:deckId/cards" element={<Card />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/decks/:deckId/study" element={<Study />} />
          <Route path="/decks/:deckId/cards/new" element={<AddCards />} />
          <Route path="/decks/new" element={<NewDeck />} />
        </Routes>
      </div>
    </>
  );
}

export default Layout;
