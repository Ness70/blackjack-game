//Blackjack Game
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsValue': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11]}
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
const hitSound = new Audio('static/sounds/swish.m4a');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    let card = randomCard();
    showCard(card, YOU);
    console.log(card);
    updateScore(card, YOU);
    showScore(YOU);
}

function randomCard() {
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}


function showCard(card, activePlayer) { 
    if (activePlayer['score'] <= 21) { //showing a bust if player exceeds 21
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

    for(i=0; i<yourImages.length; i++){
        yourImages[i].remove();
    }

    for(i=0; i<dealerImages.length; i++){
        dealerImages[i].remove();
    }

    //reset score to zero
    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    
    document.querySelector('#your-blackjack-result').style.color = 'white';   
    document.querySelector('#dealer-blackjack-result').style.color = 'white'; 
}

function updateScore(card, activePlayer) {
    //For Ace card; If adding 11 keeps me below 21, add 11 otherwise add 1
    if (card === 'A'){
        if(activePlayer['score'] + blackjackGame['cardsValue'][card][1] <= 21){ //statement checks is the card can increase by 11(from A card array value = 11) and still remain below 21
            activePlayer['score'] += blackjackGame['cardsValue'][card][1]; //..then increase by 11 (A: 11)
        } else {
            activePlayer['score'] += blackjackGame['cardsValue'][card][0]; //..otherwise, increase by 1 (A: 1)
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsValue'][card]; //otherwise continue with actual key value of cards from rest of cards array
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) { //checking if the value of the total cards exceed 21, hence update the scoreSpan html to BUST!
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function dealerLogic() {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) { //When your score is higher that the dealer or when the dealer BUST but your score is 21 or under
            console.log('You win!');
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) { //When your score is less than dealer
            console.log('You lose!');
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) { //When both your scores match
            console.log('You drew!');
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) { // When you BUST but Dealer doesn't
        console.log('You lost!')
        winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) { // When you both BUST!
        console.log('You drew!')
    }

    return winner;
}