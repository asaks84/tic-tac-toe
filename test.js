 const Player = (sign) => {
        
        const playerSign = sign;

        const getSign = () => playerSign;
        const setMove = (pos) => {
            gameBoard.getResult(pos, sign);
            controller.pointCounter();
        };

        return Object.assign({}, { getSign, setMove });
    };

    const controller = (() => {
        const players = {};
        
        
        const getPlayers = () => players;
        
        return { 
            createPlayer,
            getPlayers 
        };
})();
        
        controller.createPlayer('A');
        controller.createPlayer('B');
        controller.createPlayer('C');
        console.log(controller.getPlayers());