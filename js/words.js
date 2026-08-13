const APP_VERSION="1.15.2";
let WORDS=[];
let WORD_LISTS=[];
let CURRENT_LIST_ID="basis";

function listUrl(file){return new URL(`./data/lists/${file}?v=${APP_VERSION}`,document.baseURI).href;}
async function fetchJson(url,label){
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok)throw new Error(`${label} kon niet worden geladen (HTTP ${response.status}).`);
  const type=response.headers.get("content-type")||"";
  if(!type.includes("json"))throw new Error(`${label} gaf geen JSON terug. Start Live Server vanuit de map FransTrainer.`);
  try{return await response.json();}catch{throw new Error(`${label} bevat ongeldige JSON.`);}
}
async function loadWordListRegistry(){
  const bundled=await fetchJson(listUrl("index.json"),"Woordenlijstregister");
  if(!Array.isArray(bundled)||!bundled.length)throw new Error("Geen ingebouwde woordenlijsten gevonden.");
  const bundledEntries=bundled.map(list=>({...list,source:"bundled"}));
  WORD_LISTS=[...bundledEntries,...getImportedRegistryEntries()];
  return WORD_LISTS;
}
async function loadOneList(list){
  let data;
  if(list.source==="local"){
    data=getImportedList(list.id);
    if(!data)throw new Error(`Eigen woordenlijst "${list.name}" bestaat niet meer.`);
  }else data=await fetchJson(listUrl(list.file),`Woordenlijst "${list.name}"`);
  if(!Array.isArray(data?.words))throw new Error(`Woordenlijst "${list.name}" is ongeldig.`);
  return data.words
    .filter(word=>typeof word?.fr==="string"&&word.fr.trim()&&typeof word?.nl==="string"&&word.nl.trim())
    .map(word=>({
      ...word,
      type:word.type||"other",
      category:word.category||list.name,
      alts:Array.isArray(word.alts)?word.alts:[],
      frAlts:Array.isArray(word.frAlts)?word.frAlts:[],
      _listId:list.id,
      _listName:list.name
    }));
}
async function loadWordList(listId){
  if(!WORD_LISTS.length)await loadWordListRegistry();
  const selected=listId==="all"?WORD_LISTS:WORD_LISTS.filter(list=>list.id===listId);
  if(!selected.length)throw new Error(`Onbekende woordenlijst: ${listId}`);
  WORDS=(await Promise.all(selected.map(loadOneList))).flat();
  CURRENT_LIST_ID=listId;
  if(!WORDS.length)throw new Error("De gekozen woordenlijst bevat geen geldige woorden.");
  return WORDS;
}
function getWordListOptions(){return WORD_LISTS.map(({id,name,source})=>({id,name,source}));}
function getCategoryOptions(){
  const counts=new Map();
  for(const word of WORDS){
    const category=word.category||"Overig";
    counts.set(category,(counts.get(category)||0)+1);
  }
  return [...counts.entries()].map(([name,count])=>({id:name,name,count})).sort((a,b)=>a.name.localeCompare(b.name,"nl"));
}
