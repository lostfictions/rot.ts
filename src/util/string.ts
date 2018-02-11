/**
 * Return the given string with its first letter capitalized.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * Return the given string padded on the left with `character` until it's at
 * least `count` characters long.
 */
export function lpad(str: string, character = "0", count = 2): string {
  let s = "";
  while (s.length < count - str.length) {
    s += character;
  }
  s = s.substring(0, count - str.length);
  return s + str;
}

/**
 * Return the given string padded on the right with `character` until it's at
 * least `count` characters long.
 */
export function rpad(str: string, character = "0", count = 2): string {
  let s = "";
  while (s.length < count - str.length) {
    s += character;
  }
  s = s.substring(0, count - str.length);
  return str + s;
}
