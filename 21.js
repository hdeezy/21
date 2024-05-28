class Card {
  constructor(id) {
    this.id = id;
    if (typeof id === "string") {
      this.suit = id.substring(0, 1);
    } else {
      console.error("Error: Invalid or undefined id.");
      // Handle the situation when id is not a valid string
    }
    this.number = id.substring(1, id.length);
  }
  myValue(handValue) {
    if (["Q", "K", "J"].includes(this.number)) return 10;
    else if (this.number === "A") {
      return handValue + 11 > 21 ? 1 : 11;
    } else if (this.number === "10") {
      return 10;
    } else return Number(this.number);
  }
}

class Deck {
  constructor() {
    let suits = ["S", "C", "D", "H"];
    let numbers = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "K",
      "Q",
      "J",
    ];
    this.cards = [];
    this.discard = [];
    for (let suit of suits) {
      for (let number of numbers) {
        this.cards.push(new Card(suit + number));
      }
    }
    this.shuffle();
  }
  // shuffle(){
  //     let shuffled = [];
  //     let key = [];
  //     for (let i = 0; i < this.cards.length; i++){
  //         key[i] = i;
  //     }
  //     for (let i = 0; i < this.cards.length; i++){
  //         // select random remaining key
  //         let r = Math.random()*(this.cards.length-i)
  //         // put random card from the deck
  //         // into the new shuffled pile
  //         shuffled.push(this.cards[key[i]])
  //         // remove the card from the draw key
  //         key.splice(r,1);
  //     }
  //     this.cards = shuffled;
  // }
  shuffle() {
    // Fisher-Yates Shuffle Algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  draw() {
    if (this.cards.length === 1) {
      let c = this.cards[0];
      this.cards = this.discard;
      this.discard = [];
      this.shuffle();
      return c;
    } else if (this.cards.length === 0) {
      this.cards = this.discard;
      this.discard = [];
      this.shuffle();
      return this.cards.pop();
    } else if (this.cards.length > 1) {
      let r = Math.floor(Math.random() * this.cards.length);
      let c = new Card(this.cards[r].id);
      this.cards.splice(r, 1);
      return c;
    }
  }
}
//console.log(`Card: ${card.id}, Value:${card.myValue()}`);
class Hand {
  constructor() {
    this.cards = [];
    this.value = 0;
  }
  addCard(card) {
    this.value += card.myValue(this.value);
    this.cards.push(card);
  }
  str() {
    let handStr = "";
    if (this.cards.length < 1) return handStr;
    else {
      for (let card of this.cards) {
        handStr += card.id + " ";
      }
      return handStr;
    }
  }
}
class Game21 {
  constructor() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealerHand = new Hand();
    this.playerHand = new Hand();
    this.dealerHand.addCard(this.deck.draw());
    this.playerHand.addCard(this.deck.draw());
    this.playerHand.addCard(this.deck.draw());
    this.winner = "";
    this.checkWin();
  }
  discardHands() {
    this.deck.discard = this.deck.discard.concat(
      this.playerHand.cards,
      this.dealerHand.cards
    );
    this.playerHand.cards = [];
    this.playerHand.value = 0;
    this.dealerHand.cards = [];
    this.dealerHand.value = 0;
  }
  checkWin() {
    if (this.playerHand.value === 21) {
      if (this.dealerHand === 21) {
        this.winner = "n";
      } else this.winner = "p";
    } else if (this.dealerHand.value === 21) {
      this.winner = "d";
    } else if (this.dealerHand.value > 21) {
      if (this.playerHand.value > 21) {
        this.winner = "n";
      } else this.winner = "p";
    } else if (this.playerHand.value > 21) {
      this.winner = "d";
    }
  }
  checkWin2() {
    if (this.playerHand.value === 21) {
      if (this.dealerHand.value === 21) this.winner = "n";
      else this.standPlay();
    } else if (this.dealerHand.value === 21) {
      this.winner = "d";
    } else if (this.dealerHand.value > 21) {
      if (this.playerHand.value > 21) this.winner = "n";
      else this.winner = "p";
    } else if (this.playerHand.value > 21) {
      this.winner = "d";
    } else if (this.playerHand.value === this.dealerHand.value) {
      this.winner = "n";
    } else if (this.playerHand.value > this.dealerHand.value) {
      this.winner = "p";
    } else if (this.playerHand.value < this.dealerHand.value) {
      this.winner = "d";
    }
  }
  hitPlay() {
    this.playerHand.addCard(this.deck.draw());
    this.checkWin();
  }
  standPlay() {
    let before = this.dealerHand.value;
    while (this.dealerHand.value < 17)
      this.dealerHand.addCard(this.deck.draw());
    this.checkWin2();
  }
  new() {
    this.winner = "";
    this.discardHands();
    this.dealerHand.addCard(this.deck.draw());
    this.playerHand.addCard(this.deck.draw());
    this.playerHand.addCard(this.deck.draw());
    this.checkWin();
  }
}

