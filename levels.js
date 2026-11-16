import { percentOf } from "./score.js";  

/** Static demonstration portfolios for the ten-level prope. */
// classNo: 100 = stocks, 5–20 = equity funds, 
// ETF classNo values are provisional and should be checked against Neptoon data.
const NVDA = { instrumentId: "NVDA.US", instrumentName: "NVIDIA", gameLabel: "NVDA", mediumLabel: "NVIDIA", classNo: 100 };
const AAPL = { instrumentId: "AAPL.US", instrumentName: "Apple", gameLabel: "AAPL", mediumLabel: "Apple", classNo: 100 };
const MSFT = { instrumentId: "MSFT.US", instrumentName: "Microsoft", gameLabel: "MSFT", mediumLabel: "Microsoft", classNo: 100 };
const NOVO = { instrumentId: "NOVO-B.CO", instrumentName: "Novo Nordisk", gameLabel: "NOVO", mediumLabel: "Novo Nordisk", classNo: 100 };
const TSLA = { instrumentId: "TSLA.US", instrumentName: "Tesla", gameLabel: "TSLA", mediumLabel: "Tesla", classNo: 100 };
const EUNL2 = { instrumentId: "EUNL.XETRA", instrumentName: "iShares Core MSCI World ETF EUR", gameLabel: "EUNL", mediumLabel: "MSCI World", classNo: 17 };
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
const CARLSBERG = { instrumentId: "CARL-B.CO", instrumentName: "Carlsberg B", gameLabel: "CARL B", mediumLabel: "Carlsberg B", classNo: 100 };
/* =====================================================
   NEPTOON STRATEGY GAME · EXTENDED INVESTMENT UNIVERSE
===================================================== */

/* GOVERNMENT BONDS */
 const LYQ2 = {
  instrumentId: "LYQ2.XETRA",
  instrumentName: "Amundi Euro Government Bond 1-3Y UCITS ETF Acc",
  gameLabel: "LYQ2",
  mediumLabel: "Euro Gov Bonds 1-3Y",
  classNo: 1
};

/* CORPORATE BONDS */
const EUNW = {
  instrumentId: "EUNW.XETRA",
  instrumentName: "iShares EUR High Yield Corporate Bond UCITS ETF EUR (Dist)",
  gameLabel: "EUNW",
  mediumLabel: "EUR High Yield Bonds",
  classNo: 3
};

/* NORDIC EQUITIES */
const XDN0 = {
  instrumentId: "XDN0.XETRA",
  instrumentName: "Xtrackers MSCI Nordic",
  gameLabel: "XDN0",
  mediumLabel: "Nordic Equities",
  classNo: 5
};

/* BRAZILIAN EQUITIES */
const BRZ4 = {
  instrumentId: "4BRZ.XETRA",
  instrumentName: "iShares MSCI Brazil UCITS ETF (DE) USD (Acc)",
  gameLabel: "4BRZ",
  mediumLabel: "Brazil Equities",
  classNo: 16
};

/* GLOBAL EQUITIES */
const EUNL = {
  instrumentId: "EUNL.XETRA",
  instrumentName: "iShares Core MSCI World UCITS ETF USD (Acc)",
  gameLabel: "EUNL",
  mediumLabel: "MSCI World",
  classNo: 17
};

const PEP = {
  instrumentId: "PEP.US",
  instrumentName: "PepsiCo Inc.",
  gameLabel: "PEPSI",
  mediumLabel: "PepsiCo",
  classNo: 100
};

const MCD = {
  instrumentId: "MCD.US",
  instrumentName: "McDonald's Corporation",
  gameLabel: "MCD",
  mediumLabel: "McDonald's",
  classNo: 100
};

const KO = {
  instrumentId: "KO.US",
  instrumentName: "The Coca-Cola Company",
  gameLabel: "COCA-COLA",
  mediumLabel: "Coca-Cola",
  classNo: 100
};

/* GOLD */
const PSG8 = {
  instrumentId: "8PSG.XETRA",
  instrumentName: "Invesco Physical Gold A",
  gameLabel: "8PSG",
  mediumLabel: "Physical Gold",
  classNo: 22
};

