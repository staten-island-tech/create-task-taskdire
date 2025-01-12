import { deck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [],
  dealerHand = [],
  shuffledDeck = [];

const shuffleDeck = () => {
  shuffledDeck = [...deck.map(card => ({ ...card }))]; // Ensure a deep copy
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
};

const drawCard = () => shuffledDeck.length ? shuffledDeck.shift() : null;

const getCardValue = (card) => {
  if (card.value === "ACE") return 11;
  return Array.isArray(card.value) ? card.value[1] : card.value;
};

const adjustForAces = (hand) => {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter((card) => card.value === "ACE").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
};

const renderCards = (hand, container, hideSecondCard = false) => {
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const imgSrc = hideSecondCard && index === 1 ? "path/to/back-of-card.jpg" : card.image;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card"><img src="${imgSrc}" alt="${card.title}"></div>`
    );
  });
};

const updateScores = () => {
  const playerTotal = adjustForAces(playerHand);
  const dealerTotal = adjustForAces(dealerHand);
  playerSumDisplay.textContent = `Player Count: ${playerTotal}`;
  dealerSumDisplay.textContent = `Dealer Count: ${dealerTotal}`;
  if (playerTotal === 21) {
    setTimeout(() => {
      alert("Blackjack! You win!");
      resetGame();
    }, 300);
  } else if (dealerTotal === 21) {
    setTimeout(() => {
      alert("Dealer has Blackjack! You lose.");
      resetGame();
    }, 300);
  } else if (playerTotal > 21) {
    setTimeout(() => {
      alert("You bust! Dealer wins.");
      resetGame();
    }, 300);
  }
};

const resetGame = () => {
  hitButton.disabled = standButton.disabled = false;
  playerHand = [];
  dealerHand = [];
  shuffleDeck();
  dealerCardsContainer.innerHTML = playerCardsContainer.innerHTML = "";
  dealCards();
};

const dealCards = () => {
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer, true);
  updateScores();
};

hitButton.addEventListener("click", () => {
  playerHand.push(drawCard());
  renderCards(playerHand, playerCardsContainer);
  updateScores();
});

standButton.addEventListener("click", () => {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);
  setTimeout(() => {
    let dealerTotal = adjustForAces(dealerHand);
    while (dealerTotal <= 16) {
      dealerHand.push(drawCard());
      renderCards(dealerHand, dealerCardsContainer);
      dealerTotal = adjustForAces(dealerHand);
      updateScores();
    }
    const playerTotal = adjustForAces(playerHand);
    setTimeout(() => {
      if (dealerTotal > 21) alert("Dealer busts! You win.");
      else if (dealerTotal > playerTotal) alert("Dealer wins! You lose.");
      else if (dealerTotal === playerTotal) alert("Push!");
      else alert("You win!");
      resetGame();
    }, 300);
  }, 300);
});

resetGame();
