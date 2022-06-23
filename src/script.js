import './style.scss';
import { uiController, controller } from './core';

const createDsiplay = (() => {
  function setFields() {
    // create the field
    const screenFields = document.querySelector('div.screen');

    for (let i = 0; i < 9; i += 1) {
      const divField = document.createElement('div');

      // class="flex" data-sound="click" data-field="0"
      divField.classList.add('flex');
      divField.setAttribute('data-sound', 'click');
      divField.setAttribute('data-field', i);
      divField.addEventListener('click', uiController.selectedField);
      screenFields.appendChild(divField);
    }
  }

  function setButtons() {
    const controls = document.querySelector('div.control');
    const buttons = { Reset: uiController.resetGame };

    // create button controls
    // div.control

    // eslint-disable-next-line no-restricted-syntax
    for (const key in buttons) {
      /*
        Using if verification here due to not getting key from 'buttons' prototype.
        this is not necessary for now because the prototype is Object,
        and this means it empty object.

        eslint forces me to use Object.prototype instead of
        buttons.hasOwnProperty(key).
        Using it to remember why I have to use it.
      */

      if (Object.prototype.hasOwnProperty.call(buttons, key)) {
        const newButton = document.createElement('button');
        const div = document.createElement('div');
        newButton.classList.add('btn');
        newButton.addEventListener('click', buttons[key]);
        newButton.textContent = key;
        div.appendChild(newButton);
        controls.appendChild(div);
      }
    }
  }

  return { setFields, setButtons };
})();

(function startGame() {
  // create display
  createDsiplay.setFields();
  createDsiplay.setButtons();

  // create new players
  // start with presetted players
  controller.createPlayer('P1', 'X');
  controller.createPlayer('P2', 'O');

  // start first turn
  uiController.showTurn(controller.turnCounter.getCounter());
}());
