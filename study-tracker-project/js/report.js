/* ---------- parent report ---------- */
function reportText(){
  const wk=iso(Date.now()-7*864e5),wm=Object.values(weekMinutes()).reduce((a,b)=>a+b,0);
  const done=tasks.filter(t=>t.completed&&(t.completed_at||'')>=wk).length,pend=tasks.filter(t=>!t.completed).length;
  return `السلام عليكم ${prof.parent_name||''}،\nتقرير ${prof.name} الأسبوعي:\n✅ مهام منجزة هذا الأسبوع: ${done}\n⏳ مهام متبقية: ${pend}\n⏱️ دقائق التركيز: ${wm}\n🔥 أيام الالتزام المتتالية: ${prof.streak||0}\nمع تحياتي من تطبيق مذاكرتي.`;
}
function vReport(){
  return `<h2>تقرير ولي الأمر</h2><p class="sub">ملخص أسبوعك جاهز تبعته على واتساب بضغطة.</p>
  <div class="panel"><pre style="white-space:pre-wrap;font:inherit;line-height:1.9">${esc(reportText())}</pre><button class="btn" id="wa" style="margin-top:14px">إرسال على واتساب</button>
  <p class="muted" style="margin-top:10px">الرقم المسجّل: <span dir="ltr">${esc(prof.parent_phone||'غير مسجل')}</span></p></div>`;
}
bind.report=()=>{$('#wa').onclick=()=>{
  let p=(prof.parent_phone||'').replace(/\D/g,'');if(p.startsWith('0'))p='2'+p;
  if(!p)return toast('رقم ولي الأمر غير مسجل');
  window.open('https://wa.me/'+p+'?text='+encodeURIComponent(reportText()),'_blank')}};
