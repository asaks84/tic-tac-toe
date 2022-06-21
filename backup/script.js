import * as core from './core.js'

const createDsiplay = (() => {

    function setFields(){

        // create the field
        const screenFields = document.querySelector('div.screen');

        for (let i = 0; i < 9; i++) {
            const divField = document.createElement('div');

            // class="flex" data-sound="click" data-field="0"
            divField.classList.add('flex');
            divField.setAttribute('data-sound', 'click');
            divField.setAttribute('data-field', i);
            divField.addEventListener('click', core.uiController.selectedField);
            screenFields.appendChild(divField);
        };

    };

    function setButtons() {
        const controls = document.querySelector('div.control')
        const buttons = { 'reset': 'core.uiController.resetGame' }

        // create button controls
        // div.control

        for (const key in buttons) {
            const newButton = document.createElement('button');
            const div = document.createElement('div');
            newButton.classList.add('btn');
            newButton.addEventListener('click', eval(buttons[key]));
            newButton.textContent = key
            div.appendChild(newButton)
            controls.appendChild(div);
        };

    };

    return {setFields, setButtons}

})();

(function startGame(){
    //create display
    createDsiplay.setFields();
    createDsiplay.setButtons()

    // create new players
    // start with presetted players
    core.controller.createPlayer('P1', "X");
    core.controller.createPlayer('P2', "O");

    // start first turn
    core.uiController.showTurn(core.controller.turnCounter.getCounter())

})();