/* REAL ESTATE EQUITIES */
const IQQ6 = {
  instrumentId: "IQQ6.XETRA",
  instrumentName: "iShares Developed Markets Property Yield UCITS ETF",
  gameLabel: "IQQ6",
  mediumLabel: "Global Property",
  classNo: 18
};

/* BITCOIN */
const WBIT = {
  instrumentId: "WBIT.XETRA",
  instrumentName: "WisdomTree Physical Bitcoin",
  gameLabel: "WBIT",
  mediumLabel: "Bitcoin",
  classNo: 23
};

/* EUROPEAN DEFENCE EQUITIES */
const EUDF = {
  instrumentId: "EUDF.XETRA",
  instrumentName: "WisdomTree Europe Defence UCITS ETF EUR Unhedged Acc",
  gameLabel: "EUDF",
  mediumLabel: "Europe Defence",
  classNo: 17
};

/* LEVERAGED US EQUITIES */
const DBPG = {
  instrumentId: "DBPG.XETRA",
  instrumentName: "Xtrackers S&P 500 2x Leveraged Daily Swap UCITS ETF 1C",
  gameLabel: "DBPG",
  mediumLabel: "S&P 500 2x",
  classNo: 8
};
/* =====================================================
   NEPTOON · WEALTH PLAN INSTRUMENTS
   Temporary instrumentId = ISIN
===================================================== */

/* NEPTOON OPPENHEIMER */

const OPP_WORLD = {
  instrumentId: "IE00B4L5Y983",
  instrumentName: "iShares Core MSCI World UCITS ETF USD (Acc)",
  gameLabel: "WORLD",
  mediumLabel: "MSCI World",
  classNo: 17
};

const OPP_EM = {
  instrumentId: "IE00BKM4GZ66",
  instrumentName: "iShares Core MSCI Emerging Markets",
  gameLabel: "EM",
  mediumLabel: "Emerging Markets",
  classNo: 14
};

const OPP_BTC = {
  instrumentId: "GB00BJYDH287",
  instrumentName: "WisdomTree Physical Bitcoin",
  gameLabel: "BTC",
  mediumLabel: "Bitcoin",
  classNo: 23
};

const OPP_AI = {
  instrumentId: "IE00BGV5VN51",
  instrumentName: "Xtrackers Artificial Intelligence & Big Data",
  gameLabel: "AI",
  mediumLabel: "AI & Big Data",
  classNo: 17
};

const OPP_SP2X = {
  instrumentId: "LU0411078552",
  instrumentName: "Xtrackers S&P 500 2x Leveraged Daily Swap",
  gameLabel: "SP2X",
  mediumLabel: "S&P 500 2x",
  classNo: 8
};

const OPP_AVGO = {
  instrumentId: "US11135F1012",
  instrumentName: "Broadcom Inc",
  gameLabel: "AVGO",
  mediumLabel: "Broadcom",
  classNo: 100
};


/* SPARINDEX DEFENSIVE */

const SP_NYK_BOND = {
  instrumentId: "DK0063181698",
  instrumentName: "Nykredit Invest Lange Obligationer",
  gameLabel: "NYK",
  mediumLabel: "Nykredit Bonds",
  classNo: 1
};

const SP_SYD_IG = {
  instrumentId: "DK0060409266",
  instrumentName: "Sydinvest Virksomhedsobligationer IG",
  gameLabel: "IG",
  mediumLabel: "Corporate Bonds IG",
  classNo: 3
};

const SP_SYD_HY = {
  instrumentId: "DK0060089415",
  instrumentName: "Sydinvest Virksomhedsobligationer HY",
  gameLabel: "HY",
  mediumLabel: "Corporate Bonds HY",
  classNo: 3
};

const SP_DK = {
  instrumentId: "DK0061541232",
  instrumentName: "Sydinvest Indeks Danmark",
  gameLabel: "DK",
  mediumLabel: "Denmark Equity",
  classNo: 5
};

