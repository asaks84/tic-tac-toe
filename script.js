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

const gameBoard = (() => {

    const itemSelection = new Array(9);

    const saveResult = (pos, player) => itemSelection[pos] = player;
    const isEmpty = (pos) => (!itemSelection[pos]);
    const getResult = (pos, sign) => isEmpty(pos) ? saveResult(pos, sign) : console.log('invalid move');
    const get = () => itemSelection;
    const getPos = (pos) => itemSelection[pos];

    return { getResult, get, getPos };
})();

const Player = (sign) => {
    const playerSign = sign;
    const setMove = (pos) => {
        gameBoard.getResult(pos, sign);
        gameController.pointCounter();
    };
    const getSign = () => playerSign;

    return Object.assign({}, {getSign, setMove});
};

const gameController = (() => {
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
    const endGame = ( () => console.log('Congrats'))

    const pointCounter = () =>{
        winnigOptions.forEach(el => {
            let counterX = 0;
            let counter0 = 0;
            
            el.forEach(pos => {
                if (gameBoard.getPos(pos) == "X") {
                    ++counterX
                } else if (gameBoard.getPos(pos) == "0") {
                    ++counter0
                };
            });

            if(hasWinner(counter0)){
                console.log('Player 0 wins');
                endGame();
            } else if (hasWinner(counterX)){
                console.log('Player X wins')
                endGame();
            };
        });
    };    
    return { pointCounter };
})();


const firstPlayer = Player('X');
const secondPlayer = Player('0');

firstPlayer.setMove(0);
secondPlayer.setMove(2);
firstPlayer.setMove(1);
secondPlayer.setMove(4);
firstPlayer.setMove(3);
secondPlayer.setMove(6);


//console.log(gameBoard.get());