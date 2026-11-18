
import { playSfx, resumeAudio, setSoundEnabled, unlockAudio } from "./audio.js";
import { layoutWeighted } from "./layout.js";
import {
  levelByNumber,
  piecesOf,
  strategyLine,
  initializeGameLevels
} from "./levels.js";

import { viewPortfolio } from "./portfolio.js";
import { isPerfectScore, percentOf, SIGNAL_LABEL, signalName, evaluateStrategy, targetWeights } from "./score.js";
import { clearSave, loadSave, writeSave } from "./storage.js";
import { getGameText } from "./i18n.js";
import { gameStories } from "./gameLevelStories.js";

/* =========================================
   NEPTOON — INSTRUMENT DATA SOURCE
========================================= */

const INSTRUMENTS_URL =
  "https://neptooninvest.github.io/neptoon-data/instruments_v1.json";



/* =========================================
   NEPTOON — INITIALIZE GAME DATA
========================================= */


export async function initializeGameData() {

  const response = await fetch(INSTRUMENTS_URL);

  if(!response.ok){
    throw new Error(
      `Instrument fetch failed: ${response.status}`
    );
  }

  const payload = await response.json();

  /* =========================================
     FLATTEN GROSS INSTRUMENT UNIVERSE
  ========================================= */

  const grossInstruments = (payload.groups || [])
    .flatMap(group =>
      (group.instruments || []).map(inst => ({

        ...inst,

        classNo:
          inst.classNo ?? group.classNo,

        classMajor:
          inst.classMajor ?? group.classMajor,

        instrumentName:
          inst.instrumentName || inst.name,

        // Required by the existing game engine
        instrumentId:
          inst.instrumentId ||
          String(inst.tickerExchange || "")
            .trim()
            .toUpperCase()

      }))
    );

  if(!grossInstruments.length){
    throw new Error(
      "Invalid or empty gross instrument universe"
    );
  }

  /* =========================================
     JOIN RECOGNITION STORIES
  ========================================= */

  const gameUniverse = buildGameUniverse(
    grossInstruments,
    gameStories
  );

  /* =========================================
     POPULATE ALL 10 GAME LEVELS
  ========================================= */

  const levels = initializeGameLevels(
    grossInstruments,
    gameUniverse
  );

  console.log(
    "NEPTOON GAME DATA READY",
    {
      gross: grossInstruments.length,
      curated: gameUniverse.length,
      levels: levels.length
    }
  );

  return levels;

}



function getColor(classNo) {

    const n = Number(classNo);

    // Individual stocks
    if (n === 100)
        return "#D94B55";

    // Equity Funds: 5–19 and 25–28
    if ((n >= 5 && n <= 19) || (n >= 25 && n <= 28))
       return "#2FA89B"; // Equity Funds — muted teal

    // Government Bonds: 0–1
    if (n >= 0 && n <= 1)
        return "#8B98AA";

    // Credit Bonds: 2–4
    if (n >= 2 && n <= 4)
        return "#6EC6ED";

    // Alternatives: 20–24
    if (n >= 20 && n <= 24)
        return "#D4AF37";

    // Fallback
    return "#6EC6ED";

}


/* =========================================
   BUILD CURATED GAME UNIVERSE
   Join gross instruments with game stories
   using tickerExchange
========================================= */

function buildGameUniverse(
  grossInstruments,
  gameStories
){

  const grossByTicker = new Map(
    grossInstruments.map(inst => [
      String(inst.tickerExchange || "")
        .trim()
        .toUpperCase(),
      inst
    ])
  );

  const gameUniverse = [];
  const missing = [];

  for(const item of gameStories.instruments){

    const ticker = String(item.tickerExchange || "")
      .trim()
      .toUpperCase();

    const instrument = grossByTicker.get(ticker);

    if(!instrument){
      missing.push(ticker);
      continue;
    }

    gameUniverse.push({
      ...instrument,

      tickerExchange: ticker,

      stories: item.stories
    });

  }

  console.log(
    "NEPTOON GAME UNIVERSE",
    {
      grossCount: grossInstruments.length,
      curatedCount: gameStories.instruments.length,
      matchedCount: gameUniverse.length,
      missing
    }
  );

  return gameUniverse;

}



function shuffle(list, seed) {
    const copy = list.slice();
    let state = seed % 2147483647 || 1;
    for (let i = copy.length - 1; i > 0; i--) {
        state = (state * 16807) % 2147483647;
        const j = state % (i + 1);
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    return copy;
}
function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function iconSound(on) {
    if (on) {
        return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3V9z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3V9z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M16 10l5 5M21 10l-5 5"/></svg>`;
}
function iconReset() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 12a8 8 0 1 0 2.2-5.5M4 4v5h5"/></svg>`;
}
function iconCrown() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17h18v3H3v-3zM2 8l5 4 5-7 5 7 5-4-2 9H4L2 8z"/></svg>`;
}
function iconMark() {
    return `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="14" height="18" fill="#6EC6ED"/><rect x="17" y="1" width="14" height="10" fill="#4E79BD"/><rect x="17" y="13" width="14" height="6" fill="#E4F3FC"/><rect x="1" y="21" width="30" height="10" fill="#4E79BD"/></svg>`;
}
// Extra interface strings supplement the shared i18n.js dictionary.
const GAME_EXTRA_TEXT = {
    en: {
        display: "KNOW YOUR<br>STRATEGIES", tag: "10 LEVELS. ONE MASTERPIECE.",
   subtitle: "Select an investment. Then select a portfolio slot.",
        masterLine: "You beat all 10 levels.", trackCaption: "Tap a level to replay it.",
        resetProgress: "Reset progress", backToLevels: "Back to levels",
        soundOn: "Sound on", soundOff: "Sound off", level: "LEVEL",
        leftOut: "Left out", allPlacedLabel: "All placed",
        startOver: "Start over?", resetMessage: "Your level progress will be cleared.",
        cancel: "CANCEL", reset: "RESET", strategyMaster: "STRATEGY MASTER",
        beatAll: "YOU BEAT ALL 10 LEVELS.", closer: "Closer.",
        keepAdjusting: "Keep adjusting.", emptyAllocation: "Empty allocation",
        satisfied: "Satisfied", percent: "percent", portfolioSaved: "Saved. This opens the wealth plan in Neptoon.",
        relive: "RELIVE THE FINALE", continueLevel: "CONTINUE LEVEL", playLevel: "PLAY LEVEL",
        trackMaster: "Strategy master. All ten levels complete. Tap any level to replay it.",
        trackContinue: "Continue level {n}. Level 10 is the finale.",
        trackNew: "Ten levels. Level 10 is locked until you reach it.",
        complete: "complete", inProgress: "in progress"
    },
    da: {
        display: "KEND DINE<br>STRATEGIER", tag: "10 NIVEAUER. ÉT MESTERVÆRK.",
  subtitle: "Vælg en investering. Vælg derefter en plads i porteføljen.",
        masterLine: "Du gennemførte alle 10 niveauer.", trackCaption: "Tryk på et niveau for at spille igen.",
        resetProgress: "Nulstil fremskridt", backToLevels: "Tilbage til niveauerne",
        soundOn: "Lyd til", soundOff: "Lyd fra", level: "NIVEAU",
        leftOut: "Fravalgt", allPlacedLabel: "Alle placeret",
        startOver: "Starte forfra?", resetMessage: "Dine fremskridt på niveauerne bliver slettet.",
        cancel: "ANNULLER", reset: "NULSTIL", strategyMaster: "STRATEGIMESTER",
        beatAll: "DU GENNEMFØRTE ALLE 10 NIVEAUER.", closer: "Tættere på.",
        keepAdjusting: "Prøv en anden fordeling.", emptyAllocation: "Tom position",
        satisfied: "Opfyldt", percent: "procent", portfolioSaved: "Gemt. Formueplanen åbnes i Neptoon.",
        relive: "GENOPLEV FINALEN", continueLevel: "FORTSÆT NIVEAU", playLevel: "SPIL NIVEAU",
        trackMaster: "Strategimester. Alle ti niveauer er gennemført. Tryk på et niveau for at spille igen.",
        trackContinue: "Fortsæt niveau {n}. Niveau 10 er finalen.",
        trackNew: "Ti niveauer. Niveau 10 låses op, når du når dertil.",
        complete: "gennemført", inProgress: "i gang"
    }
};

