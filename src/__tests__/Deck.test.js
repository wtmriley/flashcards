if (typeof window.MutationObserver === 'undefined') {
  window.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, options) {}
  };
}

/* eslint-disable testing-library/no-node-access */
import React from "react";
import { act } from "react";
import { render, screen,  } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import "@testing-library/jest-dom/extend-expect";
import {
    createCard,
    createDeck,
    deleteCard,
    deleteDeck,
    listDecks,
    readCard,
    readDeck,
    updateCard,
    updateDeck,
} from "../utils/api";
import userEvent from "@testing-library/user-event";


require("cross-fetch/polyfill");

jest.mock("../utils/api");

describe("Decks", ()=>{
    beforeEach(() => {
        createCard.mockResolvedValue({
          front:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        createDeck.mockResolvedValue({
          name:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        deleteCard.mockResolvedValue({
          front:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        deleteDeck.mockResolvedValue({
          name:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        listDecks.mockResolvedValue([
          {
            front:
              "Default mock response. If you see this, you probably do not need this API call.",
          },
        ]);
        readCard.mockResolvedValue({
          front:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        readDeck.mockResolvedValue({
          name:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        updateCard.mockResolvedValue({
          front:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
        updateDeck.mockResolvedValue({
          name:
            "Default mock response. If you see this, you probably do not need this API call.",
        });
      });

      test("route for /decks/:deckId", async () => {
        const mockDeck = {
          name: "Mock Deck 3",
          description: "MD",
          id: 3,
          cards: [
            {
              id: 4,
              front: "What has ears but cannot hear?",
              back: "A cornfield.",
              deckId: 3,
            },
          ],
        };
    
        readDeck.mockResolvedValue(mockDeck);
        render(
          <MemoryRouter initialEntries={["/decks/3"]}>
            <App />
          </MemoryRouter>
        );
    
        const titleElements = await screen.findAllByText("Mock Deck 3");
        expect(titleElements.length).toBeGreaterThanOrEqual(1);
    
        expect(screen.getByText("What has ears but cannot hear?")).toBeTruthy();
        expect(screen.getByText("A cornfield.")).toBeTruthy();
      });

      test("route for /decks/new", async () => {
        render(
          <MemoryRouter initialEntries={["/decks/new"]}>
            <App />
          </MemoryRouter>
        );
      
        const titleElements = await screen.findAllByText("Create Deck");
        expect(titleElements.length).toBeGreaterThanOrEqual(1);
      
        const inputs = document.querySelectorAll("input");
        expect(inputs).toHaveLength(1);
              
        const textAreas = document.querySelectorAll("textarea");
        expect(textAreas).toHaveLength(1);
      });

      test("route for /decks/:deckId/edit", async () => {
        const mockDeck = {
          name: "Mock Deck 33",
          description: "MD33",
          id: 33,
          cards: [],
        };
      
        readDeck.mockResolvedValue(mockDeck);
      
        render(
          <MemoryRouter initialEntries={["/decks/33/edit"]}>
            <App />
          </MemoryRouter>
        );
      
        const nameInput = await screen.findByDisplayValue("Mock Deck 33");
        expect(nameInput).toBeTruthy();
      
        const descriptionInput = await screen.findByDisplayValue("MD33");
        expect(descriptionInput).toBeTruthy();
      });

      test("route for /decks/:deckId/cards/new", async () => {
        const mockDeck = {
          name: "Mock squash",
          description: "MS",
          id: 4,
          cards: [],
        };
      
        readDeck.mockResolvedValue(mockDeck);
      
        render(
          <MemoryRouter initialEntries={["/decks/4/cards/new"]}>
            <App />
          </MemoryRouter>
        );
      
        const deckNameElements = await screen.findAllByText(/Mock squash/i);
        expect(deckNameElements.length).toBeGreaterThanOrEqual(1);
      
        const titleElements = await screen.findAllByText(/Add Card/i);
        expect(titleElements.length).toBeGreaterThanOrEqual(1);
      
        const textAreas = document.querySelectorAll("textarea");
        expect(textAreas).toHaveLength(2);
      });
    
      test("route for /decks/:deckId/cards/:cardId/edit", async () => {
        const cardTen = {
          id: 10,
          front: "What did the left eye say to the right eye?",
          back: "Between us, something smells!",
          deckId: 8,
        };
      
        const mockDeck = {
          name: "Mock invite",
          description: "MI",
          id: 8,
          cards: [
            {
              id: 9,
              front: "What has ears but cannot hear?",
              back: "A cornfield.",
              deckId: 8,
            },
            cardTen,
          ],
        };
      
        readDeck.mockResolvedValue(mockDeck);
        readCard.mockResolvedValue(cardTen);
      
        render(
          <MemoryRouter initialEntries={["/decks/9/cards/10/edit"]}>
            <App />
          </MemoryRouter>
        );
      
        const frontTextArea = await screen.findByDisplayValue(
          "What did the left eye say to the right eye?"
        );
        expect(frontTextArea).toBeInTheDocument();
      });

      test("route for /decks/:deckId/study", async () => {
        const mockDeck = {
          name: "Mock Study Deck 42",
          description: "MDS42",
          id: 42,
          cards: [
            {
              id: 43,
              front: "What did one plate say to the other plate?",
              back: "Dinner is on me!",
              deckId: 42,
            },
            {
              id: 44,
              front: "Why did the student eat his homework?",
              back: "Because the teacher told him it was a piece of cake!",
              deckId: 42,
            },
            {
              id: 45,
              front: "What did the Dalmatian say after lunch?",
              back: "That hit the spot!",
              deckId: 42,
            },
          ],
        };
      
        readDeck.mockResolvedValue(mockDeck);
      
        render(
          <MemoryRouter initialEntries={["/decks/42/study"]}>
            <App />
          </MemoryRouter>
        );
      
        const deckName = await screen.findByText("Mock Study Deck 42");
        expect(deckName).toBeInTheDocument();
      
        const cardCount = screen.findByText(/Card 1 of 3/i);
        expect(cardCount).toBeTruthy();
      
        const flipButton = screen.findByText(/flip/i);
        expect(flipButton).toBeTruthy();
      
        const nextButton = screen.queryByText(/next/i);
        expect(nextButton).toBeFalsy();
      });
    
      test("route for /decks/:deckId/study clicking flip shows next button", async () => {
        const mockDeck = {
          name: "Mock Study Deck 73",
          description: "MDS42",
          id: 73,
          cards: [
            {
              id: 74,
              front: "What do you call a droid that takes the long way around?",
              back: "R2 detour.",
              deckId: 73,
            },
            {
              id: 75,
              front: "Why was 6 afraid of 7?",
              back: "Because 7, 8 (ate), 9",
              deckId: 42,
            },
            {
              id: 76,
              front: "When does a joke become a “dad” joke?",
              back: "When the punchline is a parent.",
              deckId: 73,
            },
          ],
        };
      
        readDeck.mockResolvedValue(mockDeck);
      
        render(
          <MemoryRouter initialEntries={["/decks/73/study"]}>
            <App />
          </MemoryRouter>
        );
      
        await screen.findByText("Mock Study Deck 73");
      
        expect(screen.queryByText(/next/i)).toBeFalsy();
      
        await act(async () => {
          userEvent.click(screen.getByText(/flip/i));
        });
      
      });

      test("route for /decks/:deckId/study not enough cards", async () => {
        const mockDeck = {
          name: "Mock Study Deck 13",
          description: "MDS13",
          id: 13,
          cards: [],
        };
      
        readDeck.mockResolvedValue(mockDeck);
      
        render(
          <MemoryRouter initialEntries={["/decks/13/study"]}>
            <App />
          </MemoryRouter>
        );
      
        const deckName = await screen.findAllByText(/Mock Study Deck 13/i);
        expect(deckName).toBeTruthy();
      
        const notEnoughCards = await screen.findByText(/Not enough cards/i);
        expect(notEnoughCards).toBeTruthy();
      });
})