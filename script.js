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

const counterCreator = () => {
    let count = 0;

    const add = () => count++;
    const reset = () => count = 0;
    const print = () => console.log(count);
    const getCounter = () => count;

    return { add, reset, print, getCounter };
};


const gameBoard = (() => {

    const itemSelection = new Array(9);

    const saveResult = (pos, player) => itemSelection[pos] = player;
    const isEmpty = (pos) => (!itemSelection[pos]);
    const getResult = (pos, sign) => isEmpty(pos) ? saveResult(pos, sign) : console.log('invalid move');
    const get = () => itemSelection;
    const getField = (pos) => itemSelection[pos];

    return { getResult, get, getField };
})();



//
//    PLAYER CREATOR
//

const Player = (sign) => {
    const playerSign = sign;
    
    const getSign = () => playerSign;
    const setMove = (pos) => {
        gameBoard.getResult(pos, sign);
        controller.pointCounter();
    };

    return Object.assign({}, { getSign, setMove });
};



//
//  GAME CONTROLLER
//


const controller = (() => {
    const roundCounter = counterCreator();
    const firstPlayer = Player('X');
    const secondPlayer = Player('0');
    
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

    const hasWinner = (counter) => (counter == 3);
    const endGame = (() => console.log('Congrats'));

    const pointCounter = () => {
        winnigOptions.forEach(el => {
            const counterX = counterCreator();
            const counter0 = counterCreator();
            el.forEach(pos => {
                if (gameBoard.getField(pos) == "X") {
                    counterX.add()
                } else if (gameBoard.getField(pos) == "0") {
                    counter0.add()
                };
            });

            if (hasWinner(counter0.getCounter())) {
                console.log('Player 0 wins');
                endGame();
            } else if (hasWinner(counterX.getCounter())) {
                console.log('Player X wins');
                endGame();
            };
        });
    };

    const showPlays = () => gameBoard.get().reduce((obj, sign) => {
            if (!obj[sign]) {
                obj[sign] = 0;
            }
            obj[sign]++;
            return obj;
        }, {});
    

    const selectPlayer = () => {
        const fieldsSelected = showPlays();

        if(Object.keys(fieldsSelected).length === 0){ 
            return firstPlayer
        } else if(fieldsSelected['X'] <= fieldsSelected['0']){
            return firstPlayer
        } else { return secondPlayer };
    };

    const playMaker = (pos) => {
        roundPlay();
        
        const player = selectPlayer();
        player.setMove(pos);
        console.log(player.getSign())
    }

    const roundPlay = () => {
        const fieldsSelected = showPlays();
        
        if(Object.keys(fieldsSelected).length === 0){
            roundCounter.add()
        }else if(fieldsSelected['X'] <= fieldsSelected['0']){
            roundCounter.add()
        }
        return roundCounter.print()
    }

    return { pointCounter, playMaker };
})();

controller.playMaker(0);
controller.playMaker(3);
controller.playMaker(1);
controller.playMaker(5);
controller.playMaker(2);

console.log(gameBoard.get());