const IMPORTED_LISTS_KEY="frans-trainer-imported-lists-v2";
const LEGACY_IMPORTED_LISTS_KEY="frans-trainer-imported-lists-v1";

function readImportedLists(){
  try{
    const current=JSON.parse(localStorage.getItem(IMPORTED_LISTS_KEY)||"null");
    if(Array.isArray(current))return current;

    const legacy=JSON.parse(localStorage.getItem(LEGACY_IMPORTED_LISTS_KEY)||"[]");
    if(Array.isArray(legacy)&&legacy.length){
      localStorage.setItem(IMPORTED_LISTS_KEY,JSON.stringify(legacy));
      return legacy;
    }
  }catch(error){console.warn("Eigen woordenlijsten konden niet worden gelezen:",error);}
  return [];
}

function writeImportedLists(lists){
  localStorage.setItem(IMPORTED_LISTS_KEY,JSON.stringify(lists));
}

function getImportedList(id){return readImportedLists().find(list=>list.id===id)||null;}
function getImportedRegistryEntries(){
  return readImportedLists().map(list=>({
    id:list.id,
    name:list.name,
    description:list.description||"Eigen woordenlijst",
    source:"local"
  }));
}
function removeImportedList(id){
  const before=readImportedLists();
  const after=before.filter(list=>list.id!==id);
  writeImportedLists(after);
  return after.length!==before.length;
}

