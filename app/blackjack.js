import "/style.css";
import { deck } from "/deck";

const Domselectors = {
  box: document.querySelector(".container"),
};

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (Array.isArray(card.value)) {
    return ard.value[1];
  }
  return card.value;
}