// function id2unicode(id) {
//   const suit = { S: "A", H: "B", D: "C", C: "D" };
//   const number = {
//     A: "1",
//     2: "2",
//     3: "3",
//     4: "4",
//     5: "5",
//     6: "6",
//     7: "7",
//     8: "8",
//     9: "9",
//     10: "A",
//     J: "B",
//     Q: "D",
//     K: "E",
//   };
//   console.log(id);
//   let ret = String.fromCharCode(parseInt("\\u1F0" + suit[id.charAt(0)] + number[id.slice(1)],16))
//   return ret;
// }

const id2unicode = {
  SA: "🂡",
  S2: "🂢",
  S3: "🂣",
  S4: "🂤",
  S5: "🂥",
  S6: "🂦",
  S7: "🂧",
  S8: "🂨",
  S9: "🂩",
  S10: "🂪",
  SJ: "🂫",
  SQ: "🂭",
  SK: "🂮",
  HA: "🂱",
  H2: "🂲",
  H3: "🂳",
  H4: "🂴",
  H5: "🂵",
  H6: "🂶",
  H7: "🂷",
  H8: "🂸",
  H9: "🂹",
  H10: "🂺",
  HJ: "🂻",
  HQ: "🂽",
  HK: "🂾",
  DA: "🃁",
  D2: "🃂",
  D3: "🃃",
  D4: "🃄",
  D5: "🃅",
  D6: "🃆",
  D7: "🃇",
  D8: "🃈",
  D9: "🃉",
  D10: "🃊",
  DJ: "🃋",
  DQ: "🃍",
  DK: "🃎",
  CA: "🃑",
  C2: "🃒",
  C3: "🃓",
  C4: "🃔",
  C5: "🃕",
  C6: "🃖",
  C7: "🃗",
  C8: "🃘",
  C9: "🃙",
  C10: "🃚",
  CJ: "🃛",
  CQ: "🃝",
  CK: "🃞",
};

const controlPanel = document.getElementById("controls");
// const hitButton = document.getElementById("hitButton");
// const standButton = document.getElementById("standButton");
// const newGameButton = document.getElementById("newGame");

const hitButton = document.createElement("button");
const standButton = document.createElement("button");
const newGameButton = document.createElement("button");

hitButton.textContent = "Hit";
standButton.textContent = "Stand";
newGameButton.id = "newGame";

hitButton.textContent = "Hit";

standButton.textContent = "Stand";
newGameButton.textContent = "Deal";

const dealerHand = document.getElementById("dealerHand");
const playerHand = document.getElementById("playerHand");
const deckSize = document.getElementById("deckSize");

//metascore
let playerWins = 0;
let dealerWins = 0;

const game = new Game21();

