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

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    [deck[i], deck[Math.floor(Math.random() * (i + 1))]] = [
      deck[Math.floor(Math.random() * (i + 1))],
      deck[i],
    ];
  }
};

// Update the getCardValue function to handle Aces correctly
const getCardValue = (card) => {
  if (card.value === "ACE") return 11; // Initially, treat Ace as 11
  return Array.isArray(card.value) ? card.value[1] : card.value;
};

// Adjust the total score by converting Ace from 11 to 1 if necessary
const adjustForAces = (hand) => {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter((card) => card.value === "ACE").length;

  // If the total exceeds 21, reduce Ace's value from 11 to 1
  while (total > 21 && aces > 0) {
    total -= 10; // Change one Ace from 11 to 1
    aces--;
  }

  return total;
};

const renderCards = (hand, container, hideSecondCard = false) => {
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const imgSrc =
      hideSecondCard && index === 1 ? "path/to/back-of-card.jpg" : card.image;
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

  // Check for player bust
  if (playerTotal > 21) {
    setTimeout(() => {
      alert("You bust! Dealer wins.");
      resetGame();
    }, 300);
  }
};

const resetGame = () => {
  hitButton.disabled = standButton.disabled = false;
  playerHand = dealerHand = [];
  deckIndex = 0;
  dealerCardsContainer.innerHTML = playerCardsContainer.innerHTML = "";
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
  playerHand.push(deck[deckIndex++]);
  renderCards(playerHand, playerCardsContainer);
  updateScores();
});

standButton.addEventListener("click", () => {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);

  let dealerTotal = adjustForAces(dealerHand);

  // Ensure dealer's cards update and dealer's total is calculated
  setTimeout(() => {
    while (dealerTotal <= 16) {
      dealerHand.push(deck[deckIndex++]);
      renderCards(dealerHand, dealerCardsContainer);
      dealerTotal = adjustForAces(dealerHand);
      updateScores(); // Update dealer count after each card is drawn
    }

    const playerTotal = adjustForAces(playerHand);
    setTimeout(() => {
      if (dealerTotal > 21) alert("Dealer busts! You win.");
      else if (dealerTotal > playerTotal) alert("Dealer wins! You lose.");
      else if (dealerTotal === playerTotal) alert("Push!");
      else alert("You win!");
      resetGame();
    }, 300); // Giving enough time for the dealer's hand to be displayed
  }, 300); // Allow dealer's hand to be revealed and totals to update
});

dealCards();
