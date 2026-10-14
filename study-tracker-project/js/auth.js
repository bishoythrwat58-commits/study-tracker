/* ---------- auth ---------- */
function setMode(s){signup=s;$('#signFields').classList.toggle('hidden',!s);$('#tLogin').classList.toggle('on',!s);$('#tSign').classList.toggle('on',s);$('#authBtn').textContent=s?'إنشاء الحساب':'دخول';$('#authErr').textContent=''}
$('#tLogin').onclick=()=>setMode(false);$('#tSign').onclick=()=>setMode(true);
$('#authForm').onsubmit=async e=>{
  e.preventDefault();const err=$('#authErr');err.textContent='';
  const email=$('#aEmail').value.trim(),password=$('#aPass').value;
  if(signup){
    const name=$('#aName').value.trim(),pp=$('#aPPhone').value.trim();
    if(!name||!pp){err.textContent='اكتب اسمك ورقم ولي الأمر.';return}
    const {data,error}=await db.auth.signUp({email,password,options:{data:{name,grade:$('#aGrade').value,parent_name:$('#aPName').value.trim(),parent_phone:pp}}});
    if(error){err.textContent=error.message;return}
    if(!data.session){err.textContent='تم إنشاء الحساب. أكّد بريدك من الرسالة اللي وصلتك ثم سجّل دخولك.';return}
  }else{
    const {error}=await db.auth.signInWithPassword({email,password});
    if(error){err.textContent='البريد أو كلمة المرور غير صحيحة.';return}
  }
  boot();
};
$('#logout').onclick=async()=>{await db.auth.signOut();location.reload()};

async function boot(){
  const {data:{session}}=await db.auth.getSession();
  if(!session){$('#auth').classList.remove('hidden');$('#app').classList.add('hidden');return}
  me=session.user;
  const [p,t,b,s,x]=await Promise.all([
    db.from('profiles').select('*').eq('id',me.id).single(),
    db.from('tasks').select('*').order('created_at',{ascending:false}),
    db.from('schedule_blocks').select('*').order('start_time'),
    db.from('focus_sessions').select('*').gte('created_at',new Date(Date.now()-7*864e5).toISOString()),
    db.from('exams').select('*')]);
  prof=p.data||{name:'',streak:0,total_completed:0};tasks=t.data||[];blocks=b.data||[];sessions=s.data||[];exams=x.data||[];
  $('#auth').classList.add('hidden');$('#app').classList.remove('hidden');render(true);
}
