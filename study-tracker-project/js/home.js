/* الصفحة الرئيسية */
function weekMinutes(){const o={};sessions.forEach(s=>{const k=iso(s.created_at);o[k]=(o[k]||0)+s.minutes});return o}
function lineChart(vals){
  const W=560,H=200,L=34,R=14,T=14,B=14,mx=Math.max(1,Math.ceil(Math.max(...vals)));
  const X=i=>L+i*(W-L-R)/6,Y=v=>T+(1-v/mx)*(H-T-B);
  const pts=vals.map((v,i)=>[X(i),Y(v)]);
  let d=`M${pts[0][0]},${pts[0][1]}`;
  for(let i=1;i<7;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],c=(x0+x1)/2;d+=` C${c},${y0} ${c},${y1} ${x1},${y1}`}
  const grid=[0,1,2,3,4].map(k=>{const v=mx*k/4,y=Y(v);return `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.07)"/><text x="${L-8}" y="${y+4}" text-anchor="end" fill="#8587a8" font-size="11">${+v.toFixed(1)}</text>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="ساعات المذاكرة"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00e5ff" stop-opacity=".3"/><stop offset="1" stop-color="#00e5ff" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${d} L${pts[6][0]},${H-B} L${pts[0][0]},${H-B}Z" fill="url(#lg)"/><path class="ln" pathLength="1" d="${d}" fill="none" stroke="#00e5ff" stroke-width="3.5" stroke-linecap="round"/>${pts.map(q=>`<circle class="pt" cx="${q[0]}" cy="${q[1]}" r="5" fill="#00e5ff"/>`).join('')}</svg>`;
}
function vHome(){
  const today=iso(new Date());
  const tt=tasks.filter(t=>!t.due_date||t.due_date===today),dn=tt.filter(t=>t.completed).length;
  const wm=weekMinutes(),days=[...Array(7)].map((_,i)=>new Date(Date.now()-(6-i)*864e5));
  const hrs=days.map(d=>+((wm[iso(d)]||0)/60).toFixed(2)),tot=hrs.reduce((a,b)=>a+b,0).toFixed(1);
  const ex=exams.filter(e=>e.exam_date>=today).sort((a,b)=>a.exam_date.localeCompare(b.exam_date));
  return `<h2>لوحة التحكم اليومية 🚀</h2><p class="sub">جاهز للتفوق وإنجاز أهداف اليوم؟</p>
  <div class="grid g-a">${timerCard()}
   <div class="card2"><div class="ch"><h3><i>✔</i> مهام اليوم</h3><span>${dn}/${tt.length} مكتمل</span></div>
    <form class="qa" id="qa"><input id="qaT" placeholder="اكتب المهمة الجديدة هنا..." required><button class="btn" aria-label="إضافة">+</button></form>
    ${tt.length?tt.slice(0,6).map(t=>`<div class="row ${t.completed?'done':''}"><button class="chk ${t.completed?'on':''}" data-tg="${t.id}" aria-label="تم">${t.completed?'✓':''}</button><div class="grow t">${esc(t.text)}<div class="muted">${esc(t.subject)}</div></div><span class="tag p-${t.priority}">${PRI[t.priority]}</span></div>`).join(''):'<p class="empty">لا توجد مهام مضافة اليوم.</p>'}</div></div>
  <div class="grid g-b"><div class="card2"><div class="ch"><h3><i>📈</i> ساعات المذاكرة الأسبوعية</h3><span style="color:var(--ac)">المجموع: ${tot} ساعة</span></div>${lineChart(hrs)}<div class="xl">${days.map(d=>`<span>${DAYS[dayIdx(d)]}</span>`).join('')}</div></div>
   <div class="card2"><div class="ch"><h3><i style="color:var(--bad)">⏳</i> الاختبارات القادمة</h3></div>
    ${ex.length?ex.map(e=>{const n=Math.ceil((new Date(e.exam_date)-new Date(today))/864e5);return `<div class="exam"><div class="grow">${esc(e.title)}<div class="muted">${e.exam_date}</div></div><span class="cd ${n>7?'ok':''}">${n===0?'النهاردة':'باقي '+n+' أيام'}</span><button class="btn ghost sm" data-ex="${e.id}" aria-label="حذف">×</button></div>`}).join(''):'<p class="empty">مفيش اختبارات مسجلة.</p>'}
    <form class="mf" id="exForm"><input id="exT" placeholder="اسم الاختبار" required><input id="exD" type="date" required><button class="btn sm">إضافة</button></form></div></div>`;
}
bind.home=()=>{
  bindTimer();
  $('#qa').onsubmit=async e=>{e.preventDefault();
    const {data,error}=await db.from('tasks').insert({text:$('#qaT').value.trim(),due_date:iso(new Date())}).select().single();
    if(error)return toast(error.message);tasks.unshift(data);render()};
  document.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>toggle(b.dataset.tg));
  $('#exForm').onsubmit=async e=>{e.preventDefault();
    const {data,error}=await db.from('exams').insert({title:$('#exT').value.trim(),exam_date:$('#exD').value}).select().single();
    if(error)return toast('شغّل كود جدول الامتحانات في Supabase أولاً');exams.push(data);render()};
  document.querySelectorAll('[data-ex]').forEach(b=>b.onclick=async()=>{await db.from('exams').delete().eq('id',b.dataset.ex);exams=exams.filter(x=>x.id!==b.dataset.ex);render()});
};
