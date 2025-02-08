import Header from "./Header";
import NotFound from "./NotFound";
import { Route, Routes, useLocation } from "react-router-dom";
import Deck from "../utils/class-names/deck";
import { useEffect, useState, React } from "react";
import { listDecks } from "../utils/api";
import DeckList from "../utils/class-names/deckList";
import EditCard from "../utils/class-names/editCard";

function Layout() {
  const [decks, setDecks] = useState([]);
  const location = useLocation();
  console.log("Current Path:", location.pathname);

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
          <Route path="/" element={<DeckList />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
        </Routes>
      </div>
    </>
  );
}

export default Layout;
