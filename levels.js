import { percentOf } from "./score.js";  



const DE_EUROPE = {
  instrumentId: "LU0145635479",
  instrumentName: "DWS Invest Focus Europe",
  gameLabel: "DE EU",
  mediumLabel: "Europe Equity",
  classNo: 17,

  classMajorTop: "Equity",
  classMajorTopDa: "Aktier",
  typeLabel: "Mutual Fund",
  typeLabelDa: "InvestFond"
};

const DE_EM = {
  instrumentId: "LU1984219524",
  instrumentName: "DWS Invest ESG Global Em Mkts Eqs FC",
  gameLabel: "DE EM",
  mediumLabel: "Emerging Markets",
  classNo: 14,

  classMajorTop: "Equity",
  classMajorTopDa: "Aktier",
  typeLabel: "Mutual Fund",
  typeLabelDa: "InvestFond"
};



/** Biggest weight first. Shown only after a level is solved. */
export function strategyLine(level) {

  return [...level.holdings]
    .sort((a, b) =>
      percentOf(b.weight) - percentOf(a.weight) ||
      String(a.mediumLabel || a.instrumentName || "")
        .localeCompare(
          String(b.mediumLabel || b.instrumentName || "")
        )
    )
    .map(holding =>
      `${holding.mediumLabel || holding.instrumentName} ${percentOf(holding.weight)}%`
    )
    .join(" · ");

}




/* =========================================
   RANDOMIZER 1 — LEVEL 1
   One individual stock
========================================= */


/* =========================================
   LEVEL 1 — SINGLE STOCK
========================================= */

