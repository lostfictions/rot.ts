import { defaultRNG } from './rng'

export interface StringGeneratorOptions {
  /** Use word mode? */
  words: boolean
  order: number
  prior: number
}

/**
 * (Markov process-based) string generator.
 *
 * Copied from a [RogueBasin article](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme).
 *
 * Offers configurable order and prior.
 * @param {object} [options]
 * @param {bool} [options.words=false] Use word mode?
 * @param {int} [options.order=3]
 * @param {float} [options.prior=0.001]
 */
export class StringGenerator {
  private readonly options: StringGeneratorOptions
  private readonly boundary = String.fromCharCode(0)
  private readonly suffix = this.boundary
  private readonly prefix: string[] = []
  private priorValues: { [val: string]: number } = {}
  private data = {}

  constructor(options?: Partial<StringGeneratorOptions>) {
    this.options = {
      words: false,
      order: 3,
      prior: 0.001,
      ...options
    }

    for (let i = 0; i < this.options.order; i++) {
      this.prefix.push(this.boundary)
    }

    this.priorValues[this.boundary] = this.options.prior
  }

  /**
   * Remove all learning data
   */
  clear(): void {
    this.data = {}
    this.priorValues = {}
  }

  /**
   * @returns Generated string
   */
  generate(): string {
    const result = [this.sample(this.prefix)]
    while (result[result.length - 1] !== this.boundary) {
      result.push(this.sample(result))
    }
    return this.join(result.slice(0, -1))
  }

  /**
   * Observe (learn) a string from a training set
   */
  observe(str: string): void {
    let tokens = this.split(str)

    for(const token of tokens) {
      this.priorValues[token] = this.options.prior
    }

    tokens = this.prefix.concat(tokens).concat(this.suffix) /* add boundary symbols */

    for (var i=this.options.order; i<tokens.length; i++) {
      var context = tokens.slice(i-this.options.order, i);
      var event = tokens[i];
      for (var j=0; j<context.length; j++) {
        var subcontext = context.slice(j);
        this.observeEvent(subcontext, event);
      }
    }
  }

  getStats(): string {
    var parts = [];

    var priorCount = 0;
    for (var p in this.priorValues) { priorCount++; }
    priorCount--; /* boundary */
    parts.push("distinct samples: " + priorCount);

    var dataCount = 0;
    var eventCount = 0;
    for (var p in this.data) {
      dataCount++;
      for (var key in this.data[p]) {
        eventCount++;
      }
    }
    parts.push("dictionary size (contexts): " + dataCount);
    parts.push("dictionary size (events): " + eventCount);

    return parts.join(", ")
  }

  private split(str: string): string[] {
    return str.split(this.options.words ? /\s+/ : '')
  }

  private join(arr: string[]): string {
    return arr.join(this.options.words ? " " : "");
  }

  private observeEvent(context: string[], event: string): void {
    var key = this.join(context);
    if (!(key in this.data)) { this.data[key] = {}; }
    var data = this.data[key];

    if (!(event in data)) { data[event] = 0; }
    data[event]++;
  }

  private sample(context: string[]): string {
    context = this.backoff(context);
    var key = this.join(context);
    var data = this.data[key];

    const available = {}

    if (this.options.prior) {
      for (var event in this.priorValues) { available[event] = this.priorValues[event]; }
      for (var event in data) { available[event] += data[event]; }
    } else {
      available = data
    }

    return defaultRNG.getWeightedValue(available)
  }

  private backoff(context: string[]): string[] {
    if (context.length > this.options.order) {
      context = context.slice(-this.options.order);
    } else if (context.length < this.options.order) {
      context = this.prefix.slice(0, this.options.order - context.length).concat(context);
    }

    while (!(this.join(context) in this.data) && context.length > 0) { context = context.slice(1); }

    return context;
  }
}
