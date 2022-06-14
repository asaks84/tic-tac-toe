/*
   WHY WHEN I USE MODULES, I CAN'T EXPORT CONTROLLER TO script.js? 
   THIS STOP THE DOM ELEMENTS TO WORK
*/

/*
    You’re going to store the gameboard as an array inside of a Gameboard object, 
    so start there! Your players are also going to be stored in objects… and you’re probably 
    going to want an object to control the flow of the game itself.
        
    Your main goal here is to have as little global code as possible. 
    Try tucking everything away inside of a module or factory. 
        
    Rule of thumb: if you only ever need ONE of something 
    (gameBoard, displayController), use a module. If you need multiples of something 
    (players!), create them with factories.
*/

const counterCreator = (start = 0) => {
    const firstNum = start;
    let count = start;

    const add = () => count++;
    const reset = () => count = Number(firstNum);
    const getCounter = () => count;

    return { add, reset, getCounter };
};


const gameBoard = (() => {

    const boardField = new Array();

    const saveResult = (pos, player) => boardField[pos] = player;
    const isEmpty = (pos) => (!boardField[pos]);
    const setResult = (pos, sign, name) => {

        if (isEmpty(pos)) {
            saveResult(pos, sign);
            controller.movesCounter.add();
            console.log('moves counter', controller.movesCounter.getCounter())
            uiController.showMoviment(pos, sign);
            console.log(sign + " = " + pos);
        } else {
            console.error(`${name}, this move is impossible! (${sign} = ${pos})`);
            return
        }

    }
    const get = () => boardField;
    const getPosition = (pos) => boardField[pos];
    const reset = () => boardField.length = 0;

    return { setResult, isEmpty, get, getPosition, reset };
})();




const Player = function (name, sign) {
    const playerSign = sign;
    const playerName = name;

    const getName = () => playerName;
    const getSign = () => playerSign;
    const setMove = (pos) => gameBoard.setResult(pos, sign, getName());

    return Object.assign({}, { getSign, getName, setMove });
};

//
//  UI CONTROLLER
//

const uiController =(() => {

    // creating screen in future

    // const createGame = () => {
    //     const main = document.querySelector('main');
        
    //     const aside = document.createElement('aside');
    //     const section = document.createElement('section');
    //     const div = document.createElement('div');
    //     const para = document.createElement('p')

    //     // creating menu

    //     (function(){
    //         aside

    //     })();
    // }

    function selectedField(e){
        const attr = e.target.getAttribute('data-sound');
        const fieldSelected = e.target.getAttribute('data-field');
        controller.play(fieldSelected);
        playAudio(attr);
    };
    
    function playAudio(attr) {
        const toPlay = document.querySelector(`audio[data-sound="${attr}"]`);
        const divChange = document.querySelector(`div[data-sound="${attr}"]`);
        if (!toPlay) { return };
    
       // divChange.classList.add('playing');
        toPlay.currentTime = 0;
        toPlay.play();
    };

    const showMoviment = (field, sign) => {
        const div = document.querySelector(`[data-field="${field}"]`);
        div.textContent = sign;
    };

    const showTurn = (turn) => {
        const turnSpan = document.querySelector('#turnCounter');
        turnSpan.textContent = turn;
    };

    const showResult = (results) => {
       
        for(i=0; i < fields.length; i++){
            
            if(results.includes(Number(fields[i].getAttribute('data-field')))){
                fields[i].classList.add('winner');
            } else fields[i].classList.add('looser');   
        } 
    };

    const resetGame = () => {
        controller.reset();
        fields.forEach(field => field.textContent = '');
        fields.forEach(field => field.classList.remove('winner', 'looser', 'disable'))
    };

    const reset = document.querySelector('.btn-reset');
    const start = document.querySelector('btn-start');
    const fields = Array.from(document.querySelectorAll('.screen>div'));

    reset.addEventListener('click', resetGame)
    fields.forEach(field => field.addEventListener('click', selectedField));

    return { showMoviment, showTurn, showResult }
})();

//
//  GAME CONTROLLER
//


