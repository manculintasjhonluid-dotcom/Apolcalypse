
const code = document.getElementById("code");
const backgroundMusic = document.getElementById("backgroundMusic");
const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const lineNumbers = document.getElementById("lineNumbers");

let typingInterval = null;
let firedCues = new Set();
let introTimeout = null;

const introLines = [
    "const myHeart = {",
    '    feeling: "in love",',
    '    reason: "you",',
    '    status: "forever"',
    "};",
    "",
    "function describeUs() {",
    '    return "A story written in the stars";',
    "}",
    "",
    "const memories = describeUs();",
    'console.log("Some feelings never fade...");'
];

const chorusCues = [
    {
        time: 55,
        text: "Got the music in you, baby, tell me why",
        reset: true
    },
    {
        time: 62,
        text: "Got the music in you, baby, tell me why"
    },
    {
        time: 70,
        text: "You've been locked in here forever and you just can't say goodbye"
    },
    {
        time: 120,
        text: "Your lips, my lips, apocalypse",
        reset: true
    },
    {
        time: 127,
        text: "Your lips, my lips, apocalypse"
    },
    {
        time: 177,
        text: "Got the music in you, baby, tell me why",
        reset: true
    },
    {
        time: 184,
        text: "Got the music in you, baby, tell me why"
    },
    {
        time: 192,
        text: "You've been locked in here forever and you just can't say goodbye"
    },
    {
        time: 200,
        text: "You've been locked in here forever and you just can't say goodbye"
    }
];

function updateLineNumbers() {
    lineNumbers.innerHTML = "";

    const totalLines = code.innerText.split("\n").length;

    for (let i = 1; i <= totalLines; i++) {
        const line = document.createElement("div");
        line.textContent = i;
        lineNumbers.appendChild(line);
    }
}

function stopTyping() {
    clearInterval(typingInterval);
    clearTimeout(introTimeout);
}

function typeLine(text, className = "", reset = false) {
    stopTyping();

    if (reset) {
        code.innerHTML = "";
    }

    const line = document.createElement("div");
    line.className = className;
    code.appendChild(line);

    let index = 0;

    typingInterval = setInterval(() => {
        if (index < text.length) {
            line.textContent += text.charAt(index);
            index++;
            updateLineNumbers();
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
        }
    }, 38);
}

function typeIntro() {
    stopTyping();
    code.innerHTML = "";

    let lineIndex = 0;

    function typeNextLine() {
        if (lineIndex >= introLines.length) {
            updateLineNumbers();
            return;
        }

        const line = document.createElement("div");
        line.className = "code-line";
        code.appendChild(line);

        const text = introLines[lineIndex];
        let characterIndex = 0;

        typingInterval = setInterval(() => {
            if (characterIndex < text.length) {
                line.textContent += text.charAt(characterIndex);
                characterIndex++;
                updateLineNumbers();
            } else {
                clearInterval(typingInterval);
                typingInterval = null;
                lineIndex++;
                introTimeout = setTimeout(typeNextLine, 250);
            }
        }, 45);
    }

    typeNextLine();
}

function checkChorusTiming() {
    const currentTime = backgroundMusic.currentTime;

    chorusCues.forEach((cue, index) => {
        if (currentTime >= cue.time && !firedCues.has(index)) {
            firedCues.add(index);
            typeLine(cue.text, "lyric-line", cue.reset === true);
        }
    });
}

async function playMusic() {
    try {
        await backgroundMusic.play();
        playButton.textContent = "Ⅱ Pause Music";
    } catch (error) {
        console.error("Music playback error:", error);
        playButton.textContent = "▶ Play Music";
        alert("Music could not play. Check that audio/apocalypse.mp3 exists and try again.");
    }
}

function pauseMusic() {
    backgroundMusic.pause();
    playButton.textContent = "▶ Play Music";
}

function replayEverything() {
    stopTyping();
    firedCues.clear();

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    typeIntro();
    playMusic();
}

playButton.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

replayButton.addEventListener("click", replayEverything);

backgroundMusic.addEventListener("timeupdate", checkChorusTiming);

backgroundMusic.addEventListener("ended", () => {
    playButton.textContent = "▶ Play Music";
});

backgroundMusic.addEventListener("error", () => {
    console.error("Audio file could not be loaded:", backgroundMusic.error);
});

typeIntro();
updateLineNumbers();
