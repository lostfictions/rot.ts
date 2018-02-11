export enum TokenType {
  Text = 0,
  Newline = 1,
  FG = 2,
  BG = 3
}

export type Token =
  | { type: TokenType.Text; value: string }
  | { type: TokenType.FG; value: string }
  | { type: TokenType.BG; value: string }
  | { type: TokenType.Newline };

const RE_COLORS = /%([bc]){([^}]*)}/g;

/**
 * Measure size of a resulting text block
 */
export function measure(
  str: string,
  maxWidth: number
): { width: number; height: number } {
  const result = { width: 0, height: 1 };
  const tokens = tokenize(str, maxWidth);
  let lineWidth = 0;

  for (const token of tokens) {
    switch (token.type) {
      case TokenType.Text:
        lineWidth += token.value.length;
        break;
      case TokenType.Newline:
        result.height++;
        result.width = Math.max(result.width, lineWidth);
        lineWidth = 0;
        break;
      default:
        throw new Error(`Unexpected token type: ${TokenType[token.type]}`);
    }
  }
  result.width = Math.max(result.width, lineWidth);

  return result;
}

/**
 * Convert string to a series of a formatting commands
 */
export function tokenize(str: string, maxWidth: number): Token[] {
  const result: Token[] = [];

  /* first tokenization pass - split texts and color formatting commands */
  let offset = 0;
  str.replace(
    RE_COLORS,
    (match: string, type: "b" | "c", name: string, index: number) => {
      /* string before */
      const s = str.substring(offset, index);
      if (s.length) {
        result.push({
          type: TokenType.Text,
          value: s
        });
      }

      /* color command */
      result.push({
        type: type === "c" ? TokenType.FG : TokenType.BG,
        value: name.trim()
      } as Token);

      offset = index + match.length;
      return "";
    }
  );

  /* last remaining part */
  const part = str.substring(offset);
  if (part.length) {
    result.push({
      type: TokenType.Text,
      value: part
    });
  }

  return breakLines(result, maxWidth);
}

/* insert line breaks into first-pass tokenized data */
function breakLines(tokens: Token[], maxWidth = Infinity): Token[] {
  let i = 0;
  let lineLength = 0;
  let lastTokenWithSpace = -1;

  while (i < tokens.length) {
    /* take all text tokens, remove space, apply linebreaks */
    const token = tokens[i];
    if (token.type === TokenType.Newline) {
      /* reset */
      lineLength = 0;
      lastTokenWithSpace = -1;
    }
    if (token.type !== TokenType.Text) {
      /* skip non-text tokens */
      i++;
      continue;
    }

    /* remove spaces at the beginning of line */
    while (lineLength === 0 && token.value.charAt(0) === " ") {
      token.value = token.value.substring(1);
    }

    /* forced newline? insert two new tokens after this one */
    const index = token.value.indexOf("\n");
    if (index !== -1) {
      token.value = breakInsideToken(tokens, i, index, true);

      /* if there are spaces at the end, we must remove them (we do not want the line too long) */
      const arr = token.value.split("");
      while (arr.length && arr[arr.length - 1] === " ") {
        arr.pop();
      }

      token.value = arr.join("");
    }

    /* token degenerated? */
    if (!token.value.length) {
      tokens.splice(i, 1);
      continue;
    }

    if (lineLength + token.value.length > maxWidth) {
      /* line too long, find a suitable breaking spot */

      /* is it possible to break within this token? */
      let index = -1;
      while (1) {
        const nextIndex = token.value.indexOf(" ", index + 1);
        if (nextIndex === -1) {
          break;
        }
        if (lineLength + nextIndex > maxWidth) {
          break;
        }
        index = nextIndex;
      }

      if (index !== -1) {
        /* break at space within this one */
        token.value = breakInsideToken(tokens, i, index, true);
      } else if (lastTokenWithSpace !== -1) {
        /* is there a previous token where a break can occur? */
        const token = tokens[lastTokenWithSpace];
        const breakIndex = token.value.lastIndexOf(" ");
        token.value = breakInsideToken(
          tokens,
          lastTokenWithSpace,
          breakIndex,
          true
        );
        i = lastTokenWithSpace;
      } else {
        /* force break in this token */
        token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
      }
    } else {
      /* line not long, continue */
      lineLength += token.value.length;
      if (token.value.indexOf(" ") !== -1) {
        lastTokenWithSpace = i;
      }
    }

    i++; /* advance to next token */
  }

  tokens.push({
    type: TokenType.Newline
  });

  /* remove trailing space from text tokens before newlines */
  let lastTextToken = null;
  for (const token of tokens) {
    switch (token.type) {
      case TokenType.Text:
        lastTextToken = token;
        break;
      case TokenType.Newline:
        if (lastTextToken) {
          /* remove trailing space */
          const arr = lastTextToken.value.split("");
          while (arr.length && arr[arr.length - 1] === " ") {
            arr.pop();
          }
          lastTextToken.value = arr.join("");
        }
        lastTextToken = null;
        break;
      default:
        throw new Error(`Unexpected token type: ${TokenType[token.type]}`);
    }
  }

  tokens.pop(); /* remove fake token */

  return tokens;
}

/**
 * Create new tokens and insert them into the stream
 * @param tokens
 * @param tokenIndex Token being processed
 * @param breakIndex Index within current token's value
 * @param removeBreakChar Do we want to remove the breaking character?
 * @returns remaining unbroken token value
 */
function breakInsideToken(
  tokens: Token[],
  tokenIndex: number,
  breakIndex: number,
  removeBreakChar: boolean
): string {
  const newBreakToken: Token = {
    type: TokenType.Newline
  };

  const newTextToken: Token = {
    type: TokenType.Text,
    value: tokens[tokenIndex].value.substring(
      breakIndex + (removeBreakChar ? 1 : 0)
    )
  };

  tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
  return tokens[tokenIndex].value.substring(0, breakIndex);
}