export function mountGame(root, options = {}) {
    const initialLang = options.lang || new URLSearchParams(window.location.search).get("lang") || document.documentElement.lang || "en";
    let lang = String(initialLang).toLowerCase().startsWith("da") ? "da" : "en";
    const t = (key) => getGameText(lang)[key] ?? GAME_EXTRA_TEXT[lang][key] ?? key;
    const fmt = (key, n) => t(key).replace("{n}", String(n));
    let alive = true;
    let currentLevel = 1;
    let highestCompleted = 0;
    let soundEnabled = true;

let arrangement = [];
let tray = [];
let selectedId = null;
let lastInstrumentId = null;
let solved = false;

    let score = 0;
    let busy = false;

    let layoutToken = 0;
    const pieceEls = new Map();
    let slotEls = [];
    let slotRects = [];
    root.innerHTML = "";
    root.classList.add("game-root");
    const shell = document.createElement("div");
    shell.className = "shell";
    root.appendChild(shell);
    const start = document.createElement("section");
    start.className = "start";
    start.innerHTML = `
    <div class="start-top">
      <button type="button" class="icon-btn round" data-sound aria-label="Sound on" aria-pressed="true">${iconSound(true)}</button>
    </div>
    <div class="start-body">
      <div class="mark">${iconMark()}</div>
      <p class="brand">NEPTOON</p>
      <h1 class="display">KNOW YOUR<br>STRATEGIES</h1>
      <p class="tag">10 LEVELS. ONE MASTERPIECE.</p>
      <p class="subtitle">Drag the investments. Crack the strategy.</p>
      <p class="master-line" hidden>You beat all 10 levels.</p>
      <button type="button" class="play-btn pulse" data-play>PLAY LEVEL 1</button>
      <div class="track" data-track></div>
      <p class="track-caption" data-track-caption hidden>Tap a level to replay it.</p>
      <p class="sr-only" data-track-text></p>
      <button type="button" class="text-btn" data-reset hidden>Reset progress</button>
    </div>
  `;
    const play = document.createElement("section");
    play.className = "play";
    play.hidden = true;
    play.innerHTML = `

<header class="topbar">

  <button type="button"
          class="home-btn topbar-id"
          data-home
          aria-label="Back to levels">

    <span class="mini-mark">${iconMark()}</span>

    <span class="topbar-copy">
      <span class="brand brand-sm">
        NEPTOON · <span data-level-kicker>LEVEL 1</span>
      </span>

      <span class="level-line" data-level-title>
        First Move
      </span>
    </span>

  </button>

  <div class="top-actions">

    <button type="button"
            class="icon-btn icon-btn-plain"
            data-sound
            aria-label="Sound on"
            aria-pressed="true">
      ${iconSound(true)}
    </button>

    <button type="button"
            class="icon-btn icon-btn-plain"
            data-reshuffle
            aria-label="Reshuffle instruments"
            title="Reshuffle instruments">
      ${iconReset()}
    </button>

  </div>

</header>

<div class="ticks"
     data-ticks
     aria-hidden="true"></div>


<!-- STRATEGY TABLE -->

<div class="game-mandate" data-mandate>

  <div class="mandate-heading">
    <p class="mandate-title">YOUR STRATEGY</p>
    <span data-strategy-count>5 INVESTMENTS</span>
  </div>

  <table class="strategy-table">
    <thead>
      <tr>
        <th>INSTRUMENT STORY</th>
        <th>WEIGHT</th>
      </tr>
    </thead>

    <tbody data-strategy-rows></tbody>
  </table>

</div>


<!-- KEEP EXISTING ALLOCATION MONITOR HERE -->

<!-- ASSET ALLOCATION MONITOR -->

    <div class="allocation-monitor">
      <div class="allocation-header">
        <span>YOUR ALLOCATION</span>
        <span data-allocation-total>0% allocated</span>
      </div>
      <div class="allocation-bar" data-allocation-bar>
        <div class="allocation-segment stocks" data-allocation-stocks></div>
        <div class="allocation-segment equity" data-allocation-equity></div>
        <div class="allocation-segment bonds" data-allocation-bonds></div>
        <div class="allocation-segment gold" data-allocation-gold></div>
        <div class="allocation-segment bitcoin" data-allocation-bitcoin></div>
      </div>

<div class="allocation-legend">

  <div class="allocation-item stocks">
    <span class="allocation-icon">▥</span>
    <strong data-weight-stocks>0%</strong>
    <small>Stocks</small>
  </div>

  <div class="allocation-item equity">
    <span class="allocation-icon">▤</span>
    <strong data-weight-equity>0%</strong>
    <small>Equity Funds</small>
  </div>

  <div class="allocation-item bonds">
    <span class="allocation-icon">▰</span>
    <strong data-weight-bonds>0%</strong>
    <small>Gov Bonds</small>
  </div>

  <div class="allocation-item gold">
    <span class="allocation-icon">▰</span>
    <strong data-weight-gold>0%</strong>
    <small>Credit Bonds</small>
  </div>

  <div class="allocation-item bitcoin">
    <span class="allocation-icon">◆</span>
    <strong data-weight-bitcoin>0%</strong>
    <small>Alternatives</small>
  </div>

</div>    

<p class="sr-only" data-signal-live></p>

<div class="stage">
  <div class="board" data-board>
    <p class="coach" data-coach hidden>
      Drag the card onto the board.
    </p>
    <p class="banner" data-banner hidden>
      THE MASTERPIECE
    </p>
  </div>
</div>


<!-- INVESTMENTS + COMPACT MATCH SCORE -->

<div class="tray" data-tray>

  <div class="tray-heading">

    <p class="tray-label" data-tray-label>
      INVESTMENTS
    </p>

    <div class="signal"
         data-state="searching"
         aria-live="polite">

      <span class="signal-kicker">MATCH</span>
      <strong class="signal-word" data-word>0%</strong>

    </div>

  </div>

  <p class="tray-instrument-name"
     id="trayInstrumentName"></p>

  <div class="tray-grid" data-tray-grid></div>

</div>


<!-- KEEP EXISTING VICTORY SECTION HERE -->


    <div class="victory" data-victory hidden>
      <div class="crown" data-crown hidden>${iconCrown()}</div>

<div class="victory-stars" aria-hidden="true">
  <span>♛</span>
  <span>♛</span>
  <span>♛</span>
</div>

      <p class="victory-kicker" data-victory-kicker></p>
      <h2 class="victory-title" data-victory-title></h2>
      <p class="mix" data-mix></p>
      <button type="button" class="play-btn" data-next>NEXT LEVEL</button>

<button
  type="button"
  class="play-btn"
  data-levels-end
  hidden>
  VIEW MY STRATEGIES
</button>

      <button type="button" class="play-btn" data-replay hidden>REPLAY FROM LEVEL 1</button>
      <button type="button" class="ghost-btn" data-portfolio hidden>ADD TO MYWEALTH</button>
      <button type="button" class="text-btn" data-title hidden>Back to title</button>
    </div>


<footer class="game-footer">
  <span>NEPTOON STRATEGY GAME</span>
  <small>© 2026 NEPTOON WEALTH</small>
</footer>




  `;



    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.hidden = true;
    scrim.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <h2 id="reset-title">Start over?</h2>
      <p>Your level progress will be cleared.</p>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-cancel>CANCEL</button>
        <button type="button" class="play-btn" data-confirm>RESET</button>
      </div>
    </div>
  `;
    const toast = document.createElement("p");
    toast.className = "toast";
    toast.hidden = true;
    toast.setAttribute("role", "status");
    shell.append(start, play, scrim, toast);


/* =====================================================
   NEPTOON STRATEGY GAME
   PAGE LEVELS END · FINAL PORTFOLIO GALLERY
===================================================== */

function renderPageLevelsEnd(){

  if(!isMaster()){
    return;
  }

  /*
    ==========================================
    A · PREPARE FINAL PAGE
    ==========================================
  */

  start.hidden = true;
  play.hidden = true;

  let page =
    shell.querySelector("#pageLevelsEnd");

  if(!page){

    page = document.createElement("section");

    page.id = "pageLevelsEnd";
    page.className = "page-levels-end";

    shell.appendChild(page);

  }

  page.hidden = false;

  const da = lang === "da";

  /*
    ==========================================
    B · BUILD PORTFOLIO GALLERY
    ==========================================
  */

  const levels = Array.from(
    {length:10},
    (_,i) => levelByNumber(i + 1)
  );


const levelIcons = [
  "sprout",
  "git-branch",
  "layers-3",
  "chart-no-axes-combined",
  "scale",
  "wallet",
  "pie-chart",
  "trending-up",
  "compass",
  "gem"
];


  const cards = levels.map((data,i) => {

    const levelNo = i + 1;

    const title =
      (da
        ? data.metaFlat?.titleDa
        : data.metaFlat?.title) ||
      data.metaFlat?.title ||
      `Strategy ${levelNo}`;

    return `
      <label class="levels-end-card">

        <div class="levels-end-card-top">

          <span class="levels-end-number">
            ${da ? "NIVEAU" : "LEVEL"} ${levelNo}
          </span>

<input
  type="checkbox"
  data-level-check
  value="${levelNo}"
>

        </div>

<div class="levels-end-card-title">

  <i data-lucide="${levelIcons[i]}"></i>

  <span>
    ${escapeLevelsEndHTML(title)}
  </span>

</div>

        <div class="levels-end-card-bottom">
          <span>
            ${data.holdings.length}
            ${da ? "investeringer" : "investments"}
          </span>
        </div>

      </label>
    `;

  }).join("");

  /*
    ==========================================
    C · PAGE HTML
    ==========================================
  */

  
page.innerHTML = `

  <div class="levels-end-header">

    <div class="levels-end-kicker">
      NEPTOON · STRATEGY MASTER
    </div>

    <div class="levels-end-heading">

      <div>
        <h2>
          ${da ? "MISSION GENNEMFØRT" : "MISSION COMPLETE"}
        </h2>

        <p>
          ${da
            ? "10 niveauer gennemført. Vælg dine strategier."
            : "10 levels completed. Select your strategies."}
        </p>
      </div>

      <span class="levels-end-crown">♛</span>

    </div>

    <button

  </div>


  <div class="levels-end-content">

    <div class="levels-end-section-head">

      <div>

        <h3>
          ${da ? "Mine strategier" : "My Strategies"}
        </h3>

        <p>
          ${da
            ? "Vælg de porteføljer, du vil sende til Neptoon."
            : "Select the portfolios to send to Neptoon."}
        </p>

      </div>

      <span data-levels-count>0 / 10</span>

    </div>


    <div class="levels-end-gallery">
      ${cards}
    </div>


    <div class="levels-end-selection">


    </div>

<button
  type="button"
  class="levels-end-send"
  data-levels-send
  disabled>
  ${da
    ? "TILFØJ PORTEFØLJER"
    : "ADD PORTFOLIOS"}
</button>


    <p class="levels-end-note">
      ${da
        ? "Porteføljerne bliver tilgængelige under Egne porteføljer."
        : "Your portfolios will be available under Custom."}
    </p>





    <button
      type="button"
      class="levels-end-back"
      data-levels-back>
      ${da ? "Tilbage til spillet" : "Back to Game"}
    </button>

  </div>


  <!-- ======================================
       NEPTOON STRATEGY GAME · FOOTER
  ======================================= -->

  <footer class="game-footer">

    <span>NEPTOON STRATEGY GAME</span>

    <small>© ${new Date().getFullYear()} NEPTOON WEALTH</small>

  </footer>

`;

  /*
    ==========================================
    D · SELECTION STATE
    ==========================================
  */

  const checks = [
    ...page.querySelectorAll("[data-level-check]")
  ];

  const countEl =
    page.querySelector("[data-levels-count]");

  const sendButton =
    page.querySelector("[data-levels-send]");

function updateSelection(){

  const count =
    checks.filter(c => c.checked).length;

  countEl.textContent = `${count} / 10`;

  sendButton.disabled = count === 0;

  sendButton.textContent =
    da
      ? `TILFØJ ${count} PORTEFØLJER`
      : `ADD ${count} PORTFOLIOS`;

}

  checks.forEach(check => {
    check.addEventListener(
      "change",
      updateSelection
    );
  });

  page.querySelector(
    "[data-levels-select-all]"
  ).addEventListener("click", () => {

    checks.forEach(c => c.checked = true);
    updateSelection();

  });

  page.querySelector(
    "[data-levels-clear]"
  ).addEventListener("click", () => {

    checks.forEach(c => c.checked = false);
    updateSelection();

  });

  /*
    ==========================================
    E · TRANSFER TO APP
    ==========================================
  */

  sendButton.addEventListener("click", () => {

    const selectedLevels = checks
      .filter(c => c.checked)
      .map(c => Number(c.value));

    if(!selectedLevels.length){
      return;
    }

    const selectedLevelPortfolios =
      selectedLevels.map(levelNo => {

        const data =
          levelByNumber(levelNo);

        return {

          level: levelNo,

          strategyName:
            (da
              ? data.metaFlat?.titleDa
              : data.metaFlat?.title) ||
            data.metaFlat?.title ||
            `Game Level ${levelNo}`,

          holdings:
            data.holdings.map(h => ({
              tickerExchange:
                h.tickerExchange,

              classNo:
                Number(h.classNo),

              weight:
                Number(h.weight)
            }))

        };

      });

    /*
      APP bridge.

      The APP receives the payload and calls
      receiveCustomLevelPortfolios().

      Do not change APP.planSlots here.
    */

    window.dispatchEvent(
      new CustomEvent(
        "neptoon:game-portfolios-transfer",
        {
          detail: {
            selectedLevels,
            selectedLevelPortfolios
          }
        }
      )
    );

  });

  /*
    ==========================================
    F · RETURN TO GAME
    ==========================================
  */

  page.querySelector(
    "[data-levels-back]"
  ).addEventListener("click", () => {

    page.hidden = true;

    openPlay(false);

  });

  updateSelection();

}




/* =====================================================
   SAFE HTML TEXT
===================================================== */

function escapeLevelsEndHTML(value){

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

}



/* =========================================
   NEPTOON — STRATEGY TABLE
========================================= */

function renderStrategyTable() {

  const tbody =
    play.querySelector("[data-strategy-rows]");

  if(!tbody) return;

  const data = level();

  tbody.replaceChildren();

  data.holdings.forEach((holding, index) => {

    const row = document.createElement("tr");

    const storyCell = document.createElement("td");
    const weightCell = document.createElement("td");

    const stories =
      holding.stories?.[lang] ||
      holding.stories?.en ||
      [];

    // One recognition clue per holding
    storyCell.textContent =
      stories[0] || holding.instrumentName || "";

    weightCell.textContent =
      `${percentOf(holding.weight)}%`;

    weightCell.className = "strategy-weight";

    row.append(
      storyCell,
      weightCell
    );

    tbody.appendChild(row);

  });

  const count =
    play.querySelector("[data-strategy-count]");

  if(count){
    count.textContent =
      `${data.holdings.length} ${
        lang === "da"
          ? "INVESTERINGER"
          : "INVESTMENTS"
      }`;
  }

}



    function renderStaticText() {
        root.lang = lang;
        start.querySelector(".display").innerHTML = t("display");
        start.querySelector(".tag").textContent = t("tag");
        start.querySelector(".subtitle").textContent = t("subtitle");
        start.querySelector(".master-line").textContent = t("masterLine");
        start.querySelector("[data-track-caption]").textContent = t("trackCaption");
        start.querySelector("[data-reset]").textContent = t("resetProgress");
        play.querySelector("[data-home]").setAttribute("aria-label", t("backToLevels"));

       play.querySelector(".signal-kicker").textContent =
    lang === "da" ? "SUCCES TRACKER" : "SUCCES TRACKER";

        play.querySelector(".mandate-title").textContent = t("strategy");

const allocationHeader =
  play.querySelector(".allocation-header span:first-child");

if(allocationHeader){
  allocationHeader.textContent = t("allocation");
}
     


const allocationLabels = {

    en: {
        stocks: "Stocks",
        equity: "Equity Funds",
        bonds: "Gov Bonds",
        gold: "Credit Bonds",
        bitcoin: "Alternatives"
    },

    da: {
        stocks: "Aktier",
        equity: "Aktiefonde",
        bonds: "Statsobl.",
        gold: "Kreditobl.",
        bitcoin: "Alternativer"
    }

};

for (const [key, label] of Object.entries(allocationLabels[lang])) {

    const item =
        play.querySelector(`.allocation-item.${key} small`);

    if (item) {
        item.textContent = label;
    }

}




        coachEl.textContent = t("dragInstruction");
        bannerEl.textContent = t("masterpiece");
        play.querySelector("[data-next]").textContent = t("nextLevel");
        play.querySelector("[data-replay]").textContent = t("replay");
        play.querySelector("[data-portfolio]").textContent = t("viewPortfolio");
        play.querySelector("[data-title]").textContent = t("backToTitle");
        scrim.querySelector("#reset-title").textContent = t("startOver");
        scrim.querySelector(".modal p").textContent = t("resetMessage");
        scrim.querySelector("[data-cancel]").textContent = t("cancel");
        scrim.querySelector("[data-confirm]").textContent = t("reset");
        for (const button of play.querySelectorAll("[data-reset]")) button.setAttribute("aria-label", t("resetProgress"));
    }
    const boardEl = play.querySelector("[data-board]");
    const trayEl = play.querySelector("[data-tray]");
    const trayGrid = play.querySelector("[data-tray-grid]");
    const trayLabel = play.querySelector("[data-tray-label]");
    const wordEl = play.querySelector("[data-word]");
    const ringEl = play.querySelector("[data-ring]");
    const signalEl = play.querySelector(".signal");
    const signalLive = play.querySelector("[data-signal-live]");
    const coachEl = play.querySelector("[data-coach]");
    const bannerEl = play.querySelector("[data-banner]");
    const victoryEl = play.querySelector("[data-victory]");
    const playButtons = () => shell.querySelectorAll("[data-play]");
    const saved = loadSave();
    if (saved) {
        currentLevel = clampLevel(saved.currentLevel);
        highestCompleted = clampCompleted(saved.highestCompleted);
        if (currentLevel > highestCompleted + 1)
            currentLevel = highestCompleted + 1;
        soundEnabled = saved.soundEnabled;
        if (saved.currentLevel === currentLevel && placementFits(currentLevel, saved)) {
            arrangement = saved.arrangement.slice();
            tray = saved.tray.slice();
        }
    }
    setSoundEnabled(soundEnabled);
    if (arrangement.length === 0)
        freshArrangement(currentLevel);
    score = computeScore();
    solved = isPerfectScore(score);
    function level() {
        return levelByNumber(currentLevel);
    }
    function catalog() {
        const map = new Map();
        for (const piece of piecesOf(level()))
            map.set(piece.instrumentId, piece);
        return map;
    }

/* =========================================
   DEV ONLY · OPEN GAME FINALE
========================================= */

window.testGameFinale = () => {

  highestCompleted = 10;

  renderPageLevelsEnd();

};



    function slotPercents() {
        return level().holdings.map((holding) => percentOf(holding.weight));
    }
    function computeScore() {
        return evaluateStrategy(level(), slotPercents(), arrangement).score;
    }
    function freshArrangement(levelNumber) {
        const data = levelByNumber(levelNumber);
        arrangement = data.holdings.map(() => null);
        tray = shuffle(piecesOf(data).map((piece) => piece.instrumentId), levelNumber * 97 + 13);
    }
    function placementFits(levelNumber, data) {
        const spec = levelByNumber(levelNumber);
        const ids = new Set(piecesOf(spec).map((piece) => piece.instrumentId));
        if (data.arrangement.length !== spec.holdings.length)
            return false;
        const used = new Set();
        for (const id of data.arrangement) {
            if (id == null)
                continue;
            if (!ids.has(id) || used.has(id))
                return false;
            used.add(id);
        }
        for (const id of data.tray) {
            if (!ids.has(id) || used.has(id))
                return false;
            used.add(id);
        }
        return used.size === ids.size;
    }
    function isReturning() {
        return highestCompleted > 0 || currentLevel > 1 || solved || arrangement.some((id) => id != null);
    }
    function isMaster() {
        return highestCompleted >= 10;
    }
    function persist() {
        writeSave({
            version: 1,
            currentLevel,
            highestCompleted,
            soundEnabled,
            arrangement,
            tray,
        });
    }
    function locOf(id) {
        const index = arrangement.indexOf(id);
        if (index >= 0)
            return { type: "slot", index };
        return { type: "tray" };
    }
    function canStart() {
return alive && !play.hidden && !solved && !busy;
    }


function syncChrome() {

    root.dataset.screen =
        play.hidden
            ? "start"
            : solved && currentLevel === 10
                ? "finale"
                : solved
                    ? "victory"
                    : "play";

    root.dataset.level = String(currentLevel);

    // Keep existing signal state for CSS compatibility
    root.dataset.signal = signalName(score);

    // NEW · Portfolio Match percentage
    const matchPercent =
        Math.max(0, Math.min(100, Math.round(score * 100)));

    root.dataset.match = String(matchPercent);

    root.dataset.solved = solved ? "true" : "false";

    for (const button of shell.querySelectorAll("[data-sound]")) {

        button.setAttribute(
            "aria-pressed",
            soundEnabled ? "true" : "false"
        );

        button.setAttribute(
            "aria-label",
            soundEnabled ? t("soundOn") : t("soundOff")
        );

        button.innerHTML = iconSound(soundEnabled);

    }

}


    function maxOpenLevel() {
        return isMaster() ? 10 : Math.min(10, highestCompleted + 1);
    }
    function renderTrack(into, interactive) {
        into.replaceChildren();
        if (interactive)
            into.removeAttribute("aria-hidden");
        else
            into.setAttribute("aria-hidden", "true");
        const openUntil = maxOpenLevel();
        for (let n = 1; n <= 10; n++) {
            const done = n <= highestCompleted;
            const open = interactive && n <= openUntil;
            const item = document.createElement(open ? "button" : "span");
            item.className = "tick";
            if (n === 10)
                item.classList.add("finale");
            if (done)
                item.classList.add("done");
            if (n === currentLevel)
                item.classList.add("now");
            else if (!done)
                item.classList.add("locked");
            if (open) {
                const button = item;
                button.type = "button";
                button.dataset.jump = String(n);
                const state = done ? `, ${t("complete")}` : n === currentLevel ? `, ${t("inProgress")}` : "";
                button.setAttribute("aria-label", `${t("level")} ${n}${state}`);
                if (n === currentLevel)
                    button.setAttribute("aria-current", "step");
            }
            if (n === 10)
                item.innerHTML = iconCrown();
            else
                item.textContent = String(n);
            into.appendChild(item);
        }
    }
    function renderStart() {
        const button = start.querySelector("[data-play]");
        const masterLine = start.querySelector(".master-line");
        const resetBtn = start.querySelector("[data-reset]");
        const trackText = start.querySelector("[data-track-text]");
        if (isMaster() && (currentLevel === 10 || solved)) {
            button.textContent = t("relive");
            masterLine.hidden = false;
            trackText.textContent = t("trackMaster");
        }
        else if (isReturning()) {
            button.textContent = `${t("continueLevel")} ${currentLevel}`;
            masterLine.hidden = true;
            trackText.textContent = fmt("trackContinue", currentLevel);
        }
        else {
            button.textContent = `${t("playLevel")} 1`;
            masterLine.hidden = true;
            trackText.textContent = t("trackNew");
        }
        resetBtn.hidden = !isReturning() && !isMaster();
        const caption = start.querySelector("[data-track-caption]");
        caption.hidden = highestCompleted < 1 && !isMaster();
        const track = start.querySelector("[data-track]");
        renderTrack(track, true);
        syncChrome();
    }


function renderAllocationMonitor() {

    const weights = {
        stocks: 0,
        equity: 0,
        bonds: 0,
        gold: 0,
        bitcoin: 0
    };

    const instruments = catalog();
    const slots = slotPercents();

    let allocated = 0;

    /*
       CALCULATE ALLOCATION BY ASSET CLASS

       stocks  = Individual stocks
       equity  = Equity Funds
       bonds   = Government Bonds
       gold    = Credit Bonds
       bitcoin = Alternatives

       Existing DOM bindings preserved.
    */

    arrangement.forEach((id, index) => {

        if (id == null) return;

        const weight = Number(slots[index]) || 0;

        allocated += weight;

        const instrument = instruments.get(id);

        if (!instrument) return;

        const n = Number(instrument.classNo);

        // Individual stocks
        if (n === 100) {
            weights.stocks += weight;
        }

        // Equity Funds: 5–19 and 25–28
        else if (
            (n >= 5 && n <= 19) ||
            (n >= 25 && n <= 28)
        ) {
            weights.equity += weight;
        }

        // Government Bonds: 0–1
        else if (n >= 0 && n <= 1) {
            weights.bonds += weight;
        }

        // Credit Bonds: 2–4
        else if (n >= 2 && n <= 4) {
            weights.gold += weight;
        }

        // Alternatives: 20–24
        else if (n >= 20 && n <= 24) {
            weights.bitcoin += weight;
        }

    });

    /*
       UPDATE BAR SEGMENTS AND CLASS PERCENTAGES
    */

    for (const key of Object.keys(weights)) {

        const value = weights[key];

        const segment =
            play.querySelector(
                `[data-allocation-${key}]`
            );

        if (segment) {
            segment.style.width =
                `${Math.max(0, Math.min(100, value))}%`;
        }

        const classLabel =
            play.querySelector(
                `[data-weight-${key}]`
            );

        if (classLabel) {
            classLabel.textContent =
                `${Math.round(value)}%`;
        }

    }

    /*
       UPDATE TOTAL PORTFOLIO ALLOCATION
    */

    const totalLabel =
        play.querySelector(
            "[data-allocation-total]"
        );

    if (totalLabel) {
        totalLabel.textContent =
            `${Math.round(allocated)}% ${t("allocated")}`;
    }

}
    function renderHud() {


    const data = level();

    renderStrategyTable();

        play.querySelector("[data-level-kicker]").textContent = `${t("level")} ${currentLevel}`;
        play.querySelector("[data-level-title]").textContent = (lang === "da" ? data.metaFlat.titleDa : data.metaFlat.title) || data.metaFlat.title;
        const mandate = play.querySelector("[data-mandate-rules]");
        if (mandate) {
            mandate.replaceChildren();
            for (const rule of ((lang === "da" ? data.metaFlat.rulesDa : data.metaFlat.rules) || data.metaFlat.rules || [])) {
                const li = document.createElement("li");
                li.textContent = rule;
                const result = evaluateStrategy(data, slotPercents(), arrangement);
                const ruleIndex = mandate.children.length;
                if (result.passed[ruleIndex]) {
                    li.classList.add("is-met");
                    li.setAttribute("aria-label", `${t("satisfied")}: ${rule}`);
                }
                mandate.appendChild(li);
            }
        }
        const ticks = play.querySelector("[data-ticks]");
        renderTrack(ticks, false);
        coachEl.hidden = !(currentLevel === 1 && !solved && arrangement.every((id) => id == null));
    }



function paintSignal(flash) {

    const matchPercent =
        Math.max(0, Math.min(100, Math.round(score * 100)));

    const perfect = isPerfectScore(score);

    /* =========================================
       NUMERIC PORTFOLIO MATCH
    ========================================= */

    signalEl.dataset.state =
        perfect ? "perfect" : "matching";

    wordEl.textContent = `${matchPercent}%`;

    /* =========================================
       OPTIONAL CIRCULAR GAUGE
       Guard against missing DOM element
    ========================================= */

    if(ringEl){

        ringEl.style.strokeDashoffset =
            String(100 - matchPercent);

        ringEl.style.stroke =
            perfect ? "#22C55E" : "#4E79BD";

    }

    /* =========================================
       MATCH FEEDBACK
    ========================================= */

    signalEl.classList.remove("up", "down");

    if(flash === "up" || flash === "down"){

        void signalEl.offsetWidth;

        signalEl.classList.add(flash);

        signalLive.textContent =
            `${lang === "da"
                ? "Succes Tracker"
                : "Succes Tracker"}: ${matchPercent}%`;

    } else if(flash === "none"){

        signalLive.textContent = "";

    }

    syncChrome();

}



    function labelMode(width, height) {
        if (width >= 150 && height >= 84)
            return "full";
        if (width >= 98 && height >= 60)
            return "medium";
        return "short";
    }



function applyLabel(el, instrument, mode) {

    el.classList.remove(
        "mode-full",
        "mode-medium",
        "mode-short",
        "mode-tray",
        "mode-float"
    );

    el.classList.add(`mode-${mode}`);

    /* =========================================
       DYNAMIC CARD TYPOGRAPHY
    ========================================= */

    const isBoardCard =
        mode !== "tray" &&
        mode !== "float";

    if(isBoardCard){

        const slot = el.closest(".slot");

        const width =
            slot?.clientWidth || 150;

        const height =
            slot?.clientHeight || 80;

        const scale = Math.min(
            width / 250,
            height / 160
        );

        const fontSize = Math.max(
            12,
            Math.min(28, 18 * scale)
        );

        el.style.setProperty(
            "--card-name-size",
            `${fontSize}px`
        );

    } else {

        el.style.removeProperty(
            "--card-name-size"
        );

    }

    /* =========================================
       PRIMARY LABEL
       Asset class · DA / EN
    ========================================= */

    const classLabel =
        (
            lang === "da"
                ? instrument.classMajorTopDa
                : instrument.classMajorTop
        ) ||
        instrument.classMajorTop ||
        "";

    /* =========================================
       SECONDARY LABEL
       Full instrument name
    ========================================= */

    const instrumentName =
        instrument.instrumentName ||
        instrument.name ||
        "";

    el.setAttribute(
        "aria-label",
        [classLabel, instrumentName]
            .filter(Boolean)
            .join(", ")
    );

    el.replaceChildren();

    const primary =
        document.createElement("span");

    primary.className = "ticker";
    primary.textContent = classLabel;

    const secondary =
        document.createElement("span");

    secondary.className = "sub";
    secondary.textContent = instrumentName;
    secondary.title = instrumentName;

    /* =========================================
       APPEND LABELS
    ========================================= */

    el.append(
        primary,
        secondary
    );

}



    function ensurePiece(id) {
        const existing = pieceEls.get(id);
        if (existing)
            return existing;
        const instrument = catalog().get(id);
        if (!instrument)
            throw new Error(`Unknown instrument ${id}`);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "piece";
        button.dataset.id = id;
        button.style.setProperty("--accent", getColor(instrument.classNo));
button.style.setProperty(
    "--asset-tint",
    getColor(instrument.classNo)
);


/* TAP-TO-SELECT ONLY · DRAGGING DISABLED */

button.draggable = false;

button.addEventListener("click", event => {

    if (!canStart()) return;

    const id = event.currentTarget.dataset.id;

    if (!id) return;

    handleTap(id);

});




        button.addEventListener("keydown", onPieceKey);
        button.addEventListener("contextmenu", (event) => event.preventDefault());
        pieceEls.set(id, button);
        applyLabel(button, instrument, "tray");
        return button;
    }
    function clearPieces() {
        for (const el of pieceEls.values())
            el.remove();
        pieceEls.clear();
    }
    function buildSlots() {
        const coach = coachEl;
        const banner = bannerEl;
        boardEl.replaceChildren(coach, banner);
        slotEls = [];
        const count = level().holdings.length;
        for (let index = 0; index < count; index++) {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.dataset.index = String(index);
        
slot.addEventListener("click", event => {

    if (event.target !== event.currentTarget) return;

    const index = Number(event.currentTarget.dataset.index);

    if (!Number.isInteger(index)) return;

    handleTapSlot(index);

});


            slot.addEventListener("keydown", onSlotKey);
            boardEl.appendChild(slot);
            slotEls.push(slot);
        }
    }
    function applyRect(slot, rect) {
        slot.style.left = `${rect.x}px`;
        slot.style.top = `${rect.y}px`;
        slot.style.width = `${rect.w}px`;
        slot.style.height = `${rect.h}px`;
    }
    function layoutBoard(bloom) {
        const width = boardEl.clientWidth;
        const height = boardEl.clientHeight;
        if (width < 40 || height < 40)
            return;
        const percents = slotPercents();
        if (slotEls.length !== percents.length)
            buildSlots();
        slotRects = layoutWeighted(percents, width, height);
        slotRects.forEach((rect, index) => applyRect(slotEls[index], rect));
        renderPieces(false);
        if (bloom && !reduceMotion()) {
            const token = ++layoutToken;
            boardEl.classList.remove("bloom");
            void boardEl.offsetWidth;
            boardEl.classList.add("bloom");
            busy = true;
            window.setTimeout(() => {
            if (alive && token === layoutToken)
                    busy = false;
            }, 220);
        }
    }
    function renderPieces(animate) {
        const instruments = catalog();
        const ids = piecesOf(level()).map((piece) => piece.instrumentId);
        for (const id of [...pieceEls.keys()]) {
            if (!ids.includes(id)) {
                pieceEls.get(id)?.remove();
                pieceEls.delete(id);
            }
        }
        const nodes = ids.map((id) => ensurePiece(id));
        const first = animate ? new Map(nodes.map((node) => [node, node.getBoundingClientRect()])) : null;
        trayLabel.textContent =
            solved && tray.length > 0 ? t("leftOut") : tray.length === 0 ? t("allPlacedLabel") : t("investments");


const metadataId =
    selectedId || lastInstrumentId;

const selectedInstrument =
    metadataId
        ? instruments.get(metadataId)
        : null;
const instrumentNameEl =
    root.querySelector("#trayInstrumentName");

if(instrumentNameEl){

    instrumentNameEl.textContent =
        selectedInstrument
            ? [
                lang === "da"
                    ? selectedInstrument.classMajorTop
                    : selectedInstrument.class_major_top_eng,

                lang === "da"
                    ? selectedInstrument.type_label
                    : selectedInstrument.type_label_eng,

                selectedInstrument.ccy,

                // Sector only for individual stocks
                Number(selectedInstrument.classNo) === 100
                    ? (
                        lang === "da"
                            ? selectedInstrument.sector
                            : selectedInstrument.sector_eng
                      )
                    : null,

                selectedInstrument.instrumentName

              ]
                .filter(Boolean)
                .join(" - ")
            : "";

}



        const columns = tray.length <= 1 ? 1 : tray.length === 2 ? 2 : tray.length === 3 ? 3 : 4;
        trayGrid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
        slotEls.forEach((slot, index) => {
            const id = arrangement[index];
            slot.classList.toggle("is-empty", !id);
            slot.classList.remove("is-target");
            if (!id) {
                slot.tabIndex = 0;
                slot.setAttribute("role", "button");
                slot.setAttribute("aria-label", `${t("emptyAllocation")} ${index + 1}`);
            }
            else {
                slot.tabIndex = -1;
                slot.removeAttribute("role");
                slot.removeAttribute("aria-label");
            }
        });
        trayGrid.replaceChildren();
        for (let index = 0; index < arrangement.length; index++) {
            const id = arrangement[index];
            if (!id)
                continue;
            const instrument = instruments.get(id);
            const el = ensurePiece(id);
            undock(el);
            const rect = slotRects[index];
            const mode = rect ? labelMode(rect.w, rect.h) : "short";
            if (instrument) {
                applyLabel(el, instrument, mode);
                stampWeight(el, instrument, index);
            }
            el.classList.toggle("is-selected", selectedId === id);
            slotEls[index]?.appendChild(el);
        }

for (const id of tray) {

    const instrument = instruments.get(id);
    const el = ensurePiece(id);

    undock(el);

    if (instrument) {

        applyLabel(el, instrument, "tray");

const target =
    targetWeights(level().holdings)
        .get(instrument.instrumentId) ?? 0;

const badge = document.createElement("span");

badge.className = "weight";
badge.textContent = `${target}%`;

el.appendChild(badge);

    }

    el.classList.toggle(
        "is-selected",
        selectedId === id
    );

    trayGrid.appendChild(el);

}

        renderAllocationMonitor();
        if (!first || reduceMotion())
            return;
        busy = true;
        for (const el of nodes) {
            const before = first.get(el);
            if (!before || before.width < 2)
                continue;
            const after = el.getBoundingClientRect();
            const dx = before.left - after.left;
            const dy = before.top - after.top;
            const sx = after.width > 0 ? before.width / after.width : 1;
            const sy = after.height > 0 ? before.height / after.height : 1;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02)
                continue;
            el.style.transformOrigin = "top left";
            el.style.transition = "none";
            el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        }
        requestAnimationFrame(() => {
            if (!alive)
                return;
            for (const el of nodes) {
                if (!el.style.transform)
                    continue;
                el.style.transition = "transform 230ms cubic-bezier(0.2, 0.8, 0.2, 1)";
                el.style.transform = "";
            }
        });
        window.setTimeout(() => {
            if (!alive)
                return;
            busy = false;
            for (const el of nodes) {
                el.style.transition = "";
                el.style.transformOrigin = "";
            }
        }, 260);
    }
    function stampWeight(el, instrument, slotIndex) {
        const pct = slotPercents()[slotIndex];
        if (pct == null) return;
        const badge = document.createElement("span");
        badge.className = "weight";
        badge.textContent = `${pct}%`;
        el.append(badge);
        el.setAttribute("aria-label", `${instrument.instrumentName}, ${pct} ${t("percent")}`);
    }
    function undock(el) {
        el.classList.remove("is-floating");
        el.style.position = "";
        el.style.width = "";
        el.style.height = "";
        el.style.left = "";
        el.style.top = "";
        el.style.zIndex = "";
        el.style.margin = "";
    }
    function moveToSlot(id, index) {
        const from = locOf(id);
        if (from.type === "slot" && from.index === index)
            return false;
        const occupant = arrangement[index] ?? null;
        if (from.type === "slot")
            arrangement[from.index] = occupant;
        else
            tray = tray.filter((item) => item !== id);
        if (occupant && from.type === "tray")
            tray.unshift(occupant);
        arrangement[index] = id;
        return true;
    }
    function moveToTray(id) {
        const from = locOf(id);
        if (from.type !== "slot")
            return false;
        arrangement[from.index] = null;
        tray.push(id);
        return true;
    }
    function swapIds(a, b) {
        const la = locOf(a);
        const lb = locOf(b);
        if (la.type === "slot" && lb.type === "slot") {
            arrangement[la.index] = b;
            arrangement[lb.index] = a;
            return;
        }
        if (la.type === "slot" && lb.type === "tray") {
            arrangement[la.index] = b;
            tray = tray.map((item) => (item === b ? a : item));
            return;
        }
        if (la.type === "tray" && lb.type === "slot") {
            arrangement[lb.index] = a;
            tray = tray.map((item) => (item === a ? b : item));
        }
    }
    function commit(kind) {
        const previous = score;
        score = computeScore();
        const improved = score > previous + 0.0001;
        const worsened = score < previous - 0.0001;
        const perfect = isPerfectScore(score);
        const justSolved = perfect && !solved;
        if (perfect)
            solved = true;
        if (perfect)
            playSfx(currentLevel === 10 ? "master" : "win");
        else if (kind === "swap")
            playSfx("swap");
        else
            playSfx("drop");
        if (!perfect && improved)
            playSfx("up");
        if (!perfect && worsened)
            playSfx("down");
        paintSignal(perfect || improved ? "up" : worsened ? "down" : "same");
        selectedId = null;
        coachEl.hidden = true;
        renderPieces(true);
        renderHud();
        if (justSolved)
            beginVictory();
        else
            persist();
    }
    function beginVictory() {
        solved = true;
        highestCompleted = Math.max(highestCompleted, currentLevel);
        boardEl.classList.add("is-perfect");
        if (currentLevel === 10)
            boardEl.classList.add("is-masterpiece");
        burst(currentLevel === 10);
        persist();
        window.setTimeout(() => {
            if (!alive)
                return;
            showVictory();
        }, reduceMotion() ? 0 : 520);
    }
    function showVictory() {
        const data = level();
        const finale = currentLevel === 10;
        victoryEl.hidden = false;
        play.querySelector("[data-crown]").hidden = !finale;
        play.querySelector("[data-victory-kicker]").textContent = finale ? t("strategyMaster") : `${t("level")} ${currentLevel} ${lang === "da" ? "GENNEMFØRT!" : "COMPLETE!"}`;
        play.querySelector("[data-victory-title]").textContent = finale ? t("beatAll") : t("cracked");
        play.querySelector("[data-mix]").textContent = strategyLine(data);
        const next = play.querySelector("[data-next]");
        const replay = play.querySelector("[data-replay]");
        const portfolio = play.querySelector("[data-portfolio]");
        const back = play.querySelector("[data-title]");
        next.hidden = finale;
        replay.hidden = !finale;
        back.hidden = !finale;


const levelsEndButton =
  play.querySelector("[data-levels-end]");

levelsEndButton.hidden = !finale;

levelsEndButton.textContent =
  lang === "da"
    ? "SE MINE STRATEGIER"
    : "VIEW MY STRATEGIES";

        const showPortfolio = data.metaFlat.isWealthPlan && data.metaFlat.modelNo != null;
        portfolio.hidden = !showPortfolio;
   (finale ? levelsEndButton : next).focus();
        syncChrome();
    }
    function hideVictory() {
        victoryEl.hidden = true;
        boardEl.classList.remove("is-perfect");
    }
    function burst(master) {
        if (reduceMotion())
            return;
        const layer = document.createElement("div");
        layer.className = "burst";
        const count = master ? 16 : 9;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement("i");
            spark.className = i % 3 === 0 ? "spark round" : "spark";
            const angle = (Math.PI * 2 * i) / count;
            const dist = 70 + (i % 4) * 22;
            spark.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
            spark.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
            layer.appendChild(spark);
        }
        boardEl.appendChild(layer);
        window.setTimeout(() => layer.remove(), 800);
    }
    function showBanner() {
        if (currentLevel !== 10 || solved) {
            bannerEl.hidden = true;
            return;
        }
        bannerEl.hidden = false;
        bannerEl.classList.remove("show");
        void bannerEl.offsetWidth;
        bannerEl.classList.add("show");
        window.setTimeout(() => {
            if (alive)
                bannerEl.hidden = true;
        }, 1400);
    }
    function openPlay(bloom) {
        start.hidden = true;
        play.hidden = false;
        hideVictory();
        boardEl.classList.toggle("is-masterpiece", currentLevel === 10);
        boardEl.classList.toggle("is-perfect", solved);
        renderHud();
        paintSignal("none");
        layoutBoard(bloom && !solved);
        if (solved) {
            if (slotEls.length !== level().holdings.length)
                layoutBoard(false);
            renderPieces(false);
            showVictory();
        }
        else {
            showBanner();
        }
        syncChrome();
    }
    function showTitle() {
        play.hidden = true;
        start.hidden = false;
        scrim.hidden = true;
        renderStart();
    }

    function overTray(x, y) {
        const rect = trayEl.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    function clearTargets() {
        for (const slot of slotEls)
            slot.classList.remove("is-target");
        trayEl.classList.remove("is-target");
    }
    function liftPiece(event, el) {
        if (!drag)
            return;
        const instrument = catalog().get(drag.id);
        if (instrument)
            applyLabel(el, instrument, "float");
        const rect = el.getBoundingClientRect();
        const width = Math.min(200, Math.max(148, rect.width));
        const height = Math.min(96, Math.max(72, rect.height));
        drag.ox = ((event.clientX - rect.left) * width) / Math.max(rect.width, 1);
        drag.oy = ((event.clientY - rect.top) * height) / Math.max(rect.height, 1);
        el.classList.add("is-floating");
        el.style.position = "fixed";
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.zIndex = "40";
        el.style.left = `${event.clientX - drag.ox}px`;
        el.style.top = `${event.clientY - drag.oy}px`;
        document.body.appendChild(el);
        drag.lifted = true;
        playSfx("pick");
        const from = locOf(drag.id);
        if (from.type === "slot")
            slotEls[from.index]?.classList.add("is-empty");
    }

    function onPieceDown(event) {
        if (event.pointerType === "mouse" && event.button !== 0)
            return;
        if (!canStart())
            return;
        unlockAudio();
        const el = event.currentTarget;
        const id = el.dataset.id;
        if (!id)
            return;
        try {
            el.setPointerCapture(event.pointerId);
        }
        catch {
            /* synthetic events */
        }
        drag = {
            id,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            ox: 0,
            oy: 0,
            lifted: false,
        };
    }
    function onPieceMove(event) {
        if (!drag || event.pointerId !== drag.pointerId)
            return;
        const el = event.currentTarget;
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (!drag.lifted && distance > 8)
            liftPiece(event, el);
        if (!drag.lifted)
            return;
        event.preventDefault();
        el.style.left = `${event.clientX - drag.ox}px`;
        el.style.top = `${event.clientY - drag.oy}px`;
        clearTargets();
        const slot = hitSlot(event.clientX, event.clientY);
        if (slot != null)
            slotEls[slot]?.classList.add("is-target");
        else if (overTray(event.clientX, event.clientY))
            trayEl.classList.add("is-target");
    }
    function finishDrag(x, y) {
        if (!drag)
            return;
        const id = drag.id;
        const lifted = drag.lifted;
        drag = null;
        clearTargets();
        if (!lifted) {
            handleTap(id);
            return;
        }
        const slot = hitSlot(x, y);
        const from = locOf(id);
        if (slot != null) {
            const occupant = arrangement[slot];
            if (occupant === id) {
                renderPieces(true);
                playSfx("drop");
                return;
            }
            const swapping = occupant != null && from.type === "slot";
            moveToSlot(id, slot);
            commit(swapping ? "swap" : "drop");
            return;
        }
        if (overTray(x, y) && from.type === "slot") {
            moveToTray(id);
            commit("return");
            return;
        }
        renderPieces(true);
        playSfx("drop");
    }
    function onPieceUp(event) {
        if (!drag || event.pointerId !== drag.pointerId)
            return;
        finishDrag(event.clientX, event.clientY);
    }
    function onPieceCancel(event) {
        if (!drag || event.pointerId !== drag.pointerId)
            return;
        drag = null;
        clearTargets();
        renderPieces(true);
    }


function handleTap(id) {

    if (!canStart())
        return;

    unlockAudio();

    // Remember the instrument for metadata display
    lastInstrumentId = id;

    if (selectedId && selectedId !== id) {

        const a = locOf(selectedId);
        const b = locOf(id);

        if (a.type === "tray" && b.type === "tray") {

            selectedId = id;

            renderPieces(false);
            playSfx("pick");

            return;
        }

        const kind =
            a.type === "slot" && b.type === "slot"
                ? "swap"
                : "drop";

        swapIds(selectedId, id);

        selectedId = null;

        commit(kind);

        return;
    }

    selectedId =
        selectedId === id
            ? null
            : id;

    playSfx(selectedId ? "pick" : "drop");

    renderPieces(false);
}


function handleTapSlot(index) {

    if (!canStart() || !selectedId)
        return;

    const occupant = arrangement[index];

    if (occupant === selectedId) {

        lastInstrumentId = selectedId;
        selectedId = null;

        renderPieces(false);

        return;
    }

    const from = locOf(selectedId);

    const swapping =
        occupant != null &&
        from.type === "slot";

    // Preserve metadata before clearing selection
    lastInstrumentId = selectedId;

    moveToSlot(selectedId, index);

    selectedId = null;

    commit(swapping ? "swap" : "drop");
}

    function onPieceKey(event) {
        if (event.key !== "Enter" && event.key !== " ")
            return;
        event.preventDefault();
        const el = event.currentTarget;
        if (!el.dataset.id)
            return;
        handleTap(el.dataset.id);
    }
    function onSlotKey(event) {
        if (event.key !== "Enter" && event.key !== " ")
            return;
        event.preventDefault();
        const slot = event.currentTarget;
        handleTapSlot(Number(slot.dataset.index));
    }
    function applySolution() {
        const data = level();
        const target = targetWeights(data.holdings);
        const slots = slotPercents();
        const remaining = data.holdings.map((holding) => holding.instrumentId);
        arrangement = slots.map((weight) => {
            const index = remaining.findIndex((id) => target.get(id) === weight);
            if (index < 0)
                return null;
            const id = remaining[index];
            remaining.splice(index, 1);
            return id;
        });
        const used = new Set(arrangement.filter((id) => id != null));
        tray = piecesOf(data)
            .map((piece) => piece.instrumentId)
            .filter((id) => !used.has(id));
        score = computeScore();
        solved = isPerfectScore(score);
    }
    function jumpTo(levelNumber) {
        if (levelNumber < 1 || levelNumber > maxOpenLevel())
            return;
        if (levelNumber === currentLevel || (isMaster() && levelNumber === 10)) {
            currentLevel = levelNumber;
            enterFromTitle();
            return;
        }
        unlockAudio();
        currentLevel = levelNumber;
        solved = false;
        selectedId = null;
        freshArrangement(levelNumber);
        score = 0;
        clearPieces();
        slotEls = [];
        boardEl.classList.remove("is-perfect", "is-masterpiece");
        hideVictory();
        persist();
        openPlay(true);
    }
    function enterFromTitle() {
        unlockAudio();
        if (isMaster() && currentLevel === 10) {
            currentLevel = 10;
            if (!placementFits(10, { version: 1, currentLevel: 10, highestCompleted, soundEnabled, arrangement, tray }) || !isPerfectScore(computeScore())) {
                freshArrangement(10);
                applySolution();
            }
            else {
                score = computeScore();
                solved = true;
            }
            highestCompleted = 10;
            solved = true;
            score = computeScore();
            persist();
            openPlay(false);
            return;
        }
        if (arrangement.length !== level().holdings.length)
            freshArrangement(currentLevel);
        score = computeScore();
        solved = isPerfectScore(score);
        openPlay(true);
    }
    function goNext() {
        if (currentLevel >= 10)
            return;
        highestCompleted = Math.max(highestCompleted, currentLevel);
        currentLevel += 1;
        solved = false;
        selectedId = null;
        freshArrangement(currentLevel);
        score = 0;
        solved = false;
        hideVictory();
        boardEl.classList.remove("is-perfect", "is-masterpiece");
        clearPieces();
        slotEls = [];
        persist();
        openPlay(true);
    }
    function replay() {
        clearSave();
        currentLevel = 1;
        highestCompleted = 0;
        solved = false;
        selectedId = null;
        freshArrangement(1);
        score = 0;
        clearPieces();
        slotEls = [];
        boardEl.classList.remove("is-perfect", "is-masterpiece");
        hideVictory();
        persist();
        openPlay(true);
    }
    function resetAll() {
        clearSave();
        currentLevel = 1;
        highestCompleted = 0;
        solved = false;
        selectedId = null;
        soundEnabled = true;
        setSoundEnabled(true);
        freshArrangement(1);
        score = 0;
        clearPieces();
        slotEls = [];
        scrim.hidden = true;
        showTitle();
    }
    function showToast(message) {
        toast.hidden = false;
        toast.textContent = message;
        window.setTimeout(() => {
            if (alive)
                toast.hidden = true;
        }, 2200);
    }
    shell.addEventListener("pointerdown", () => unlockAudio());


  

shell.addEventListener("click", (event) => {

  const target = event.target;

  if (target.closest("[data-play]")) {
    enterFromTitle();
    return;
  }

  const jump = target.closest("[data-jump]");

  if (jump) {
    jumpTo(Number(jump.dataset.jump));
    return;
  }

  if (target.closest("[data-home]")) {
    showTitle();
    return;
  }

  if (target.closest("[data-sound]")) {
    unlockAudio();
    soundEnabled = !soundEnabled;
    setSoundEnabled(soundEnabled);

    if (soundEnabled) {
      playSfx("pick");
    }

    persist();
    syncChrome();
    return;
  }

  if (target.closest("[data-reset]")) {
    scrim.hidden = false;
    scrim.querySelector("[data-cancel]")?.focus();
    return;
  }

  if (target.closest("[data-cancel]")) {
    scrim.hidden = true;
    return;
  }

  if (target.closest("[data-confirm]")) {
    resetAll();
    return;
  }

  if (target.closest("[data-next]")) {
    goNext();
    return;
  }

  if (target.closest("[data-replay]")) {
    replay();
    return;
  }

  /* =========================================
     LEVEL 10 → FINAL PORTFOLIO GALLERY
  ========================================= */

  if (target.closest("[data-levels-end]")) {

    if (!isMaster()) return;

    renderPageLevelsEnd();

    return;
  }

  if (target.closest("[data-title]")) {
    showTitle();
    return;
  }

  /* =========================================
     EXISTING GAME → MYWEALTH BRIDGE
  ========================================= */

  if (target.closest("[data-portfolio]")) {

    const current = level();
    const modelNo = Number(current.metaFlat.modelNo);

    if (
      !current.metaFlat.sendToMyWealth ||
      !Number.isInteger(modelNo) ||
      modelNo <= 0
    ) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("neptoon:strategy-to-mywealth", {
        detail: {
          level: current.level,
          modelNo
        }
      })
    );

    return;
  }

});




    const onKey = (event) => {
        if (event.key === "Escape" && !scrim.hidden)
            scrim.hidden = true;
    };
    window.addEventListener("keydown", onKey);
    const onHide = () => {
        if (document.visibilityState === "hidden")
            persist();
        else
            resumeAudio();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", persist);
    const resize = () => {
if (play.hidden)
            return;
        layoutBoard(false);
    };
    const observer = new ResizeObserver(() => resize());
    observer.observe(boardEl);
  
  window.__neptoon = {
        score: () => score,
        level: () => currentLevel,
        signal: () => signalName(score),
        solved: () => solved,
        arrangement: () => arrangement.slice(),
        tray: () => tray.slice(),
        highest: () => highestCompleted,
        language: () => lang,
        drop: (instrumentId, target) => {
            if (play.hidden)
                enterFromTitle();
            busy = false;
            solved = false;
            victoryEl.hidden = true;
            boardEl.classList.remove("is-perfect");
            if (target === "tray") {
                if (locOf(instrumentId).type === "slot")
                    moveToTray(instrumentId);
            }
            else {
                moveToSlot(instrumentId, target);
            }
            selectedId = null;
            commit(target === "tray" ? "return" : "drop");
        },
    };
    renderStaticText();
    renderStart();
    paintSignal("none");
    function setLanguage(nextLang) {
        const normalized = String(nextLang).toLowerCase().startsWith("da") ? "da" : "en";
        if (normalized === lang) return;
        lang = normalized;
        renderStaticText();
        renderStart();
        renderHud();
        paintSignal("none");
        renderPieces(false);
        if (!victoryEl.hidden) showVictory();
    }
    return {
        setLanguage,
        getLanguage: () => lang,
        destroy() {
            alive = false;
            observer.disconnect();
            window.removeEventListener("keydown", onKey);
            document.removeEventListener("visibilitychange", onHide);
            window.removeEventListener("pagehide", persist);
            if (window.__neptoon)
                delete window.__neptoon;
            root.replaceChildren();
        },
    };
}
function clampLevel(value) {
    if (!Number.isFinite(value))
        return 1;
    return Math.min(10, Math.max(1, Math.round(value)));
}
function clampCompleted(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.min(10, Math.max(0, Math.round(value)));
}


/* =========================================
   NEPTOON — GAME STARTUP
========================================= */

const standaloneRoot =
  document.getElementById("game");

if(standaloneRoot){

  try {

    await initializeGameData();

    mountGame(standaloneRoot);

  } catch(error) {

    console.error(
      "NEPTOON GAME INITIALIZATION FAILED",
      error
    );

    standaloneRoot.textContent =
      "Unable to load the game. Please refresh the page.";

  }

}



















