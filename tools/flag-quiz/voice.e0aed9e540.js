'use strict';
(() => {
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const button=$('voice-toggle'),status=$('voice-status');
 let enabled=false,recognizer=null,generation=0,restartTimer=null;
 const consumed=new Map(),latest=new Map();
 const canListen=()=>enabled&&active&&!document.hidden&&!$('give-up-dialog').open;
 function pause(){
  generation++;clearTimeout(restartTimer);
  const previous=recognizer;recognizer=null;
  if(previous){try{previous.abort();}catch{}}
 }
 function stop(message=''){
  enabled=false;pause();button.textContent='🎙 Speak';button.setAttribute('aria-pressed','false');status.textContent=message;
 }
 function reset(){
  if(!canListen())return;
  for(const [index,text] of latest)consumed.set(index,normalize(text));
  $('answer').blur();$('answer').value='';
  status.textContent='Listening — say the next country';
  if(!recognizer){clearTimeout(restartTimer);listen(generation);}
 }
 function listen(currentGeneration){
  if(currentGeneration!==generation||!canListen())return;
  consumed.clear();latest.clear();
  const session=new Recognition();recognizer=session;
  session.lang='en-US';session.continuous=true;session.interimResults=true;session.maxAlternatives=3;
  const isCurrent=()=>currentGeneration===generation&&recognizer===session&&canListen();
  session.onstart=()=>{if(isCurrent())status.textContent='Listening — say a country';};
  session.onresult=event=>{
   if(!isCurrent())return;
   for(let i=event.resultIndex;i<event.results.length;i++){
    if(!isCurrent())return;
    const result=event.results[i];
    latest.set(i,result[0].transcript);
    const prefix=consumed.get(i)||'';
    let answer='';
    for(let j=0;j<result.length;j++){
     const transcript=result[j].transcript.trim(),normalized=normalize(transcript);
     // Already-used speech may be finalized or extended after we advance.
     if(prefix&&!normalized.startsWith(prefix))continue;
     const candidate=prefix?normalized.slice(prefix.length):transcript;
     if(candidate&&accepts(order[0],candidate)){answer=candidate;break;}
    }
    if(answer){
     consumed.set(i,normalize(result[0].transcript));
     $('answer').value=answer;checkAnswer();return;
    }
    const normalized=normalize(result[0].transcript);
    const pending=prefix?(normalized.startsWith(prefix)?normalized.slice(prefix.length):''):result[0].transcript.trim();
    if(pending)$('answer').value=pending;
    if(result.isFinal&&pending){
     consumed.set(i,normalized);
     status.textContent=`Heard “${pending}”. Try again.`;
    }
   }
  };
  session.onerror=event=>{
   if(!isCurrent())return;
   if(event.error==='no-speech')return;
   const message=['not-allowed','service-not-allowed'].includes(event.error)?'Microphone access was denied. Allow it in your browser to use voice.':event.error==='audio-capture'?'No microphone available. You can still type.':'Voice stopped. Tap Speak to try again.';
   stop(message);
  };
  session.onend=()=>{
   if(!isCurrent())return;
   recognizer=null;
   restartTimer=setTimeout(()=>listen(currentGeneration),100);
  };
  try{session.start();}catch{stop('Tap Speak to start listening again.');}
 }
 window.quizVoice={get enabled(){return enabled;},reset,pause,stop};
 if(!Recognition){button.disabled=true;status.textContent='Voice isn’t supported in this browser. Try Safari or Chrome.';return;}
 button.addEventListener('click',()=>{
  if(enabled){stop();$('answer').focus();return;}
  if(!active)return;
  enabled=true;button.textContent='■ Voice off';button.setAttribute('aria-pressed','true');
  $('answer').blur();$('answer').value='';pause();listen(generation);
 });
 $('answer').addEventListener('focus',()=>{if(enabled)stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();
