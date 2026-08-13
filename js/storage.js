const KEY="frans-trainer-v1";
function loadState(){
  const defaults={
    direction:"fr-nl",
    wordListId:"basis",
    exerciseMode:"cards",
    category:"all",
    dark:false,
    hardOnly:false,
    difficult:[],
    scores:{},
    sessionSeen:0,
    sessionKnown:0
  };
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||"{}");
    return {...defaults,...saved,sessionSeen:0,sessionKnown:0};
  }catch{
    return defaults;
  }
}
function saveState(state){
  const {sessionSeen,sessionKnown,...persistent}=state;
  localStorage.setItem(KEY,JSON.stringify(persistent));
}
