/* NEPTOON STRATEGY GAME — LANGUAGE */

export const GAME_TEXT = {
  en: {
    strategy: "YOUR STRATEGY",
    allocation: "YOUR ALLOCATION",
    investments: "INVESTMENTS",
    stocks: "Stocks",
    funds: "Funds",
    bonds: "Bonds",
    gold: "Gold",
    bitcoin: "Bitcoin",
    allocated: "allocated",
    allPlaced: "ALL PLACED",
    nextLevel: "NEXT LEVEL",
    replay: "REPLAY FROM LEVEL 1",
    viewPortfolio: "VIEW PORTFOLIO",
    backToTitle: "Back to title",
    strategySignal: "STRATEGY SIGNAL",
    searching: "Searching",
    warmer: "Getting warmer",
    hot: "Hot",
    almost: "Almost there",
    perfect: "Perfect!",
    levelComplete: "LEVEL COMPLETE!",
    cracked: "YOU CRACKED THE STRATEGY.",
    dragInstruction: "Drag the card onto the board.",
    masterpiece: "THE MASTERPIECE"
  },

  da: {
    strategy: "DIN STRATEGI",
    allocation: "DIN FORDELING",
    investments: "INVESTERINGER",
    stocks: "Aktier",
    funds: "Fonde",
    bonds: "Obligationer",
    gold: "Guld",
    bitcoin: "Bitcoin",
    allocated: "fordelt",
    allPlaced: "ALLE PLACERET",
    nextLevel: "NÆSTE NIVEAU",
    replay: "START FORFRA",
    viewPortfolio: "SE PORTEFØLJE",
    backToTitle: "Tilbage til start",
    strategySignal: "STRATEGISIGNAL",
    searching: "Søger",
    warmer: "Du nærmer dig",
    hot: "Tæt på",
    almost: "Næsten i mål",
    perfect: "Perfekt!",
    levelComplete: "NIVEAU GENNEMFØRT!",
    cracked: "DU LØSTE STRATEGIEN.",
    dragInstruction: "Træk investeringen ind på spillepladen.",
    masterpiece: "MESTERVÆRKET"
  }
};

export function getGameText(lang = "en") {
  return GAME_TEXT[lang === "da" ? "da" : "en"];
}
