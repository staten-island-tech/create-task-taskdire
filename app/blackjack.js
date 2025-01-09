import { deck } from "/deck.js";

const dealerCardsContainer = document.getElementById("dealer-cards");
const playerCardsContainer = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let playerHand = [];
let dealerHand = [];
let deckIndex = 0;

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
    renderCards(playerHand, playerCardsContainer);
    setTimeout(() => {
      alert("You lose.");
      resetGame();
    }, 500);
  } else if (playerTotal === 21) {
    setTimeout(() => {
      alert("Player wins with a Blackjack!");
      resetGame();
    }, 300);
  } else if (dealerTotal === 21) {
    setTimeout(() => {
      alert("Dealer wins with a Blackjack!");
      resetGame();
    }, 300);
  }
};

const resetGame = () => {
  hitButton.disabled = false;
  standButton.disabled = false;
  playerHand = [];
  dealerHand = [];
  deckIndex = 0;
  dealCards();
};

const dealCards = () => {
  shuffleDeck(deck);
  playerHand = deck.slice(deckIndex, deckIndex + 2);
  dealerHand = deck.slice(deckIndex + 2, deckIndex + 4);
  deckIndex += 4;

  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer, true);

  updateScores();
};

hitButton.addEventListener("click", () => {
  playerHand.push(deck.slice(deckIndex, deckIndex + 1)[0]);
  deckIndex++;
  renderCards(playerHand, playerCardsContainer);
  updateScores();
});

standButton.addEventListener("click", () => {
  hitButton.disabled = true;
  standButton.disabled = true;

  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = dealerHand.reduce(
    (sum, card) => sum + getCardValue(card),
    0
  );
  while (dealerTotal <= 16) {
    dealerHand.push(deck.slice(deckIndex, deckIndex + 1)[0]);
    deckIndex++;
    dealerTotal = dealerHand.reduce((sum, card) => sum + getCardValue(card), 0);
    renderCards(dealerHand, dealerCardsContainer);
    updateScores();
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
