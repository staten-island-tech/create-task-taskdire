import { deck as originalDeck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [],
  dealerHand = [],
  remainingDeck = [];

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (card.value === "ACE") return 11;
  return Array.isArray(card.value) ? card.value[1] : card.value;
}

function adjustForAces(hand) {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter((card) => card.value === "ACE").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function renderCards(hand, container) {
  container.innerHTML = "";
  hand.forEach((card) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card"><img src="${card.image}" alt="${card.title}"></div>`
    );
  });
}

function updateScores() {
  const playerTotal = adjustForAces(playerHand);
  const dealerTotal = adjustForAces(dealerHand);
  playerSumDisplay.textContent = `Player Count: ${playerTotal}`;
  dealerSumDisplay.textContent = `Dealer Count: ${dealerTotal}`;

  if (playerTotal > 21) {
    setTimeout(() => {
      alert("You bust! Dealer wins.");
      resetGame();
    }, 300);
  }
}

function resetGame() {
  hitButton.disabled = standButton.disabled = false;
  playerHand = [];
  dealerHand = [];
  remainingDeck = [...originalDeck];
  shuffleDeck(remainingDeck);
  dealerCardsContainer.innerHTML = "";
  playerCardsContainer.innerHTML = "";
  dealCards();
}

function drawCard() {
  return remainingDeck.length > 0 ? remainingDeck.pop() : null;
}

function dealCards() {
  remainingDeck = [...originalDeck];
  shuffleDeck(remainingDeck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer);
  updateScores();
}

function playerHit() {
  const card = drawCard();
  if (card) {
    playerHand.push(card);
    renderCards(playerHand, playerCardsContainer);
    updateScores();
  }
}

function dealerPlay() {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = adjustForAces(dealerHand);

  setTimeout(() => {
    while (dealerTotal <= 16) {
      const card = drawCard();
      if (card) {
        dealerHand.push(card);
        renderCards(dealerHand, dealerCardsContainer);
        dealerTotal = adjustForAces(dealerHand);
        updateScores();
      } else {
        break;
      }
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
}

function addEventListeners() {
  hitButton.addEventListener("click", playerHit);
  standButton.addEventListener("click", dealerPlay);
}

function initializeGame() {
  remainingDeck = [...originalDeck];
  shuffleDeck(remainingDeck);
  addEventListeners();
  dealCards();
}

initializeGame();
