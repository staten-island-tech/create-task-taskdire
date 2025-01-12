import { deck } from "/deck.js";

let playerHand = [],
  dealerHand = [],
  shuffledDeck = [];

function shuffleDeck() {
  shuffledDeck = [...deck.map(card => ({ ...card }))];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
}

function drawCard() {
  return shuffledDeck.length ? shuffledDeck.shift() : null;
}

function getCardValue(card) {
  if (card.value === "ACE") return 11;
  if (typeof card.value === "string") return 10;
  return card.value;
}

function adjustForAces(hand) {
  let total = 0;
  let aces = 0;
  
  hand.forEach(card => {
    let cardValue = getCardValue(card);
    if (card.value === "ACE") {
      aces++;
    }
    total += cardValue;
  });
  
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  
  return total;
}

function renderCards(hand, container) {
  container.innerHTML = "";
  hand.forEach(card => {
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

  if (playerTotal === 21 && playerHand.length === 2) {
    handleBlackjack("Player");
  } else if (dealerTotal === 21 && dealerHand.length === 2) {
    handleBlackjack("Dealer");
  } else if (playerTotal > 21) {
    handleBust("Player");
  }
}

function handleBlackjack(winner) {
  setTimeout(() => {
    alert(`${winner} has Blackjack! ${winner === "Player" ? "You win!" : "You lose."}`);
    resetGame();
  }, 300);
}

function handleBust(loser) {
  setTimeout(() => {
    alert(`${loser} busts! Dealer wins.`);
    resetGame();
  }, 300);
}

function resetGame() {
  hitButton.disabled = standButton.disabled = false;
  playerHand = [];
  dealerHand = [];
  shuffleDeck();
  dealerCardsContainer.innerHTML = playerCardsContainer.innerHTML = "";
  dealCards();
}

function dealCards() {
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderCards(playerHand, playerCardsContainer);
  renderCards(dealerHand, dealerCardsContainer);
  updateScores();
}

function playerHit() {
  playerHand.push(drawCard());
  renderCards(playerHand, playerCardsContainer);
  updateScores();
}

function dealerPlay() {
  hitButton.disabled = standButton.disabled = true;
  renderCards(dealerHand, dealerCardsContainer);
  setTimeout(() => {
    let dealerTotal = adjustForAces(dealerHand);
    while (dealerTotal < 17) {
      dealerHand.push(drawCard());
      renderCards(dealerHand, dealerCardsContainer);
      dealerTotal = adjustForAces(dealerHand);
      updateScores();
    }
    determineWinner(dealerTotal);
  }, 300);
}

function determineWinner(dealerTotal) {
  const playerTotal = adjustForAces(playerHand);
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
}

hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", dealerPlay);

resetGame();
