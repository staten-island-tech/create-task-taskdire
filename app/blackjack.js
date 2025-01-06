import { deck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [];
let dealerHand = [];

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (Array.isArray(card.value)) {
    return card.value[1];
  }
  return card.value;
}

function dealCards() {
  shuffleDeck(deck);

  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  displayCards();

  // Check if the dealer has 21 at the start
  const dealerTotal = dealerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );
  if (dealerTotal === 21) {
    setTimeout(() => {
      alert("Dealer has a Blackjack! Dealer wins!");
      resetGame();
    }, 300); // Delay alert until after cards are displayed
  }

  // Check if the player has 21 at the start
  const playerTotal = playerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );
  if (playerTotal === 21) {
    setTimeout(() => {
      alert("Player has a Blackjack! Player wins!");
      resetGame();
    }, 300); // Delay alert until after cards are displayed
  }
}

function displayCards() {
  playerCardsContainer.innerHTML = "";
  dealerCardsContainer.innerHTML = "";

  playerHand.forEach((card) => {
    playerCardsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="card w-1/6 h-[400px] bg-red-500 rounded-3xl flex flex-col items-center justify-evenly m-2 border-2 border-black">  
        <img src="${card.image}" alt="${card.title}" class="card-img rounded-3xl w-50% h-50%">
      </div>`
    );
  });

  dealerHand.forEach((card, index) => {
    let cardHTML = `
      <div class="card w-1/6 h-[400px] bg-red-500 rounded-3xl flex flex-col items-center justify-evenly m-2 border-2 border-black">
        <img src="${
          index === 1 ? "path/to/back-of-card.jpg" : card.image
        }" alt="${card.title}" class="card-img rounded-3xl w-50% h-50%">
      </div>
    `;
    dealerCardsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  updateScores();
}

function updateScores() {
  const playerTotal = playerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );
  const dealerTotal = dealerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );

  playerSumDisplay.textContent = `Player Count: ${playerTotal}`;
  dealerSumDisplay.textContent = `Dealer Count: ${dealerTotal}`;

  if (playerTotal > 21) {
    alert("Player bust! You lose.");
    resetGame();
  }
}

function resetGame() {
  hitButton.disabled = true;
  standButton.disabled = true;

  playerCardsContainer.innerHTML = "";
  dealerCardsContainer.innerHTML = "";

  setTimeout(() => {
    playerHand = [];
    dealerHand = [];
    dealCards();
    hitButton.disabled = false;
    standButton.disabled = false;
  }, 0);
}

hitButton.addEventListener("click", () => {
  playerHand.push(deck.pop());
  displayCards();
});

standButton.addEventListener("click", () => {
  hitButton.disabled = true;
  standButton.disabled = true;

  dealerCardsContainer.innerHTML = "";
  dealerHand.forEach((card, index) => {
    const cardHTML = `
      <div class="card w-1/6 h-[400px] bg-red-500 rounded-3xl flex flex-col items-center justify-evenly m-2 border-2 border-black">
        <img src="${card.image}" alt="${card.title}" class="card-img rounded-3xl w-50% h-50%">
      </div>
    `;
    dealerCardsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  let dealerTotal = dealerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );

  // Dealer hits if their total is 16 or less
  while (dealerTotal <= 16) {
    dealerHand.push(deck.pop());
    dealerTotal = dealerHand.reduce((sum, card) => sum + getCardValue(card), 0);
    displayCards(); // Update cards after each hit
  }

  const playerTotal = playerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );

  // After displaying all dealer cards, now show the result
  setTimeout(() => {
    if (dealerTotal > 21) {
      alert("Dealer bust! You win!");
    } else if (dealerTotal > playerTotal) {
      alert("Dealer wins! You lose.");
    } else if (dealerTotal === playerTotal) {
      alert("Push!");
    } else {
      alert("You win!");
    }

    resetGame();
  }, 300); // Delay alert until after cards are fully displayed
});

dealCards();
