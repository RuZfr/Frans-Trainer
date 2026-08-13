const q=document.querySelector("#question");
const a=document.querySelector("#answer");
const answerInfo=document.querySelector("#answerInfo");
const card=document.querySelector("#card");
const easyBtn=document.querySelector("#easyBtn");
const hardBtn=document.querySelector("#hardBtn");
const wordListSelect=document.querySelector("#wordListSelect");
const categorySelect=document.querySelector("#categorySelect");
const exerciseMode=document.querySelector("#exerciseMode");
const direction=document.querySelector("#direction");
const themeBtn=document.querySelector("#themeBtn");
const themeIcon=document.querySelector("#themeIcon");
const hardOnlyBtn=document.querySelector("#hardOnlyBtn");
const status=document.querySelector("#status");
const progressCount=document.querySelector("#progressCount");
const progressBar=document.querySelector("#progressBar");
const typingForm=document.querySelector("#typingForm");
const typingInput=document.querySelector("#typingInput");
const feedback=document.querySelector("#feedback");
const ratingActions=document.querySelector("#ratingActions");
const importListBtn=document.querySelector("#importListBtn");
const removeListBtn=document.querySelector("#removeListBtn");
const listFileInput=document.querySelector("#listFileInput");
const listImportStatus=document.querySelector("#listImportStatus");
const listStats=document.querySelector("#listStats");
const splash=document.querySelector("#splash");
const splashStarted=performance.now();

let state=loadState();
let current=null;
let previousId=null;
let currentDirection="fr-nl";
let shown=false;
let retryUsed=false;
const id=w=>`${w._listId||CURRENT_LIST_ID}::${w.fr}`;
const legacyId=w=>w.fr;

