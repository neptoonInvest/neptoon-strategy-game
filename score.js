/** Integer percent, safe against binary float noise. */
export function percentOf(weight) {
    return Math.round(weight * 100);
}
export function targetWeights(holdings) {
    const map = new Map();
    for (const holding of holdings)
        map.set(holding.instrumentId, percentOf(holding.weight));
    return map;
}
/**
 * Hidden similarity in 0..1.
 * A placed instrument scores its slot only when that slot's weight is the
 * instrument's target weight. Equal-weight slots are interchangeable because
 * both instruments share the same target weight.
 * Empty slots and decoys contribute nothing. 1 means the exact portfolio.
 */
export function similarityScore(slotPercents, placed, target) {
    let got = 0;
    let total = 0;
    for (let i = 0; i < slotPercents.length; i++) {
        const slotWeight = slotPercents[i] ?? 0;
        total += slotWeight;
        const id = placed[i];
        if (!id)
            continue;
        if (target.get(id) === slotWeight)
            got += slotWeight;
    }
    if (total <= 0)
        return 0;
    return got / total;
}
export function isPerfectScore(score) {
    return score >= 0.999;
}
export function signalName(score) {
    if (score >= 0.999)
        return "perfect";
    if (score >= 0.72)
        return "almost";
    if (score >= 0.45)
        return "hot";
    if (score >= 0.12)
        return "warmer";
    return "searching";
}
export const SIGNAL_LABEL = {
    searching: "Searching",
    warmer: "Getting warmer",
    hot: "Hot",
    almost: "Almost there",
    perfect: "Perfect!",
};
