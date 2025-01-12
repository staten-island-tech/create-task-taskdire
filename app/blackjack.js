import { deck } from "/deck.js";

// Keep the DOM elements as constants
const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [],
  dealerHand = [];

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    [deck[i], deck[Math.floor(Math.random() * (i + 1))]] = [
      deck[Math.floor(Math.random() * (i + 1))],
      deck[i],
    ];
  }
}

function getCardValue(card) {
  if (card.value === "ACE") return 11; // Initially, treat Ace as 11
  return Array.isArray(card.value) ? card.value[1] : card.value;
}

function adjustForAces(hand) {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter((card) => card.value === "ACE").length;

  // If the total exceeds 21, reduce Ace's value from 11 to 1
  while (total > 21 && aces > 0) {
    total -= 10; // Change one Ace from 11 to 1
    aces--;
  }

  return total;
}

function renderCards(hand, container, hideSecondCard = false) {
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const imgSrc =
      hideSecondCard && index === 1 ? "path/to/back-of-card.jpg" : card.image;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card"><img src="${imgSrc}" alt="${card.title}"></div>`
    );
  });
}

function updateScores() {
  const playerTotal = adjustForAces(playerHand);
  const dealerTotal = adjustForAces(dealerHand);
  playerSumDisplay.textContent = `Player Count: ${playerTotal}`;
  dealerSumDisplay.textContent = `Dealer Count: ${dealerTotal}`;

  // Check for player bust
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
  dealerCardsContainer.innerHTML = playerCardsContainer.innerHTML = "";
  dealCards();
}

function dealCards() {
  shuffleDeck(deck);
  // Deal two cards to the player and two to the dealer, removing cards from the deck
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer, true);
  updateScores();
}

function playerHit() {
  // Draw a card and remove it from the deck
  playerHand.push(deck.pop());
  renderCards(playerHand, playerCardsContainer);
  updateScores();
}

function dealerPlay() {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = adjustForAces(dealerHand);

  setTimeout(() => {
    while (dealerTotal <= 16) {
      dealerHand.push(deck.pop());
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

hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", dealerPlay);

dealCards();
