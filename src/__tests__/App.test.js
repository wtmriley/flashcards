if (typeof window.MutationObserver === 'undefined') {
  window.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, options) {}
  };
}

import React from "react";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
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

require("cross-fetch/polyfill");

jest.mock("../utils/api");

describe("App", () => {
  beforeEach(() => {
    createCard.mockResolvedValue({
      front: "Default mock card front",
      back: "Default mock card back",
    });
    createDeck.mockResolvedValue({
      id: 1,
      name: "Default mock deck",
      description: "Description of the default mock deck",
    });
    deleteCard.mockResolvedValue({
      id: 1,
      name: "Default mock deck",
      description: "Description of the default mock deck",
    });
    deleteDeck.mockResolvedValue({
      id: 1,
      name: "Default mock deck",
      description: "Description of the default mock deck",
    });
    listDecks.mockResolvedValue([
      {
        id: 1,
        name: "Mock Rendering in React",
        description: "A deck for learning React",
        cards: [{ id: 1, front: "Card 1" }, { id: 2, front: "Card 2" }],
      },
    ]);
    readCard.mockResolvedValue({
      id: 1,
      front: "What is React?",
      back: "A JavaScript library for building user interfaces",
    });
    readDeck.mockResolvedValue({
      id: 1,
      name: "React Basics",
      description: "A deck for learning React basics",
      cards: [
        { id: 1, front: "What is JSX?", back: "JSX is a syntax extension for JavaScript" },
      ],
    });
    updateCard.mockResolvedValue({
      id: 1,
      front: "Updated front of the card",
      back: "Updated back of the card",
    });
    updateDeck.mockResolvedValue({
      id: 1,
      name: "Updated React Basics",
      description: "Updated description for React basics",
    });
  });

  test('landing on a bad page shows "Not Found" page', () => {

    render(
        <MemoryRouter initialEntries={["/some/bad/route"]}>
            <App />
        </MemoryRouter>      
    );
    expect(screen.findByText("Not Found")).toBeTruthy();
  });

  test("route for /", async () => {
    const mockDecks = [
      {
        id: 1,
        name: "Mock Rendering in React",
        description: "RIR",
        cards: [{ id: 2 }, { id: 3 }],
      },
      {
        name: "Mock React Router",
        description: "RR",
        id: 2,
        cards: [],
      },
    ];

    //const mockDecksPromise = Promise.resolve(mockDecks);

    //listDecks.mockImplementation(() => mockDecksPromise);
    listDecks.mockImplementation(() => Promise.resolve(mockDecks));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
            <App />
        </MemoryRouter>
      );
    });

    //await act(() => mockDecksPromise);
 
    expect(screen.findByText("Mock Rendering in React")).toBeTruthy();
    expect(screen.findByText("2 cards")).toBeTruthy();
    expect(screen.findByText("Mock React Router")).toBeTruthy();
    expect(screen.findByText("0 cards")).toBeTruthy();
  });
});