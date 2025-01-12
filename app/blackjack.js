import { deck } from "/deck.js";

function getDealerCardsContainer() {
  return document.getElementById("dealer-cards");
}

function getPlayerCardsContainer() {
  return document.getElementById("player-cards");
}

function getDealerSumDisplay() {
  return document.getElementById("dealer-sum");
}

function getPlayerSumDisplay() {
  return document.getElementById("player-sum");
}

function getHitButton() {
  return document.getElementById("hit-button");
}

function getStandButton() {
  return document.getElementById("stand-button");
}

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
  getPlayerSumDisplay().textContent = `Player Count: ${playerTotal}`;
  getDealerSumDisplay().textContent = `Dealer Count: ${dealerTotal}`;

  if (playerTotal > 21) {
    setTimeout(() => {
      alert("You bust! Dealer wins.");
      resetGame();
    }, 300);
  }
}

function resetGame() {
  getHitButton().disabled = getStandButton().disabled = false;
  playerHand = dealerHand = [];
  deckIndex = 0;
  getDealerCardsContainer().innerHTML = getPlayerCardsContainer().innerHTML = "";
  dealCards();
}

function dealCards() {
  shuffleDeck(deck);
  playerHand = deck.slice(deckIndex, deckIndex + 2);
  dealerHand = deck.slice(deckIndex + 2, deckIndex + 4);
  deckIndex += 4;
  renderCards(playerHand, getPlayerCardsContainer());
  renderCards(dealerHand, getDealerCardsContainer(), true);
  updateScores();
}

function playerHit() {
  playerHand.push(deck[deckIndex++]);
  renderCards(playerHand, getPlayerCardsContainer());
  updateScores();
}

function dealerPlay() {
  getHitButton().disabled = getStandButton().disabled = true;
  renderCards(dealerHand, getDealerCardsContainer());

  let dealerTotal = adjustForAces(dealerHand);

  setTimeout(() => {
    while (dealerTotal <= 16) {
      dealerHand.push(deck[deckIndex++]);
      renderCards(dealerHand, getDealerCardsContainer());
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

getHitButton().addEventListener("click", playerHit);
getStandButton().addEventListener("click", dealerPlay);

dealCards();
