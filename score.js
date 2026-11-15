/** Integer percent, safe against binary float noise. */
export function percentOf(weight) { return Math.round(weight * 100); }
export function targetWeights(holdings) {
  const map = new Map();
  for (const holding of holdings) map.set(holding.instrumentId, percentOf(holding.weight));
  return map;
}
/** Original exact-match scorer, retained for compatibility and diagnostics. */
export function similarityScore(slotPercents, placed, target) {
  let got = 0, total = 0;
  for (let i = 0; i < slotPercents.length; i++) {
    const w = slotPercents[i] ?? 0;
    total += w;
    if (placed[i] && target.get(placed[i]) === w) got += w;
  }
  return total > 0 ? got / total : 0;
}

const clamp = x => Math.max(0, Math.min(1, x));
const near = (actual, target, scale = 35) => clamp(1 - Math.abs(actual - target) / scale);
const atLeast = (actual, target) => clamp(actual / Math.max(1, target));
const all = (...values) => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Score the strategy, not the original ticker-to-slot arrangement.
 * Every displayed rule maps to a concrete, testable condition.
 * A level is won ONLY when 100% is allocated and every condition passes.
 * Partial credit powers the Strategy Signal without awarding false victories.
 */
export function evaluateStrategy(level, slotPercents, placed) {
  const instruments = new Map(
    [...level.holdings, ...(level.decoys || [])].map(p => [p.instrumentId, p])
  );
  const positions = placed.flatMap((id, i) => {
    const instrument = instruments.get(id);
    return id && instrument ? [{ id, weight: Number(slotPercents[i]) || 0, classNo: Number(instrument.classNo) }] : [];
  });
  const count = positions.length;
  const allocated = positions.reduce((s, p) => s + p.weight, 0);
  const stocks = positions.filter(p => p.classNo === 100);
  const funds = positions.filter(p => p.classNo >= 5 && p.classNo <= 20);
  const alternatives = positions.filter(p => p.classNo === 22 || p.classNo === 23);
  const sum = xs => xs.reduce((s, p) => s + p.weight, 0);
  const stockWeight = sum(stocks), fundWeight = sum(funds), altWeight = sum(alternatives);
  const weights = positions.map(p => p.weight).sort((a,b) => b-a);
  const maxWeight = weights[0] || 0;
  const minWeight = weights[weights.length-1] || 0;
  const numAt = n => weights.filter(w => w === n).length;
  const noDecoys = positions.every(p => !(level.decoys || []).some(d => d.instrumentId === p.id));
  const complete = allocated === 100 && count === slotPercents.length;

  // Each entry: a continuous progress value, and a strict pass/fail condition.
  // The first criterion in each level covers the core investment construction.
  let checks;
  switch (level.level) {
    case 1:
      checks = [
        {progress: atLeast(count,1), pass: count === 1},
        {progress: near(maxWeight,100,100), pass: maxWeight === 100},
        {progress: allocated/100, pass: complete}
      ]; break;
    case 2:
      checks = [
        {progress: atLeast(count,2), pass: count === 2},
        {progress: count === 2 ? (weights[0] !== weights[1] ? 1 : 0) : 0, pass: count === 2 && weights[0] > weights[1]},
        {progress: allocated/100, pass: complete}
      ]; break;
    case 3:
      checks = [
        {progress: all(atLeast(count,3), atLeast(stocks.length,3)), pass: count === 3 && stocks.length === 3},
        {progress: atLeast(stocks.length,3), pass: stocks.length === 3},
        {progress: near(maxWeight,50,50), pass: maxWeight === 50}
      ]; break;
    case 4:
      checks = [
        {progress: all(atLeast(stocks.length,1),atLeast(funds.length,1)), pass: stocks.length > 0 && funds.length > 0},
        {progress: near(fundWeight,40,40), pass: fundWeight === 40},
        {progress: near(stockWeight,60,60), pass: stockWeight === 60}
      ]; break;
    case 5:
      checks = [
        {progress: atLeast(count,5), pass: count === 5},
        {progress: all(atLeast(stocks.length,1),atLeast(funds.length,1)), pass: stocks.length > 0 && funds.length > 0},
        {progress: noDecoys ? 1 : 0, pass: complete && noDecoys}
      ]; break;
    case 6:
      checks = [
        {progress: all(atLeast(count,6),atLeast(stocks.length,4)), pass: count === 6 && stocks.length >= 4},
        {progress: all(atLeast(stocks.length,1),atLeast(funds.length,1)), pass: stocks.length > 0 && funds.length > 0},
        {progress: atLeast(numAt(10),2), pass: numAt(10) === 2 && minWeight === 10}
      ]; break;
    case 7:
      checks = [
        {progress: all(atLeast(count,6),atLeast(stocks.length,6)), pass: count === 6 && stocks.length === 6},
        {progress: maxWeight <= 26 ? 1 : near(maxWeight,26,40), pass: maxWeight <= 26},
        {progress: atLeast(numAt(12),2), pass: numAt(12) >= 2}
      ]; break;
    case 8:
      checks = [
        {progress: atLeast(count,7), pass: count === 7},
        {progress: all(atLeast(stocks.length+funds.length,1),atLeast(alternatives.length,1)), pass: stocks.length+funds.length > 0 && alternatives.length > 0},
        {progress: near(altWeight,6,30), pass: altWeight === 6}
      ]; break;
    case 9:
      checks = [
        {progress: atLeast(count,7), pass: count === 7},
        {progress: all(atLeast(stocks.length,1),atLeast(funds.length,1)), pass: stocks.length > 0 && funds.length > 0},
        {progress: count ? new Set(weights).size/count : 0, pass: new Set(weights).size === 7}
      ]; break;
    case 10:
      checks = [
        {progress: atLeast(count,7), pass: count === 7},
        {progress: all(atLeast(stocks.length,1),atLeast(funds.length,1)), pass: stocks.length > 0 && funds.some(p => p.id === "IWDA.AS" || p.id === "VEU.US")},
        {progress: count ? weights.filter(w => w >= 12 && w <= 18).length/count : 0,
          pass: count === 7 && weights.every(w => w >= 12 && w <= 18)}
      ]; break;
    default: throw new Error(`Unknown strategy level ${level.level}`);
  }
  const passed = checks.map(c => c.pass);
  const perfect = complete && passed.every(Boolean);
  const progress = .20 * clamp(allocated / 100) + .80 * all(...checks.map(c => clamp(c.progress)));
  return {
    score: perfect ? 1 : Math.min(.985, progress),
    perfect,
    passed,
    allocated,
    count
  };
}
export function isPerfectScore(score) { return score >= 0.999; }
export function signalName(score) {
  if (score >= 0.999) return "perfect";
  if (score >= 0.72) return "almost";
  if (score >= 0.45) return "hot";
  if (score >= 0.12) return "warmer";
  return "searching";
}
export const SIGNAL_LABEL = {
  searching: "Searching", warmer: "Getting warmer", hot: "Hot",
  almost: "Almost there", perfect: "Perfect!"
};
