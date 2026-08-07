const q=document.querySelector("#question");
const a=document.querySelector("#answer");
const answerInfo=document.querySelector("#answerInfo");
const card=document.querySelector("#card");
const easyBtn=document.querySelector("#easyBtn");
const hardBtn=document.querySelector("#hardBtn");
const wordListSelect=document.querySelector("#wordListSelect");
const exerciseMode=document.querySelector("#exerciseMode");
const direction=document.querySelector("#direction");
const themeBtn=document.querySelector("#themeBtn");
const hardOnlyBtn=document.querySelector("#hardOnlyBtn");
const status=document.querySelector("#status");
const progressCount=document.querySelector("#progressCount");
const progressBar=document.querySelector("#progressBar");
const typingForm=document.querySelector("#typingForm");
const typingInput=document.querySelector("#typingInput");
const feedback=document.querySelector("#feedback");
const ratingActions=document.querySelector("#ratingActions");

let state=loadState();
let current=null;
let previousId=null;
let currentDirection="fr-nl";
let shown=false;
let retryUsed=false;
const id=w=>`${w._listId||CURRENT_LIST_ID}::${w.fr}`;
const legacyId=w=>w.fr;

function pool(){
  if(!state.hardOnly)return WORDS;
  const difficult=new Set(state.difficult);
  const filtered=WORDS.filter(w=>difficult.has(id(w))||difficult.has(legacyId(w)));
  return filtered.length?filtered:WORDS;
}
function weight(word){
  const score=state.scores[id(word)]??state.scores[legacyId(word)]??0;
  return Math.max(1,5-score);
}
function chooseWord(){
  const source=pool();
  if(!source.length)throw new Error("De gekozen woordenlijst bevat geen woorden.");
  if(source.length===1)return source[0];

  const candidates=source.filter(w=>id(w)!==previousId);
  const usable=candidates.length?candidates:source;
  const total=usable.reduce((sum,w)=>sum+weight(w),0);
  let target=Math.random()*total;

  for(const word of usable){
    target-=weight(word);
    if(target<=0)return word;
  }
  return usable[usable.length-1];
}
function chooseDirection(){
  return state.direction==="random"?(Math.random()<.5?"fr-nl":"nl-fr"):state.direction;
}
function next(){
  card.classList.add("change");
  setTimeout(()=>{
    current=chooseWord();
    previousId=id(current);
    currentDirection=chooseDirection();
    shown=false;
    retryUsed=false;
    typingInput.value="";
    render();
    card.classList.remove("change");
    if(state.exerciseMode==="typing")setTimeout(()=>typingInput.focus(),0);
  },120);
}
function alternativesForDisplay(){
  return (current.alts||[]).filter(x=>stripDutchArticle(normalizeLoose(x))!==stripDutchArticle(normalizeLoose(current.nl)));
}
function render(){
  const frToNl=currentDirection==="fr-nl";
  const typing=state.exerciseMode==="typing";
  q.textContent=frToNl?current.fr:current.nl;
  a.textContent=frToNl?current.nl:current.fr;
  const alternatives=frToNl?alternativesForDisplay():[];
  const info=[];
  if(alternatives.length)info.push(`Ook goed: ${alternatives.join(", ")}`);
  if(shown&&current.note)info.push(current.note);
  answerInfo.textContent=info.join(" · ");
  a.hidden=!shown;
  answerInfo.hidden=!shown||!answerInfo.textContent;
  card.setAttribute("aria-label",typing?"Oefenwoord":(shown?"Antwoord getoond":"Toon antwoord"));
  typingForm.hidden=!typing;
  ratingActions.hidden=typing&&!shown;
  wordListSelect.value=state.wordListId||"basis";
  exerciseMode.value=state.exerciseMode;
  if(typing&&!shown&&!retryUsed){feedback.textContent="";feedback.className="feedback";}
  easyBtn.disabled=!shown;
  hardBtn.disabled=!shown;
  direction.value=state.direction;
  document.documentElement.classList.toggle("dark",state.dark);
  themeBtn.textContent=state.dark?"☀️":"🌙";
  hardOnlyBtn.classList.toggle("active",state.hardOnly);
  hardOnlyBtn.textContent=state.hardOnly?"Alle woorden":"Alleen moeilijke woorden";
  status.textContent=frToNl?"Frans → Nederlands":"Nederlands → Frans";
  progressCount.textContent=`${state.difficult.length} moeilijk`;
  const percent=state.sessionSeen?Math.round((state.sessionKnown/state.sessionSeen)*100):0;
  progressBar.style.width=`${percent}%`;
  progressBar.parentElement.setAttribute("aria-label",`Voortgang ${percent}%`);
}
function show(){if(!shown){shown=true;render();}}
function updateScore(delta){
  const key=id(current);
  state.scores[key]=Math.max(-3,Math.min(4,(state.scores[key]||0)+delta));
  state.sessionSeen+=1;
}
function markCorrect(message){
  shown=true;
  feedback.textContent=message;
  feedback.className="feedback correct";
  updateScore(1);
  state.sessionKnown+=1;
  state.difficult=state.difficult.filter(x=>x!==id(current)&&x!==legacyId(current));
  saveState(state);render();
}
function markWrong(message){
  shown=true;
  feedback.textContent=message;
  feedback.className="feedback incorrect";
  updateScore(-1);
  if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));
  saveState(state);render();
}
function expectedAnswers(){
  if(currentDirection==="nl-fr")return [current.fr];
  return [current.nl,...(current.alts||[])];
}
function evaluate(given,word,directionMode){
  const exact=v=>v.toLowerCase().replace(/\s+/g," ").trim();
  const stripAccents=v=>exact(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const stripNlArticle=v=>exact(v).replace(/^(de|het)\s+/,"");
  const stripFrArticle=v=>exact(v).replace(/^(le|la|les|l['’])\s*/,"");

  const expected=directionMode==="fr-nl"?word.nl:word.fr;
  const alternatives=Array.isArray(word.alts)?word.alts:[];
  const accepted=[expected,...alternatives];

  // Exact correct answer or accepted alternative
  if(accepted.some(v=>exact(given)===exact(v))){
    const isAlternative=exact(given)!==exact(expected);
    return {
      kind:"correct",
      note:isAlternative?`Juist! Hoofdvertaling: ${expected}`:"Juist!"
    };
  }

  // Dutch answer: de/het may be omitted or added and is still fully correct
  if(directionMode==="fr-nl"){
    if(accepted.some(v=>stripNlArticle(given)===stripNlArticle(v))){
      return {kind:"correct",note:`Juist! Hoofdvertaling: ${expected}`};
    }
  }

  // French answer: missing article is a small real error
  if(directionMode==="nl-fr"){
    if(stripFrArticle(given)===stripFrArticle(expected) && exact(given)!==exact(expected)){
      return {kind:"almost",hint:`Bijna juist. Let op het lidwoord: ${expected}`};
    }

    // Missing/wrong accent only
    if(stripAccents(given)===stripAccents(expected) && exact(given)!==exact(expected)){
      return {kind:"almost",hint:`Bijna juist. Let op de spelling/accenten: ${expected}`};
    }
  }

  // One small typo only (same length-ish; Levenshtein distance 1)
  const lev=(a,b)=>{
    a=exact(a);b=exact(b);
    const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
    for(let i=0;i<=a.length;i++)dp[i][0]=i;
    for(let j=0;j<=b.length;j++)dp[0][j]=j;
    for(let i=1;i<=a.length;i++){
      for(let j=1;j<=b.length;j++){
        dp[i][j]=Math.min(
          dp[i-1][j]+1,
          dp[i][j-1]+1,
          dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
        );
      }
    }
    return dp[a.length][b.length];
  };

  if(lev(given,expected)===1){
    return {kind:"almost",hint:`Bijna juist. Er zit één kleine tikfout in. Probeer nog eens.`};
  }

  return {kind:"wrong"};
}
function almostMessage(result){
  if(result.reason==="accent")return `Bijna juist. Let op het accent en probeer opnieuw.`;
  if(result.reason==="article")return `Bijna juist. Vergeet het Franse lidwoord niet en probeer opnieuw.`;
  return `Bijna juist. Controleer de spelling en probeer opnieuw.`;
}

card.onclick=()=>{if(state.exerciseMode==="cards")show()};
easyBtn.onclick=()=>{updateScore(1);state.sessionKnown+=1;state.difficult=state.difficult.filter(x=>x!==id(current)&&x!==legacyId(current));saveState(state);next()};
hardBtn.onclick=()=>{updateScore(-1);if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));saveState(state);next()};
wordListSelect.onchange=async()=>{
  state.wordListId=wordListSelect.value;
  state.hardOnly=false;
  saveState(state);
  await loadSelectedList();
};

exerciseMode.onchange=()=>{state.exerciseMode=exerciseMode.value;saveState(state);feedback.textContent="";next()};

typingForm.onsubmit=e=>{
  e.preventDefault();
  if(shown)return;

  const expected=currentDirection==="fr-nl"?current.nl:current.fr;
  const given=typingInput.value.trim();
  if(!given)return;

  const result=evaluate(given,current,currentDirection);

  if(result.kind==="correct"){
    shown=true;
    feedback.textContent=result.note||"Juist!";
    feedback.className="feedback correct";
    updateScore(1);
    state.sessionKnown+=1;
    state.difficult=state.difficult.filter(x=>x!==id(current)&&x!==legacyId(current));
    saveState(state);
    render();
    return;
  }

  if(result.kind==="almost" && !retryUsed){
    retryUsed=true;
    feedback.textContent=result.hint||"Bijna juist. Probeer nog één keer.";
    feedback.className="feedback almost";
    typingInput.focus();
    typingInput.select();
    return;
  }

  shown=true;
  feedback.textContent=`Nog niet juist. Correct antwoord: ${expected}`;
  feedback.className="feedback incorrect";
  updateScore(-1);
  if(!state.difficult.includes(id(current))&&!state.difficult.includes(legacyId(current)))state.difficult.push(id(current));
  retryUsed=false;
  saveState(state);
  render();
};

function normalizeStrict(value){return value.toLowerCase().replace(/[’]/g,"'").replace(/\s+/g," ").trim()}
function normalizeLoose(value){return normalizeStrict(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function stripDutchArticle(value){return value.replace(/^(de|het)\s+/,"")}
function stripFrenchArticle(value){return value.replace(/^(le|la|les|l')\s*/,"")}
function levenshtein(a,b){
  const m=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)m[i][0]=i;
  for(let j=0;j<=b.length;j++)m[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return m[a.length][b.length];
}

direction.onchange=()=>{state.direction=direction.value;saveState(state);next()};
themeBtn.onclick=()=>{state.dark=!state.dark;saveState(state);render()};
hardOnlyBtn.onclick=()=>{state.hardOnly=!state.hardOnly;saveState(state);next()};
document.addEventListener("keydown",e=>{
  if(state.exerciseMode==="cards"&&(e.key===" "||e.key==="Enter")&&!shown){e.preventDefault();show()}
  else if(e.key==="ArrowLeft"&&shown)hardBtn.click();
  else if(e.key==="ArrowRight"&&shown)easyBtn.click();
});
async function prepareDevelopmentEnvironment(){
  const isLocal=location.hostname==="127.0.0.1"||location.hostname==="localhost";
  if(!isLocal)return;

  try{
    if("serviceWorker" in navigator){
      const registrations=await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r=>r.unregister()));
    }
    if("caches" in window){
      const names=await caches.keys();
      await Promise.all(names.map(name=>caches.delete(name)));
    }
  }catch(error){
    console.warn("Lokale cache-opruiming niet volledig gelukt:",error);
  }
}

async function populateWordListSelect(){
  await loadWordListRegistry();
  wordListSelect.innerHTML="";

  const allOption=document.createElement("option");
  allOption.value="all";
  allOption.textContent="Alle woordenlijsten";
  wordListSelect.appendChild(allOption);

  for(const list of getWordListOptions()){
    const option=document.createElement("option");
    option.value=list.id;
    option.textContent=list.name;
    wordListSelect.appendChild(option);
  }

  const wanted=state.wordListId||"basis";
  const valid=wanted==="all"||WORD_LISTS.some(list=>list.id===wanted);
  state.wordListId=valid?wanted:"basis";
  wordListSelect.value=state.wordListId;
}

async function loadSelectedList(){
  q.textContent="Laden…";
  a.hidden=true;
  answerInfo.hidden=true;
  try{
    await loadWordList(state.wordListId||"basis");
    current=chooseWord();
    previousId=id(current);
    currentDirection=chooseDirection();
    shown=false;
    retryUsed=false;
    feedback.textContent="";
    render();
    if(state.exerciseMode==="typing")typingInput.focus();
  }catch(error){
    console.error(error);
    q.textContent="Woordenlijst kon niet worden geladen";
    feedback.textContent=error.message;
    feedback.className="feedback incorrect";
  }
}

async function init(){
  try{
    await prepareDevelopmentEnvironment();
    await populateWordListSelect();
    await loadSelectedList();
  }catch(error){
    console.error("Frans Trainer startfout:",error);
    q.textContent="Starten mislukt";
    feedback.textContent=error?.message||"Onbekende startfout.";
    feedback.className="feedback incorrect";
    typingForm.hidden=false;
  }
}

const isLocalDevelopment=
  location.hostname==="127.0.0.1"||
  location.hostname==="localhost";

if("serviceWorker" in navigator&&!isLocalDevelopment){
  window.addEventListener("load",async()=>{
    try{
      const registration=await navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`);
      registration.update();
    }catch(error){
      console.warn("Service worker kon niet worden geregistreerd:",error);
    }
  });
}

init();
