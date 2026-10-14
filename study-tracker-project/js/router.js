/* ---------- navigation ---------- */
document.querySelectorAll('.nav[data-v]').forEach(b=>b.onclick=()=>{
  if(view===b.dataset.v)return;
  const v=$('#view');v.classList.add('leave');          /* تأثير الخروج */
  setTimeout(()=>{view=b.dataset.v;v.classList.remove('leave');render(true)},150);
});
function render(animate=false){
  document.querySelectorAll('.nav[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===view));
  const v=$('#view');v.className='view';if(animate){void v.offsetWidth;v.classList.add('enter')} /* تأثير الدخول يشتغل عند التنقل بس */
  v.innerHTML=userChip()+({home:vHome,schedule:vSchedule,tasks:vTasks,focus:vFocus,report:vReport})[view]();
  bind[view]&&bind[view]();
}
const bind={};


function userChip(){const n=prof.name||(me.user_metadata&&me.user_metadata.name)||'طالب';return `<div class="uchip"><div class="av">${esc(n[0])}</div><div><b>${esc(n)}</b><small>${esc(prof.grade||'')}</small></div></div>`}
