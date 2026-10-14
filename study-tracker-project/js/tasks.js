/* ---------- tasks ---------- */
function vTasks(){
  const today=iso(new Date());
  let l=tasks.filter(t=>filter==='all'||(filter==='today'&&t.due_date===today)||(filter==='pending'&&!t.completed)||(filter==='done'&&t.completed));
  const F=[['all','الكل'],['today','النهاردة'],['pending','المتبقية'],['done','المنجزة']];
  return `<h2>مهامي</h2><p class="sub">اكتب اللي عليك وحدد أولويته وموعده.</p>
  <form class="add panel" id="tForm"><input id="tText" placeholder="مثال: حل تمارين الباب الثالث" required><input id="tSub" placeholder="المادة"><select id="tPri"><option value="medium">أولوية متوسطة</option><option value="high">عالية</option><option value="low">منخفضة</option></select><input id="tDue" type="date" value="${today}"><button class="btn">إضافة</button></form>
  <div class="filters">${F.map(([k,n])=>`<button data-f="${k}" class="${filter===k?'on':''}">${n}</button>`).join('')}</div>
  <div class="panel">${l.length?l.map(t=>`<div class="row ${t.completed?'done':''}"><button class="chk ${t.completed?'on':''}" data-tg="${t.id}" aria-label="تم">${t.completed?'✓':''}</button><div class="grow t">${esc(t.text)}<div class="muted">${esc(t.subject)} ${t.due_date?'· '+t.due_date:''}</div></div><span class="tag p-${t.priority}">${PRI[t.priority]}</span><button class="btn ghost sm" data-rm="${t.id}">حذف</button></div>`).join(''):'<p class="muted">لا توجد مهام هنا. أضف أول مهمة من الأعلى.</p>'}</div>`;
}
bind.tasks=()=>{
  $('#tForm').onsubmit=async e=>{e.preventDefault();
    const {data,error}=await db.from('tasks').insert({text:$('#tText').value.trim(),subject:$('#tSub').value.trim(),priority:$('#tPri').value,due_date:$('#tDue').value||null}).select().single();
    if(error)return toast(error.message);tasks.unshift(data);render()};
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{filter=b.dataset.f;render()});
  document.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>toggle(b.dataset.tg));
  document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=async()=>{await db.from('tasks').delete().eq('id',b.dataset.rm);tasks=tasks.filter(t=>t.id!==b.dataset.rm);render()});
};
async function toggle(id){
  const t=tasks.find(x=>x.id===id),c=!t.completed;
  await db.from('tasks').update({completed:c,completed_at:c?new Date().toISOString():null}).eq('id',id);
  t.completed=c;
  if(c){ // تحديث الإنجاز والالتزام اليومي
    const today=iso(new Date()),y=iso(Date.now()-864e5);
    const streak=prof.last_active===today?prof.streak:(prof.last_active===y?(prof.streak||0)+1:1);
    prof={...prof,streak,last_active:today,total_completed:(prof.total_completed||0)+1};
    await db.from('profiles').update({streak,last_active:today,total_completed:prof.total_completed}).eq('id',me.id);
    toast('أحسنت! مهمة منجزة ✓');
  }
  render();
}
