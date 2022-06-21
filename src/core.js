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
            uiController.showMoviment(pos, sign);
        } else {
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
//  GAME CONTROLLER
//


export const controller = (() => {
    
    const turnCounter = counterCreator(1);
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
        // but I have to find nextPlayer first.
        // For this game it's ok to use this simple way,
        // and I don't have much time to spend here.
        // Maybe next time.
        
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
    const endGame = (player, winnigElement) => {
        uiController.showResult(winnigElement);
        onOff.add();
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

       
        
        // Replacing last solution with forEach(), 
        // only because it was unstoppable! 
        // Also now I can use only one comparsion for all players.
        // commit name "replacing forEach solution for verifyResult()"

        
        playerLoop:
        for (let i = 0; i < numberOfPlayers; i++) {

            combinationPossibilities:
            for (let winninglength = 0; winninglength < winnigOptions.length; winninglength++) {
                const winnigElement = winnigOptions[winninglength];

                eachPositionLoop:
                for (let eachPos = 0; eachPos < winnigElement.length; eachPos++) {
                    const pos = winnigElement[eachPos];
                    if (gameBoard.getPosition(pos) == getPlayer(i).getSign()) {
                        playerPoints.add();
                    };
                    if (hasWinner(playerPoints.getCounter())) {
                        endGame(getPlayer(i), winnigElement);
                        break playerLoop;
                    };
                };
                playerPoints.reset();
            };
        };
        if(movesCounter.getCounter() >= 9 && onOff.getCounter() < 1){
        }
    };

    const reset = () => {
        turnCounter.reset();
        gameBoard.reset();
        onOff.reset();
        movesCounter.reset();
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

    const isGameOver = () => (onOff.getCounter() > 0) 
        

    const changeTurnCounter = (isFieldEmpty) => {

        // turn counter
        // the onOff condition is to not change turn if the game is over
        if (isAllPlayersPlayed() && isFieldEmpty && onOff.getCounter() < 1) {
            turnCounter.add();
            uiController.showTurn(turnCounter.getCounter())
        };


    };

    const play = (pos) => {
        // Set all changes after every move on the game
        
        const isFieldEmpty = gameBoard.isEmpty(pos);

        // Verify if game is over
        if(isGameOver()){
            return
        }

        //Try to Move
        getPlayerToMove().setMove(pos);
        
        // Verify result the game after move
        verifyResult();

        // Change turn counter
        changeTurnCounter(isFieldEmpty);
           
    };

    return {
        turnCounter,
        movesCounter,
        play,
        reset,
        createPlayer
    };
})();


//
//  UI CONTROLLER
//

export const uiController = (() => {

    function playAudio(attr) {
        const toPlay = document.querySelector(`audio[data-sound="${attr}"]`);
        
        if (!toPlay) { return };
        
        toPlay.currentTime = 0;
        toPlay.play();
    };

    const showMoviment = (field, sign) => {
        const div = document.querySelector(`[data-field="${field}"]`);
        div.textContent = sign;
        div.classList.add('selected');
    };

    const showTurn = (turn) => {
        const turnSpan = document.querySelector('#turnCounter');
        turnSpan.textContent = turn;
    };

    const showResult = (results) => {
        const fields = Array.from(document.querySelectorAll('.screen>div'));

       
        for(let i=0; i < fields.length; i++){
            
            if(results.includes(Number(fields[i].getAttribute('data-field')))){
                fields[i].classList.add('winner', 'selected');
            } else fields[i].classList.add('looser', 'selected');   
        } 
    };

    function selectedField(e){
        const attr = e.target.getAttribute('data-sound');
        const fieldSelected = e.target.getAttribute('data-field');
        controller.play(fieldSelected);
        playAudio(attr);
    };

    const resetGame = () => {
        const fields = Array.from(document.querySelectorAll('.screen>div'));

        controller.reset();
        fields.forEach(field => field.textContent = '');
        fields.forEach(field => field.classList.remove('winner', 'looser', 'selected'))
    };
    
    return { showMoviment, showTurn, showResult, selectedField, resetGame };

})();