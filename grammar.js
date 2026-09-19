(() => {
  "use strict";

  const SESSION_LENGTH=10;
  const FALLBACK_DATA={"id":"cod","name":"COD","title":"COD herkennen en vervangen","description":"Vind het directe voorwerp en vervang het daarna door le, la, l’ of les.","recognition":[{"sentence":"Je mange la pomme.","question":"Wat is het COD?","answer":"la pomme","options":["Je","mange","la pomme","geen COD"],"explanation":"Je mange quoi ? → la pomme. Er staat geen voorzetsel tussen het werkwoord en het COD."},{"sentence":"Marie regarde le film.","question":"Wat is het COD?","answer":"le film","options":["Marie","regarde","le film","geen COD"],"explanation":"Marie regarde quoi ? → le film."},{"sentence":"Nous achetons les billets.","question":"Wat is het COD?","answer":"les billets","options":["Nous","achetons","les billets","geen COD"],"explanation":"Nous achetons quoi ? → les billets."},{"sentence":"Tu écoutes cette chanson.","question":"Wat is het COD?","answer":"cette chanson","options":["Tu","écoutes","cette chanson","geen COD"],"explanation":"Tu écoutes quoi ? → cette chanson."},{"sentence":"Paul adore le football.","question":"Wat is het COD?","answer":"le football","options":["Paul","adore","le football","geen COD"],"explanation":"Paul adore quoi ? → le football."},{"sentence":"Elle cherche son téléphone.","question":"Wat is het COD?","answer":"son téléphone","options":["Elle","cherche","son téléphone","geen COD"],"explanation":"Elle cherche quoi ? → son téléphone."},{"sentence":"On prépare le dîner.","question":"Wat is het COD?","answer":"le dîner","options":["On","prépare","le dîner","geen COD"],"explanation":"On prépare quoi ? → le dîner."},{"sentence":"Vous invitez vos amis.","question":"Wat is het COD?","answer":"vos amis","options":["Vous","invitez","vos amis","geen COD"],"explanation":"Vous invitez qui ? → vos amis."},{"sentence":"Le garçon ferme la porte.","question":"Wat is het COD?","answer":"la porte","options":["Le garçon","ferme","la porte","geen COD"],"explanation":"Le garçon ferme quoi ? → la porte."},{"sentence":"Les élèves lisent le texte.","question":"Wat is het COD?","answer":"le texte","options":["Les élèves","lisent","le texte","geen COD"],"explanation":"Les élèves lisent quoi ? → le texte."},{"sentence":"Je prends le bus.","question":"Wat is het COD?","answer":"le bus","options":["Je","prends","le bus","geen COD"],"explanation":"Je prends quoi ? → le bus."},{"sentence":"Ils visitent Paris.","question":"Wat is het COD?","answer":"Paris","options":["Ils","visitent","Paris","geen COD"],"explanation":"Ils visitent quoi ? → Paris. Ook een eigennaam kan COD zijn."},{"sentence":"Léa aime son chien.","question":"Wat is het COD?","answer":"son chien","options":["Léa","aime","son chien","geen COD"],"explanation":"Léa aime qui ? → son chien."},{"sentence":"Nous regardons la télévision.","question":"Wat is het COD?","answer":"la télévision","options":["Nous","regardons","la télévision","geen COD"],"explanation":"Nous regardons quoi ? → la télévision."},{"sentence":"Mon frère ouvre la fenêtre.","question":"Wat is het COD?","answer":"la fenêtre","options":["Mon frère","ouvre","la fenêtre","geen COD"],"explanation":"Mon frère ouvre quoi ? → la fenêtre."},{"sentence":"Le professeur pose une question.","question":"Wat is het COD?","answer":"une question","options":["Le professeur","pose","une question","geen COD"],"explanation":"Le professeur pose quoi ? → une question."}],"replacement":[{"sentence":"Je regarde le film.","target":"le film","question":"Vervang het COD door een voornaamwoord.","answer":"Je le regarde.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le film is mannelijk enkelvoud → le. Het voornaamwoord staat vóór regarde."},{"sentence":"Elle ferme la porte.","target":"la porte","question":"Vervang het COD door een voornaamwoord.","answer":"Elle la ferme.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La porte is vrouwelijk enkelvoud → la. Dus: Elle la ferme."},{"sentence":"Nous achetons les billets.","target":"les billets","question":"Vervang het COD door een voornaamwoord.","answer":"Nous les achetons.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les billets is meervoud → les. Het COD-voornaamwoord komt vóór achetons."},{"sentence":"J’aime la musique.","target":"la musique","question":"Vervang het COD door een voornaamwoord.","answer":"Je l’aime.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"La wordt l’ vóór een werkwoord dat met een klinker begint: Je l’aime."},{"sentence":"Tu invites Marie.","target":"Marie","question":"Vervang het COD door een voornaamwoord.","answer":"Tu l’invites.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Marie wordt la, maar vóór invites wordt la → l’. Dus: Tu l’invites."},{"sentence":"Il écoute les chansons.","target":"les chansons","question":"Vervang het COD door een voornaamwoord.","answer":"Il les écoute.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les chansons is meervoud → les."},{"sentence":"On prend le bus.","target":"le bus","question":"Vervang het COD door een voornaamwoord.","answer":"On le prend.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le bus is mannelijk enkelvoud → le."},{"sentence":"Vous regardez la télévision.","target":"la télévision","question":"Vervang het COD door een voornaamwoord.","answer":"Vous la regardez.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La télévision is vrouwelijk enkelvoud → la."},{"sentence":"Ils aiment leurs amis.","target":"leurs amis","question":"Vervang het COD door een voornaamwoord.","answer":"Ils les aiment.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Leurs amis is meervoud → les."},{"sentence":"J’ouvre la fenêtre.","target":"la fenêtre","question":"Vervang het COD door een voornaamwoord.","answer":"Je l’ouvre.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"La fenêtre wordt la, maar vóór ouvre wordt la → l’. Dus: Je l’ouvre."},{"sentence":"Nous cherchons le professeur.","target":"le professeur","question":"Vervang het COD door een voornaamwoord.","answer":"Nous le cherchons.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Le professeur is mannelijk enkelvoud → le."},{"sentence":"Elle prépare la pizza.","target":"la pizza","question":"Vervang het COD door een voornaamwoord.","answer":"Elle la prépare.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La pizza is vrouwelijk enkelvoud → la."},{"sentence":"Tu prends les clés.","target":"les clés","question":"Vervang het COD door een voornaamwoord.","answer":"Tu les prends.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les clés is meervoud → les."},{"sentence":"Paul adore ce jeu.","target":"ce jeu","question":"Vervang het COD door een voornaamwoord.","answer":"Paul l’adore.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Ce jeu wordt le, maar vóór adore wordt le → l’. Dus: Paul l’adore."},{"sentence":"Les enfants mangent les frites.","target":"les frites","question":"Vervang het COD door een voornaamwoord.","answer":"Les enfants les mangent.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les frites is meervoud → les."},{"sentence":"Je connais cette fille.","target":"cette fille","question":"Vervang het COD door een voornaamwoord.","answer":"Je la connais.","pronoun":"la","options":["le","la","l’","les"],"explanation":"Cette fille is vrouwelijk enkelvoud → la."}],"advancedRecognition":[{"sentence":"Quand le professeur explique la règle, les élèves prennent des notes.","question":"Wat is het COD bij « explique »?","answer":"la règle","options":["le professeur","la règle","les élèves","des notes"],"explanation":"Le professeur explique quoi ? → la règle. « Des notes » hoort bij het werkwoord prennent."},{"sentence":"Même s’il est fatigué, Thomas termine son devoir avant le dîner.","question":"Wat is het COD bij « termine »?","answer":"son devoir","options":["Thomas","son devoir","avant le dîner","fatigué"],"explanation":"Thomas termine quoi ? → son devoir. « Avant le dîner » geeft tijd aan en is geen COD."},{"sentence":"Ma sœur a oublié ses clés dans la voiture.","question":"Wat is het COD?","answer":"ses clés","options":["Ma sœur","ses clés","dans la voiture","la voiture"],"explanation":"Ma sœur a oublié quoi ? → ses clés. « Dans la voiture » is een plaatsbepaling."},{"sentence":"Nous voulons visiter ce musée pendant les vacances.","question":"Wat is het COD bij « visiter »?","answer":"ce musée","options":["Nous","ce musée","pendant les vacances","les vacances"],"explanation":"Visiter quoi ? → ce musée. Bij een infinitief zoek je het COD bij de infinitief zelf."},{"sentence":"Le directeur a félicité les élèves qui avaient gagné le concours.","question":"Wat is het COD bij « a félicité »?","answer":"les élèves","options":["Le directeur","les élèves","le concours","qui"],"explanation":"Le directeur a félicité qui ? → les élèves. « Le concours » is het COD van avaient gagné."},{"sentence":"Je ne comprends pas cette explication malgré les exemples.","question":"Wat is het COD?","answer":"cette explication","options":["Je","cette explication","les exemples","malgré les exemples"],"explanation":"Je ne comprends pas quoi ? → cette explication. De ontkenning verandert de functie van het COD niet."},{"sentence":"Après le cours, Léa raconte son problème à sa meilleure amie.","question":"Wat is het COD bij « raconte »?","answer":"son problème","options":["Léa","son problème","à sa meilleure amie","sa meilleure amie"],"explanation":"Léa raconte quoi ? → son problème. « À sa meilleure amie » is geen COD omdat er à voor staat."},{"sentence":"Les pompiers ont rapidement évacué le bâtiment après l’alarme.","question":"Wat is het COD?","answer":"le bâtiment","options":["Les pompiers","le bâtiment","après l’alarme","l’alarme"],"explanation":"Les pompiers ont évacué quoi ? → le bâtiment."},{"sentence":"Si tu relis attentivement le texte, tu trouveras la réponse.","question":"Wat is het COD bij « relis »?","answer":"le texte","options":["tu","le texte","attentivement","la réponse"],"explanation":"Tu relis quoi ? → le texte. « La réponse » hoort bij trouveras."},{"sentence":"Mon frère préfère regarder les documentaires que lire les romans.","question":"Wat is het COD bij « regarder »?","answer":"les documentaires","options":["Mon frère","les documentaires","les romans","regarder"],"explanation":"Regarder quoi ? → les documentaires. « Les romans » is het COD van lire."},{"sentence":"La journaliste pose plusieurs questions au ministre.","question":"Wat is het COD?","answer":"plusieurs questions","options":["La journaliste","plusieurs questions","au ministre","le ministre"],"explanation":"La journaliste pose quoi ? → plusieurs questions. « Au ministre » begint met à en is dus geen COD."},{"sentence":"Mes parents ont acheté une nouvelle voiture l’année dernière.","question":"Wat is het COD?","answer":"une nouvelle voiture","options":["Mes parents","une nouvelle voiture","l’année dernière","dernière"],"explanation":"Mes parents ont acheté quoi ? → une nouvelle voiture."},{"sentence":"Pendant que nous attendions le bus, Emma lisait un article intéressant.","question":"Wat is het COD bij « lisait »?","answer":"un article intéressant","options":["nous","le bus","Emma","un article intéressant"],"explanation":"Emma lisait quoi ? → un article intéressant. « Le bus » hoort bij attendions."},{"sentence":"Le médecin examine le patient avant de donner son avis.","question":"Wat is het COD bij « examine »?","answer":"le patient","options":["Le médecin","le patient","son avis","avant de donner"],"explanation":"Le médecin examine qui ? → le patient. « Son avis » is het COD van donner."},{"sentence":"On ne peut pas résoudre ce problème sans utiliser une formule.","question":"Wat is het COD bij « résoudre »?","answer":"ce problème","options":["On","ce problème","une formule","sans utiliser"],"explanation":"Résoudre quoi ? → ce problème. « Une formule » is het COD van utiliser."},{"sentence":"Après avoir vérifié les résultats, l’équipe publiera le rapport demain.","question":"Wat is het COD bij « publiera »?","answer":"le rapport","options":["les résultats","l’équipe","le rapport","demain"],"explanation":"L’équipe publiera quoi ? → le rapport. « Les résultats » hoort bij avoir vérifié."}],"advancedReplacement":[{"sentence":"Je vais acheter ce livre demain.","target":"ce livre","question":"Vervang het COD door een voornaamwoord.","answer":"Je vais l’acheter demain.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Bij een infinitief staat het COD-voornaamwoord vóór de infinitief: acheter → l’acheter."},{"sentence":"Nous voulons regarder ce documentaire ce soir.","target":"ce documentaire","question":"Vervang het COD door een voornaamwoord.","answer":"Nous voulons le regarder ce soir.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Het voornaamwoord hoort bij regarder en staat daarom vóór de infinitief: le regarder."},{"sentence":"Elle ne comprend pas cette règle.","target":"cette règle","question":"Vervang het COD door een voornaamwoord.","answer":"Elle ne la comprend pas.","pronoun":"la","options":["le","la","l’","les"],"explanation":"Bij een ontkenning staat het COD-voornaamwoord vóór het vervoegde werkwoord: ne la comprend pas."},{"sentence":"Tu as vu Marie à la gare.","target":"Marie","question":"Vervang het COD door een voornaamwoord.","answer":"Tu l’as vue à la gare.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Marie → la → l’ vóór as. Omdat het COD vóór avoir staat, past het voltooid deelwoord zich aan: vue."},{"sentence":"J’ai acheté les chaussures hier.","target":"les chaussures","question":"Vervang het COD door een voornaamwoord.","answer":"Je les ai achetées hier.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les chaussures → les. Het COD staat vóór avoir, dus acheté krijgt vrouwelijk meervoud: achetées."},{"sentence":"Il a terminé son projet avant vendredi.","target":"son projet","question":"Vervang het COD door een voornaamwoord.","answer":"Il l’a terminé avant vendredi.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Son projet → le → l’ vóór a. Het voltooid deelwoord blijft mannelijk enkelvoud: terminé."},{"sentence":"Nous avons invité nos voisines à la fête.","target":"nos voisines","question":"Vervang het COD door een voornaamwoord.","answer":"Nous les avons invitées à la fête.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Nos voisines → les. Omdat les vóór avons staat, wordt invité → invitées."},{"sentence":"Vous devez finir les exercices avant midi.","target":"les exercices","question":"Vervang het COD door een voornaamwoord.","answer":"Vous devez les finir avant midi.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Na devoir staat een infinitief. Het voornaamwoord komt vóór die infinitief: les finir."},{"sentence":"On ne peut pas ouvrir cette fenêtre.","target":"cette fenêtre","question":"Vervang het COD door een voornaamwoord.","answer":"On ne peut pas l’ouvrir.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Cette fenêtre → la → l’ vóór ouvrir. Het voornaamwoord staat vóór de infinitief."},{"sentence":"Le professeur a corrigé les copies ce matin.","target":"les copies","question":"Vervang het COD door een voornaamwoord.","answer":"Le professeur les a corrigées ce matin.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Les copies → les. Omdat het COD vóór avoir staat, wordt corrigé → corrigées."},{"sentence":"Ma sœur cherche son téléphone depuis une heure.","target":"son téléphone","question":"Vervang het COD door een voornaamwoord.","answer":"Ma sœur le cherche depuis une heure.","pronoun":"le","options":["le","la","l’","les"],"explanation":"Son téléphone is mannelijk enkelvoud → le, vóór het vervoegde werkwoord cherche."},{"sentence":"Ils vont visiter la nouvelle exposition samedi.","target":"la nouvelle exposition","question":"Vervang het COD door een voornaamwoord.","answer":"Ils vont la visiter samedi.","pronoun":"la","options":["le","la","l’","les"],"explanation":"La nouvelle exposition → la. Bij aller + infinitief komt la vóór visiter."},{"sentence":"Je n’ai pas compris la question.","target":"la question","question":"Vervang het COD door een voornaamwoord.","answer":"Je ne l’ai pas comprise.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"La question → l’. Het COD staat vóór ai, dus compris wordt vrouwelijk enkelvoud: comprise."},{"sentence":"Elle aimerait revoir ses anciens camarades.","target":"ses anciens camarades","question":"Vervang het COD door een voornaamwoord.","answer":"Elle aimerait les revoir.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Ses anciens camarades is meervoud → les. Het voornaamwoord staat vóór de infinitief revoir."},{"sentence":"Nous avons choisi cette solution après une longue discussion.","target":"cette solution","question":"Vervang het COD door een voornaamwoord.","answer":"Nous l’avons choisie après une longue discussion.","pronoun":"l’","options":["le","la","l’","les"],"explanation":"Cette solution → la → l’. Omdat het COD vóór avoir staat, wordt choisi → choisie."},{"sentence":"Ils n’ont jamais rencontré ces actrices.","target":"ces actrices","question":"Vervang het COD door een voornaamwoord.","answer":"Ils ne les ont jamais rencontrées.","pronoun":"les","options":["le","la","l’","les"],"explanation":"Ces actrices → les. In de ontkenning staat les vóór ont; rencontré wordt daarom rencontrées."}]};
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
      const url=new URL(`./data/grammar/cod.json?v=1.18.1`,document.baseURI);
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
    if(selectedMode==="advancedRecognition"){
      return shuffle(data.advancedRecognition).slice(0,Math.min(SESSION_LENGTH,data.advancedRecognition.length)).map(item=>({...item,type:"recognition",advanced:true}));
    }
    if(selectedMode==="replacement"){
      return shuffle(data.replacement).slice(0,Math.min(SESSION_LENGTH,data.replacement.length)).map(item=>({...item,type:"replacement"}));
    }
    if(selectedMode==="advancedReplacement"){
      return shuffle(data.advancedReplacement).slice(0,Math.min(SESSION_LENGTH,data.advancedReplacement.length)).map(item=>({...item,type:"replacement",advanced:true}));
    }
    if(selectedMode==="mixed"){
      const basic=[
        ...shuffle(data.recognition).slice(0,5).map(item=>({...item,type:"recognition"})),
        ...shuffle(data.replacement).slice(0,5).map(item=>({...item,type:"replacement"}))
      ];
      return shuffle(basic);
    }
    if(selectedMode==="mixedAdvanced"){
      const advanced=[
        ...shuffle(data.advancedRecognition).slice(0,5).map(item=>({...item,type:"recognition",advanced:true})),
        ...shuffle(data.advancedReplacement).slice(0,5).map(item=>({...item,type:"replacement",advanced:true}))
      ];
      return shuffle(advanced);
    }
    return [];
  }

  function setScreen(name){
    home.hidden=name!=="home";
    exercise.hidden=name!=="exercise";
    result.hidden=name!=="result";
  }

  function labelForMode(value){
    if(value==="recognition")return "1 · COD herkennen";
    if(value==="advancedRecognition")return "1.1 · COD herkennen · moeilijker";
    if(value==="replacement")return "2 · COD vervangen";
    if(value==="advancedReplacement")return "2.1 · COD vervangen · moeilijker";
    if(value==="mixed")return "★ · COD mix";
    if(value==="mixedAdvanced")return "★★ · COD mix · moeilijker";
    return "COD";
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
      exerciseLabel.textContent=labelForMode(mode);
    }else{
      questionType.textContent="Welk COD-voornaamwoord past?";
      targetHint.hidden=false;
      targetHint.innerHTML=`Vervang <strong>${escapeHtml(item.target)}</strong>.`;
      exerciseLabel.textContent=labelForMode(mode);
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
