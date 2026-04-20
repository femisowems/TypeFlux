export const easyWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "system", "computer", "program", "data", "network", "cloud"
];

export const paragraphs = [
  "Typing is a skill that requires both muscle memory and extreme concentration. When you first begin to learn how to type efficiently, it feels incredibly unnatural to your hands. However, as you continue to practice daily, your brain slowly maps the exact keyboard layout into your subconscious. Eventually, you will stop looking at the keys entirely and your fingers will simply float across the board.",
  "The rapid evolution of web development has completely transformed the modern software landscape. Years ago, developers relied strictly on basic HTML files intertwined with messy styling scripts. Today, complex JavaScript frameworks seamlessly orchestrate real-time data flows, dynamically rendering stunning components into the viewport without ever forcing the browser to physically reload the entire document.",
  "Deep inside the architecture of any computer lies the processor, continuously executing millions of calculations every single second. It communicates directly with volatile memory modules to access crucial application data instantly. Whenever you press a key on your board, an electrical signal travels through the motherboard and is instantly interpreted by the operating system to display your exact character.",
  "Artificial intelligence has leaped from the pages of science fiction books directly into our modern reality. We now rely on sophisticated machine learning algorithms to filter our emails, recommend our movies, and even assist in writing complex application source code. While the sheer speed of this technological advancement is terrifying to some, it undeniably opens the doors to an incredibly bright future.",
  "Success in software engineering is rarely born out of sheer natural talent alone. It typically comes from thousands of frustrating hours spent meticulously debugging broken logic and reading dense documentation. The true mark of a senior developer is not knowing every single answer by heart, but rather having the patience and structural methodology required to isolate and resolve absolutely any problem."
];

export const historyFacts = [
  "Pope Innocent IV was born in Genoa and went on to become one of the most influential popes of the 13th century, central to the conflict with the Holy Roman Empire.",
  "Henry VIII of England moved to break away from the authority of the Pope and the Roman Catholic Church, establishing the Church of England in 1534.",
  "Joan of Arc, nicknamed the Maid of Orleans, was a peasant girl who led the French army in a momentous victory at Orleans during the Hundred Years' War.",
  "The Magna Carta, signed in 1215, was a landmark document that limited the power of the English King and established the principle that everyone is subject to the law.",
  "The Industrial Revolution, which began in the 18th century, transformed agrarian societies into industrialized urban ones through technological advancements.",
  "Alexander the Great, King of Macedonia, created one of the largest empires in history by the age of thirty, stretching from Greece to northwestern India.",
  "The Renaissance was a fervent period of European cultural, artistic, political and economic rebirth following the Middle Ages.",
  "Nelson Mandela was a South African anti-apartheid revolutionary and political leader who served as the first black president of South Africa from 1994 to 1999.",
  "The French Revolution was a period of far-reaching social and political upheaval in France and its colonies beginning in 1789.",
  "Gengis Khan founded the Mongol Empire by uniting many of the nomadic tribes of Northeast Asia and went on to conquer much of Eurasia."
];

export const hardWords = [
  "acknowledgment", "bureaucracy", "circumstance", "development", "environment",
  "familiarize", "government", "hypothetical", "immediately", "jurisdiction",
  "knowledgeable", "laboratory", "maintenance", "necessary", "opportunity",
  "particularly", "questionnaire", "responsibility", "simultaneously", "temperature",
  "unprecedented", "vulnerability", "weather", "xenophobia", "yesterday", "zoology",
  "algorithm", "cryptography", "architecture", "authentication", "mathematics"
];

export const codeWords = [
  "const", "let", "function", "return", "Promise", "async", "await", "import", "export",
  "class", "interface", "type", "public", "private", "protected", "implements", "extends",
  "console.log", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "Array",
  "String", "Number", "Boolean", "Object", "Map", "Set", "WeakMap", "WeakSet", "typeof",
  "instanceof", "try", "catch", "finally", "throw", "new", "this", "super", "null", "undefined",
  "NaN", "Infinity", "Math.random", "JSON.parse", "JSON.stringify", "document.getElementById",
  "window.addEventListener", "Event", "Error", "TypeError", "ReferenceError", "SyntaxError",
  "module.exports", "require", "process.env", "__dirname", "__filename", "fetch", "Response"
];

