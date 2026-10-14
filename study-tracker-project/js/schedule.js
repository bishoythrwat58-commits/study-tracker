/* ---------- schedule ---------- */
function vSchedule(){
  const td=dayIdx(new Date());
  return `<h2>جدولي الأسبوعي</h2><p class="sub">اعمل حصصك ومواعيد مذاكرتك بنفسك.</p>
  <button class="btn" id="addBlk" style="margin-bottom:14px">+ إضافة موعد</button>
  <div class="week">${DAYS.map((d,i)=>`<div class="day ${i===td?'today':''}"><h4>${d}</h4>${blocks.filter(b=>b.day===i).map(b=>`<div class="blk" style="background:${b.color}"><button data-del="${b.id}" aria-label="حذف">×</button>${esc(b.subject)}<small>${hm(b.start_time)} – ${hm(b.end_time)}</small>${b.note?`<small>${esc(b.note)}</small>`:''}</div>`).join('')||'<span class="muted">فاضي</span>'}</div>`).join('')}</div>`;
}
bind.schedule=()=>{
  $('#addBlk').onclick=()=>{
    const m=document.createElement('div');m.className='modal';
    m.innerHTML=`<form class="card"><h3>موعد جديد</h3>
     <label>المادة / النشاط</label><input id="bS" required>
     <label>اليوم</label><select id="bD">${DAYS.map((d,i)=>`<option value="${i}" ${i===dayIdx(new Date())?'selected':''}>${d}</option>`).join('')}</select>
     <div class="g2"><div><label>من</label><input id="bF" type="time" value="16:00" required></div><div><label>إلى</label><input id="bT" type="time" value="17:00" required></div></div>
     <label>ملاحظة (اختياري)</label><input id="bN">
     <label>اللون</label><select id="bC">${COLORS.map(c=>`<option value="${c}" style="background:${c};color:#000">${c}</option>`).join('')}</select>
     <div class="err" id="bE"></div>
     <div style="display:flex;gap:8px;margin-top:12px"><button class="btn">حفظ</button><button type="button" class="btn ghost" id="bX">إلغاء</button></div></form>`;
    document.body.append(m);$('#bX').onclick=()=>m.remove();
    m.querySelector('form').onsubmit=async e=>{e.preventDefault();
      if($('#bT').value<=$('#bF').value){$('#bE').textContent='وقت النهاية لازم يكون بعد البداية.';return}
      const {data,error}=await db.from('schedule_blocks').insert({day:+$('#bD').value,start_time:$('#bF').value,end_time:$('#bT').value,subject:$('#bS').value.trim(),note:$('#bN').value.trim(),color:$('#bC').value}).select().single();
      if(error){$('#bE').textContent=error.message;return}
      blocks.push(data);blocks.sort((a,b)=>a.start_time.localeCompare(b.start_time));m.remove();render();toast('تمت الإضافة')};
  };
  document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{await db.from('schedule_blocks').delete().eq('id',b.dataset.del);blocks=blocks.filter(x=>x.id!==b.dataset.del);render()});
};