const SP_US = {
  instrumentId: "DK0010270776",
  instrumentName: "Sydinvest USA Value",
  gameLabel: "USA",
  mediumLabel: "USA Value",
  classNo: 8
};

const SP_EU = {
  instrumentId: "DK0015323406",
  instrumentName: "Sydinvest Europa Value",
  gameLabel: "EU",
  mediumLabel: "Europe Value",
  classNo: 17
};

const SP_EM = {
  instrumentId: "DK0060499747",
  instrumentName: "Sydinvest Globale Emerging Aktier",
  gameLabel: "EM",
  mediumLabel: "Emerging Equities",
  classNo: 14
};


/* SYDBANK AGGRESSIVE */

const SYD_GOV = {
  instrumentId: "LU1287023185",
  instrumentName: "Amundi Euro Government Bond 7-10Y",
  gameLabel: "GOV",
  mediumLabel: "Euro Gov Bonds",
  classNo: 1
};

const SYD_CORP = {
  instrumentId: "IE00B3F81R35",
  instrumentName: "iShares Core EUR Corporate Bond",
  gameLabel: "CORP",
  mediumLabel: "EUR Corporate Bonds",
  classNo: 3
};

const SYD_HY = {
  instrumentId: "IE00B66F4759",
  instrumentName: "iShares EUR High Yield",
  gameLabel: "HY",
  mediumLabel: "EUR High Yield",
  classNo: 3
};

const SYD_DK = {
  instrumentId: "DK0060442556",
  instrumentName: "Sparindex OMX C25 KL",
  gameLabel: "C25",
  mediumLabel: "OMX C25",
  classNo: 5
};

const SYD_US = {
  instrumentId: "DK0010298272",
  instrumentName: "Sparindex USA Growth KL",
  gameLabel: "USA",
  mediumLabel: "USA Growth",
  classNo: 8
};

const SYD_EU = {
  instrumentId: "DK0064866149",
  instrumentName: "Sparindex STOXX Europe 600",
  gameLabel: "EU",
  mediumLabel: "Europe 600",
  classNo: 17
};

const SYD_EM = {
  instrumentId: "DK0060300762",
  instrumentName: "Sparindex Emerging Markets KL",
  gameLabel: "EM",
  mediumLabel: "Emerging Markets",
  classNo: 14
};

/* =====================================================
   NEPTOON BOHR · CAPITAL PRESERVATION
===================================================== */

const BOHR_SHORT_BONDS = {
  instrumentId: "DK0060009249",
  instrumentName: "Nykredit Invest Korte Obligationer",
  gameLabel: "SHORT",
  mediumLabel: "Short Bonds",
  classNo: 1
};

const BOHR_CORP = {
  instrumentId: "IE00B3F81R35",
  instrumentName: "iShares Core EUR Corporate Bond (IG)",
  gameLabel: "CORP",
  mediumLabel: "Corporate Bonds",
  classNo: 3
};

const BOHR_HY = {
  instrumentId: "IE00B66F4759",
  instrumentName: "iShares EUR High Yield (High Yield)",
  gameLabel: "HY",
  mediumLabel: "High Yield Bonds",
  classNo: 3
};

const BOHR_EM_BONDS = {
  instrumentId: "IE00BDFC6G93",
  instrumentName: "JPM USD Emerging Bonds",
  gameLabel: "EMB",
  mediumLabel: "Emerging Bonds",
  classNo: 3
};

const BOHR_COMMODITY = {
  instrumentId: "LU1829218749",
  instrumentName: "Amundi Bloomberg Equal-weight Commodity",
  gameLabel: "CMDTY",
  mediumLabel: "Commodities",
  classNo: 22
};

const BOHR_GOLD = {
  instrumentId: "IE00B579F325",
  instrumentName: "Invesco Physical Gold A",
  gameLabel: "GOLD",
  mediumLabel: "Physical Gold",
  classNo: 22
};

const BOHR_PROPERTY = {
  instrumentId: "IE00B1FZS350",
  instrumentName: "iShares Developed Markets Property",
  gameLabel: "REIT",
  mediumLabel: "Global Property",
  classNo: 18
};

