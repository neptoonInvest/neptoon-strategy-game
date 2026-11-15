import { percentOf } from "./score.js";

/** Static demonstration portfolios for the ten-level prototype. */
// classNo: 100 = stocks, 5–20 = equity funds, 22 = gold.
// ETF classNo values are provisional and should be checked against Neptoon data.
const NVDA = { instrumentId: "NVDA.US", instrumentName: "NVIDIA", gameLabel: "NVDA", mediumLabel: "NVIDIA", classNo: 100 };
const AAPL = { instrumentId: "AAPL.US", instrumentName: "Apple", gameLabel: "AAPL", mediumLabel: "Apple", classNo: 100 };
const MSFT = { instrumentId: "MSFT.US", instrumentName: "Microsoft", gameLabel: "MSFT", mediumLabel: "Microsoft", classNo: 100 };
const NOVO = { instrumentId: "NOVO-B.CO", instrumentName: "Novo Nordisk", gameLabel: "NOVO", mediumLabel: "Novo Nordisk", classNo: 100 };
const TSLA = { instrumentId: "TSLA.US", instrumentName: "Tesla", gameLabel: "TSLA", mediumLabel: "Tesla", classNo: 100 };
const IWDA = { instrumentId: "IWDA.AS", instrumentName: "iShares Core MSCI World ETF", gameLabel: "IWDA", mediumLabel: "MSCI World", classNo: 17 };
const VOO = { instrumentId: "VOO.US", instrumentName: "Vanguard S&P 500 ETF", gameLabel: "VOO", mediumLabel: "S&P 500", classNo: 8 };
const ASML = { instrumentId: "ASML.AS", instrumentName: "ASML", gameLabel: "ASML", mediumLabel: "ASML", classNo: 100 };
const AMZN = { instrumentId: "AMZN.US", instrumentName: "Amazon", gameLabel: "AMZN", mediumLabel: "Amazon", classNo: 100 };
const GOOGL = { instrumentId: "GOOGL.US", instrumentName: "Alphabet", gameLabel: "GOOGL", mediumLabel: "Alphabet", classNo: 100 };
const META = { instrumentId: "META.US", instrumentName: "Meta", gameLabel: "META", mediumLabel: "Meta", classNo: 100 };
const LLY = { instrumentId: "LLY.US", instrumentName: "Eli Lilly", gameLabel: "LLY", mediumLabel: "Eli Lilly", classNo: 100 };
const AVGO = { instrumentId: "AVGO.US", instrumentName: "Broadcom", gameLabel: "AVGO", mediumLabel: "Broadcom", classNo: 100 };
const JNJ = { instrumentId: "JNJ.US", instrumentName: "Johnson & Johnson", gameLabel: "JNJ", mediumLabel: "J&J", classNo: 100 };
const NESN = { instrumentId: "NESN.SW", instrumentName: "Nestlé", gameLabel: "NESN", mediumLabel: "Nestlé", classNo: 100 };
const SAP = { instrumentId: "SAP.DE", instrumentName: "SAP", gameLabel: "SAP", mediumLabel: "SAP", classNo: 100 };
const LVMH = { instrumentId: "MC.PA", instrumentName: "LVMH", gameLabel: "LVMH", mediumLabel: "LVMH", classNo: 100 };
const SHEL = { instrumentId: "SHEL.L", instrumentName: "Shell", gameLabel: "SHEL", mediumLabel: "Shell", classNo: 100 };
const VEU = { instrumentId: "VEU.US", instrumentName: "Vanguard FTSE All-World ex-US ETF", gameLabel: "VEU", mediumLabel: "All-World ex-US", classNo: 17 };
const GLD = { instrumentId: "GLD.US", instrumentName: "SPDR Gold Shares", gameLabel: "GLD", mediumLabel: "Gold", classNo: 22 };
const QQQ = { instrumentId: "QQQ.US", instrumentName: "Invesco QQQ Trust", gameLabel: "QQQ", mediumLabel: "Nasdaq 100", classNo: 8 };

function hold(instrument, percent) {
  return { ...instrument, weight: percent / 100 };
}

/** Biggest weight first. Shown only after a level is solved. */
export function strategyLine(level) {
  return [...level.holdings]
    .sort((a, b) => percentOf(b.weight) - percentOf(a.weight) || a.mediumLabel.localeCompare(b.mediumLabel))
    .map((holding) => `${holding.mediumLabel} ${percentOf(holding.weight)}%`)
    .join(" · ");
}

