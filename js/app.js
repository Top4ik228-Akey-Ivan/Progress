import { Progress } from './progress.js';
import { ValueInput } from './value-input.js';

const container = document.querySelector('#progress-container');
const valueField = document.querySelector('#value');
const animateSwitch = document.querySelector('#animate');
const hideSwitch = document.querySelector('#hide');

const progress = new Progress(container, { value: 60 });

// Поле → кольцо: человек ввёл число
const valueInput = new ValueInput(valueField, {
  value: progress.getValue(),
  onChange: (value) => progress.setValue(value),
});

// Кольцо → поле: значение изменили не из поля (через API)
container.addEventListener('progress:change', (e) => valueInput.setValue(e.detail.value));

animateSwitch.checked = progress.isAnimated();
hideSwitch.checked = progress.isHidden();

animateSwitch.addEventListener('change', () => progress.setAnimated(animateSwitch.checked));
hideSwitch.addEventListener('change', () => progress.setHidden(hideSwitch.checked));