import { deck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [],
  dealerHand = [],
  deckIndex = 0;

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    [deck[i], deck[Math.floor(Math.random() * (i + 1))]] = [
      deck[Math.floor(Math.random() * (i + 1))],
      deck[i],
    ];
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
  playerHand = dealerHand = [];
  deckIndex = 0;
  dealerCardsContainer.innerHTML = playerCardsContainer.innerHTML = "";
  dealCards();
}

function dealCards() {
  shuffleDeck(deck);
  playerHand = [deck[deckIndex++], deck[deckIndex++]];
  dealerHand = [deck[deckIndex++], deck[deckIndex++]];
  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer);
  updateScores();
}

function playerHit() {
  playerHand.push(deck[deckIndex++]);
  renderCards(playerHand, playerCardsContainer);
  updateScores();
}

function dealerPlay() {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = adjustForAces(dealerHand);

  setTimeout(() => {
    while (dealerTotal <= 16) {
      dealerHand.push(deck[deckIndex++]);
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
}

function addEventListeners() {
  hitButton.addEventListener("click", playerHit);
  standButton.addEventListener("click", dealerPlay);
}

function initializeGame() {
  addEventListeners();
  dealCards();
}

initializeGame();
