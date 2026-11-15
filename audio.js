let ctx = null;
let master = null;
let noise = null;
let enabled = true;
export function setSoundEnabled(value) {
    enabled = value;
}
export function unlockAudio() {
    const Ctx = window.AudioContext ||
        window.webkitAudioContext;
    if (!Ctx)
        return;
    if (!ctx) {
        ctx = new Ctx({ latencyHint: "interactive" });
        master = ctx.createGain();
        master.gain.value = 0.2;
        master.connect(ctx.destination);
        const length = Math.max(1, Math.floor(ctx.sampleRate * 0.06));
        noise = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < length; i++)
            data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    if (ctx.state === "suspended")
        void ctx.resume();
}
export function resumeAudio() {
    if (ctx && ctx.state === "suspended")
        void ctx.resume();
}
function envGain(start, peak, duration) {
    const audio = ctx;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    return gain;
}
function tone(start, from, to, duration, peak, type) {
    if (!ctx || !master)
        return;
    const osc = ctx.createOscillator();
    const gain = envGain(start, peak, duration);
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(40, from), start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
}
function click(start) {
    if (!ctx || !master || !noise)
        return;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(700, start);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start(start);
    source.stop(start + 0.05);
}
function arpeggio(notes, step, peak) {
    if (!ctx)
        return;
    const start = ctx.currentTime;
    click(start);
    notes.forEach((freq, index) => {
        tone(start + index * step, freq, freq * 1.01, step * 0.92, peak, "triangle");
    });
}
export function playSfx(name) {
    if (!enabled || !ctx || !master)
        return;
    const now = ctx.currentTime;
    const wobble = 1 + (Math.random() - 0.5) * 0.04;
    switch (name) {
        case "pick":
            tone(now, 680 * wobble, 920, 0.07, 0.07, "sine");
            break;
        case "drop":
            click(now);
            tone(now, 210 * wobble, 130, 0.09, 0.09, "sine");
            break;
        case "swap":
            tone(now, 520, 540, 0.06, 0.07, "sine");
            tone(now + 0.07, 760, 790, 0.07, 0.07, "sine");
            break;
        case "up":
            tone(now, 523, 784, 0.16, 0.07, "triangle");
            break;
        case "down":
            tone(now, 360, 220, 0.14, 0.045, "sine");
            break;
        case "win":
            arpeggio([523, 659, 784, 1047], 0.09, 0.07);
            break;
        case "master":
            arpeggio([392, 523, 659, 784, 1047, 1318], 0.11, 0.075);
            break;
        default:
            break;
    }
}
