'use strict';
const codes = 'af al dz ad ao ag ar am au at az bs bh bd bb by be bz bj bt bo ba bw br bn bg bf bi cv kh cm ca cf td cl cn co km cg cd cr ci hr cu cy cz dk dj dm do ec eg sv gq er ee sz et fj fi fr ga gm ge de gh gr gd gt gn gw gy ht hn hu is in id ir iq ie il it jm jp jo kz ke ki kp kr kw kg la lv lb ls lr ly li lt lu mg mw my mv ml mt mh mr mu mx fm md mc mn me ma mz mm na nr np nl nz ni ne ng mk no om pk pw pa pg py pe ph pl pt qa ro ru rw kn lc vc ws sm st sa sn rs sc sl sg sk si sb so za ss es lk sd sr se ch sy tj tz th tl tg to tt tn tr tm tv ug ua ae gb us uy uz vu ve vn ye zm zw ps va xk tw'.split(' ');
const variants = {
 cn:['China', 'People’s Republic of China', 'PRC', 'Mainland China', 'China mainland'],
 us:['United States','United States of America','USA','US','America'],gb:['United Kingdom','UK','Britain','Great Britain'],ci:['Ivory Coast','Côte d’Ivoire','Cote d Ivoire'],cd:['Democratic Republic of the Congo','DR Congo','DRC','Congo Kinshasa'],cg:['Republic of the Congo','Congo','Congo Brazzaville'],kr:['South Korea','Republic of Korea'],kp:['North Korea','DPRK'],ru:['Russia','Russian Federation'],cz:['Czechia','Czech Republic'],sz:['Eswatini','Swaziland'],cv:['Cabo Verde','Cape Verde'],mm:['Myanmar','Burma'],tl:['Timor-Leste','East Timor'],va:['Vatican City','Vatican','Holy See'],ps:['Palestine','State of Palestine'],tr:['Turkey','Türkiye'],bs:['Bahamas','The Bahamas'],gm:['Gambia','The Gambia'],mk:['North Macedonia','Macedonia'],fm:['Micronesia','Federated States of Micronesia'],tz:['Tanzania','United Republic of Tanzania'],bn:['Brunei','Brunei Darussalam'],la:['Laos','Lao PDR'],vn:['Vietnam','Viet Nam'],sy:['Syria','Syrian Arab Republic'],ir:['Iran','Islamic Republic of Iran'],bo:['Bolivia'],ve:['Venezuela'],md:['Moldova','Republic of Moldova'],st:['São Tomé and Príncipe','Sao Tome and Principe','Sao Tome Principe'],ae:['United Arab Emirates','UAE'],ba:['Bosnia and Herzegovina','Bosnia Herzegovina','Bosnia'],tt:['Trinidad and Tobago','Trinidad & Tobago'],ag:['Antigua and Barbuda','Antigua & Barbuda'],kn:['Saint Kitts and Nevis','St Kitts and Nevis'],lc:['Saint Lucia','St Lucia'],vc:['Saint Vincent and the Grenadines','St Vincent and the Grenadines']
};
// Fixed English names keep the answer key identical across browsers.
const countryNames = {"af":"Afghanistan","al":"Albania","dz":"Algeria","ad":"Andorra","ao":"Angola","ag":"Antigua & Barbuda","ar":"Argentina","am":"Armenia","au":"Australia","at":"Austria","az":"Azerbaijan","bs":"Bahamas","bh":"Bahrain","bd":"Bangladesh","bb":"Barbados","by":"Belarus","be":"Belgium","bz":"Belize","bj":"Benin","bt":"Bhutan","bo":"Bolivia","ba":"Bosnia & Herzegovina","bw":"Botswana","br":"Brazil","bn":"Brunei","bg":"Bulgaria","bf":"Burkina Faso","bi":"Burundi","cv":"Cape Verde","kh":"Cambodia","cm":"Cameroon","ca":"Canada","cf":"Central African Republic","td":"Chad","cl":"Chile","cn":"China","co":"Colombia","km":"Comoros","cg":"Congo - Brazzaville","cd":"Congo - Kinshasa","cr":"Costa Rica","ci":"Côte d’Ivoire","hr":"Croatia","cu":"Cuba","cy":"Cyprus","cz":"Czechia","dk":"Denmark","dj":"Djibouti","dm":"Dominica","do":"Dominican Republic","ec":"Ecuador","eg":"Egypt","sv":"El Salvador","gq":"Equatorial Guinea","er":"Eritrea","ee":"Estonia","sz":"Eswatini","et":"Ethiopia","fj":"Fiji","fi":"Finland","fr":"France","ga":"Gabon","gm":"Gambia","ge":"Georgia","de":"Germany","gh":"Ghana","gr":"Greece","gd":"Grenada","gt":"Guatemala","gn":"Guinea","gw":"Guinea-Bissau","gy":"Guyana","ht":"Haiti","hn":"Honduras","hu":"Hungary","is":"Iceland","in":"India","id":"Indonesia","ir":"Iran","iq":"Iraq","ie":"Ireland","il":"Israel","it":"Italy","jm":"Jamaica","jp":"Japan","jo":"Jordan","kz":"Kazakhstan","ke":"Kenya","ki":"Kiribati","kp":"North Korea","kr":"South Korea","kw":"Kuwait","kg":"Kyrgyzstan","la":"Laos","lv":"Latvia","lb":"Lebanon","ls":"Lesotho","lr":"Liberia","ly":"Libya","li":"Liechtenstein","lt":"Lithuania","lu":"Luxembourg","mg":"Madagascar","mw":"Malawi","my":"Malaysia","mv":"Maldives","ml":"Mali","mt":"Malta","mh":"Marshall Islands","mr":"Mauritania","mu":"Mauritius","mx":"Mexico","fm":"Micronesia","md":"Moldova","mc":"Monaco","mn":"Mongolia","me":"Montenegro","ma":"Morocco","mz":"Mozambique","mm":"Myanmar (Burma)","na":"Namibia","nr":"Nauru","np":"Nepal","nl":"Netherlands","nz":"New Zealand","ni":"Nicaragua","ne":"Niger","ng":"Nigeria","mk":"North Macedonia","no":"Norway","om":"Oman","pk":"Pakistan","pw":"Palau","pa":"Panama","pg":"Papua New Guinea","py":"Paraguay","pe":"Peru","ph":"Philippines","pl":"Poland","pt":"Portugal","qa":"Qatar","ro":"Romania","ru":"Russia","rw":"Rwanda","kn":"St. Kitts & Nevis","lc":"St. Lucia","vc":"St. Vincent & Grenadines","ws":"Samoa","sm":"San Marino","st":"São Tomé & Príncipe","sa":"Saudi Arabia","sn":"Senegal","rs":"Serbia","sc":"Seychelles","sl":"Sierra Leone","sg":"Singapore","sk":"Slovakia","si":"Slovenia","sb":"Solomon Islands","so":"Somalia","za":"South Africa","ss":"South Sudan","es":"Spain","lk":"Sri Lanka","sd":"Sudan","sr":"Suriname","se":"Sweden","ch":"Switzerland","sy":"Syria","tj":"Tajikistan","tz":"Tanzania","th":"Thailand","tl":"Timor-Leste","tg":"Togo","to":"Tonga","tt":"Trinidad & Tobago","tn":"Tunisia","tr":"Türkiye","tm":"Turkmenistan","tv":"Tuvalu","ug":"Uganda","ua":"Ukraine","ae":"United Arab Emirates","gb":"United Kingdom","us":"United States","uy":"Uruguay","uz":"Uzbekistan","vu":"Vanuatu","ve":"Venezuela","vn":"Vietnam","ye":"Yemen","zm":"Zambia","zw":"Zimbabwe","ps":"Palestinian Territories","va":"Vatican City","xk":"Kosovo","tw":"Taiwan"};
const countries = codes.map(code=>({code,name:(variants[code]||[countryNames[code]])[0],answers:[countryNames[code],...(variants[code]||[])]}));
const normalize = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
const accepts = (country,answer)=>country.answers.some(name=>normalize(name)===normalize(answer));
const $ = id=>document.getElementById(id);
let order=[],correct=new Set(),skipped=new Set(),seen=new Set(),started=0,deadline=0,duration=1200,ticker,active=false;
const elapsed=()=>Math.min(duration||Infinity,Math.max(0,Math.floor((Date.now()-started)/1000)));
const remaining=()=>duration?Math.max(0,Math.ceil((deadline-Date.now())/1000)):Infinity;
const formatTime=seconds=>`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
function focusAnswer(){if(document.activeElement!==$('answer'))$('answer').focus({preventScroll:true});}
function showScreen(id){if(id==='game')window.scrollTo(0,0);document.body.classList.toggle('playing',id==='game');updateViewport();for(const screen of ['welcome','game','results']) $(screen).hidden=screen!==id;}
function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function tick(){if(!active)return;$('clock').textContent=formatTime(duration?remaining():elapsed());if(remaining()===0)finish('timeout');}
function start(){
 clearInterval(ticker);duration=Number($('duration').value)*60;
 if(![0,300,600,1200,1800].includes(duration))duration=1200;
 order=shuffle(countries);correct=new Set();skipped=new Set();seen=new Set();active=true;
 started=Date.now();deadline=started+duration*1000;
 showScreen('game');tick();ticker=setInterval(tick,1000);render();focusAnswer();
}
function loadFlag(){ $('image-error').hidden=true;$('flag').hidden=true;$('flag').src=`https://flagcdn.com/w640/${order[0].code}.png`; }
function render(message=''){
 seen.add(order[0].code);$('progress').textContent=`${order.length} flags left`;
 $('score').textContent=`${correct.size} / ${countries.length} correct`;$('bar').value=correct.size;
 $('answer').value='';$('answer').disabled=false;$('feedback').textContent=message;
 $('feedback').dataset.kind=message?'correct':'';$('next').textContent='Skip flag →';loadFlag();
}
function next(){
 if(!active)return;if(remaining()===0){finish('timeout');return;}
 skipped.add(order[0].code);order.push(order.shift());render();focusAnswer();
}
function finish(reason='giveup'){
 if(!active)return;
 if(remaining()===0)reason='timeout';
 const seconds=elapsed();if($('give-up-dialog').open)$('give-up-dialog').close();active=false;clearInterval(ticker);showScreen('results');
 $('result-label').textContent=reason==='complete'?'ALL FLAGS CORRECT':reason==='timeout'?"TIME’S UP":'ROUND ENDED';
 const percentage=Number((correct.size/countries.length*100).toFixed(1));
 $('result-title').textContent=`${percentage}% correct`;
 $('result-score').textContent=`${correct.size} out of ${countries.length} countries`;
 const unattempted=countries.filter(c=>!seen.has(c.code)).length;
 $('summary').textContent=`Time used: ${formatTime(seconds)} ${duration?`of ${formatTime(duration)}`:"(free play)"} · ${order.length} remaining · ${unattempted} not reached`;
 const missed=countries.filter(c=>!correct.has(c.code));
 $('missed-title').textContent=missed.length?`Countries you missed (${missed.length})`:'A perfect trip around the world!';
 $('missed').replaceChildren();
 for(const c of missed){
  const row=document.createElement('div');row.className='missed-row';
  const img=document.createElement('img');img.src=`https://flagcdn.com/w80/${c.code}.png`;img.alt=`Flag of ${c.name}`;img.loading='lazy';
  const name=document.createElement('strong');name.textContent=c.name;
  const status=document.createElement('span');status.textContent=skipped.has(c.code)?'Skipped':seen.has(c.code)?'Unanswered':'Not reached';
  row.append(img,name,status);$('missed').append(row);
 }
 $('again').focus();
}
function checkAnswer(event){
 if(event?.isComposing || !active)return;
 if(remaining()===0){finish('timeout');return;}
 if(!accepts(order[0],$('answer').value))return;
 const country=order.shift();correct.add(country.code);skipped.delete(country.code);
 if(!order.length)finish('complete');else render(`Correct! ${country.name}.`);
}
// Let the native keyboard finish its edit before clearing the field or changing flags.
let answerTimer=null,composing=false;
function scheduleAnswer(event){
 clearTimeout(answerTimer);
 if(composing||event?.isComposing||!active)return;
 answerTimer=setTimeout(()=>{answerTimer=null;if(!composing)checkAnswer();},0);
}
$('answer').addEventListener('compositionstart',()=>{composing=true;clearTimeout(answerTimer);});
$('answer').addEventListener('compositionend',()=>{composing=false;scheduleAnswer();});
$('answer').addEventListener('input',scheduleAnswer);
$('answer-form').addEventListener('submit',event=>{event.preventDefault();scheduleAnswer();});
let viewportFrame=null,lastViewportHeight=0;
function updateViewport(){
 if(viewportFrame!==null)return;
 viewportFrame=requestAnimationFrame(()=>{
  viewportFrame=null;
  const height=Math.round(window.visualViewport?.height||window.innerHeight);
  if(height===lastViewportHeight)return;
  lastViewportHeight=height;
  document.documentElement.style.setProperty('--quiz-height',`${height}px`);
 });
}
window.visualViewport?.addEventListener('resize',updateViewport);
window.addEventListener('resize',updateViewport);
updateViewport();
$('flag').addEventListener('load',()=>{$('flag').hidden=false;});
$('flag').addEventListener('error',()=>{$('flag').hidden=true;$('image-error').hidden=false;});
$('start').addEventListener('click',start);$('again').addEventListener('click',()=>{showScreen('welcome');$('duration').focus();});$('next').addEventListener('click',next);$('finish').addEventListener('click',()=>{if(active){$('give-up-dialog').showModal();}});$('retry').addEventListener('click',loadFlag);

document.addEventListener('visibilitychange',tick);
window.addEventListener('pageshow',tick);

$('keep-playing').addEventListener('click',()=>{ $('give-up-dialog').close();if(active)focusAnswer(); });
$('confirm-give-up').addEventListener('click',()=>finish('giveup'));
$('give-up-dialog').addEventListener('cancel',()=>{if(active)requestAnimationFrame(focusAnswer);});
