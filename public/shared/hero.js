/* Al Himmah Kids 1.6 — wolkenkop die meegroeit met de tekst.
   Zet de tekst van elke <section class="hero"> in een eigen wolkvlak (.cloud).
   De wolk zelf wordt met CSS als 9-vlaks-afbeelding getekend (shared/banner.css):
   de maan en de blauwe wolken houden hun vorm, alleen het witte midden rekt mee. */
(function(){
  'use strict';
  function upgrade(hero){
    if(hero.dataset.cloud)return;hero.dataset.cloud='1';
    const back=hero.querySelector(':scope > .back');
    const cloud=document.createElement('div');cloud.className='cloud';
    for(const n of [...hero.childNodes])if(n!==back)cloud.appendChild(n);
    hero.appendChild(cloud);hero.classList.add('has-cloud');
  }
  function scan(node){
    if(node.nodeType!==1)return;
    if(node.matches('section.hero'))upgrade(node);
    node.querySelectorAll('section.hero').forEach(upgrade);
  }
  new MutationObserver(list=>{for(const m of list)m.addedNodes.forEach(scan)}).observe(document.documentElement,{childList:true,subtree:true});
  if(document.body)scan(document.body);
  document.addEventListener('DOMContentLoaded',()=>scan(document.body));
})();