function normalize(value){return String(value).toLowerCase().replace(/[’]/g,"'").replace(/\s+/g," ").trim();}
function normalizeAnswer(value){
  return normalize(value)
    .replace(/[\s.,!?;:…]+$/u,"")
    .trim();
}
function stripAccents(value){return normalizeAnswer(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function dutchParts(value){
  const v=normalizeAnswer(value);const m=v.match(/^(de|het)\s+(.+)$/);
  return m?{article:m[1],bare:m[2]}:{article:"",bare:v};
}
function frenchParts(value){
  const v=normalizeAnswer(value);let m=v.match(/^(le|la|les)\s+(.+)$/);
  if(m)return {article:m[1],bare:m[2]};
  m=v.match(/^l['’]?\s*(.+)$/);
  if(m&&/^l['’]/.test(v))return {article:"l'",bare:m[1]};
  return {article:"",bare:v};
}
function sameWithoutArticle(given,candidate,directionMode){
  const g=directionMode==="fr-nl"?dutchParts(given):frenchParts(given);
  const c=directionMode==="fr-nl"?dutchParts(candidate):frenchParts(candidate);
  return g.bare===c.bare;
}
function activeWords(){
  const category=state.category||"all";
  return category==="all"?WORDS:WORDS.filter(word=>(word.category||"Overig")===category);
}
function pool(){
  const source=activeWords();
  if(!state.hardOnly)return source;
  const difficult=new Set(state.difficult);
  return source.filter(w=>difficult.has(id(w))||difficult.has(legacyId(w)));
}
function weight(word){
  const score=state.scores[id(word)]??state.scores[legacyId(word)]??0;
  return Math.max(1,5-score);
}
function chooseWord(){
  const source=pool();
  if(!source.length)throw new Error(state.hardOnly?"Nog geen moeilijke woorden in deze selectie.":"Deze categorie bevat geen woorden.");
  if(source.length===1)return source[0];
  const candidates=source.filter(w=>id(w)!==previousId);
  const usable=candidates.length?candidates:source;
  const total=usable.reduce((sum,w)=>sum+weight(w),0);
  let target=Math.random()*total;
  for(const word of usable){target-=weight(word);if(target<=0)return word;}
  return usable[usable.length-1];
}
function chooseDirection(){return state.direction==="random"?(Math.random()<.5?"fr-nl":"nl-fr"):state.direction;}
function difficultCountInActiveSet(){
  const difficult=new Set(state.difficult);
  return activeWords().filter(w=>difficult.has(id(w))||difficult.has(legacyId(w))).length;
}
function uniqueAnswerStrings(values){
  const seen=new Set();
  return values.filter(value=>{
    const key=normalizeAnswer(value);
    if(!key||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function alternativesForDisplay(){
  const raw=currentDirection==="fr-nl"?(current.alts||[]):(current.frAlts||[]);
  const main=currentDirection==="fr-nl"?current.nl:current.fr;
  const unique=uniqueAnswerStrings(raw).filter(value=>normalizeAnswer(value)!==normalizeAnswer(main));
  if(current.type!=="noun")return unique;

  const parts=currentDirection==="fr-nl"?dutchParts:frenchParts;
  const all=[main,...unique];
  const fullBares=new Set(all.map(value=>parts(value)).filter(item=>item.article).map(item=>item.bare));

  return unique.filter(value=>{
    const parsed=parts(value);
    // Een kale zelfstandignaamwoordvariant hoeft niet als leertaal getoond
    // te worden wanneer dezelfde vertaling al mét lidwoord aanwezig is.
    return parsed.article||!fullBares.has(parsed.bare);
  });
}
function render(){
  if(!current)return;
  const frToNl=currentDirection==="fr-nl";
  const typing=state.exerciseMode==="typing";
  q.textContent=frToNl?current.fr:current.nl;
  a.textContent=frToNl?current.nl:current.fr;

  const alternatives=alternativesForDisplay();
  const info=[];
  if(alternatives.length)info.push(`Ook correct: ${alternatives.join(", ")}`);
  if(shown&&current.note)info.push(current.note);
  answerInfo.textContent=info.join(" · ");
  a.hidden=!shown;
  answerInfo.hidden=!shown||!answerInfo.textContent;
  card.setAttribute("aria-label",typing?"Oefenwoord":(shown?"Antwoord getoond":"Toon antwoord"));
  typingForm.hidden=!typing;
  ratingActions.hidden=typing;
  wordListSelect.value=state.wordListId||"basis";
  categorySelect.value=state.category||"all";
  exerciseMode.value=state.exerciseMode;
  easyBtn.disabled=!shown;hardBtn.disabled=!shown;
  direction.value=state.direction;
  document.documentElement.classList.toggle("dark",state.dark);
  if(themeBtn){
    themeBtn.dataset.mode=state.dark?"dark":"light";
    themeBtn.setAttribute("aria-label",state.dark?"Lichte modus":"Donkere modus");
    themeBtn.setAttribute("title",state.dark?"Lichte modus":"Donkere modus");
  }
  if(themeIcon)themeIcon.src=state.dark?"icons/icon-sun.svg":"icons/icon-moon.svg";
  const difficultCount=difficultCountInActiveSet();
  hardOnlyBtn.classList.toggle("active",state.hardOnly);
  hardOnlyBtn.disabled=!state.hardOnly&&difficultCount===0;
  hardOnlyBtn.textContent=state.hardOnly?"Alle woorden":(difficultCount===0?"Nog geen moeilijke woorden":"Alleen moeilijke woorden");
  status.textContent=frToNl?"Frans → Nederlands":"Nederlands → Frans";
  progressCount.textContent=`${activeWords().length} woorden · ${difficultCount} moeilijk`;
  const percent=state.sessionSeen?Math.round((state.sessionKnown/state.sessionSeen)*100):0;
  progressBar.style.width=`${percent}%`;
  progressBar.parentElement.setAttribute("aria-label",`Voortgang ${percent}%`);
  updateListManager();
}
function next(){
  card.classList.add("change");
  setTimeout(()=>{
    current=chooseWord();previousId=id(current);currentDirection=chooseDirection();shown=false;retryUsed=false;
    typingInput.value="";feedback.textContent="";feedback.className="feedback";
    render();card.classList.remove("change");
    if(state.exerciseMode==="typing")setTimeout(()=>typingInput.focus(),0);
  },120);
}
function show(){if(!shown){shown=true;render();}}
function updateScore(delta){
  const key=id(current);state.scores[key]=Math.max(-3,Math.min(4,(state.scores[key]||0)+delta));state.sessionSeen+=1;
}
function markCorrect(message){
  shown=true;feedback.textContent=message;feedback.className="feedback correct";
  updateScore(1);state.sessionKnown+=1;
  removeCurrentFromDifficult();
  saveState(state);render();
}
function markWrong(){
  const expected=currentDirection==="fr-nl"?current.nl:current.fr;
  shown=true;feedback.textContent=`Nog niet juist. Correct: ${expected}.`;feedback.className="feedback incorrect";
  updateScore(-1);
  if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));
  saveState(state);render();
}

function addCurrentToDifficult(){
  if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));
}
function removeCurrentFromDifficult(){
  state.difficult=state.difficult.filter(x=>x!==id(current)&&x!==legacyId(current));
  if(state.hardOnly&&difficultCountInActiveSet()===0)state.hardOnly=false;
}
function scheduleTypingNext(delay=850){
  window.setTimeout(()=>{if(state.exerciseMode==="typing"&&shown)next();},delay);
}
function feedbackReadingDelay(message,minimum=750){
  const extra=answerInfo?.textContent||"";
  const length=`${message||""} ${extra}`.trim().length;
  return Math.min(3200,Math.max(minimum,550+(length*22)));
}
function markTypingCorrect(message,hadRetry=false){
  shown=true;
  feedback.textContent=message;
  feedback.className="feedback correct";

  if(hadRetry){
    // Een fout/bijna-fout op de eerste poging telt als moeilijk,
    // ook wanneer de leerling het bij de herkansing goed verbetert.
    updateScore(-1);
    addCurrentToDifficult();
  }else{
    updateScore(1);
    state.sessionKnown+=1;
    removeCurrentFromDifficult();
  }

  saveState(state);
  render();
  scheduleTypingNext(feedbackReadingDelay(message,hadRetry?1250:750));
}
function markTypingWrong(){
  const expected=currentDirection==="fr-nl"?current.nl:current.fr;
  shown=true;
  feedback.textContent=`Nog niet juist. Correct: ${expected}.`;
  feedback.className="feedback incorrect";
  updateScore(-1);
  addCurrentToDifficult();
  saveState(state);
  render();
  scheduleTypingNext(feedbackReadingDelay(feedback.textContent,1800));
}
function levenshtein(a,b){
  a=normalize(a);b=normalize(b);
  const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)dp[i][0]=i;for(let j=0;j<=b.length;j++)dp[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(
    dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
  );
  return dp[a.length][b.length];
}
function smallTypo(source,target){
  source=normalizeAnswer(source);target=normalizeAnswer(target);
  const longest=Math.max(source.length,target.length);
  if(longest<4)return false; // voorkomt dat één letter bij korte basiswoorden als 'bijna juist' geldt
  if(Math.abs(source.length-target.length)>1)return false;
  return levenshtein(source,target)===1;
}
function evaluate(given,word,directionMode){
  const expected=directionMode==="fr-nl"?word.nl:word.fr;
  const alternatives=directionMode==="fr-nl"?(word.alts||[]):(word.frAlts||[]);
  const accepted=[expected,...alternatives];

  const exactMatch=accepted.find(value=>normalizeAnswer(given)===normalizeAnswer(value));
  if(exactMatch){
    const alternative=normalizeAnswer(exactMatch)!==normalizeAnswer(expected);
    return {kind:"correct",message:alternative?`Juist! Dat is ook correct. Hoofdvertaling: ${expected}.`:"Juist!"};
  }

  if(word.type==="noun"){
    const parts=directionMode==="fr-nl"?dutchParts:frenchParts;
    const g=parts(given);
    for(const candidate of accepted){
      const c=parts(candidate);
      if(g.bare!==c.bare)continue;
      const full=accepted.find(value=>{const p=parts(value);return p.bare===c.bare&&p.article;})||candidate;
      if(!g.article&&c.article){
        return {kind:"correct",message:`Juist! Volledige vorm: ${full}. Onthoud het lidwoord mee.`};
      }
      if(g.article&&c.article&&g.article!==c.article){
        return {kind:"almost",reason:"article",hint:directionMode==="fr-nl"
          ?"Bijna juist. Controleer het Nederlandse lidwoord en probeer nog één keer."
          :"Bijna juist. Controleer het Franse lidwoord en probeer nog één keer."};
      }
    }
  }

  if(directionMode==="nl-fr"){
    const accentMatch=accepted.find(value=>stripAccents(given)===stripAccents(value));
    if(accentMatch&&normalizeAnswer(given)!==normalizeAnswer(accentMatch)){
      return {kind:"almost",reason:"accent",hint:"Bijna juist. Controleer de Franse accenten/spelling en probeer nog één keer."};
    }
    if(word.type==="noun"){
      const g=frenchParts(given);
      for(const candidate of accepted){
        const c=frenchParts(candidate);
        if(stripAccents(g.bare)===stripAccents(c.bare)&&g.bare!==c.bare){
          return {kind:"almost",reason:"accent",hint:"Bijna juist. Controleer de Franse accenten/spelling en probeer nog één keer."};
        }
      }
    }
  }

  const typoPairs=accepted.map(candidate=>{
    if(word.type!=="noun")return [given,candidate];
    const parts=directionMode==="fr-nl"?dutchParts:frenchParts;
    return [parts(given).bare,parts(candidate).bare];
  });
  if(typoPairs.some(([source,target])=>smallTypo(source,target))){
    return {kind:"almost",reason:"typo",hint:"Bijna juist. Er zit één kleine tikfout in. Kijk nog eens goed en probeer opnieuw."};
  }

  return {kind:"wrong"};
}

card.onclick=()=>{if(state.exerciseMode==="cards")show();};
easyBtn.onclick=()=>{updateScore(1);state.sessionKnown+=1;removeCurrentFromDifficult();saveState(state);next();};
hardBtn.onclick=()=>{updateScore(-1);if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));saveState(state);next();};
exerciseMode.onchange=()=>{state.exerciseMode=exerciseMode.value;saveState(state);next();};
direction.onchange=()=>{state.direction=direction.value;saveState(state);next();};
themeBtn.onclick=()=>{state.dark=!state.dark;saveState(state);render();};
hardOnlyBtn.onclick=()=>{
  if(!state.hardOnly&&difficultCountInActiveSet()===0){
    render();
    return;
  }
  state.hardOnly=!state.hardOnly;
  saveState(state);
  next();
};

wordListSelect.onchange=async()=>{
  state.wordListId=wordListSelect.value;state.category="all";state.hardOnly=false;saveState(state);
  await loadSelectedList();
};
categorySelect.onchange=()=>{
  state.category=categorySelect.value;state.hardOnly=false;saveState(state);next();
};

typingForm.onsubmit=e=>{
  e.preventDefault();if(shown)return;
  const given=typingInput.value.trim();if(!given)return;
  const result=evaluate(given,current,currentDirection);

  if(result.kind==="correct"){
    const hadRetry=retryUsed;
    let message=result.message||"Juist!";
    if(hadRetry)message=message.replace(/^Juist!/,"Goed verbeterd!");
    markTypingCorrect(message,hadRetry);
    return;
  }

  if(result.kind==="almost"&&!retryUsed){
    retryUsed=true;
    feedback.textContent=result.hint;
    feedback.className="feedback almost";
    typingInput.focus();
    typingInput.select();
    return;
  }

  markTypingWrong();
};

document.addEventListener("keydown",e=>{
  if(state.exerciseMode==="cards"&&(e.key===" "||e.key==="Enter")&&!shown){e.preventDefault();show();}
  else if(state.exerciseMode==="cards"&&e.key==="ArrowLeft"&&shown)hardBtn.click();
  else if(state.exerciseMode==="cards"&&e.key==="ArrowRight"&&shown)easyBtn.click();
});

function populateCategorySelect(){
  const options=getCategoryOptions();categorySelect.innerHTML="";
  const all=document.createElement("option");all.value="all";all.textContent=`Alle categorieën (${WORDS.length})`;categorySelect.appendChild(all);
  for(const item of options){const option=document.createElement("option");option.value=item.id;option.textContent=`${item.name} (${item.count})`;categorySelect.appendChild(option);}
  const wanted=state.category||"all";const valid=wanted==="all"||options.some(item=>item.id===wanted);
  state.category=valid?wanted:"all";categorySelect.value=state.category;saveState(state);
}
async function populateWordListSelect(preferredId=null){
  await loadWordListRegistry();wordListSelect.innerHTML="";
  const all=document.createElement("option");all.value="all";all.textContent="Alle woordenlijsten";wordListSelect.appendChild(all);
  for(const list of getWordListOptions()){
    const option=document.createElement("option");option.value=list.id;option.textContent=list.source==="local"?`${list.name} (eigen)`:list.name;wordListSelect.appendChild(option);
  }
  const wanted=preferredId||state.wordListId||"basis";const valid=wanted==="all"||WORD_LISTS.some(list=>list.id===wanted);
  state.wordListId=valid?wanted:"basis";wordListSelect.value=state.wordListId;saveState(state);
}
async function loadSelectedList(){
  q.textContent="Laden…";a.hidden=true;answerInfo.hidden=true;
  try{
    await loadWordList(state.wordListId||"basis");populateCategorySelect();
    current=chooseWord();previousId=id(current);currentDirection=chooseDirection();shown=false;retryUsed=false;feedback.textContent="";render();
    if(state.exerciseMode==="typing")typingInput.focus();
  }catch(error){console.error(error);q.textContent="Woordenlijst kon niet worden geladen";feedback.textContent=error.message;feedback.className="feedback incorrect";}
}

function setListImportStatus(message,type=""){
  if(!listImportStatus)return;listImportStatus.textContent=message;listImportStatus.className=`settings-status ${type}`.trim();
}
function updateListManager(){
  if(!listStats)return;
  const selected=WORD_LISTS.find(list=>list.id===state.wordListId);
  const categories=getCategoryOptions();
  listStats.textContent=`${WORDS.length} woorden · ${categories.length} ${categories.length===1?"categorie":"categorieën"}${selected?.source==="local"?" · eigen lijst":""}`;
  if(removeListBtn)removeListBtn.hidden=!selected||selected.source!=="local";
}
if(importListBtn&&listFileInput){
  importListBtn.onclick=()=>listFileInput.click();
  listFileInput.onchange=async()=>{
    const file=listFileInput.files?.[0];if(!file)return;
    importListBtn.disabled=true;setListImportStatus("Woordenlijst controleren…");
    try{
      const result=await importWordListFile(file);state.wordListId=result.list.id;state.category="all";state.hardOnly=false;saveState(state);
      await populateWordListSelect(result.list.id);await loadSelectedList();
      const warning=result.warnings.length?` ${result.warnings.join(" ")}`:"";
      setListImportStatus(`${result.list.name}: ${result.list.words.length} woorden toegevoegd.${warning}`,result.warnings.length?"warning":"success");
    }catch(error){console.error(error);setListImportStatus(error.message||"Importeren mislukt.","error");}
    finally{importListBtn.disabled=false;listFileInput.value="";}
  };
}
if(removeListBtn){
  removeListBtn.onclick=async()=>{
    const selected=WORD_LISTS.find(list=>list.id===state.wordListId);if(!selected||selected.source!=="local")return;
    if(!removeImportedList(selected.id))return;
    state.wordListId="basis";state.category="all";state.hardOnly=false;saveState(state);
    await populateWordListSelect("basis");await loadSelectedList();setListImportStatus(`"${selected.name}" is verwijderd.`,"success");
  };
}

function setupSettingsPanel(){
  const settingsBtn=document.querySelector("#settingsBtn");
  const settingsPanel=document.querySelector("#settingsPanel");
  const settingsBackdrop=document.querySelector("#settingsBackdrop");
  const settingsCloseBtn=document.querySelector("#settingsCloseBtn");
  if(!settingsBtn||!settingsPanel||!settingsBackdrop||!settingsCloseBtn)return;
  const open=()=>{settingsBackdrop.hidden=false;settingsPanel.classList.add("open");settingsPanel.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";updateListManager();settingsCloseBtn.focus();};
  const close=()=>{settingsPanel.classList.remove("open");settingsPanel.setAttribute("aria-hidden","true");settingsBackdrop.hidden=true;document.body.style.overflow="";};
  settingsBtn.addEventListener("click",open);settingsCloseBtn.addEventListener("click",close);settingsBackdrop.addEventListener("click",close);
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&settingsPanel.classList.contains("open")){close();settingsBtn.focus();}});
}

function hideSplash(){
  if(!splash||splash.dataset.hidden==="true")return;
  const elapsed=performance.now()-splashStarted;
  const wait=Math.max(0,650-elapsed);
  window.setTimeout(()=>{
    splash.classList.add("splash-screen--hide");
    window.setTimeout(()=>{
      splash.hidden=true;
      splash.dataset.hidden="true";
      document.body.classList.add("app-ready");
    },380);
  },wait);
}

async function prepareDevelopmentEnvironment(){
  const isLocal=location.hostname==="127.0.0.1"||location.hostname==="localhost";if(!isLocal)return;
  try{
    if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}
    if("caches" in window){const names=await caches.keys();await Promise.all(names.map(name=>caches.delete(name)));}
  }catch(error){console.warn("Lokale cache-opruiming niet volledig gelukt:",error);}
}
async function init(){
  try{
    await prepareDevelopmentEnvironment();
    await populateWordListSelect();
    await loadSelectedList();
    setupSettingsPanel();
  }catch(error){
    console.error("Frans Trainer startfout:",error);
    q.textContent="Starten mislukt";
    feedback.textContent=error?.message||"Onbekende startfout.";
    feedback.className="feedback incorrect";
    typingForm.hidden=false;
  }finally{
    hideSplash();
  }
}
const isLocalDevelopment=location.hostname==="127.0.0.1"||location.hostname==="localhost";
if("serviceWorker" in navigator&&!isLocalDevelopment){
  window.addEventListener("load",async()=>{try{const registration=await navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`);registration.update();}catch(error){console.warn("Service worker kon niet worden geregistreerd:",error);}});
}
init();
