/* A single recording with non-destructive ayah boundaries. */
function markerErrors(recording,count){
 const errors=[];if(!recording?.audio)return errors;
 const m=recording.marks||[],duration=recording.duration;
 if(!Number.isFinite(duration)||duration<=0)errors.push('De opnameduur ontbreekt.');
 if(m.length!==count)errors.push('Het aantal markeringen moet gelijk zijn aan het aantal ayat.');
 m.forEach((x,i)=>{const next=m[i+1]?.start??duration;if(!Number.isFinite(x.start)||x.start<0||x.start>=duration||(i>0&&x.start<=m[i-1].start))errors.push(`Controleer de begintijd van ayah ${i+1}.`);if(x.end!=null&&(!Number.isFinite(x.end)||x.end<=x.start||x.end>next||x.end>duration))errors.push(`De eindtijd van ayah ${i+1} moet na het begin en vóór de volgende ayah liggen.`)});
 return errors;
}
class MarkedPlayer {
 constructor({onIndex=()=>{},onState=()=>{},onError=()=>{},onEnd=()=>{},AudioClass=Audio,setTimer=(fn,ms)=>setTimeout(fn,ms),clearTimer=id=>clearTimeout(id)}={}){Object.assign(this,{onIndex,onState,onError,onEnd,AudioClass,setTimer,clearTimer});this.audio=null;this.playing=false;this.token=0;this.timer=null;this.options={};this.signature='';}
 async play(src,recording,index,options){
  const errors=markerErrors(recording,recording?.marks?.length||0);if(!src||errors.length||!recording?.marks?.length){this.stop();this.onError(errors[0]||'Voor deze luisteroptie is nog geen volledige opname ingesteld.');return}
  const signature=JSON.stringify([src,options.first,options.last,!!options.single,!!options.full]);const resume=signature===this.signature&&this.audio&&this.audio.currentTime>=this.begin&&this.audio.currentTime<this.end;
  this.pause();const token=++this.token;this.options=options;this.recording=recording;this.signature=signature;this.index=index;
  this.begin=options.full?0:recording.marks[options.first].start;this.end=options.full?recording.duration:(recording.marks[options.last].end??recording.marks[options.last+1]?.start??recording.duration);
  if(this.src!==src||!this.audio){if(this.audio){this.audio.removeAttribute('src');this.audio.load()}this.audio=new this.AudioClass(src);this.audio.preload='metadata';this.src=src}
  const a=this.audio;a.onended=()=>{if(token===this.token)this.boundary()};a.onerror=()=>{if(token===this.token){this.stop();this.onError('De opname kan niet laden. Probeer opnieuw.')}};
  try{
   if(a.readyState<1)await new Promise((resolve,reject)=>{const timer=this.setTimer(()=>{a.onloadedmetadata=null;reject(Error('timeout'))},15000);a.onloadedmetadata=()=>{this.clearTimer(timer);a.onloadedmetadata=null;resolve()};a.onerror=()=>{this.clearTimer(timer);reject(Error('audio'))}});
   if(token!==this.token)return;
   if(this.end>a.duration+0.1)throw Error('markeringen');
   if(!resume)a.currentTime=options.full&&index===options.first?0:recording.marks[index].start;
   a.onerror=()=>{if(token===this.token){this.stop();this.onError('De opname kan niet laden. Probeer opnieuw.')}};
   this.playing=true;this.onState(true);this.onIndex(index);await a.play();
   if(token!==this.token){if(!this.playing||a!==this.audio)a.pause();return}this.tick();
  }catch{if(token===this.token){this.stop();this.onError('Afspelen lukt niet. Controleer de opname en tijdmarkeringen.')}}
 }
 tick(){if(!this.playing)return;const t=this.audio.currentTime;if(t>=this.end){this.boundary();return}let index=this.options.first;for(let i=index;i<=this.options.last;i++)if(t>=this.recording.marks[i].start)index=i;if(index!==this.index){this.index=index;this.onIndex(index)}this.timer=this.setTimer(()=>this.tick(),Math.min(20,Math.max(1,(this.end-t)*1000)))}
 boundary(){if(!this.playing)return;const again=this.options.repeat,options={...this.options},src=this.src,r=this.recording;this.pause();this.audio.currentTime=this.end;if(again){this.signature='';this.play(src,r,options.first,options)}else{this.signature='';this.onEnd()}}
 pause(){this.token++;this.clearTimer(this.timer);this.timer=null;this.audio?.pause();this.playing=false;this.onState(false)}
 stop(){this.pause();this.signature='';if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.onloadedmetadata=null;this.audio.removeAttribute('src');this.audio.load()}this.audio=null;this.src=''}
 dispose(){this.stop()}
}
if(typeof window!=='undefined'){window.MarkedPlayer=MarkedPlayer;window.markerErrors=markerErrors}
if(typeof module!=='undefined')module.exports={MarkedPlayer,markerErrors};
