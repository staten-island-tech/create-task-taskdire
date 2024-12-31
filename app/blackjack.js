import "/style.css";
import { deck } from "/deck";

const Domselectors = {
  box: document.querySelector(".container"),
};

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (Array.isArray(card.value)) {
    return ard.value[1];
  }
  return card.value;
}


/* 
create 2 cards faced up on players side 

 2 cards on dealers side - 1 faced up - 1 faced down 

 record values in a form 

 wait for players respone 

 make a hit and stand button 

if hit add a card faced up on players side - record value -> if not over 21 ask player if they want to hit again - if over 21 "you busted" ->  wipe all cards on screen and repeat first 4 steps  
 
if stand have both values compared and which ever one is the highest wins( if player value is higher "you win" if dealer higher "you lose") -> wipe all cards on screen and repeat first 4 steps








*/

