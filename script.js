
const codeElement = document.getElementById("code");
const lineNumbers = document.getElementById("lineNumbers");
const lineStatus = document.getElementById("lineStatus");
const replayButton = document.getElementById("replay");
const keys = document.getElementById("keys");

const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

const lines = [
  '<span class="comment">// maybe in another lifetime...</span>',
  '',
  '<span class="keyword">const</span> <span class="variable">you</span> = <span class="string">"the one I never forgot"</span>;',
  '<span class="keyword">let</span> <span class="variable">time</span> = <span class="string">"moving forward"</span>;',
  '',
  '<span class="keyword">function</span> <span class="function">remember</span>() {',
  '  <span class="keyword">if</span> (<span class="variable">the_night</span> === <span class="string">"quiet"</span>) {',
  '    <span class="keyword">return</span> <span class="string">"I still think of you."</span>;',
  '  }',
  '}',
  '',
  '<span class="comment">// some memories never learn to fade.</span>',
  '<span class="variable">remember</span>();'
];

const plainLines = [
  '// maybe in another lifetime...',
  '',
  'const you = "the one I never forgot";',
  'let time = "moving forward";',
  '',
  'function remember() {',
  '  if (the_night === "quiet") {',
  '    return "I still think of you.";',
  '  }',
  '}',
  '',
  '// some memories never learn to fade.',
  'remember();'
];

let lineIndex = 0;
let charIndex = 0;
let timer;

function makeKeyboard() {
  for (let i = 0; i < 60; i++) {
    const key = document.createElement("div");
    key.className = "key";
    keys.appendChild(key);
  }
}

function typeLine() {
  if (lineIndex >= lines.length) {
    lineStatus.textContent = lines.length;
    return;
  }

  const currentPlain = plainLines[lineIndex];

  if (currentPlain.length === 0) {
    codeElement.innerHTML += "\n";
    lineIndex++;
    charIndex = 0;
    updateLineNumbers();
    timer = setTimeout(typeLine, 260);
    return;
  }

  const visible = currentPlain.slice(0, charIndex + 1);
  const safeText = escapeHTML(visible);
  const colored = colorPartialLine(lineIndex, safeText);
  const completed = lines.slice(0, lineIndex).join("\n");

  codeElement.innerHTML = completed + (lineIndex ? "\n" : "") + colored;

  charIndex++;
  lineStatus.textContent = lineIndex + 1;

  if (charIndex >= currentPlain.length) {
    lineIndex++;
    charIndex = 0;
    updateLineNumbers();
    timer = setTimeout(typeLine, 520);
  } else {
    timer = setTimeout(typeLine, 55 + Math.random() * 55);
  }
}

function colorPartialLine(index, text) {
  if (index === 0 || index === 11) {
    return `<span class="comment">${text}</span>`;
  }

  if (index === 2) {
    return text
      .replace("const", '<span class="keyword">const</span>')
      .replace("you", '<span class="variable">you</span>')
      .replace(/&quot;(.*?)&quot;/g, '<span class="string">"$1"</span>');
  }

  if (index === 3) {
    return text
      .replace("let", '<span class="keyword">let</span>')
      .replace("time", '<span class="variable">time</span>')
      .replace(/&quot;(.*?)&quot;/g, '<span class="string">"$1"</span>');
  }

  if (index === 5) {
    return text
      .replace("function", '<span class="keyword">function</span>')
      .replace("remember", '<span class="function">remember</span>');
  }

  if (index === 6) {
    return text
      .replace("if", '<span class="keyword">if</span>')
      .replace("the_night", '<span class="variable">the_night</span>')
      .replace(/&quot;(.*?)&quot;/g, '<span class="string">"$1"</span>');
  }

  if (index === 7) {
    return text
      .replace("return", '<span class="keyword">return</span>')
      .replace(/&quot;(.*?)&quot;/g, '<span class="string">"$1"</span>');
  }

  if (index === 12) {
    return text.replace("remember", '<span class="variable">remember</span>');
  }

  return text;
}

function escapeHTML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function updateLineNumbers() {
  lineNumbers.innerHTML = Array.from(
    { length: Math.max(lineIndex + 1, 1) },
    (_, i) => i + 1
  ).join("<br>");
}

function replay() {
  clearTimeout(timer);

  lineIndex = 0;
  charIndex = 0;

  codeElement.innerHTML = "";
  lineNumbers.innerHTML = "1";
  lineStatus.textContent = "1";

  timer = setTimeout(typeLine, 900);
}

async function toggleMusic() {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();

      musicButton.textContent = "♫ Music Playing";
      musicButton.classList.add("playing");
    } catch (error) {
      musicButton.textContent = "Music unavailable";
    }
  } else {
    backgroundMusic.pause();

    musicButton.textContent = "♫ Play Music";
    musicButton.classList.remove("playing");
  }
}

backgroundMusic.volume = 0.35;

backgroundMusic.addEventListener("ended", () => {
  musicButton.textContent = "♫ Play Music";
  musicButton.classList.remove("playing");
});

makeKeyboard();
replay();

replayButton.addEventListener("click", replay);
musicButton.addEventListener("click", toggleMusic);
