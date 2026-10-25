import { toValue, MAX } from './value.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [name, val] of Object.entries(attrs)) el.setAttribute(name, val);
    return el;
}

export class Progress {
    #root;        // корневой div компонента
    #arc;         // синяя дуга
    #value = 0;   // текущее значение (единственный источник правды)

    constructor(container, { value = 0 } = {}) {
        this.#root = document.createElement('div');
        this.#root.className = 'progress';
        this.#root.setAttribute('role', 'progressbar');
        this.#root.setAttribute('aria-valuemin', 0);
        this.#root.setAttribute('aria-valuemax', 100);

        // pathLength=100: SVG считает длину окружности равной 100,
        // поэтому значение 0–100 можно подставлять в дугу напрямую
        const circle = { cx: 50, cy: 50, r: 45, pathLength: 100 };

        const svg = createSvgElement('svg', { class: 'progress__svg', viewBox: '0 0 100 100', 'aria-hidden': 'true' });
        const track = createSvgElement('circle', { ...circle, class: 'progress__track' });
        // поворот на −90° переносит начало на 12 часов
        this.#arc = createSvgElement('circle', { ...circle, class: 'progress__arc', transform: 'rotate(-90 50 50)' });

        svg.append(track, this.#arc);
        this.#root.append(svg);
        container.append(this.#root);

        this.#render();
        this.setValue(value);
    }

    setValue(input) {
        const value = toValue(input);
        if (value === null) {
            console.warn(`Progress: значение "${input}" проигнорировано`);
            return;
        }
        this.#value = value;
        this.#render();
    }

    getValue() {
        return this.#value;
    }

    #render() {
        // При полном значении пунктир не нужен: сплошная линия не даёт щели в шве
        const dash = this.#value >= MAX ? 'none' : `${this.#value} ${MAX}`;
        this.#arc.setAttribute('stroke-dasharray', dash);
        // при 0 скруглённый конец оставил бы точку, поэтому дугу прячем
        this.#arc.style.visibility = this.#value === 0 ? 'hidden' : '';
        this.#root.setAttribute('aria-valuenow', this.#value);
    }
}