import { rng } from "./rng";

export interface StringGeneratorOptions {
  /** Use word mode? */
  words: boolean;
  order: number;
  prior: number;
}

/**
 * (Markov process-based) string generator.
 *
 * Copied from a [RogueBasin article](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme).
 *
 * Offers configurable order and prior.
 */
export class StringGenerator {
  private readonly options: StringGeneratorOptions;
  private readonly boundary = String.fromCharCode(0);
  private readonly suffix = this.boundary;
  private readonly prefix: string[] = [];
  private priorValues: { [val: string]: number } = {};
  private data: { [key: string]: { [ev: string]: number } } = {};

  constructor(options?: Partial<StringGeneratorOptions>) {
    this.options = { words: false, order: 3, prior: 0.001, ...options };

    for (let i = 0; i < this.options.order; i++) {
      this.prefix.push(this.boundary);
    }

    this.priorValues[this.boundary] = this.options.prior;
  }

  /**
   * Remove all learning data
   */
  clear(): void {
    this.data = {};
    this.priorValues = {};
  }

  /**
   * @returns Generated string
   */
  generate(): string {
    const result = [this.sample(this.prefix)];
    while (result[result.length - 1] !== this.boundary) {
      result.push(this.sample(result));
    }
    return this.join(result.slice(0, -1));
  }

  /**
   * Observe (learn) a string from a training set
   */
  observe(str: string): void {
    let tokens = this.split(str);

    for (const token of tokens) {
      this.priorValues[token] = this.options.prior;
    }

    tokens = this.prefix
      .concat(tokens)
      .concat(this.suffix); /* add boundary symbols */

    for (let i = this.options.order; i < tokens.length; i++) {
      const context = tokens.slice(i - this.options.order, i);
      const event = tokens[i];
      for (let j = 0; j < context.length; j++) {
        const subcontext = context.slice(j);
        this.observeEvent(subcontext, event);
      }
    }
  }

  getStats(): string {
    const parts = [];

    const priorCount = Object.keys(this.priorValues).length - 1;
    parts.push("distinct samples: " + priorCount);

    const dataCount = Object.keys(this.data).length;
    const eventCount = Object.values(this.data).reduce<number>(
      (p, c) => p + Object.keys(c).length,
      0
    );

    parts.push("dictionary size (contexts): " + dataCount);
    parts.push("dictionary size (events): " + eventCount);

    return parts.join(", ");
  }

  private split(str: string): string[] {
    return str.split(this.options.words ? /\s+/ : "");
  }

  private join(arr: string[]): string {
    return arr.join(this.options.words ? " " : "");
  }

  private observeEvent(context: string[], event: string): void {
    const key = this.join(context);
    if (!(key in this.data)) {
      this.data[key] = {};
    }
    const data = this.data[key];

    if (!(event in data)) {
      data[event] = 0;
    }
    data[event]++;
  }

  private sample(context: string[]): string {
    const backedoff = this.backoff(context);
    const key = this.join(backedoff);
    const data = this.data[key];

    let available: { [ev: string]: number };

    if (this.options.prior) {
      available = {};

      for (const [ev, value] of Object.entries(this.priorValues)) {
        available[ev] = value;
      }

      for (const [ev, value] of Object.entries(data)) {
        available[ev] += value;
      }
    } else {
      available = data;
    }

    return rng.getWeightedValue(available);
  }

  private backoff(context: string[]): string[] {
    let result: string[] = context;
    if (context.length > this.options.order) {
      result = context.slice(-this.options.order);
    } else if (context.length < this.options.order) {
      result = this.prefix
        .slice(0, this.options.order - context.length)
        .concat(context);
    }

    while (!(this.join(result) in this.data) && result.length > 0) {
      result = result.slice(1);
    }

    return result;
  }
}
