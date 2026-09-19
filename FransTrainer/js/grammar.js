(() => {
  "use strict";

  const SESSION_LENGTH=10;
  const FALLBACK_DATA={"id":"cod","name":"COD","title":"COD herkennen en vervangen","description":"Vind het directe voorwerp en vervang het daarna door le, la, l’ of les.","recognition":[{"sentence":"Je mange la pomme.","question":"Wat is het COD?","answer":"la pomme","options":["Je","mange","la pomme","geen COD"],"explanation":"Je mange quoi ? → la pomme. Er staat geen voorzetsel tussen het werkwoord en het COD."},{"sentence":"Marie regarde le film.","question":"Wat is het COD?","answer":"le film","options":["Marie","regarde","le film","geen COD"],"explanation":"Marie regarde quoi ? → le film."},{"sentence":"Nous achetons les billets.","question":"Wat is het COD?","answer":"les billets","options":["Nous","achetons","les billets","geen COD"],"explanation":"Nous achetons quoi ? → les billets."},{"sentence":"Tu écoutes cette chanson.","question":"Wat is het COD?","answer":"cette chanson","options":["Tu","écoutes","cette chanson","geen COD"],"explanation":"Tu écoutes quoi ? → cette chanson."},{"sentence":"Paul adore le football.","question":"Wat is het COD?","answer":"le football","options":["Paul","adore","le football","geen COD"],"explanation":"Paul adore quoi ? → le football."},{"sentence":"Elle cherche son téléphone.","question":"Wat is het COD?","answer":"son téléphone","options":["Elle","cherche","son téléphone","geen COD"],"explanation":"Elle cherche quoi ? → son téléphone."},{"sentence":"On prépare le dîner.","question":"Wat is het COD?","answer":"le dîner","options":["On","prépare","le dîner","geen COD"],"explanation":"On prépare quoi ? → le dîner."},{"sentence":"Vous invitez vos amis.","question":"Wat is het COD?","answer":"vos amis","options":["Vous","invitez","vos amis","geen COD"],"explanation":"Vous invitez qui ? → vos amis."},{"sentence":"Le garçon ferme la porte.","question":"Wat is het COD?","answer":"la porte","options":["Le garçon","ferme","la porte","geen COD"],"explanation":"Le garçon ferme quoi ? → la porte."},{"sentence":"Les élèves lisent le texte.","question":"Wat is het COD?","answer":"le texte","options":["Les élèves","lisent","le texte","geen COD"],"explanation":"Les élèves lisent quoi ? → le texte."},{"sentence":"Je prends le bus.","question":"Wat is het COD?","answer":"le bus","options":["Je","prends","le bus","geen COD"],"explanation":"Je prends quoi ? → le bus."},{"sentence":"Ils visitent Paris.","question":"Wat is het COD?","answer":"Paris","options":["Ils","visitent","Paris","geen COD"],"explanation":"Ils visitent quoi ? → Paris. Ook een eigennaam kan COD zijn."},{"sentence":"Léa aime son chien.","question":"Wat is het COD?","answer":"son chien","options":["Léa","aime","son chien","geen COD"],"explanation":"Léa aime qui ? → son chien."},{"sentence":"Nous regardons la télévision.","question":"Wat is het COD?","answer":"la télévision","options":["Nous","regardons","la télévision","geen COD"],"explanation":"Nous regardons quoi ? → la télévision."},{"sentence":"Mon frère ouvre la fenêtre.","question":"Wat is het COD?","answer":"la fenêtre","options":["Mon frère","ouvre","la fenêtre","geen COD"],"explanation":"Mon frère ouvre quoi ? → la fenêtre."},{"sentence":"Le professeur pose une question.","question":"Wat is het COD?","answer":"une question","options":["Le professeur","pose","une question","geen COD"],"explanation":"Le professeur pose quoi ? → une question."}],"replacement":[{"sentence":"Je regarde le film.","target":"le film","question":"Vervang het COD door een voornaamwoord.","answer":"Je le regarde.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le film is mannelijk enkelvoud → le. Het voornaamwoord staat vóór regarde."},{"sentence":"Elle ferme la porte.","target":"la porte","question":"Vervang het COD door een voornaamwoord.","answer":"Elle la ferme.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La porte is vrouwelijk enkelvoud → la. Dus: Elle la ferme."},{"sentence":"Nous achetons les billets.","target":"les billets","question":"Vervang het COD door een voornaamwoord.","answer":"Nous les achetons.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les billets is meervoud → les. Het COD-voornaamwoord komt vóór achetons."},{"sentence":"J’aime la musique.","target":"la musique","question":"Vervang het COD door een voornaamwoord.","answer":"Je l’aime.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"La wordt l’ vóór een werkwoord dat met een klinker begint: Je l’aime."},{"sentence":"Tu invites Marie.","target":"Marie","question":"Vervang het COD door een voornaamwoord.","answer":"Tu l’invites.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Marie wordt la, maar vóór invites wordt la → l’. Dus: Tu l’invites."},{"sentence":"Il écoute les chansons.","target":"les chansons","question":"Vervang het COD door een voornaamwoord.","answer":"Il les écoute.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les chansons is meervoud → les."},{"sentence":"On prend le bus.","target":"le bus","question":"Vervang het COD door een voornaamwoord.","answer":"On le prend.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le bus is mannelijk enkelvoud → le."},{"sentence":"Vous regardez la télévision.","target":"la télévision","question":"Vervang het COD door een voornaamwoord.","answer":"Vous la regardez.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La télévision is vrouwelijk enkelvoud → la."},{"sentence":"Ils aiment leurs amis.","target":"leurs amis","question":"Vervang het COD door een voornaamwoord.","answer":"Ils les aiment.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Leurs amis is meervoud → les."},{"sentence":"J’ouvre la fenêtre.","target":"la fenêtre","question":"Vervang het COD door een voornaamwoord.","answer":"Je l’ouvre.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"La fenêtre wordt la, maar vóór ouvre wordt la → l’. Dus: Je l’ouvre."},{"sentence":"Nous cherchons le professeur.","target":"le professeur","question":"Vervang het COD door een voornaamwoord.","answer":"Nous le cherchons.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le professeur is mannelijk enkelvoud → le."},{"sentence":"Elle prépare la pizza.","target":"la pizza","question":"Vervang het COD door een voornaamwoord.","answer":"Elle la prépare.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La pizza is vrouwelijk enkelvoud → la."},{"sentence":"Tu prends les clés.","target":"les clés","question":"Vervang het COD door een voornaamwoord.","answer":"Tu les prends.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les clés is meervoud → les."},{"sentence":"Paul adore ce jeu.","target":"ce jeu","question":"Vervang het COD door een voornaamwoord.","answer":"Paul l’adore.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Ce jeu wordt le, maar vóór adore wordt le → l’. Dus: Paul l’adore."},{"sentence":"Les enfants mangent les frites.","target":"les frites","question":"Vervang het COD door een voornaamwoord.","answer":"Les enfants les mangent.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les frites is meervoud → les."},{"sentence":"Je connais cette fille.","target":"cette fille","question":"Vervang het COD door een voornaamwoord.","answer":"Je la connais.","pronoun":"la","options":["le","la","l’","les"],"explanation":"Cette fille is vrouwelijk enkelvoud → la."}]};
  let data=null;
  let mode="recognition";
  let queue=[];
  let index=0;
  let correct=0;
  let answered=false;

  const home=document.querySelector("#grammarHome");
  const exercise=document.querySelector("#grammarExercise");
  const result=document.querySelector("#grammarResult");
  const startButtons=[...document.querySelectorAll("[data-grammar-mode]")];
  const backBtn=document.querySelector("#grammarBackBtn");
  const exerciseLabel=document.querySelector("#grammarExerciseLabel");
  const progressText=document.querySelector("#grammarProgressText");
  const progressBar=document.querySelector("#grammarProgressBar");
  const questionType=document.querySelector("#grammarQuestionType");
  const sentence=document.querySelector("#grammarSentence");
  const targetHint=document.querySelector("#grammarTargetHint");
  const options=document.querySelector("#grammarOptions");
  const feedback=document.querySelector("#grammarFeedback");
  const feedbackTitle=document.querySelector("#grammarFeedbackTitle");
  const feedbackText=document.querySelector("#grammarFeedbackText");
  const correctSentence=document.querySelector("#grammarCorrectSentence");
  const nextBtn=document.querySelector("#grammarNextBtn");
  const resultTitle=document.querySelector("#grammarResultTitle");
  const resultScore=document.querySelector("#grammarResultScore");
  const resultMessage=document.querySelector("#grammarResultMessage");
  const againBtn=document.querySelector("#grammarAgainBtn");
  const homeBtn=document.querySelector("#grammarHomeBtn");

  function shuffle(items){
    const a=[...items];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  async function loadData(){
    if(data)return data;
    try{
      const url=new URL(`./data/grammar/cod.json?v=1.17.1`,document.baseURI);
      const response=await fetch(url,{cache:"no-store"});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const payload=await response.json();
      if(!Array.isArray(payload.recognition)||!Array.isArray(payload.replacement))throw new Error("ongeldige data");
      data=payload;
    }catch(error){
      console.warn("COD JSON niet bereikbaar; ingebouwde oefeningen worden gebruikt.",error);
      data=FALLBACK_DATA;
    }
    return data;
  }

  function makeQueue(selectedMode){
    if(selectedMode==="recognition"){
      return shuffle(data.recognition).slice(0,Math.min(SESSION_LENGTH,data.recognition.length)).map(item=>({...item,type:"recognition"}));
    }
    if(selectedMode==="replacement"){
      return shuffle(data.replacement).slice(0,Math.min(SESSION_LENGTH,data.replacement.length)).map(item=>({...item,type:"replacement"}));
    }

    const recognition=shuffle(data.recognition).slice(0,5).map(item=>({...item,type:"recognition"}));
    const replacement=shuffle(data.replacement).slice(0,5).map(item=>({...item,type:"replacement"}));
    return shuffle([...recognition,...replacement]);
  }

  function setScreen(name){
    home.hidden=name!=="home";
    exercise.hidden=name!=="exercise";
    result.hidden=name!=="result";
  }

  function labelForMode(value){
    if(value==="recognition")return "COD herkennen";
    if(value==="replacement")return "COD vervangen";
    return "COD mix";
  }

  async function start(selectedMode){
    try{
      await loadData();
      mode=selectedMode;
      queue=makeQueue(mode);
      index=0;
      correct=0;
      answered=false;
      exerciseLabel.textContent=labelForMode(mode);
      setScreen("exercise");
      renderQuestion();
    }catch(error){
      console.error(error);
      setScreen("home");
      const note=document.createElement("p");
      note.className="grammar-load-error";
      note.textContent=error.message||"De grammaticaoefeningen konden niet worden geladen.";
      home.appendChild(note);
    }
  }

  function current(){
    return queue[index];
  }

  function renderQuestion(){
    const item=current();
    if(!item){
      finish();
      return;
    }

    answered=false;
    feedback.hidden=true;
    feedback.className="grammar-feedback";
    correctSentence.hidden=true;
    correctSentence.textContent="";
    nextBtn.hidden=true;
    options.innerHTML="";

    const number=index+1;
    progressText.textContent=`${number} / ${queue.length}`;
    progressBar.style.width=`${Math.round((index/queue.length)*100)}%`;

    sentence.textContent=item.sentence;

    if(item.type==="recognition"){
      questionType.textContent="Wat is het COD?";
      targetHint.hidden=true;
      exerciseLabel.textContent=mode==="mixed"?"COD mix":"COD herkennen";
    }else{
      questionType.textContent="Welk COD-voornaamwoord past?";
      targetHint.hidden=false;
      targetHint.innerHTML=`Vervang <strong>${escapeHtml(item.target)}</strong>.`;
      exerciseLabel.textContent=mode==="mixed"?"COD mix":"COD vervangen";
    }

    item.options.forEach(value=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="grammar-option";
      button.textContent=value;
      button.dataset.value=value;
      button.addEventListener("click",()=>choose(value,button));
      options.appendChild(button);
    });
  }

  function normalize(value){
    return String(value).replace(/[’]/g,"'").trim().toLowerCase();
  }

  function choose(value,button){
    if(answered)return;
    answered=true;
    const item=current();
    const expected=item.type==="recognition"?item.answer:item.pronoun;
    const isCorrect=normalize(value)===normalize(expected);

    [...options.querySelectorAll(".grammar-option")].forEach(option=>{
      option.disabled=true;
      if(normalize(option.dataset.value)===normalize(expected))option.classList.add("correct");
    });

    if(isCorrect){
      correct+=1;
      button.classList.add("selected-correct");
      feedback.classList.add("correct");
      feedbackTitle.textContent="Juist!";
    }else{
      button.classList.add("wrong");
      feedback.classList.add("incorrect");
      feedbackTitle.textContent="Nog niet juist.";
    }

    feedbackText.textContent=item.explanation;

    if(item.type==="replacement"){
      correctSentence.hidden=false;
      correctSentence.innerHTML=`Volledige zin: <strong>${escapeHtml(item.answer)}</strong>`;
    }else if(!isCorrect){
      correctSentence.hidden=false;
      correctSentence.innerHTML=`COD: <strong>${escapeHtml(item.answer)}</strong>`;
    }

    feedback.hidden=false;
    nextBtn.hidden=false;
    nextBtn.textContent=index===queue.length-1?"Bekijk resultaat":"Volgende";
    progressBar.style.width=`${Math.round(((index+1)/queue.length)*100)}%`;
    nextBtn.focus();
  }

  function next(){
    if(!answered)return;
    index+=1;
    if(index>=queue.length)finish();
    else renderQuestion();
  }

  function finish(){
    setScreen("result");
    const total=queue.length;
    const pct=total?Math.round((correct/total)*100):0;
    resultScore.textContent=`${correct} van ${total} juist · ${pct}%`;

    if(pct===100){
      resultTitle.textContent="Perfect!";
      resultMessage.textContent="Je herkent en vervangt het COD heel sterk.";
    }else if(pct>=80){
      resultTitle.textContent="Heel goed!";
      resultMessage.textContent="Je hebt het COD goed onder de knie. Nog één ronde maakt het extra stevig.";
    }else if(pct>=60){
      resultTitle.textContent="Goed bezig!";
      resultMessage.textContent="De basis zit er al in. Bekijk de uitleg nog even en oefen daarna opnieuw.";
    }else{
      resultTitle.textContent="Blijf oefenen!";
      resultMessage.textContent="Bekijk vooral de twee regels bovenaan opnieuw. Daarna zal het snel duidelijker worden.";
    }
  }

  function goHome(){
    setScreen("home");
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function escapeHtml(value){
    return String(value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;");
  }

  startButtons.forEach(button=>{
    button.addEventListener("click",()=>start(button.dataset.grammarMode));
  });
  backBtn?.addEventListener("click",goHome);
  nextBtn?.addEventListener("click",next);
  againBtn?.addEventListener("click",()=>start(mode));
  homeBtn?.addEventListener("click",goHome);

  window.GrammarTrainer={
    showHome:goHome,
    start
  };
})();
