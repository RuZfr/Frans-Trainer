const APP_VERSION="1.8.2";
let WORDS=[];
let WORD_LISTS=[];
let CURRENT_LIST_ID="basis";

function listUrl(file){
  return new URL(`./data/lists/${file}?v=${APP_VERSION}`,document.baseURI).href;
}

async function fetchJson(url,label){
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok)throw new Error(`${label} kon niet worden geladen (HTTP ${response.status}).`);

  const type=response.headers.get("content-type")||"";
  if(!type.includes("json")){
    throw new Error(`${label} gaf geen JSON terug. Start Live Server vanuit de map FransTrainer.`);
  }

  try{return await response.json();}
  catch{throw new Error(`${label} bevat ongeldige JSON.`);}
}

async function loadWordListRegistry(){
  const data=await fetchJson(listUrl("index.json"),"Woordenlijstregister");
  if(!Array.isArray(data)||!data.length)throw new Error("Geen woordenlijsten gevonden.");

  for(const list of data){
    if(!list?.id||!list?.name||!list?.file){
      throw new Error("Een woordenlijst in index.json mist id, name of file.");
    }
  }

  WORD_LISTS=data;
  return data;
}

async function loadWordList(listId){
  if(!WORD_LISTS.length)await loadWordListRegistry();

  const selected=listId==="all"
    ? WORD_LISTS
    : WORD_LISTS.filter(list=>list.id===listId);

  if(!selected.length)throw new Error(`Onbekende woordenlijst: ${listId}`);

  const loaded=await Promise.all(selected.map(async list=>{
    const data=await fetchJson(listUrl(list.file),`Woordenlijst "${list.name}"`);
    if(!Array.isArray(data?.words))throw new Error(`Woordenlijst "${list.name}" is ongeldig.`);

    return data.words
      .filter(word=>typeof word?.fr==="string"&&word.fr.trim()&&typeof word?.nl==="string"&&word.nl.trim())
      .map(word=>({...word,alts:Array.isArray(word.alts)?word.alts:[],_listId:list.id}));
  }));

  WORDS=loaded.flat();
  CURRENT_LIST_ID=listId;
  if(!WORDS.length)throw new Error("De gekozen woordenlijst bevat geen geldige woorden.");
  return WORDS;
}

function getWordListOptions(){
  return WORD_LISTS.map(({id,name})=>({id,name}));
}
