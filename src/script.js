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
    const buttons = [
      {
        Name: 'Reset',
        Function: uiController.resetGame,
      },
    ];

    // create button controls
    // div.control

    // eslint-disable-next-line no-restricted-syntax
    for (const obj in buttons) {
      /*
        Using if verification here due to not getting obj from 'buttons' prototype.
        this is not necessary for now because the prototype is Array,
        and this means it's an empty array.

        If it was an object, it make more sense.
        eslint forces me to use Object.prototype instead of
        buttons.hasOwnProperty(key).
        Using it to remember why I have to use it.

        Even if it's not an object, it works fine.
      */

      if (Array.prototype.hasOwnProperty.call(buttons, obj)) {
        const newButton = document.createElement('button');
        const div = document.createElement('div');
        newButton.classList.add('btn');
        newButton.addEventListener('click', buttons[obj].Function);
        newButton.textContent = buttons[obj].Name;
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
  uiController.getFields();
  uiController.showTurn(controller.turnCounter.getCounter());
}());