function normalizeHeader(value){
  return String(value||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[ _-]+/g,"");
}
function firstValue(row,names){
  for(const [key,value] of Object.entries(row||{})){
    if(names.includes(normalizeHeader(key)))return value;
  }
  return "";
}
function splitAlternatives(value){
  if(Array.isArray(value))return value.map(String).map(v=>v.trim()).filter(Boolean);
  if(value===undefined||value===null||value==="")return [];
  return String(value).split(/[|;]/).map(v=>v.trim()).filter(Boolean);
}
function uniqueStrings(values){
  const seen=new Set();
  return values.filter(value=>{
    const key=String(value).toLowerCase().replace(/[’]/g,"'").replace(/\s+/g," ").trim();
    if(!key||seen.has(key))return false;
    seen.add(key);return true;
  });
}
function normalizeType(value){
  const raw=String(value||"").trim().toLowerCase();
  const map={
    noun:"noun",zn:"noun",zelfstandignaamwoord:"noun",zelfstandignaamwoord:"noun",
    verb:"verb",ww:"verb",werkwoord:"verb",
    adjective:"adjective",adj:"adjective",bijvoeglijknaamwoord:"adjective",
    adverb:"adverb",bijwoord:"adverb",
    expression:"expression",uitdrukking:"expression",zin:"expression",
    preposition:"preposition",voorzetsel:"preposition"
  };
  return map[normalizeHeader(raw)]||raw||"other";
}
function hasFrenchArticle(value){return /^(le|la|les)\s+|^l[’']/i.test(String(value).trim());}
function hasDutchArticle(value){return /^(de|het)\s+/i.test(String(value).trim());}

function normalizeImportedWord(raw,index,defaultCategory){
  if(!raw||typeof raw!=="object")return {error:`Rij ${index+1}: geen geldig woord.`};

  const fr=String(firstValue(raw,["fr","frans","french"])||"").trim();
  const nl=String(firstValue(raw,["nl","nederlands","dutch"])||"").trim();
  if(!fr||!nl)return {error:`Rij ${index+1}: Frans en Nederlands zijn verplicht.`};

  const type=normalizeType(firstValue(raw,["type","woordsoort","soort"]));
  const category=String(firstValue(raw,["category","categorie","thema","theme"])||defaultCategory||"Eigen woorden").trim();
  const note=String(firstValue(raw,["note","opmerking","uitleg","explanation"])||"").trim();
  const alts=uniqueStrings(splitAlternatives(firstValue(raw,["alts","alternatieven","alternatives","nlalts","nlalternatieven"])));
  const frAlts=uniqueStrings(splitAlternatives(firstValue(raw,["fralts","fralternatieven","frenchalternatives"])));

  const warnings=[];
  if(type==="noun"){
    if(!hasFrenchArticle(fr))warnings.push(`Rij ${index+1}: Frans zelfstandig naamwoord zonder lidwoord (${fr}).`);
    if(!hasDutchArticle(nl))warnings.push(`Rij ${index+1}: Nederlandse hoofdvertaling zonder de/het (${nl}).`);
  }

  const word={fr,nl,type,category};
  if(alts.length)word.alts=alts;
  if(frAlts.length)word.frAlts=frAlts;
  if(note)word.note=note;
  return {word,warnings};
}

function parseCsvRecords(text){
  const records=[];let row=[];let field="";let quoted=false;
  const source=String(text).replace(/^\uFEFF/,"");
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(ch==='"'){
      if(quoted&&source[i+1]==='"'){field+='"';i++;}
      else quoted=!quoted;
    }else if((ch===","||ch===";"||ch==="\t")&&!quoted){
      // delimiter is resolved later; temporarily preserve separators in field marker
      field+=ch;
    }else if((ch==="\n"||ch==="\r")&&!quoted){
      if(ch==="\r"&&source[i+1]==="\n")i++;
      row.push(field);field="";
      if(row.some(v=>v.trim()))records.push(row.join("\n"));
      row=[];
    }else field+=ch;
  }
  row.push(field);
  if(row.some(v=>v.trim()))records.push(row.join("\n"));
  return records;
}
function splitCsvLine(line,delimiter){
  const values=[];let field="";let quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted&&line[i+1]==='"'){field+='"';i++;}
      else quoted=!quoted;
    }else if(ch===delimiter&&!quoted){values.push(field.trim());field="";}
    else field+=ch;
  }
  values.push(field.trim());return values;
}
function detectDelimiter(line){
  const options=[";",",","\t"];
  let best=options[0],count=-1;
  for(const delimiter of options){
    const n=splitCsvLine(line,delimiter).length;
    if(n>count){best=delimiter;count=n;}
  }
  return best;
}
function parseCsv(text){
  // Rebuild logical lines while respecting quoted newlines.
  const source=String(text).replace(/^\uFEFF/,"");
  const logical=[];let current="";let quoted=false;
  for(let i=0;i<source.length;i++){
    const ch=source[i];current+=ch;
    if(ch==='"'){
      if(quoted&&source[i+1]==='"'){current+=source[++i];}
      else quoted=!quoted;
    }
    if((ch==="\n"||ch==="\r")&&!quoted){
      if(ch==="\r"&&source[i+1]==="\n")current+=source[++i];
      if(current.trim())logical.push(current.replace(/[\r\n]+$/, ""));
      current="";
    }
  }
  if(current.trim())logical.push(current);
  if(logical.length<2)throw new Error("CSV bevat geen gegevens.");

  const delimiter=detectDelimiter(logical[0]);
  const headers=splitCsvLine(logical[0],delimiter).map(v=>v.trim());
  if(!headers.length)throw new Error("CSV bevat geen kolomnamen.");

  return logical.slice(1).filter(line=>line.trim()).map(line=>{
    const values=splitCsvLine(line,delimiter);const row={};
    headers.forEach((header,index)=>row[header]=values[index]??"");
    return row;
  });
}
function slugify(value){
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"woordenlijst";
}
function validateAndBuildImportedList(raw,nameHint){
  let source,name=nameHint||"Nieuwe woordenlijst",description="";
  if(Array.isArray(raw))source=raw;
  else if(raw&&typeof raw==="object"&&Array.isArray(raw.words)){
    source=raw.words;if(raw.name)name=String(raw.name).trim();
    if(raw.description)description=String(raw.description).trim();
  }else throw new Error('JSON moet een array zijn of een object met een "words"-array.');

  const words=[],warnings=[],errors=[];
  source.forEach((rawWord,index)=>{
    const result=normalizeImportedWord(rawWord,index,name);
    if(result.error)errors.push(result.error);
    else{words.push(result.word);warnings.push(...(result.warnings||[]));}
  });
  if(!words.length)throw new Error(errors[0]||"De woordenlijst bevat geen geldige woorden.");

  const seenPairs=new Set(),seenFrench=new Map(),unique=[];
  let duplicatePairs=0,duplicateFrench=0;
  for(const word of words){
    const frKey=word.fr.toLowerCase().replace(/[’]/g,"'").trim();
    const pairKey=`${frKey}|${word.nl.toLowerCase().trim()}`;
    if(seenPairs.has(pairKey)){duplicatePairs++;continue;}
    seenPairs.add(pairKey);
    if(seenFrench.has(frKey)&&seenFrench.get(frKey)!==word.nl.toLowerCase().trim())duplicateFrench++;
    else seenFrench.set(frKey,word.nl.toLowerCase().trim());
    unique.push(word);
  }

  if(errors.length)warnings.push(`${errors.length} ongeldige rij(en) overgeslagen.`);
  if(duplicatePairs)warnings.push(`${duplicatePairs} exact dubbele rij(en) overgeslagen.`);
  if(duplicateFrench)warnings.push(`${duplicateFrench} Frans(e) woord(en) komt/komen met meerdere hoofdvertalingen voor; controleer of dit bewust is.`);

  return {name,description,words:unique,warnings};
}
function parseWordListText(text,filename){
  const lower=String(filename||"").toLowerCase();
  const name=String(filename||"Nieuwe woordenlijst").replace(/\.[^.]+$/,"").trim();
  if(lower.endsWith(".json")){
    let data;try{data=JSON.parse(text);}catch{throw new Error("Het JSON-bestand bevat ongeldige JSON.");}
    return validateAndBuildImportedList(data,name);
  }
  if(lower.endsWith(".csv")||lower.endsWith(".txt"))return validateAndBuildImportedList(parseCsv(text),name);
  throw new Error("Gebruik een JSON- of CSV-bestand.");
}
function storeImportedList(parsed){
  const lists=readImportedLists();const base=`local-${slugify(parsed.name)}`;
  let id=base,suffix=2;while(lists.some(list=>list.id===id))id=`${base}-${suffix++}`;
  const stored={id,name:parsed.name,description:parsed.description||"",words:parsed.words,importedAt:new Date().toISOString()};
  lists.push(stored);writeImportedLists(lists);return stored;
}
async function importWordListFile(file){
  if(!file)throw new Error("Geen bestand gekozen.");
  if(file.size>2_500_000)throw new Error("Dit bestand is te groot. Houd een woordenlijst onder 2,5 MB.");
  const parsed=parseWordListText(await file.text(),file.name);
  const stored=storeImportedList(parsed);return {list:stored,warnings:parsed.warnings};
}
