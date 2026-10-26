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
    #animated = false;    // вращается ли блок
    #hidden = false;      // скрыт ли блок

    constructor(container, { value = 0, animated = false, hidden = false } = {}) {
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

        const initial = toValue(value);
        if (initial === null) {
            console.warn(`Progress: начальное значение "${value}" проигнорировано`);
        } else {
            this.#value = initial;
        }
        this.#animated = Boolean(animated);
        this.#hidden = Boolean(hidden);

        this.#render();
        container.append(this.#root);
    }

    setValue(input) {
        const value = toValue(input);
        if (value === null) {
            console.warn(`Progress: значение "${input}" проигнорировано`);
            return;
        }
        if (value === this.#value) return;
        this.#value = value;
        this.#render();
        this.#root.dispatchEvent(
            new CustomEvent('progress:change', { bubbles: true, detail: { value } })
        );
    }

    getValue() {
        return this.#value;
    }

    setAnimated(on) {
        this.#animated = Boolean(on);
        this.#render();
    }

    isAnimated() {
        return this.#animated;
    }

    setHidden(on) {
        this.#hidden = Boolean(on);
        this.#render();
    }

    isHidden() {
        return this.#hidden;
    }

    destroy() {
        this.#root.remove();
    }

    #render() {
        // При полном значении пунктир не нужен: сплошная линия не даёт щели в шве
        const dash = this.#value >= MAX ? 'none' : `${this.#value} ${MAX}`;
        this.#arc.setAttribute('stroke-dasharray', dash);
        // при 0 скруглённый конец оставил бы точку, поэтому дугу прячем
        this.#arc.style.visibility = this.#value === 0 ? 'hidden' : '';
        this.#root.setAttribute('aria-valuenow', this.#value);

        this.#root.classList.toggle('progress--animated', this.#animated);
        this.#root.classList.toggle('progress--hidden', this.#hidden);

    }
}