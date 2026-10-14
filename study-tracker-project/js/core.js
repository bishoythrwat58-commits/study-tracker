const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAYS=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
const COLORS=['#2dd4bf','#fbbf24','#a5b4fc','#f9a8d4','#86efac','#fdba74'];
const PRI={high:'عالية',medium:'متوسطة',low:'منخفضة'};
let me=null,prof=null,tasks=[],blocks=[],sessions=[],exams=[],view='home',filter='all',signup=false;
const dayIdx=d=>(d.getDay()+1)%7; // السبت=0
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const hm=t=>t.slice(0,5);
const toast=m=>{const e=document.createElement('div');e.className='toast';e.textContent=m;document.body.append(e);setTimeout(()=>e.remove(),2400)};