const BOHR_SPACE = {
  instrumentId: "US84615Q1031",
  instrumentName: "Space Exploration Technologies Corp.",
  gameLabel: "SPACE",
  mediumLabel: "SpaceX",
  classNo: 100
};

/* =====================================================
   LEVEL 7 · DANSKE BANK GENERIC AGGRESSIVE
===================================================== */

const DB_LONG_BONDS = {
  instrumentId: "DK0016105380",
  instrumentName: "Danske Lange Obligationer",
  gameLabel: "DB LONG",
  mediumLabel: "Long Bonds",
  classNo: 1
};

const DB_IG_BONDS = {
  instrumentId: "DK0060448751",
  instrumentName: "DB Euro Investment Grade-Obligationer",
  gameLabel: "DB IG",
  mediumLabel: "Investment Grade",
  classNo: 3
};

const DB_HY_BONDS = {
  instrumentId: "DK0060497378",
  instrumentName: "DB Euro High Yield-Obligationer",
  gameLabel: "DB HY",
  mediumLabel: "High Yield",
  classNo: 3
};

const DB_DENMARK = {
  instrumentId: "DK0060244325",
  instrumentName: "DB Danmark Fokus",
  gameLabel: "DB DK",
  mediumLabel: "Denmark Equity",
  classNo: 5
};

const DB_USA = {
  instrumentId: "DK0061270105",
  instrumentName: "Danske Invest USA Restricted",
  gameLabel: "DB USA",
  mediumLabel: "USA Equity",
  classNo: 8
};

const DB_EUROPE = {
  instrumentId: "DK0010252956",
  instrumentName: "Danske Invest Europa",
  gameLabel: "DB EU",
  mediumLabel: "Europe Equity",
  classNo: 17
};

const DB_EM = {
  instrumentId: "DK0060042026",
  instrumentName: "Danske Invest Nye Markeder",
  gameLabel: "DB EM",
  mediumLabel: "Emerging Markets",
  classNo: 14
};

const DANSKE = {
  instrumentId: "DANSKE.CO",
  instrumentName: "Danske Bank A/S",
  gameLabel: "DANSKE",
  mediumLabel: "Danske Bank",
  classNo: 100
};

const CBK = {
  instrumentId: "CBK.XETRA",
  instrumentName: "Commerzbank AG",
  gameLabel: "COMMERZ",
  mediumLabel: "Commerzbank",
  classNo: 100
};

/* =====================================================
   LEVEL 9 · DEUTSCHE BANK AGGRESSIVE
===================================================== */
const HEIA = {
  instrumentId: "HEIA.AS",
  instrumentName: "Heineken N.V.",
  gameLabel: "HEINEKEN",
  mediumLabel: "Heineken",
  classNo: 100
};
const RBREW = {
  instrumentId: "RBREW.CO",
  instrumentName: "Royal Unibrew A/S",
  gameLabel: "ROYAL",
  mediumLabel: "Royal Unibrew",
  classNo: 100
};

const DE_GOV_BONDS = {
  instrumentId: "LU1287023185",
  instrumentName: "Amundi Euro Government Bond 7-10Y",
  gameLabel: "DE GOV",
  mediumLabel: "Euro Gov Bonds",
  classNo: 1
};

const DE_IG_BONDS = {
  instrumentId: "LU2001241897",
  instrumentName: "DWS Invest ESG Euro Corporate Bonds",
  gameLabel: "DE IG",
  mediumLabel: "Corporate Bonds",
  classNo: 3
};

const DE_HY_BONDS = {
  instrumentId: "LU2111935651",
  instrumentName: "DWS Invest ESG Euro High Yield",
  gameLabel: "DE HY",
  mediumLabel: "High Yield",
  classNo: 3
};

const DE_GERMANY = {
  instrumentId: "DE000DWS2D82",
  instrumentName: "DWS Aktien Strategie Deutschland",
  gameLabel: "DE GER",
  mediumLabel: "Germany Equity",
  classNo: 17
};

