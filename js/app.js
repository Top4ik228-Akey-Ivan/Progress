import { Progress } from './progress.js';
import { ValueInput } from './value-input.js';

const container = document.querySelector('#progress-container');
const progress = new Progress(container, { value: 60 });

const valueInput = new ValueInput(document.querySelector('#value'), {
  value: progress.getValue(),
  onChange: (value) => progress.setValue(value),
});

// Обратная связь: изменили значение через API, и поле показало его
container.addEventListener('progress:change', (e) => valueInput.setValue(e.detail.value));

window.progress = progress;
window.Progress = Progress;