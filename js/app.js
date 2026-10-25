import { Progress } from './progress.js';

const progress = new Progress(document.querySelector('#progress-container'), { value: 60 });

window.progress = progress; // ВРЕМЕННО, чтобы управлять из консоли