const DE_USA = {
  instrumentId: "LU1769939361",
  instrumentName: "DWS Invest CROCI US USD",
  gameLabel: "DE USA",
  mediumLabel: "USA Equity",
  classNo: 8
};

const DE_EUROPE = {
  instrumentId: "LU0145635479",
  instrumentName: "DWS Invest Focus Europe",
  gameLabel: "DE EU",
  mediumLabel: "Europe Equity",
  classNo: 17
};

const DE_EM = {
  instrumentId: "LU1984219524",
  instrumentName: "DWS Invest ESG Global Em Mkts Eqs FC",
  gameLabel: "DE EM",
  mediumLabel: "Emerging Markets",
  classNo: 14
};

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
    title: "The First Investment",
    titleDa: "Den første investering",

    description: "One stock. One allocation.",
    descriptionDa: "Én aktie. Én fordeling.",

    isWealthPlan: false,
    modelNo: null,

    rules: [
      "Construct a portfolio with one stock.",
      "Identify the software company co-founded by Bill Gates.",
      "Allocate the entire portfolio to that company."
    ],

    rulesDa: [
      "Sammensæt en portefølje med én aktie.",
      "Find softwarevirksomheden, som Bill Gates var med til at grundlægge.",
      "Fordel hele porteføljen til dette selskab."
    ]
  },

  holdings: [
    hold(MSFT, 100)
  ],

  decoys: [
    AAPL,
    NOVO,
    KO
  ]
},
{
  level: 2,
  metaFlat: {
    title: "Two Investments",
    titleDa: "To investeringer",
    description: "Two stocks. One portfolio.",
    descriptionDa: "To aktier. Én portefølje.",
    isWealthPlan: false,
    modelNo: null,
rules: [
  "Construct a portfolio with two stocks.",
  "Select the American car manufacturer named after a pioneering electrical engineer and the Danish brewery founded in 1847.",
  "Allocate the largest position to the American company."
],

rulesDa: [
  "Sammensæt en portefølje med to aktier.",
  "Vælg den amerikanske bilproducent opkaldt efter en banebrydende elektroingeniør og det danske bryggeri grundlagt i 1847.",
  "Fordel den største andel til det amerikanske selskab."
],
     
  },
  holdings: [
    hold(TSLA, 62),
    hold(CARLSBERG, 38)
  ],

decoys: [
  HEIA,
  RBREW,
  AAPL,
   JNJ
]
},
{
  level: 3,
  metaFlat: {
    title: "Three Investments",
    titleDa: "Tre investeringer",
    description: "Three stocks. Three weights.",
    descriptionDa: "Tre aktier. Tre vægte.",
    isWealthPlan: false,
    modelNo: null,
  rules: [
  "Construct a portfolio with three stocks.",
  "Focus on obesity medicine, global health hand semiconductor technology.",
  "Include Swiss Consumer Staples as the smallest position. No Danish companies."
],

rulesDa: [
  "Sammensæt en portefølje med tre aktier.",
  "Fokusér på fedmemedicin, global sundhed og halvlederteknologi.",
  "Medtag schweiziske dagligvarer som den mindste position. Ingen danske selskaber."
],
  },
  holdings: [
    hold(LLY, 60),
    hold(AVGO, 30),
    hold(NESN, 10)
  ],

decoys: [
  NOVO,
  KO,
  MCD
],

   
},

{
  level: 4,

  metaFlat: {
    title: "Four Investments",
    titleDa: "Fire investeringer",

    description: "Combine stocks and an ETF.",
    descriptionDa: "Kombinér aktier og en ETF.",

    isWealthPlan: false,
    modelNo: null,

    rules: [
      "Construct a portfolio with four investments.",
      "Allocate the largest position to the global ETF and the smallest to the company behind Facebook.",
      "Include at least one Nordic company. Amazon represents half of the individual-stock allocation."
    ],

    rulesDa: [
      "Sammensæt en portefølje med fire investeringer.",
      "Fordel mest til den globale ETF og mindst til selskabet bag Facebook.",
      "Medtag mindst ét nordisk selskab. Amazon udgør halvdelen af enkeltaktiernes samlede vægt."
    ]
  },

  holdings: [
    hold(EUNL, 60),
    hold(AMZN, 20),
    hold(DANSKE, 15),
    hold(META, 5)
  ],

  decoys: [
    CBK,
    AAPL
  ]
},
   
