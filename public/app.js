const items=[
['alfabet','Arabisch alfabet','#bde5c2',10.55,27.8,33,27,'ا',['Letters ontdekken','Kijken en herkennen','Samen nazeggen'],'Spelenderwijs kennismaken met de Arabische letters.'],
['quran','Al-Quran','#ffdaa0',89.44,27.8,94,27,'۞',['Korte surahs','Luisteren','Samen herhalen'],'In kleine stukjes luisteren en samen herhalen.'],
['duas','Adʿiya','#d9c8ef',10.55,59.46,33,57,'♡',['Bij het eten','Voor het slapen','Elke dag'],'Korte dua’s voor herkenbare momenten in de dag.'],
['gebed','Het gebed','#ffe38d',89.44,59.46,94,57,'☾',['Wudu','De houdingen','Stap voor stap'],'Samen de eerste stappen van wudu en het gebed ontdekken.'],
['verhalen','Verhalen van de profeten','#a9dafa',10.55,88.55,33,86,'◇',['Luisteren','Samen praten','Wat leren we?'],'Korte verhalen met één mooie les om mee te nemen.'],
['levenslessen','Levenslessen','#f7c1c8',89.44,88.55,94,86,'✿',['Samen delen','Elkaar helpen','Vriendelijk zijn'],'Kleine lessen over goed zijn voor elkaar.']];
items.push(['wudu','Wudu','#afe2e3',0,0,0,0,'◈',[],'De wassing stap voor stap.'],['aqieda','ʿAqieda','#dfd0ed',0,0,0,0,'✧',[],'Samen leren over het geloof.'],['sierah','Sierah','#fca66e',0,0,0,0,'?',[],'Vragen stellen en luisteren.']);
const main=document.querySelector('main');
function render(){const route=location.hash.slice(1);const destinations={gebed:'gebed/',alfabet:'alfabet/',quran:'quran/',duas:'leren/#duas',verhalen:'leren/#profeten',levenslessen:'leren/#levenslessen',wudu:'ontdekken/#wudu',aqieda:'ontdekken/#aqieda',vragen:'ontdekken/#vragen',sierah:'sierah/',installeren:'ontdekken/#installeren'};if(destinations[route]){location.replace(destinations[route]);return;}
main.innerHTML=`<section class="hero home"><h1>Al Himmah Kids</h1><p>Bismillah, laten we beginnen!</p></section><section class="grid" aria-label="Leeronderdelen">${items.map((i,n)=>`<a class="card ${i[0]==='sierah'?'sierah':n>5?'new':''}" href="#${i[0]}" data-card="${i[0]}" aria-label="${i[1]}" style="--color:${i[2]};--col:${n%2};--row:${Math.floor(n/2)};--newrow:${n-6}"><span class="art" aria-hidden="true"></span><span class="label">${i[0]==='levenslessen'?'Levens-<br>lessen':i[1]}</span></a>`).join('')}</section>`;document.title='Al Himmah Kids';}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});render();
