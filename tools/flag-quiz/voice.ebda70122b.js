'use strict';
(() => {
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const button=$('voice-toggle'),status=$('voice-status');
 let enabled=false,recognizer=null,generation=0,restartTimer=null;
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
  pause();if(!canListen())return;
  $('answer').blur();$('answer').value='';status.textContent='Getting ready…';
  const currentGeneration=generation;
  restartTimer=setTimeout(()=>listen(currentGeneration),200);
 }
 function listen(currentGeneration){
  if(currentGeneration!==generation||!canListen())return;
  const countryCode=order[0].code;
  const session=new Recognition();recognizer=session;
  session.lang='en-US';session.continuous=false;session.interimResults=true;session.maxAlternatives=3;
  const isCurrent=()=>currentGeneration===generation&&canListen()&&order[0]?.code===countryCode;
  session.onstart=()=>{if(isCurrent())status.textContent='Listening — say a country';};
  session.onresult=event=>{
   if(!isCurrent())return;
   for(let i=event.resultIndex;i<event.results.length;i++){
    const result=event.results[i];
    $('answer').value=result[0].transcript.trim();
    if(!result.isFinal)continue;
    let answer=result[0].transcript.trim();
    for(let j=0;j<result.length;j++)if(accepts(order[0],result[j].transcript)){answer=result[j].transcript;break;}
    $('answer').value=answer;
    if(accepts(order[0],answer)){checkAnswer();return;}
    status.textContent=`Heard “${answer}”. Try again.`;
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
   restartTimer=setTimeout(()=>listen(currentGeneration),250);
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
