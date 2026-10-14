/* مؤقت التركيز (بومودورو) */
let tm={len:25,left:25*60,run:false,iv:null};
function timerCard(){
  return `<div class="card2 timer"><div class="ch"><h3><i style="color:var(--pk)">⏱</i> مؤقت التركيز (بومودورو)</h3></div>
  <div class="chips">${[15,25,45,60].map(m=>`<button data-len="${m}" class="${tm.len===m?'on':''}">${m}د</button>`).join('')}</div>
  <svg class="ring" viewBox="0 0 120 120" role="timer"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b7cf6"/><stop offset="1" stop-color="#e58bf5"/></linearGradient></defs><circle cx="60" cy="60" r="52" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)" stroke-width="8"/><circle id="arc" cx="60" cy="60" r="52" fill="none" stroke="url(#tg)" stroke-width="8" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="326.7"/><text id="tt" class="tt" x="60" y="64" text-anchor="middle"></text><text class="ts" x="60" y="80" text-anchor="middle">جلسة مذاكرة</text></svg>
  <div class="tb"><button class="btn" id="tgo"></button><button class="btn out" id="trs">↻ إعادة</button></div></div>`;
}
function tick(){const e=$('#tt');if(!e)return;const m=String(Math.floor(tm.left/60)).padStart(2,'0'),s=String(tm.left%60).padStart(2,'0');e.textContent=m+':'+s;$('#arc').style.strokeDashoffset=326.7*(1-tm.left/(tm.len*60));$('#tgo').textContent=tm.run?'⏸ إيقاف':'▶ ابدأ'}
function bindTimer(){tick();
  document.querySelectorAll('[data-len]').forEach(b=>b.onclick=()=>{clearInterval(tm.iv);tm={len:+b.dataset.len,left:+b.dataset.len*60,run:false};render()});
  $('#trs').onclick=()=>{clearInterval(tm.iv);tm={len:tm.len,left:tm.len*60,run:false};tick()};
  $('#tgo').onclick=()=>{
    if(tm.run){clearInterval(tm.iv);tm.run=false;return tick()}
    tm.run=true;tm.iv=setInterval(async()=>{tm.left--;tick();
      if(tm.left<=0){clearInterval(tm.iv);tm.run=false;const mins=tm.len;tm.left=mins*60;
        const {data}=await db.from('focus_sessions').insert({minutes:mins}).select().single();if(data)sessions.push(data);toast('جلسة تركيز مكتملة: '+mins+' دقيقة 🎉');tick()}},1000);tick()};
}
function vFocus(){return `<h2>مؤقت التركيز</h2><p class="sub">ذاكر بتركيز كامل، وكل جلسة بتتسجل في تقريرك.</p><div style="max-width:460px">${timerCard()}</div>`}
bind.focus=bindTimer;
