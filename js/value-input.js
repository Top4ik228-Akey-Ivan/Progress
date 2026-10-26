import { toValue, isValidInput } from './value.js';

export class ValueInput {
  #input;
  #onChange;
  #current;    // последнее принятое значение (число)
  #lastValid;  // последний допустимый текст в поле

  constructor(input, { value = 0, onChange = () => {} } = {}) {
    this.#input = input;
    this.#onChange = onChange;
    this.#current = value;
    this.#show(value);

    input.addEventListener('input', () => this.#handleInput());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });

    input.addEventListener('focus', () => input.select());
    input.addEventListener('blur', () => this.#commit());
  }

  setValue(value) {
    this.#current = value;
    if (document.activeElement !== this.#input) this.#show(value);
  }

  /** Записывает значение в поле и запоминает его как последнее хорошее. */
  #show(value) {
    this.#lastValid = String(value);
    this.#input.value = this.#lastValid;
  }

  #apply(value) {
    this.#current = value;
    this.#onChange(value);
  }

  #handleInput() {
    const text = this.#input.value;

    if (!isValidInput(text)) {
      this.#input.value = this.#lastValid; // откатываем: «нажатие не сработало»
      return;
    }

    this.#lastValid = text;
    const value = toValue(text);
    if (value !== null) this.#apply(value); // пустое поле значения не даёт, кольцо не трогаем
  }

  #commit() {
    this.#show(toValue(this.#input.value) ?? this.#current); // пусто → возвращаем текущее
  }
}