export const reactWords = [
  "useState", "useEffect", "useContext", "useReducer", "useCallback", "useMemo", "useRef",
  "useLayoutEffect", "useImperativeHandle", "useDebugValue", "useTransition", "useDeferredValue",
  "useSyncExternalStore", "useInsertionEffect", "component", "props", "state", "context",
  "render", "mount", "unmount", "hook", "fragment", "portal", "strict-mode", "suspense",
  "concurrent", "hydrate", "create-root", "jsx", "tsx", "virtual-dom", "diffing-algorithm",
  "functional-component", "class-component", "lifecycle", "dependency-array", "synthetic-event"
];

export const gitWords = [
  "rebase", "cherry-pick", "reflog", "bisect", "stash", "commit", "push", "pull", "fetch",
  "merge", "branch", "checkout", "switch", "restore", "reset", "revert", "diff", "log",
  "show", "status", "add", "rm", "mv", "remote", "origin", "upstream", "fork", "clone",
  "init", "config", "alias", "hook", "submodule", "subtree", "tag", "clean", "blame",
  "prune", "gc", "archive", "bundle", "fast-forward", "conflict", "HEAD", "detached-head"
];

export const cssWords = [
  "flex-direction", "justify-content", "align-items", "grid-template-columns", "grid-row-gap",
  "box-sizing", "z-index", "position", "absolute", "relative", "fixed", "sticky", "display",
  "opacity", "visibility", "background-color", "border-radius", "box-shadow", "box-sizing",
  "transition", "animation", "transform", "translate", "scale", "rotate", "skew", "filter",
  "backdrop-filter", "pointer-events", "overflow", "margin", "padding", "width", "height",
  "max-width", "min-height", "aspect-ratio", "content-visibility", "will-change"
];

export interface GeneratorOptions {
  count?: number;
  vocabulary?: 'easy' | 'hard' | 'code' | 'paragraphs' | 'react' | 'git' | 'css' | 'history';
  punctuation?: boolean;
  numbers?: boolean;
}

export const generateWords = (options: GeneratorOptions = {}): string[] => {
  const { 
    count = 60, 
    vocabulary = 'paragraphs',
    punctuation = false,
    numbers = false
  } = options;
  if (vocabulary === 'paragraphs') {
    let text = "";
    while (text.split(' ').length < count + 5) {
      text += paragraphs[Math.floor(Math.random() * paragraphs.length)] + " ";
    }
    return text.trim().split(' ').slice(0, count);
  }

  if (vocabulary === 'history') {
    let text = "";
    while (text.split(' ').length < count + 5) {
      text += historyFacts[Math.floor(Math.random() * historyFacts.length)] + " ";
    }
    return text.trim().split(' ').slice(0, count);
  }

  let pool = easyWords;
  if (vocabulary === 'hard') pool = [...easyWords, ...hardWords];
  if (vocabulary === 'code') pool = [...easyWords, ...codeWords];
  if (vocabulary === 'react') pool = [...easyWords, ...reactWords];
  if (vocabulary === 'git') pool = [...easyWords, ...gitWords];
  if (vocabulary === 'css') pool = [...easyWords, ...cssWords];

  const words: string[] = [];
  const punctuationMarks = ['.', ',', '?', '!', ';', ':', '()', '""', "''"];

  for (let i = 0; i < count; i++) {
    if (numbers && Math.random() < 0.1) {
       words.push(Math.floor(Math.random() * 10000).toString());
       continue;
    }

    let word = pool[Math.floor(Math.random() * pool.length)];

    if (punctuation && Math.random() < 0.2) {
      if (Math.random() < 0.5) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (mark === '()') word = `(${word})`;
      else if (mark === '""') word = `"${word}"`;
      else if (mark === "''") word = `'${word}'`;
      else word = word + mark;
    }

    words.push(word);
  }
  return words;
};
