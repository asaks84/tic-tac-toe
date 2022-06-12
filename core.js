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
    let count = start;

    const add = () => count++;
    const reset = () => count = 0;
    const getCounter = () => count;

    return { add, reset, getCounter };
};


const gameBoard = (() => {

    const itemSelection = new Array();

    const saveResult = (pos, player) => itemSelection[pos] = player;
    const isEmpty = (pos) => (!itemSelection[pos]);
    const setResult = (pos, sign, name) => {

        if(isEmpty(pos)){
            saveResult(pos, sign);
            console.log(sign + " = " + pos );
        } else {
            console.error(`${name}, this move is impossible! (${sign} = ${pos})`);
        }
          
    } 
    const get = () => itemSelection;
    const getPosition = (pos) => itemSelection[pos];
    const reset = () => itemSelection.length = 0;

    return { setResult, get, getPosition, reset };
})();




const Player = function(name, sign) {
    const playerSign = sign;
    const playerName = name;

    const getName = () => playerName;
    const getSign = () => playerSign;
    const setMove = (pos) => gameBoard.setResult(pos, sign, getName());

    return Object.assign({}, { getSign, getName, setMove });
};


//
//  GAME CONTROLLER
//


const controller = (() => {
    let lastRound = 0;
    const roundCounter = counterCreator(1);

    const players = {};

    //
    // players controllers
    //

    const createPlayer = (name, sign) => {
        const newPlayer = Player(name, sign)
        players[newPlayer.getName()] = newPlayer;
    };

    const getPlayers = () => players;
    const getPlayer = (pos) => players[Object.keys(players)[pos]];

    const selectPlayer = () => {
        const numberOfMoves = getAmountOfPlays();

        if (Object.keys(numberOfMoves).length === 0) {
            return getPlayer(0);
        } else if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(1).getSign()]) {
            return getPlayer(0);
        } else { return getPlayer(1); };
    };

    const playerCounter = () => Object.keys(players).length;

    //
    // game controllers
    //

    const hasWinner = (counter) => (counter == 3);
    const endGame = (player) => console.log(`${player.getName()} wins!\nCongrats!`);

    const pointCounter = () => {
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
        const numberOfPlayers = playerCounter();
        const playerPoints = counterCreator();

        /*
            Replacing last solution with forEach(), 
            only because it was unstoppable! 
            Also now I can use it for all players.
            
            The forEach solution is on the commit before this one 
            "replacing forEach solution for pointCounter()"
        */
        
        playerLoop:
        for (i = 0; i < numberOfPlayers; i++){

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
                        break playerLoop;
                    };
                };
                playerPoints.reset();
            };
        };
    };

    const reset = () => {
        roundCounter.reset();
        gameBoard.reset();
        lastRound = 0;
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

    const play = (pos) => {
        
        if ( lastRound != roundCounter.getCounter()) {
            console.log(roundCounter.getCounter());
        };

        const selectedPlayer = selectPlayer();
        selectedPlayer.setMove(pos);
        lastRound = roundCounter.getCounter();
        roundPlay();
        pointCounter();
    };

    const roundPlay = () => {
        const numberOfMoves = getAmountOfPlays();

        if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(1).getSign()]) {
            roundCounter.add();
        };
    };

    return { 
        play, 
        reset,
        createPlayer,
        getPlayers
    };
})();

// it's just for test =)
(function () {
    controller.createPlayer('P1', "X");
    controller.createPlayer('P2', "O");

    controller.play(0);
    controller.play(3);
    controller.play(6);
    controller.play(5);
    controller.play(2);
    controller.play(2);
    controller.play(4);
    
    console.log(gameBoard.get());
})();


// controller.reset();
// console.log(gameBoard.get());