const controller = (() => {
    let allPlayersPhase = 0;

    const turnCounter = counterCreator(1);
    const playerRotation = counterCreator();
    const onOff = counterCreator();
    const movesCounter = counterCreator();

    const players = [];

    //
    // players controllers
    //

    const createPlayer = (name, sign) => {
        const newPlayer = Player(name, sign)
        players.push(newPlayer);
    };

    const getPlayer = (pos) => players[pos];

    const getPlayerToMove = () => {
        const numberOfMoves = getAmountOfPlays();
        
        // It could be better comparing a actualPlayer and a nextPlayer
        // but I have to find nextPlayer first, for this game it's ok to do here
        
        if (Object.keys(numberOfMoves).length === 0) {
            return getPlayer(0);
        } else if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(1).getSign()]) {
            return getPlayer(0);
        } else { return getPlayer(1); };

    };

    const getAmountOfPlayers = () => players.length;

    //
    // game controllers
    //

    const hasWinner = (counter) => (counter == 3);
    const endGame = (player) => {
        console.log(`${player.getName()} wins!\nCongrats!`)
        onOff.add()
    };

    const verifyResult = () => {
        const winnigOptions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        const numberOfPlayers = getAmountOfPlayers();
        const playerPoints = counterCreator();
        const numberOfMoves = getAmountOfPlays();

        /*
            Replacing last solution with forEach(), 
            only because it was unstoppable! 
            Also now I can use it for all players.
            
            The forEach solution is on the commit before this one 
            "replacing forEach solution for verifyResult()"
        */

        playerLoop:
        for (i = 0; i < numberOfPlayers; i++) {

            combinationPossibilities:
            for (winninglength = 0; winninglength < winnigOptions.length; winninglength++) {
                const winnigElement = winnigOptions[winninglength];

                eachPositionLoop:
                for (eachPos = 0; eachPos < winnigElement.length; eachPos++) {
                    const pos = winnigElement[eachPos];
                    if (gameBoard.getPosition(pos) == getPlayer(i).getSign()) {
                        playerPoints.add();
                    };
                    if (hasWinner(playerPoints.getCounter())) {
                        endGame(getPlayer(i));
                        uiController.showResult(winnigElement);
                        break playerLoop;
                    };
                };
                playerPoints.reset();
            };
        };
        if(movesCounter.getCounter() >= 9){
            console.log("It's a Draw!" )
        }
    };

    const reset = () => {
        turnCounter.reset();
        gameBoard.reset();
        allPlayersPhase = 0;
        onOff.reset();
        movesCounter.reset();
        console.clear();
        uiController.showTurn(turnCounter.getCounter());
    };

    //
    // plays controllers
    //

    const getAmountOfPlays = () => gameBoard.get().reduce((obj, sign) => {
        if (!obj[sign]) {
            obj[sign] = 0;
        }
        obj[sign]++;
        return obj;
    }, {});

    const isAllPlayersPlayed = () => {
        const numberOfMoves = getAmountOfPlays();

        return (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(getAmountOfPlayers() - 1).getSign()])
    };

    const play = (pos) => {

        const fieldIsEmpty = gameBoard.isEmpty(pos);

        if (onOff.getCounter() > 0) {
            console.log("The game is Over");
        }

        //turn counter
        // the onOff condition is to not change turn if the game is over

        getPlayerToMove().setMove(pos);
        allPlayersPhase = turnCounter.getCounter();
        if (isAllPlayersPlayed() && fieldIsEmpty && onOff.getCounter() < 1) {
            turnCounter.add();
        }

        verifyResult();

        // turn exhibition;

        if (allPlayersPhase != turnCounter.getCounter()) {
            console.log(turnCounter.getCounter());
            uiController.showTurn(turnCounter.getCounter())
        };
        
    };

    console.log(turnCounter.getCounter());
    uiController.showTurn(turnCounter.getCounter())
    return {
        movesCounter,
        play,
        reset,
        createPlayer
    };
})();

controller.createPlayer('P1', "X");
controller.createPlayer('P2', "O");


