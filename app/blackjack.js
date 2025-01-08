import { deck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [];
let dealerHand = [];

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const getCardValue = (card) =>
  Array.isArray(card.value) ? card.value[1] : card.value;

const renderCards = (hand, container, hideSecondCard = false) => {
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const imgSrc =
      hideSecondCard && index === 1 ? "path/to/back-of-card.jpg" : card.image;
    const cardHTML = `
      <div class="card w-1/6 h-[400px] bg-red-500 rounded-3xl flex flex-col items-center justify-evenly m-2 border-2 border-black">
        <img src="${imgSrc}" alt="${card.title}" class="card-img rounded-3xl w-50% h-50%">
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
};

const updateScores = () => {
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
    alert("You lose.");
    resetGame();
  } else if (playerTotal === 21) {
    alert("Player wins with a Blackjack!");
    resetGame();
  } else if (dealerTotal === 21) {
    alert("Dealer wins with a Blackjack!");
    resetGame();
  }
};

const resetGame = () => {
  hitButton.disabled = false;
  standButton.disabled = false;
  playerHand = [];
  dealerHand = [];
  dealCards();
};

const dealCards = () => {
  shuffleDeck(deck);
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer, true);

  updateScores(); // Ensure the initial scores are updated
};

hitButton.addEventListener("click", () => {
  playerHand.push(deck.pop());
  renderCards(playerHand, playerCardsContainer);
  updateScores(); // Update the score after a hit
});

standButton.addEventListener("click", () => {
  hitButton.disabled = true;
  standButton.disabled = true;

  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = dealerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );
  // Dealer hits if their total is 16 or less
  while (dealerTotal <= 16) {
    const newCard = deck.pop();
    dealerHand.push(newCard);
    dealerTotal = dealerHand.reduce((sum, card) => sum + getCardValue(card), 0);
    renderCards(dealerHand, dealerCardsContainer);
    updateScores(); // Ensure the score updates after each dealer card is added
  }

  const playerTotal = playerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );

  setTimeout(() => {
    if (dealerTotal > 21) {
      alert("Dealer busts! You win.");
    } else if (dealerTotal > playerTotal) {
      alert("Dealer wins! You lose.");
    } else if (dealerTotal === playerTotal) {
      alert("Push!");
    } else {
      alert("You win!");
    }
    resetGame();
  }, 300);
});

dealCards();

// when the player busts let the value and card show up before the alert pops up and restart the entire game
