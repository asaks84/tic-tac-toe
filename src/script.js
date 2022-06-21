import "./style.scss";
import { uiController, controller } from "./core.js";


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
            divField.addEventListener('click', uiController.selectedField);
            screenFields.appendChild(divField);
        };

    };

    function setButtons() {
        const controls = document.querySelector('div.control')
        const buttons = { 'Reset': uiController.resetGame }

        // create button controls
        // div.control
        for (const key in buttons) {
            const newButton = document.createElement('button');
            const div = document.createElement('div');
            newButton.classList.add('btn');
            newButton.addEventListener('click', buttons[key]);
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
    controller.createPlayer('P1', "X");
    controller.createPlayer('P2', "O");

    // start first turn
    uiController.showTurn(controller.turnCounter.getCounter())

})();