function replaceSuits(idtext) {
  idtext = idtext.replace(new RegExp("S", "g"), "\u2660");
  idtext = idtext.replace(new RegExp("H", "g"), "\u2665");
  idtext = idtext.replace(new RegExp("D", "g"), "\u2666");
  idtext = idtext.replace(new RegExp("C", "g"), "\u2663");
  return idtext;
}
function updateGui() {
  newGameButton.removeEventListener("click", resetGame);

  dealerHand.innerHTML = "";
  playerHand.innerHTML = "";

  // Update dealer's hand
  if (game.dealerHand.cards.length > 0) {
    for (let card of game.dealerHand.cards) {
      const cardDiv = document.createElement("ins");
      cardDiv.className = "card";
      cardDiv.textContent = replaceSuits(card.id);
      dealerHand.appendChild(cardDiv);
    }
    document.getElementById("dealerScore").innerText = game.dealerHand.value;
  } else {
    document.getElementById("dealerScore").innerText = "0";
  }
  // Update player's hand
  if (game.playerHand.cards.length > 0) {
    for (let card of game.playerHand.cards) {
      let cardDiv = document.createElement("ins");
      cardDiv.className = "card";
      cardDiv.textContent = replaceSuits(card.id);
      playerHand.appendChild(cardDiv);
    }
    document.getElementById("playerScore").innerText = game.playerHand.value;
  } else {
    document.getElementById("playerScore").innerText = "0";
  }

  // Update deck size
  if (game.deck.cards.length === 1) {
    deckSize.innerText = "1 card left in the deck";
  } else
    deckSize.innerText =
      game.deck.cards.length.toString() + " cards left in the deck";

  // Update game message and handle game end
  if (game.winner !== "") {
    controlPanel.innerHTML = "";
    controlPanel.appendChild(newGameButton);
    newGameButton.addEventListener("click", resetGame);
    navigator.vibrate(5);
    if (game.winner === "p") {
      document.getElementById("message").innerText = "You won!";
      playerWins++;
      if (playerWins === 1) {
        document.getElementById("playerWins").innerText = "1 Win";
      } else
        document.getElementById("playerWins").innerText = playerWins.toString().concat(" Wins");
    } else if (game.winner === "d") {
      document.getElementById("message").innerText = "Dealer won";
      dealerWins++;
      if (dealerWins === 1) {
        document.getElementById("dealerWins").innerText = "1 Loss";
      } else {
        document.getElementById("dealerWins").innerText = dealerWins.toString() + " Losses";
      }
    } else if (game.winner === "n") {
      document.getElementById("message").innerText = "Push";
    }

    hitButton.removeEventListener("click", hitPlayGuiDecorator);
    standButton.removeEventListener("click", standPlayGuiDecorator);
  } else {
    controlPanel.innerHTML = [];
    controlPanel.appendChild(hitButton);
    controlPanel.appendChild(standButton);

    document.getElementById("message").innerText = "";
    hitButton.addEventListener("click", hitPlayGuiDecorator);
    standButton.addEventListener("click", standPlayGuiDecorator);
  }
}
function resetGame() {
  navigator.vibrate(2);
  game.new();

  hitButton.removeEventListener("click", hitPlayGuiDecorator);
  standButton.removeEventListener("click", standPlayGuiDecorator);
  hitButton.addEventListener("click", hitPlayGuiDecorator);
  standButton.addEventListener("click", standPlayGuiDecorator);

  updateGui();
}

updateGui();
function hitMouseDown() {
  navigator.vibrate(1);
}
function stayMouseDown() {
  navigator.vibrate(1);
}
function newGameMouseDown() {
  navigator.vibrate(1);
}
// mouse down / active listener
hitButton.addEventListener("mousedown", hitMouseDown);
standButton.addEventListener("mousedown", stayMouseDown);
newGameButton.addEventListener("mousedown", newGameMouseDown);
hitButton.addEventListener("mouseup", hitMouseDown);
standButton.addEventListener("mouseup", stayMouseDown);
newGameButton.addEventListener("mouseup", newGameMouseDown);

function hitPlayGuiDecorator() {
  navigator.vibrate(2);
  game.hitPlay();
  updateGui();
}
function standPlayGuiDecorator() {
  navigator.vibrate(2);
  game.standPlay();
  updateGui();
}
