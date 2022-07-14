//Blackjack Game
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsValue': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false //When the turns between player and bot are over
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const loseSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}


function showCard(card, activePlayer) { 
    if (activePlayer['score'] <= 21) { //Showing a bust if player exceeds 21
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isStand'] = false;
        
        // showResult(computeWinner()); //Use this function when playing 2 player
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        //Clear the cards from view/ reset for a new round
        for(i=0; i<yourImages.length; i++){
            yourImages[i].remove();
        }
    
        for(i=0; i<dealerImages.length; i++){
            dealerImages[i].remove();
        }
    
        //Reset score to zero
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        
        document.querySelector('#your-blackjack-result').style.color = 'white';   
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
    
        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = false;
    }
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    if (blackjackGame['turnsOver'] === false) {
        blackjackGame['isStand'] = true;
    
        while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }
        
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
    }
}
    

//Compute the winner and the also update the wins,draws and losses
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) { //When your score is higher that the dealer or when the dealer BUST but your score is 21 or under
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) { //When your score is less than dealer
            blackjackGame['losses']++;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) { //When both your scores match
            blackjackGame['draws']++;
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) { // When you BUST but Dealer doesn't
        blackjackGame['losses']++;
        winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) { // When you both BUST!
        blackjackGame['draws']++;
    }

    return winner;
    
}

//Display the Win-Lose-Draw-BUST result
function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            loseSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew';
            messageColor = 'black';
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}