export const GAME_LEVELS = [
  {
    level: 1,
    metaFlat: {
      title: "First Move",
      description: "One investment. It fills the board.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Build your first investment portfolio.",
        "Allocate 100% to one investment.",
        "Complete the portfolio allocation.",
      ],
    },
    holdings: [hold(NVDA, 100)],
  },
  {
    level: 2,
    metaFlat: {
      title: "The Swap",
      description: "Two names. One sits heavier.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Construct a portfolio with two investments.",
        "Allocate more capital to one investment.",
        "Ensure total allocation equals 100%.",
      ],
    },
    holdings: [hold(AAPL, 62), hold(MSFT, 38)],
  },
  {
    level: 3,
    metaFlat: {
      title: "Three Names",
      description: "A first real arrangement.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Construct a three-stock portfolio.",
        "Allocate capital across all three stocks.",
        "Keep the largest position at 50%.",
      ],
    },
    holdings: [hold(NOVO, 50), hold(TSLA, 30), hold(ASML, 20)],
  },
  {
    level: 4,
    metaFlat: {
      title: "Uneven Ground",
      description: "The areas stop matching.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Combine individual stocks and an equity fund.",
        "Allocate 40% to the equity fund.",
        "Distribute the remaining 60% across stocks.",
      ],
    },
    holdings: [hold(IWDA, 40), hold(AMZN, 28), hold(GOOGL, 20), hold(LLY, 12)],
  },
  {
    level: 5,
    metaFlat: {
      title: "The Mix",
      description: "One slice is easy to miss.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Construct a portfolio with five investments.",
        "Include an equity fund and individual stocks.",
        "Identify the investment that does not belong.",
      ],
    },
    holdings: [hold(VOO, 35), hold(META, 25), hold(NESN, 20), hold(SAP, 15), hold(SHEL, 5)],
    decoys: [AVGO],
  },
  {
    level: 6,
    metaFlat: {
      title: "Cross Currents",
      description: "Two small seats are twins.",
      isWealthPlan: true,
      modelNo: "WP-1840",
      rules: [
        "Construct a diversified equity portfolio.",
        "Combine individual stocks with an equity fund.",
        "Keep the two smallest allocations at 10% each.",
      ],
    },
    holdings: [hold(NVDA, 28), hold(AAPL, 22), hold(MSFT, 18), hold(NOVO, 12), hold(IWDA, 10), hold(JNJ, 10)],
    decoys: [TSLA],
  },
  {
    level: 7,
    metaFlat: {
      title: "Tight Calls",
      description: "Close sizes. Careful swaps.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Construct a six-stock portfolio.",
        "Limit the largest position to 26%.",
        "Maintain two equally weighted positions at 12%.",
      ],
    },
    holdings: [hold(ASML, 26), hold(AMZN, 20), hold(GOOGL, 16), hold(META, 14), hold(LLY, 12), hold(LVMH, 12)],
    decoys: [SAP],
  },
  {
    level: 8,
    metaFlat: {
      title: "Deep Water",
      description: "Seven seats. No extras.",
      isWealthPlan: true,
      modelNo: "WP-2218",
      rules: [
        "Construct a seven-investment portfolio.",
        "Combine equities with an alternative investment.",
        "Limit the alternative allocation to 6%.",
      ],
    },
    holdings: [hold(VOO, 24), hold(NVDA, 18), hold(NOVO, 16), hold(NESN, 14), hold(SHEL, 12), hold(JNJ, 10), hold(GLD, 6)],
  },
  {
    level: 9,
    metaFlat: {
      title: "Expert Line",
      description: "Every seat is its own size.",
      isWealthPlan: false,
      modelNo: null,
      rules: [
        "Construct a seven-investment portfolio.",
        "Combine individual stocks and equity funds.",
        "Keep every position at a different weight.",
      ],
    },
    holdings: [hold(MSFT, 22), hold(AAPL, 18), hold(ASML, 16), hold(AMZN, 14), hold(QQQ, 12), hold(LVMH, 10), hold(VEU, 8)],
  },
  {
    level: 10,
    metaFlat: {
      title: "The Masterpiece",
      description: "The final strategy.",
      isWealthPlan: true,
      modelNo: "WP-3001",
      rules: [
        "Construct the final seven-investment portfolio.",
        "Combine global equity funds and individual stocks.",
        "Keep every position between 12% and 18%.",
      ],
    },
    holdings: [hold(IWDA, 18), hold(NVDA, 16), hold(NOVO, 15), hold(MSFT, 14), hold(VOO, 13), hold(LLY, 12), hold(ASML, 12)],
  },
];

export function levelByNumber(level) {
  const found = GAME_LEVELS.find((entry) => entry.level === level);
  if (!found) throw new Error(`Missing level ${level}`);
  return found;
}

export function piecesOf(level) {
  return [...level.holdings, ...(level.decoys ?? [])];
}