function buildLevel1() {

  return {

    level: 1,

    metaFlat: {
      title: "The First Investment",
      titleDa: "Den første investering",

      description: "One stock. One allocation.",
      descriptionDa: "Én aktie. Én fordeling.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Identify one stock from its recognition story.",
        "Allocate 100% of the portfolio to that stock."
      ],

      rulesDa: [
        "Identificér én aktie ud fra dens genkendelseshistorie.",
        "Fordel 100 % af porteføljen til aktien."
      ]
    },

    slots: [
      {
        classNo: 100,
        weight: 100
      }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 2 — TWO STOCKS
========================================= */

function buildLevel2() {

  // Random largest allocation: 55–75%
  const largestWeight =
    55 + Math.floor(Math.random() * 5) * 5;

  const smallestWeight =
    100 - largestWeight;

  return {

    level: 2,

    metaFlat: {
      title: "Two Investments",
      titleDa: "To investeringer",

      description: "Two stocks. Two allocations.",
      descriptionDa: "To aktier. To fordelinger.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Identify two stocks from their recognition stories.",
        "Allocate the larger weight to the first stock.",
        "Ensure the portfolio totals 100%."
      ],

      rulesDa: [
        "Identificér to aktier ud fra deres genkendelseshistorier.",
        "Fordel den største vægt til den første aktie.",
        "Sørg for, at porteføljen samlet udgør 100 %."
      ]
    },

    slots: [
      {
        classNo: 100,
        weight: largestWeight
      },
      {
        classNo: 100,
        weight: smallestWeight
      }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 3 — THREE STOCKS
========================================= */

function buildLevel3() {

  // Generate valid strategic allocations
  const combinations = [];

  for(let largest = 45; largest <= 60; largest += 5){

    for(let middle = 25; middle <= 35; middle += 5){

      const smallest = 100 - largest - middle;

      if(
        smallest >= 10 &&
        smallest < middle &&
        middle < largest
      ){
        combinations.push([
          largest,
          middle,
          smallest
        ]);
      }

    }

  }

  // Select one allocation randomly
  const weights =
    combinations[
      Math.floor(Math.random() * combinations.length)
    ];

  return {

    level: 3,

    metaFlat: {
      title: "Three Investments",
      titleDa: "Tre investeringer",

      description: "Three stocks. Three allocations.",
      descriptionDa: "Tre aktier. Tre fordelinger.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Identify three stocks from their recognition stories.",
        "Allocate the largest weight to the first stock.",
        "Allocate the smallest weight to the third stock."
      ],

      rulesDa: [
        "Identificér tre aktier ud fra deres genkendelseshistorier.",
        "Fordel den største vægt til den første aktie.",
        "Fordel den mindste vægt til den tredje aktie."
      ]
    },

    slots: [
      {
        classNo: 100,
        weight: weights[0]
      },
      {
        classNo: 100,
        weight: weights[1]
      },
      {
        classNo: 100,
        weight: weights[2]
      }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 4 — STOCKS & EQUITY FUNDS
========================================= */

function buildLevel4() {

  const combinations = [];

  // Two equity funds
  for(let fund1 = 35; fund1 <= 45; fund1 += 5){

    for(let fund2 = 20; fund2 <= 30; fund2 += 5){

      const fundTotal = fund1 + fund2;

      if(fundTotal < 60 || fundTotal > 70){
        continue;
      }

      const stockTotal = 100 - fundTotal;

      // Two individual stocks
      for(let stock1 = 15; stock1 <= 25; stock1 += 5){

        const stock2 = stockTotal - stock1;

        const weights = [
          fund1,
          fund2,
          stock1,
          stock2
        ];

        if(
          stock2 >= 5 &&
          stock1 > stock2 &&
          new Set(weights).size === 4
        ){
          combinations.push(weights);
        }

      }

    }

  }

  if(!combinations.length){
    throw new Error("Level 4: No valid allocations");
  }

  const weights =
    combinations[
      Math.floor(Math.random() * combinations.length)
    ];

  return {

    level: 4,

    metaFlat: {
      title: "Stocks & Equity Funds",
      titleDa: "Aktier og aktiefonde",

      description: "Four investments across two asset types.",
      descriptionDa: "Fire investeringer fordelt på to aktivtyper.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Identify two equity funds and two individual stocks.",
        "Allocate 60–70% to equity funds.",
        "Assign the correct weight to each investment."
      ],

      rulesDa: [
        "Identificér to aktiefonde og to enkeltaktier.",
        "Fordel 60–70 % til aktiefonde.",
        "Tildel hver investering den korrekte vægt."
      ]
    },

slots: [
  {
    classNo: 17,
    weight: weights[0]
  },
  {
    classNo: 5,
    weight: weights[1]
  },
  {
    classNo: 100,
    weight: weights[2]
  },
  {
    classNo: 100,
    weight: weights[3]
  }
],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 5 — CLASSICAL BALANCED 50/50
   Five funds / ETFs
========================================= */

function buildLevel5() {

  const combinations = [];

  // Bonds: exactly 50%
  for(let bond1 = 25; bond1 <= 35; bond1 += 5){

    const bond2 = 50 - bond1;

    if(bond2 < 15 || bond2 > 25){
      continue;
    }

    // Equities: exactly 50%
    for(let equity1 = 20; equity1 <= 30; equity1 += 5){

      for(let equity2 = 10; equity2 <= 20; equity2 += 5){

        const equity3 =
          50 - equity1 - equity2;

        if(
          equity3 < 5 ||
          equity3 > 15
        ){
          continue;
        }

        combinations.push([
          bond1,
          bond2,
          equity1,
          equity2,
          equity3
        ]);

      }

    }

  }

  if(!combinations.length){
    throw new Error("Level 5: No valid allocations");
  }

  const weights =
    combinations[
      Math.floor(Math.random() * combinations.length)
    ];

  return {

    level: 5,

    metaFlat: {
      title: "The Balanced Portfolio",
      titleDa: "Den balancerede portefølje",

      description: "Five funds. Half bonds, half equities.",
      descriptionDa: "Fem fonde. Halvdelen obligationer, halvdelen aktier.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct a balanced portfolio using five funds and ETFs.",
        "Allocate exactly 50% to bonds and 50% to equities.",
        "Identify all five investments from their recognition stories."
      ],

      rulesDa: [
        "Sammensæt en balanceret portefølje med fem fonde og ETF'er.",
        "Fordel præcis 50 % til obligationer og 50 % til aktier.",
        "Identificér alle fem investeringer ud fra deres genkendelseshistorier."
      ]
    },

    slots: [
      { classNo: 0,  weight: weights[0] },
      { classNo: 2,  weight: weights[1] },
      { classNo: 8,  weight: weights[2] },
      { classNo: 9,  weight: weights[3] },
      { classNo: 18, weight: weights[4] }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


function buildLevel6() {

  const combinations = [];

  for(let ig = 20; ig <= 30; ig += 5){

    for(let hy = 10; hy <= 20; hy += 5){

      const emd = 50 - ig - hy;

      if(emd >= 5 && emd <= 15){
        combinations.push([50, ig, hy, emd]);
      }

    }

  }

  if(!combinations.length){
    throw new Error("Level 6: No valid allocations");
  }

  const weights = combinations[
    Math.floor(Math.random() * combinations.length)
  ];

  return {

    level: 6,

    metaFlat: {
      title: "The Cash Alternative",
      titleDa: "Alternativet til kontanter",

      description: "Four bond ETFs. No equities.",
      descriptionDa: "Fire obligations-ETF'er. Ingen aktier.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct a portfolio using four bond ETFs.",
        "Allocate exactly 50% to short-duration bonds.",
        "Distribute the remaining 50% across investment-grade, high-yield and emerging-market bonds."
      ],

      rulesDa: [
        "Sammensæt en portefølje med fire obligations-ETF'er.",
        "Fordel præcis 50 % til korte obligationer.",
        "Fordel de resterende 50 % mellem investment-grade-, high-yield- og emerging-market-obligationer."
      ]
    },

    slots: [
      { classNo: 0, weight: weights[0] },
      { classNo: 2, weight: weights[1] },
      { classNo: 3, weight: weights[2] },
      { classNo: 4, weight: weights[3] }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 7 — THE 60/40 PORTFOLIO
   40% Bonds / 60% Equities
   Including 20% individual stocks
========================================= */

function buildLevel7() {

  // Bond allocation: 40%
  const ig = 10 + Math.floor(Math.random() * 2) * 5;
  const hy = 20 - ig;

  // Equity ETF allocation: 40%
  const world = 25 + Math.floor(Math.random() * 2) * 5;
  const denmark = 40 - world;

  // Individual stocks: 20%
  const stock1 =
    5 + Math.floor(Math.random() * 3) * 5;

  const stock2 = 20 - stock1;

  return {

    level: 7,

    metaFlat: {
      title: "The 60/40 Portfolio",
      titleDa: "60/40-porteføljen",

      description:
        "A balanced strategy with two individual stocks.",

      descriptionDa:
        "En balanceret strategi med to enkeltaktier.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct a portfolio with 60% equities and 40% bonds.",
        "Allocate 20% to two individual stocks.",
        "Distribute the remaining equity allocation across global and Danish equity ETFs."
      ],

      rulesDa: [
        "Sammensæt en portefølje med 60 % aktier og 40 % obligationer.",
        "Fordel 20 % på to enkeltaktier.",
        "Fordel den resterende aktieandel mellem globale og danske aktie-ETF'er."
      ]
    },

    slots: [
      { classNo: 0,   weight: 20 },
      { classNo: 2,   weight: ig },
      { classNo: 3,   weight: hy },

      { classNo: 17,  weight: world },
      { classNo: 5,   weight: denmark },

      { classNo: 100, weight: stock1 },
      { classNo: 100, weight: stock2 }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}



/* =========================================
   LEVEL 8 — AGGRESSIVE ACTIVE PORTFOLIO
   50% Bitcoin + Leveraged MSCI
   50% Individual Stocks
========================================= */

function buildLevel8() {

  // Bitcoin + leveraged MSCI: 50%
  const bitcoin =
    10 + Math.floor(Math.random() * 7) * 5;

  const leveraged =
    50 - bitcoin;

  // Three stocks: 50%, minimum 10% each
  const stockCombinations = [];

  for(let stock1 = 10; stock1 <= 30; stock1 += 5){

    for(let stock2 = 10; stock2 <= 30; stock2 += 5){

      const stock3 =
        50 - stock1 - stock2;

      if(stock3 >= 10 && stock3 <= 30){
        stockCombinations.push([
          stock1,
          stock2,
          stock3
        ]);
      }

    }

  }

  const stocks =
    stockCombinations[
      Math.floor(Math.random() * stockCombinations.length)
    ];

  return {

    level: 8,

    metaFlat: {
      title: "The Aggressive Portfolio",
      titleDa: "Den aggressive portefølje",

      description:
        "Bitcoin, leveraged equities and individual stocks.",

      descriptionDa:
        "Bitcoin, gearede aktier og enkeltaktier.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct an aggressive portfolio with five investments.",
        "Allocate 50% to Bitcoin and leveraged MSCI exposure, with at least 10% in each.",
        "Allocate the remaining 50% across three individual stocks, with at least 10% in each."
      ],

      rulesDa: [
        "Sammensæt en aggressiv portefølje med fem investeringer.",
        "Fordel 50 % mellem Bitcoin og gearet MSCI-eksponering, med mindst 10 % i hver.",
        "Fordel de resterende 50 % mellem tre enkeltaktier, med mindst 10 % i hver."
      ]
    },

    slots: [
      { classNo: 24,  weight: bitcoin },
      { classNo: 28,  weight: leveraged },

      { classNo: 100, weight: stocks[0] },
      { classNo: 100, weight: stocks[1] },
      { classNo: 100, weight: stocks[2] }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}


/* =========================================
   LEVEL 9 — NORDIC HOME BIAS
   Four holdings
========================================= */

function buildLevel9() {

  // MSCI World: 50–60%
  const world =
    50 + Math.floor(Math.random() * 3) * 5;

  // Class 26: 5–10%
  const class26 =
    5 + Math.floor(Math.random() * 2) * 5;

  // Fixed allocation to class 18
  const class18 = 25;

  // Nordic equities receive the remainder
  const nordic =
    100 - world - class26 - class18;

  return {

    level: 9,

    metaFlat: {
      title: "Nordic Home Bias",
      titleDa: "Nordisk hjemmebias",

      description:
        "A global equity strategy with Nordic exposure.",

      descriptionDa:
        "En global aktiestrategi med nordisk eksponering.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct a four-investment portfolio.",
        "Allocate 50–60% to MSCI World and 25% to class 18.",
        "Allocate 5–10% to class 21 and the remaining weight to Nordic equities."
      ],

      rulesDa: [
        "Sammensæt en portefølje med fire investeringer.",
        "Fordel 50–60 % til MSCI World og 25 % til klasse 18.",
        "Fordel 5–10 % til klasse 21 og resten til nordiske aktier."
      ]
    },

    slots: [
      { classNo: 17, weight: world },
      { classNo: 26, weight: class26 },
      { classNo: 18, weight: class18 },
      { classNo: 6,  weight: nordic }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}



/* =========================================
   LEVEL 10 — ALTERNATIVES PORTFOLIO
   MSCI World + Four Alternatives
========================================= */

function buildLevel10() {

  // MSCI World: 25–40%
  const world =
    25 + Math.floor(Math.random() * 4) * 5;

  // Remaining allocation to alternatives
  const residual = 100 - world;

  // Minimum 5% for each alternative
  const weights = [5, 5, 5, 5];

  // Randomly distribute residual in 5% steps
  const steps = (residual - 20) / 5;

  for(let i = 0; i < steps; i++){

    const index =
      Math.floor(Math.random() * 4);

    weights[index] += 5;

  }

  return {

    level: 10,

    metaFlat: {
      title: "The Alternatives Portfolio",
      titleDa: "Porteføljen med alternative investeringer",

      description:
        "Global equities, commodities, gold, property and infrastructure.",

      descriptionDa:
        "Globale aktier, råvarer, guld, ejendomme og infrastruktur.",

      isWealthPlan: false,
      modelNo: null,

      rules: [
        "Construct a portfolio with five investments.",
        "Allocate 25–40% to MSCI World.",
        "Distribute the remaining allocation across commodities, gold, real estate and infrastructure, with at least 5% in each."
      ],

      rulesDa: [
        "Sammensæt en portefølje med fem investeringer.",
        "Fordel 25–40 % til MSCI World.",
        "Fordel resten mellem råvarer, guld, ejendomme og infrastruktur med mindst 5 % i hver."
      ]
    },

    slots: [
      { classNo: 17, weight: world },
      { classNo: 20, weight: weights[0] },
      { classNo: 21, weight: weights[1] },
      { classNo: 22, weight: weights[2] },
      { classNo: 23, weight: weights[3] }
    ],

    decoyCount: 3,

    holdings: [],
    decoys: []

  };

}






































































































/* =========================================
   GROSS INSTRUMENT LOOKUP
========================================= */

let instrumentByTicker = new Map();

function tickerKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function setInstrumentUniverse(instruments) {

  instrumentByTicker = new Map(
    instruments.map(inst => [
      tickerKey(inst.tickerExchange),
      inst
    ])
  );

}

function hold(tickerExchange, weight) {

  const key = tickerKey(tickerExchange);
  const instrument = instrumentByTicker.get(key);

  if(!instrument){
    throw new Error(`Unknown instrument: ${key}`);
  }

  return {
    ...instrument,
    weight: weight / 100
  };

}


function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function populateLevel(skeleton, gameUniverse) {

  const used = new Set();

  const holdings = skeleton.slots.map(slot => {

    const candidates = gameUniverse.filter(inst =>
      Number(inst.classNo) === Number(slot.classNo) &&
      !used.has(inst.tickerExchange)
    );

    if(!candidates.length){
      throw new Error(
        `Level ${skeleton.level}: No eligible instrument for class ${slot.classNo}`
      );
    }

    const selected = randomItem(candidates);

    used.add(selected.tickerExchange);

    return {
      ...hold(selected.tickerExchange, slot.weight),
      stories: selected.stories
    };

  });

  const decoyCandidates = gameUniverse.filter(inst =>
    !used.has(inst.tickerExchange)
  );

  if(decoyCandidates.length < skeleton.decoyCount){
    throw new Error(
      `Level ${skeleton.level}: Insufficient decoys`
    );
  }

  const decoys = [];

  for(let i = 0; i < skeleton.decoyCount; i++){

    const index = Math.floor(
      Math.random() * decoyCandidates.length
    );

    const [selected] = decoyCandidates.splice(index, 1);

    decoys.push({
      ...instrumentByTicker.get(selected.tickerExchange),
      stories: selected.stories
    });

  }

  return {
    ...skeleton,
    holdings,
    decoys
  };

}





export function levelByNumber(level) {

  const found = GAME_LEVELS.find(
    entry => entry.level === level
  );

  if(!found){
    throw new Error(`Missing level ${level}`);
  }

  return found;

}

export function piecesOf(level) {

  return [
    ...level.holdings,
    ...(level.decoys ?? [])
  ];

}

	

/* =========================================
   RANDOMIZER 2
   Populate strategic skeleton
========================================= */

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function takeRandom(pool) {
  const index = randomIndex(pool.length);
  return pool.splice(index, 1)[0];
}

function populateLevel(skeleton, gameUniverse) {

  const slots = skeleton.slots;
  const used = new Set();

  const holdings = slots.map(slot => {

    const candidates = gameUniverse.filter(inst => {

      const key = tickerKey(inst.tickerExchange);

      return (
        Number(inst.classNo) === Number(slot.classNo) &&
        !used.has(key)
      );

    });

    if(!candidates.length){
      throw new Error(
        `Level ${skeleton.level}: No available instrument for class ${slot.classNo}`
      );
    }

    const selected = candidates[
      randomIndex(candidates.length)
    ];

    const key = tickerKey(selected.tickerExchange);

    used.add(key);

    return {
      ...hold(key, slot.weight),
      stories: selected.stories
    };

  });

  /* -----------------------------------------
     DECOYS
     Prefer the asset classes in this level
  ----------------------------------------- */

  const levelClasses = new Set(
    slots.map(slot => Number(slot.classNo))
  );

  const eligible = gameUniverse.filter(inst =>
    !used.has(tickerKey(inst.tickerExchange))
  );

  const sameClass = eligible.filter(inst =>
    levelClasses.has(Number(inst.classNo))
  );

  const otherClasses = eligible.filter(inst =>
    !levelClasses.has(Number(inst.classNo))
  );

  const decoys = [];

  for(let i = 0; i < skeleton.decoyCount; i++){

    const pool = sameClass.length
      ? sameClass
      : otherClasses;

    if(!pool.length){
      throw new Error(
        `Level ${skeleton.level}: Insufficient decoys`
      );
    }

    const selected = takeRandom(pool);
    const key = tickerKey(selected.tickerExchange);

    used.add(key);

    decoys.push({
      ...instrumentByTicker.get(key),
      stories: selected.stories
    });

  }

  return {
    ...skeleton,
    holdings,
    decoys
  };

}





/* =========================================
   NEPTOON — GAME LEVEL FACTORY
========================================= */

export let GAME_LEVELS = [];

const LEVEL_BUILDERS = [
  buildLevel1,
  buildLevel2,
  buildLevel3,
  buildLevel4,
  buildLevel5,
  buildLevel6,
  buildLevel7,
  buildLevel8,
  buildLevel9,
  buildLevel10
];

/* =========================================
   INITIALIZE ALL 10 LEVELS
========================================= */

export function initializeGameLevels(
  grossInstruments,
  gameUniverse
){

  setInstrumentUniverse(grossInstruments);

  if(!Array.isArray(gameUniverse)){
    throw new Error("Invalid curated game universe");
  }

  const populated = LEVEL_BUILDERS.map(build => {

    const skeleton = build();

    const totalWeight = skeleton.slots.reduce(
      (sum, slot) => sum + slot.weight,
      0
    );

    if(totalWeight !== 100){
      throw new Error(
        `Level ${skeleton.level}: Weights sum to ${totalWeight}%`
      );
    }

    const result = populateLevel(
      skeleton,
      gameUniverse
    );

    const pieces = [
      ...result.holdings,
      ...result.decoys
    ];

    const ids = pieces.map(p => p.instrumentId);

    if(
      ids.some(id => id == null) ||
      new Set(ids).size !== ids.length
    ){
      throw new Error(
        `Level ${skeleton.level}: Invalid or duplicate instrumentId`
      );
    }

    console.log(
      `LEVEL ${result.level} READY`,
      {
        holdings: result.holdings.length,
        decoys: result.decoys.length,
        weights: result.holdings.map(
          h => Math.round(h.weight * 100)
        ),
        tickers: result.holdings.map(
          h => h.tickerExchange
        )
      }
    );

    return result;

  });

  GAME_LEVELS = populated;

  console.log(
    "NEPTOON — ALL LEVELS READY",
    GAME_LEVELS.length
  );

  return GAME_LEVELS;

}






































export function initializeGameLevels(
  grossInstruments,
  gameUniverse
) {

  setInstrumentUniverse(grossInstruments);

  const builders = [
    buildLevel1,
    buildLevel2,
    buildLevel3,
    buildLevel4,
    buildLevel5,
    buildLevel6,
    buildLevel7,
    buildLevel8,
    buildLevel9,
    buildLevel10
  ];

  const populated = builders.map(build => {

    const skeleton = build();

    return populateLevel(
      skeleton,
      gameUniverse
    );

  });

  GAME_LEVELS = populated;

  console.log(
    "NEPTOON GAME LEVELS INITIALIZED",
    GAME_LEVELS
  );

  return GAME_LEVELS;

}