{
  level: 5,
  metaFlat: {
    title: "Five Investments",
    titleDa: "Fem investeringer",
    description: "Five positions and one decoy.",
    descriptionDa: "Fem positioner og én distraktion.",
    isWealthPlan: false,
    modelNo: null,
   rules: [
  "Construct a portfolio with five investments.",
  "Build a risk ladder from government bonds to growth equities.",
  "Allocate progressively larger weights as risk increases. All positions must carry investment risk."
],

rulesDa: [
  "Sammensæt en portefølje med fem investeringer.",
  "Opbyg en risikostige fra statsobligationer til vækstaktier.",
  "Fordel stigende vægte med stigende risiko. Alle positioner skal have investeringsrisiko."
],
  },
  holdings: [
    hold(DE_GOV_BONDS, 5),
    hold(BOHR_CORP, 10),
    hold(BOHR_HY, 20),
    hold(XDN0 , 25),
    hold(DBPG, 40)
  ],
  decoys: [LYQ2],
},

{
  level: 6,
  metaFlat: {
    title: "Neptoon Bohr",
    titleDa: "Neptoon Bohr",
    description: "Build the defensive Neptoon Bohr strategy.",
    descriptionDa: "Sammensæt den defensive Neptoon Bohr-strategi.",
    isWealthPlan: true,
    modelNo: 3,
    sendToMyWealth: true,
rules: [
  "Construct the defensive Neptoon Bohr portfolio.",
  "Build the portfolio using Government Bonds, Credit Bonds and Alternatives.",
  "Government Bonds must have the largest allocation. Exclude Single Stocks and Equity Funds."
],

rulesDa: [
  "Sammensæt den defensive Neptoon Bohr-portefølje.",
  "Opbyg porteføljen med statsobligationer, kreditobligationer og alternative investeringer.",
  "Statsobligationer skal have den største andel. Udelad enkeltaktier og aktiefonde."
],
  },
  holdings: [
    hold(BOHR_SHORT_BONDS, 45),
    hold(BOHR_CORP, 15),
    hold(BOHR_HY, 15),
    hold(BOHR_EM_BONDS, 10),
    hold(BOHR_COMMODITY, 5),
    hold(BOHR_GOLD, 5),
    hold(BOHR_PROPERTY, 5)
  ],
  decoys: [BOHR_SPACE],
},

{
  level: 7,
  metaFlat: {
    title: "Danske Bank Aggressive",
    titleDa: "Danske Bank Aggressiv",
    description: "Build an aggressive portfolio of actively managed funds.",
    descriptionDa: "Sammensæt en aggressiv portefølje med aktivt forvaltede fonde.",
    isWealthPlan: true,
    modelNo: 8, // Insert actual Danske Bank modelNo
    sendToMyWealth: true,
rules: [
  "Construct the Danske Bank Generic Aggressive portfolio.",
  "Combine seven actively managed funds across Government Bonds, Credit Bonds and Equity Funds.",
  "Allocate 80% to Equity Funds and 20% to Bonds. Exclude Single Stocks and Alternatives."
],

rulesDa: [
  "Sammensæt Danske Bank Generic Aggressive-porteføljen.",
  "Kombinér syv aktivt forvaltede fonde inden for statsobligationer, kreditobligationer og aktiefonde.",
  "Fordel 80 % til aktiefonde og 20 % til obligationer. Udelad enkeltaktier og alternative investeringer."
],
  },
  holdings: [
    hold(DB_LONG_BONDS, 10),
    hold(DB_IG_BONDS, 5),
    hold(DB_HY_BONDS, 5),
    hold(DB_DENMARK, 15),
    hold(DB_USA, 35),
    hold(DB_EUROPE, 20),
    hold(DB_EM, 10)
  ],
},

