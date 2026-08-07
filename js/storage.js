const KEY="frans-trainer-v1";
function loadState(){
  const defaults={
    direction:"fr-nl",
    wordListId:"basis",
    exerciseMode:"cards",
    dark:false,
    hardOnly:false,
    difficult:[],
    scores:{},
    sessionSeen:0,
    sessionKnown:0
  };
  try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}
  catch{return defaults}
}
function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}
