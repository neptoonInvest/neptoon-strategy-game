
let ctx = null;
let master = null;
let noise = null;
let enabled = true;

export function setSoundEnabled(value) {
    enabled = Boolean(value);
}

export function unlockAudio() {

    const Ctx =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!Ctx) return;

    if (!ctx) {

        ctx = new Ctx({
            latencyHint: "interactive"
        });

        master = ctx.createGain();

        // Overall volume
        master.gain.value = 0.16;

        master.connect(ctx.destination);

        const length =
            Math.max(
                1,
                Math.floor(ctx.sampleRate * 0.08)
            );

        noise = ctx.createBuffer(
            1,
            length,
            ctx.sampleRate
        );

        const data = noise.getChannelData(0);

        for (let i = 0; i < length; i++) {
            data[i] =
                (Math.random() * 2 - 1) *
                (1 - i / length);
        }
    }

    if (ctx.state === "suspended") {
        void ctx.resume();
    }
}

export function resumeAudio() {

    if (ctx && ctx.state === "suspended") {
        void ctx.resume();
    }
}


// ========================================
// ARCADE TONE ENGINE
// ========================================

function tone(
    start,
    from,
    to,
    duration,
    peak = 0.1,
    type = "square"
) {

    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;

    osc.frequency.setValueAtTime(
        Math.max(40, from),
        start
    );

    osc.frequency.exponentialRampToValueAtTime(
        Math.max(40, to),
        start + duration
    );

    gain.gain.setValueAtTime(
        0.0001,
        start
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, peak),
        start + 0.008
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + duration
    );

    osc.connect(gain);
    gain.connect(master);

    osc.start(start);
    osc.stop(start + duration + 0.02);
}


// ========================================
// ARCADE NOISE CLICK
// ========================================

function click(start, peak = 0.16) {

    if (!ctx || !master || !noise) return;

    const source = ctx.createBufferSource();

    source.buffer = noise;

    const filter = ctx.createBiquadFilter();

    filter.type = "highpass";

    filter.frequency.setValueAtTime(
        1100,
        start
    );

    const gain = ctx.createGain();

    gain.gain.setValueAtTime(
        0.0001,
        start
    );

    gain.gain.exponentialRampToValueAtTime(
        peak,
        start + 0.004
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + 0.045
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    source.start(start);
    source.stop(start + 0.05);
}


// ========================================
// STEPPED ARCADE NOTES
// ========================================

function notes(
    frequencies,
    step,
    duration,
    peak,
    type = "square",
    startOffset = 0
) {

    if (!ctx) return;

    const start =
        ctx.currentTime + startOffset;

    frequencies.forEach((frequency, index) => {

        const time =
            start + index * step;

        tone(
            time,
            frequency,
            frequency,
            duration,
            peak,
            type
        );

    });
}


// ========================================
// SOUND EFFECTS
// ========================================

export function playSfx(name) {

    if (!enabled || !ctx || !master) {
        return;
    }

    const now = ctx.currentTime;

    switch (name) {

        // Sharp arcade selection
        case "pick":

            tone(
                now,
                520,
                1040,
                0.085,
                0.11,
                "square"
            );

            break;


        // Mechanical electronic placement
        case "drop":

            click(now, 0.18);

            tone(
                now,
                340,
                150,
                0.13,
                0.13,
                "square"
            );

            break;


        // Two-tone arcade swap
        case "swap":

            tone(
                now,
                440,
                440,
                0.075,
                0.10,
                "square"
            );

            tone(
                now + 0.085,
                660,
                660,
                0.09,
                0.11,
                "square"
            );

            break;


        // Positive progress
        case "up":

            notes(
                [523, 659, 784],
                0.075,
                0.11,
                0.10
            );

            break;


        // Negative feedback
        case "down":

            notes(
                [392, 294, 196],
                0.07,
                0.11,
                0.08
            );

            break;


        // =================================
        // LEVEL VICTORY
        // =================================

        case "win":

            notes(
                [
                    523,
                    659,
                    784,
                    1047,
                    1318,
                    1047
                ],
                0.12,
                0.16,
                0.12
            );

            // Final harmonic accent
            tone(
                now + 0.62,
                523,
                523,
                0.34,
                0.09,
                "triangle"
            );

            tone(
                now + 0.62,
                784,
                784,
                0.34,
                0.08,
                "square"
            );

            break;


        // =================================
        // LEVEL 10 GRAND FINALE
        // =================================

        case "master":

            notes(
                [
                    392,
                    523,
                    659,
                    784,
                    1047,
                    1318,
                    1568,
                    2093
                ],
                0.13,
                0.17,
                0.12
            );

            // Final major chord
            [523, 659, 784, 1047].forEach(
                frequency => {

                    tone(
                        now + 1.15,
                        frequency,
                        frequency,
                        0.65,
                        0.075,
                        "square"
                    );

                }
            );

            // Bass accent
            tone(
                now + 1.15,
                131,
                131,
                0.6,
                0.12,
                "triangle"
            );

            break;


        default:
            break;
    }
}

