/* eslint-disable no-use-before-define */

// Refactoring code due a loop game and other
// functions has just one execution (Single reponsibility)

const counterCreator = (start = 0) => {
  const firstNum = start;
  let count = start;

  function add() { count += 1; }
  function reset() { count = Number(firstNum); }
  const getCounter = () => count;

  return { add, reset, getCounter };
};

const gameBoard = (() => {
  const boardField = [];

  function saveResult(pos, player) { boardField[pos] = player; }
  function reset() { boardField.length = 0; }
  const isEmpty = (pos) => (!boardField[pos]);
  const get = () => boardField;
  const getPosition = (pos) => boardField[pos];

  return {
    saveResult, isEmpty, get, getPosition, reset,
  };
})();

const Player = (name, sign) => {
  const playerSign = sign;
  const playerName = name;

  const getName = () => playerName;
  const getSign = () => playerSign;
  const setMove = (pos) => gameBoard.saveResult(pos, sign);

  return { getSign, getName, setMove };
};

//
//  GAME CONTROLLER
//

export const controller = (() => {
  const turnCounter = counterCreator(1);
  const gameOver = counterCreator();
  const movesCounter = counterCreator();

  const players = [];

  //
  // players controllers
  //

  const createPlayer = (name, sign) => {
    const newPlayer = Player(name, sign);
    players.push(newPlayer);
  };

  const getPlayer = (pos) => players[pos];

  const getAmountOfPlayers = () => players.length;

  const getPlayerToMove = () => {
    const numberOfMoves = getAmountOfPlays();

    // It could be better comparing a actualPlayer and a nextPlayer
    // but I have to find nextPlayer first.
    // For this game it's ok to use this simple way,
    // and I don't have much time to spend here.
    // Maybe next time.

    if (Object.keys(numberOfMoves).length === 0) {
      return getPlayer(0);
    } if (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(1).getSign()]) {
      return getPlayer(0);
    } return getPlayer(1);
  };

  //
  // game controllers
  //

  const hasWinner = (counter) => (counter === 3);
  const endGame = (player, sequence) => {
    uiController.showResult(sequence);
    gameOver.add();
  };

  const verifyResult = () => {
    const sequencesToWin = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const numberOfPlayers = getAmountOfPlayers();
    const playerPoints = counterCreator();

    // Replacing last solution with forEach(),
    // only because it was unstoppable!
    // Also now I can use only one comparsion for all players.

    // verify all players
    for (let i = 0; i < numberOfPlayers; i += 1) {
      // verify all possible sequences to win

      // eslint-disable-next-line max-len
      for (let sequencePosition = 0; sequencePosition < sequencesToWin.length; sequencePosition += 1) {
        const sequence = sequencesToWin[sequencePosition];

        // verify each position of each sequence
        for (let eachPos = 0; eachPos < sequence.length; eachPos += 1) {
          const pos = sequence[eachPos];

          if (gameBoard.getPosition(pos) === getPlayer(i).getSign()) playerPoints.add();
          if (hasWinner(playerPoints.getCounter())) return sequence;
        }
        playerPoints.reset();
      }
    }
    return false;
  };

  const reset = () => {
    turnCounter.reset();
    gameBoard.reset();
    gameOver.reset();
    movesCounter.reset();
    uiController.showTurn(turnCounter.getCounter());
  };

  //
  // plays controllers
  //

  const getAmountOfPlays = () => gameBoard.get().reduce((obj, sign) => {
    // eslint-disable-next-line no-param-reassign

    if (!obj[sign]) { obj[sign] = 0; }

    // eslint-disable-next-line no-param-reassign
    obj[sign] += 1;
    return obj;
  }, {});

  const isAllPlayersPlayed = () => {
    const numberOfMoves = getAmountOfPlays();

    // eslint-disable-next-line max-len
    return (numberOfMoves[getPlayer(0).getSign()] <= numberOfMoves[getPlayer(getAmountOfPlayers() - 1).getSign()]);
  };

  const isGameOver = () => (gameOver.getCounter() > 0);

  const changeTurnCounter = (isFieldEmpty) => {
    // turn counter
    if (isAllPlayersPlayed() && isFieldEmpty) {
      turnCounter.add();
      uiController.showTurn(turnCounter.getCounter());
    }
  };

  // game loop every play
  const play = (pos) => {
    // Set all changes after every move on the game

    const isFieldEmpty = gameBoard.isEmpty(pos);
    const player = getPlayerToMove();

    // Verify if game is over
    // If game is over, stop execution
    if (isGameOver()) return;

    // if is not over, continue game
    // if isn't empty, stop, else cotinue play
    if (!isFieldEmpty) {
      return;
    }
    // make move
    player.setMove(pos);
    // count movements to set a Draw
    movesCounter.add();
    // show movement on display
    uiController.showMoviment(pos, player.getSign());

    // Verify result the game after move;
    const winnerCombination = verifyResult();

    // If it's false, change turnCounter and stop play
    // It has the winner combinetion positions and endGame.

    if (!winnerCombination) {
      changeTurnCounter(isFieldEmpty);
    } else endGame(player, winnerCombination);
  };

  return {
    turnCounter,
    play,
    reset,
    createPlayer,
  };
})();

//
//  UI CONTROLLER
//

export const uiController = (() => {
  function playAudio(attr) {
    const toPlay = document.querySelector(`audio[data-sound="${attr}"]`);

    if (!toPlay) return;

    toPlay.currentTime = 0;
    toPlay.play();
  }

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

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fields.length; i++) {
      if (results.includes(Number(fields[i].getAttribute('data-field')))) {
        fields[i].classList.add('winner', 'selected');
      } else fields[i].classList.add('looser', 'selected');
    }
  };

  function selectedField(e) {
    const attr = e.target.getAttribute('data-sound');
    const fieldSelected = e.target.getAttribute('data-field');
    controller.play(fieldSelected);
    playAudio(attr);
  }

  const resetGame = () => {
    const fields = Array.from(document.querySelectorAll('.screen>div'));

    controller.reset();
    // eslint-disable-next-line no-return-assign
    fields.forEach((field) => field.textContent = '');
    fields.forEach((field) => field.classList.remove('winner', 'looser', 'selected'));
  };

  return {
    showMoviment, showTurn, showResult, selectedField, resetGame,
  };
})();
