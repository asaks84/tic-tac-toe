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

        if(isEmpty(pos)){
            saveResult(pos, sign);
            console.log(sign + " = " + pos );
        } else {
            console.error(`${name}, this move is impossible! (${sign} = ${pos})`);
        }
          
    } 
    const get = () => boardField;
    const getPosition = (pos) => boardField[pos];
    const reset = () => boardField.length = 0;

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
    let allPlayersPhase = 0;

    const turnCounter = counterCreator(1);
    const playerRotation = counterCreator();
    const onOff = counterCreator();
    const roundCounter = counterCreator(1);

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
        const player = getPlayer(playerRotation.getCounter());
        if(playerRotation.getCounter() < players.length){
            playerRotation.add();
            
        }
        if(playerRotation.getCounter() >= players.length){
            playerRotation.reset();
        }
        return player;
        /*
            old way to do the same thing
            but setting manually max players im the game
            not a problem for this game

            const numberOfMoves = getAmountOfPlays();
            if (Object.keys(numberOfMoves).length === 0) {
                return getPlayer(0);
            } else if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(1).getSign()]) {
                return getPlayer(0);
            } else { return getPlayer(1); };
        */
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
        const numberOfPlayers = getAmountOfPlayers();
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
        turnCounter.reset();
        gameBoard.reset();
        allPlayersPhase = 0;
        onOff.reset()
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

        if(onOff.getCounter() > 0){
            console.log("The game is Over");
            return
        }
        
        if ( allPlayersPhase != turnCounter.getCounter()) {
            console.log(turnCounter.getCounter());
        };

        getPlayerToMove().setMove(pos);
        allPlayersPhase = turnCounter.getCounter();
        isAllPlayersPlayed();
        pointCounter();
    };

    const isAllPlayersPlayed = () => {
        const numberOfMoves = getAmountOfPlays();

        if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(getAmountOfPlayers()-1).getSign()]) {
            turnCounter.add();
        };
    };
    
    return { 
        play, 
        reset,
        createPlayer
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