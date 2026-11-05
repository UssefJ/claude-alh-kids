/* One real audio file per unit. No timing simulation and no skipped missing tracks. */
class SequencePlayer {
 constructor({tracks=[],onIndex=()=>{},onState=()=>{},onError=()=>{},onEnd=()=>{},AudioClass=Audio}={}){Object.assign(this,{tracks,onIndex,onState,onError,onEnd,AudioClass});this.index=-1;this.audio=null;this.playing=false;this.token=0;this.options={};}
 async play(index,options=this.options){this.options=options;const token=++this.token;const src=this.tracks[index];if(!src){this.stop();this.onError('Voor dit onderdeel is nog geen opname toegevoegd.');return}if(index!==this.index||!this.audio){this.audio?.pause();if(this.audio){this.audio.onended=null;this.audio.onerror=null}this.index=index;this.audio=new this.AudioClass(src);this.audio.preload='metadata';this.onIndex(index)}const audio=this.audio;audio.onended=()=>{if(token!==this.token)return;const o=this.options;if(o.single){if(o.repeat){audio.currentTime=0;this.play(index,o)}else this.finish()}else if(index<o.last){this.play(index+1,o)}else if(o.repeat){this.stop();this.play(o.first,o)}else this.finish()};audio.onerror=()=>{if(token===this.token){this.stop();this.onError('De opname kon niet laden. Probeer opnieuw.')}};this.playing=true;this.onState(true);try{await audio.play();if(token!==this.token&&(!this.playing||audio!==this.audio))audio.pause()}catch{if(token===this.token){this.stop();this.onError('De opname kon niet starten. Druk opnieuw op play.')}}}
 pause(){this.token++;this.audio?.pause();this.playing=false;this.onState(false)}
 stop(){this.pause();if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.removeAttribute?.('src');this.audio.load?.()}this.audio=null;this.index=-1}
 finish(){this.pause();if(this.audio)this.audio.currentTime=0;this.onEnd()}
 dispose(){this.stop()}
}
if(typeof window!=='undefined')window.SequencePlayer=SequencePlayer;
if(typeof module!=='undefined')module.exports={SequencePlayer};
