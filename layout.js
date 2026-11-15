/**
 * Ordered guillotine layout. Area stays proportional to weight, and the
 * split is chosen to keep the smallest cell as large and as square as possible.
 * n is at most 7, so every ordered split is cheap to score.
 */
function bestLayout(weights, x, y, w, h, gap) {
    if (weights.length === 1) {
        const innerW = w - gap;
        const innerH = h - gap;
        const minSide = Math.min(innerW, innerH);
        const worstAspect = innerW > 0 && innerH > 0 ? Math.max(innerW / innerH, innerH / innerW) : 999;
        return { minSide, worstAspect, rects: [{ x, y, w, h }] };
    }
    const total = weights.reduce((sum, value) => sum + value, 0);
    let best = null;
    const consider = (candidate) => {
        if (!best ||
            candidate.minSide > best.minSide + 0.5 ||
            (Math.abs(candidate.minSide - best.minSide) <= 0.5 && candidate.worstAspect < best.worstAspect)) {
            best = candidate;
        }
    };
    for (let cut = 1; cut < weights.length; cut++) {
        const left = weights.slice(0, cut);
        const right = weights.slice(cut);
        const leftSum = left.reduce((sum, value) => sum + value, 0);
        const rightSum = total - leftSum;
        const leftW = (w * leftSum) / total;
        const sideA = bestLayout(left, x, y, leftW, h, gap);
        const sideB = bestLayout(right, x + leftW, y, w - leftW, h, gap);
        consider(join(sideA, sideB));
        const topH = (h * leftSum) / total;
        const stackA = bestLayout(left, x, y, w, topH, gap);
        const stackB = bestLayout(right, x, y + topH, w, h - topH, gap);
        consider(join(stackA, stackB));
    }
    return best;
}
function join(a, b) {
    return {
        minSide: Math.min(a.minSide, b.minSide),
        worstAspect: Math.max(a.worstAspect, b.worstAspect),
        rects: [...a.rects, ...b.rects],
    };
}
function snapInset(rect, width, height, gap) {
    const x = Math.max(0, Math.round(rect.x + gap / 2));
    const y = Math.max(0, Math.round(rect.y + gap / 2));
    const right = Math.min(width, Math.round(rect.x + rect.w - gap / 2));
    const bottom = Math.min(height, Math.round(rect.y + rect.h - gap / 2));
    return {
        x,
        y,
        w: Math.max(1, right - x),
        h: Math.max(1, bottom - y),
    };
}
/** Weight-proportional mosaic with a consistent gap and usable cell sizes. */
export function layoutWeighted(weights, width, height) {
    let chosen = [];
    let bestMin = -1;
    for (const gap of [6, 5, 4, 3]) {
        const laid = bestLayout(weights, 0, 0, width, height, gap);
        const rects = laid.rects.map((rect) => snapInset(rect, width, height, gap));
        const minSide = rects.reduce((min, rect) => Math.min(min, rect.w, rect.h), Infinity);
        if (minSide > bestMin) {
            bestMin = minSide;
            chosen = rects;
        }
        if (minSide >= 44)
            return rects;
    }
    return chosen;
}
