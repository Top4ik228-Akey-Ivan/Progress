import { Progress } from './progress.js';

const container = document.querySelector('#progress-container');
const progress = new Progress(container, { value: 60 });

container.addEventListener('progress:change', (e) => {
  console.log('Новое значение:', e.detail.value);
});

window.progress = progress;