{
  level: 8,

  metaFlat: {
    title: "Sparindex Balanced",
    titleDa: "Sparindex Balanceret",

    description: "Build the Sparindex Balanced investment strategy.",
    descriptionDa: "Sammensæt Sparindex Balanced-investeringsstrategien.",

    isWealthPlan: true,
    modelNo: 21,
    sendToMyWealth: true,

    rules: [
      "Construct the Sparindex Balanced portfolio with seven investments.",
      "Combine Government Bonds, Credit Bonds and diversified Equity Funds.",
      "Allocate 80% to Equity Funds and 20% to Bonds. Exclude Single Stocks and Alternatives."
    ],

    rulesDa: [
      "Sammensæt Sparindex Balanced-porteføljen med syv investeringer.",
      "Kombinér statsobligationer, kreditobligationer og diversificerede aktiefonde.",
      "Fordel 80 % til aktiefonde og 20 % til obligationer. Udelad enkeltaktier og alternative investeringer."
    ]
  },

  holdings: [
    hold(SP_NYK_BOND, 10),
    hold(SP_SYD_IG, 5),
    hold(SP_SYD_HY, 5),
    hold(SP_DK, 15),
    hold(SP_US, 35),
    hold(SP_EU, 20),
    hold(SP_EM, 10)
  ]
},
{
  level: 9,
  metaFlat: {
    title: "Deutsche Bank Aggressive",
    titleDa: "Deutsche Bank Aggressiv",
    description: "Build an aggressive strategy with European and global funds.",
    descriptionDa: "Sammensæt en aggressiv strategi med europæiske og globale fonde.",
    isWealthPlan: true,
    modelNo: 6, // Insert actual Deutsche Bank modelNo
    sendToMyWealth: true,
rules: [
  "Construct the Deutsche Bank Aggressive portfolio.",
  "Select seven funds from the Deutsche Bank investment universe.",
  "Allocate 80% to Equity Funds and 20% to Bonds. Exclude funds from competing providers."
],

rulesDa: [
  "Sammensæt Deutsche Bank Aggressive-porteføljen.",
  "Vælg syv fonde fra Deutsche Banks investeringsunivers.",
  "Fordel 80 % til aktiefonde og 20 % til obligationer. Udelad fonde fra konkurrerende udbydere."
],
  },
  holdings: [
    hold(DE_GOV_BONDS, 10),
    hold(DE_IG_BONDS, 5),
    hold(DE_HY_BONDS, 5),
    hold(DE_GERMANY, 15),
    hold(DE_USA, 35),
    hold(DE_EUROPE, 20),
    hold(DE_EM, 10)
  ],

   decoys: [
  DB_USA,
  SP_US
],
},

{
  level: 10,

  metaFlat: {
    title: "Neptoon Oppenheimer",
    titleDa: "Neptoon Oppenheimer",

    description: "The final seven-investment challenge.",
    descriptionDa: "Den sidste udfordring med syv investeringer.",

    isWealthPlan: true,
    modelNo: 7,
    sendToMyWealth: true,

    rules: [
      "Construct the Neptoon Oppenheimer portfolio.",
      "Combine Equity Funds, Single Stocks and Alternatives, including Bitcoin and leveraged investments.",
      "Build seven positions with no Government Bonds or Credit Bonds. The largest position represents 30%."
    ],

    rulesDa: [
      "Sammensæt Neptoon Oppenheimer-porteføljen.",
      "Kombinér aktiefonde, enkeltaktier og alternative investeringer, herunder Bitcoin og gearede investeringer.",
      "Sammensæt syv positioner uden stats- eller kreditobligationer. Den største position udgør 30 %."
    ]
  },

  holdings: [
    hold(OPP_WORLD, 30),
    hold(OPP_EM, 15),
    hold(OPP_BTC, 15),
    hold(OPP_AI, 15),
    hold(OPP_SP2X, 15),
    hold(NVDA, 5),
    hold(OPP_AVGO, 5)
  ],

  decoys: [
    AAPL,
    MSFT,
    DE_GOV_BONDS,
    DE_IG_BONDS
  ]
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
