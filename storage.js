const KEY = "neptoon.kys.v1";
export const SAVE_VERSION = 1;
export function defaultSave() {
    return {
        version: SAVE_VERSION,
        currentLevel: 1,
        highestCompleted: 0,
        soundEnabled: true,
        arrangement: [],
        tray: [],
    };
}
export function loadSave() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.version !== SAVE_VERSION)
            return null;
        const base = defaultSave();
        return {
            ...base,
            ...parsed,
            version: SAVE_VERSION,
            arrangement: Array.isArray(parsed.arrangement) ? parsed.arrangement : [],
            tray: Array.isArray(parsed.tray) ? parsed.tray : [],
            soundEnabled: parsed.soundEnabled !== false,
        };
    }
    catch {
        return null;
    }
}
export function writeSave(data) {
    try {
        localStorage.setItem(KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
    }
    catch {
        /* private mode / quota — keep playing in memory */
    }
}
export function clearSave() {
    try {
        localStorage.removeItem(KEY);
    }
    catch {
        /* ignore */
    }
}
