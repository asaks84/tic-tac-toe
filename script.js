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
    const print = () => console.log(count);
    const getCounter = () => count;

    return { add, reset, print, getCounter };
};



const gameBoard = (() => {

    const itemSelection = new Array();

    const saveResult = (pos, player) => itemSelection[pos] = player;
    const isEmpty = (pos) => (!itemSelection[pos]);
    const getResult = (pos, sign) => isEmpty(pos) ? saveResult(pos, sign) : console.log('invalid move');
    const get = () => itemSelection;
    const getPosition = (pos) => itemSelection[pos];
    const reset = () => itemSelection.length = 0;

    return { getResult, get, getPosition, reset };
})();


//
//    PLAYER CREATOR
//


const Player = function(name, sign) {
    const playerSign = sign;
    const playerName = name;

    const getName = () => playerName;
    const getSign = () => playerSign;
    const setMove = (pos) => gameBoard.getResult(pos, sign);

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
    const getPlayer = (pos) => players[Object.keys(players)[pos]]

    const selectPlayer = () => {
        const positionSelected = showPlays();

        if (Object.keys(positionSelected).length === 0) {
            return players[Object.keys(players)[0]];
        } else if (positionSelected['X'] <= positionSelected['O']) {
            return players[Object.keys(players)[0]];
        } else { return players[Object.keys(players)[1]]; };
    };

    //
    // game controllers
    //

    const hasWinner = (counter) => (counter == 3);
    const endGame = (() => console.log('Congrats'));

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

        winnigOptions.forEach(el => {
            const counterX = counterCreator();
            const counterO = counterCreator();
            el.forEach(pos => {
               if (gameBoard.getPosition(pos) == 'X') {
                    counterX.add();
                } else if (gameBoard.getPosition(pos) == "O") {
                    counterO.add();
                };
            });

            if (hasWinner(counterO.getCounter())) {
                endGame();
                console.log(`Player ${getPlayer(1).getSign()} wins`);
            } else if (hasWinner(counterX.getCounter())) {
                endGame();
                console.log(`Player ${getPlayer(0).getSign()} wins`);
            };
        });
    };

    const reset = () => {
        roundCounter.reset();
        gameBoard.reset();
    };

    //
    // plays controllers
    //

    const showPlays = () => gameBoard.get().reduce((obj, sign) => {
        if (!obj[sign]) {
            obj[sign] = 0;
        }
        obj[sign]++;
        return obj;
    }, {});

    const playMaker = (pos) => {
        
        if ( lastRound != roundCounter.getCounter()) {
            roundCounter.print();
        };

        const selectedPlayer = selectPlayer();
        selectedPlayer.setMove(pos);
        console.log(selectedPlayer.getSign());
        lastRound = roundCounter.getCounter();
        roundPlay();
        pointCounter();
    };

    const roundPlay = () => {
        const positionSelected = showPlays();

        if (positionSelected['X'] <= positionSelected['O']) {
            roundCounter.add();
        };
        
        return 
    };

    return { 
        playMaker, 
        reset,
        createPlayer,
        getPlayers
    };
})();

controller.createPlayer('P1',"X");
controller.createPlayer('P2',"O");
// console.log(controller.getPlayers());

controller.playMaker(0);
controller.playMaker(3);
controller.playMaker(6);
controller.playMaker(5);
controller.playMaker(2);
controller.playMaker(4);

// console.log(gameBoard.get());

// controller.reset();
// console.log(gameBoard.get());