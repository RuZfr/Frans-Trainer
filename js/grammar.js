(() => {
  "use strict";

  const SESSION_LENGTH=10;
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
    const url=new URL(`./data/grammar/cod.json?v=1.17.0`,document.baseURI);
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok)throw new Error(`COD-oefeningen konden niet worden geladen (${response.status}).`);
    const payload=await response.json();
    if(!Array.isArray(payload.recognition)||!Array.isArray(payload.replacement))throw new Error("COD-oefeningen zijn ongeldig.");
    data=payload;
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
