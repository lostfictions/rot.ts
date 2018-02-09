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
export function lpad(str: string, character = '0', count = 2): string {
  let s = "";
  while (s.length < (count - str.length)) { s += character; }
  s = s.substring(0, count - str.length);
  return s + str;
};

/**
 * Return the given string padded on the right with `character` until it's at
 * least `count` characters long.
 */
export function rpad(str: string, character = '0', count = 2): string {
  let s = "";
  while (s.length < (count - str.length)) { s += character; }
  s = s.substring(0, count - str.length);
  return str + s;
}


// TODO

/**
 * Format a string in a flexible way. Scans for %s strings and replaces them
 * with arguments. List of patterns is modifiable via String.format.map.
 */
export function format(template: string, ...args: any[]): string {
  var map = formatMap;

  const replacer = (match: string, group1: string, group2: string, index: number) => {
    if (template.charAt(index-1) == "%") { return match.substring(1); }
    if (!args.length) { return match; }
    var obj = args[0];

    var group = group1 || group2;
    var parts = group.split(",");
    var name = parts.shift();
    var method = map[name.toLowerCase()];
    if (!method) { return match; }

    var obj = args.shift();
    var replaced = obj[method].apply(obj, parts);

    var first = name.charAt(0);
    if (first != first.toLowerCase()) { replaced = replaced.capitalize(); }

    return replaced;
  };
  return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}

const formatMap: { readonly [templateChar: string]: string } = {
  "s": "toString"
}
