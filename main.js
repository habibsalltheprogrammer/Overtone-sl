(()=>{'use strict';
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
// Year, sticky shadow, back to top
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const hdr=$('.site-header'),top=$('.totop');
const onScroll=()=>{hdr.classList.toggle('stuck',scrollY>8);top.classList.toggle('show',scrollY>600)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
top.addEventListener('click',()=>scrollTo({top:0}));
// Mobile menu
const tg=$('.nav-toggle'),nav=$('#site-nav');
const setNav=o=>{nav.classList.toggle('open',o);tg.setAttribute('aria-expanded',o);tg.textContent=o?'Close':'Menu'};
tg.addEventListener('click',()=>setNav(!nav.classList.contains('open')));
addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setNav(false);tg.focus()}});
addEventListener('resize',()=>{if(innerWidth>1100)setNav(false)});
// Gallery filter + lightbox
const gal=$('.gallery');
if(gal){const items=$$('.g-item',gal),empty=$('#gallery-empty'),dlg=$('#lightbox');let cur=[],i=0,opener;
 $$('.filters button').forEach(b=>b.addEventListener('click',()=>{$$('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const c=b.dataset.cat;let n=0;items.forEach(it=>{const s=c==='all'||it.dataset.cat===c;it.hidden=!s;if(s)n++});empty.hidden=n>0;
  $('#filter-live').textContent=n+(n===1?' photo shown':' photos shown')}));
 const show=()=>{const it=cur[i];$('img',dlg).src=it.dataset.full;$('img',dlg).alt=it.dataset.alt;$('#lb-cap').textContent=it.dataset.caption};
 const step=d=>{i=(i+d+cur.length)%cur.length;show()};
 items.forEach(it=>{const b=$('button',it);if(!b)return;b.addEventListener('click',()=>{opener=b;cur=items.filter(x=>!x.hidden&&$('button',x));i=cur.indexOf(it);show();dlg.showModal()})});
 $('#lb-prev').onclick=()=>step(-1);$('#lb-next').onclick=()=>step(1);$('#lb-close').onclick=()=>dlg.close();
 dlg.addEventListener('close',()=>opener&&opener.focus());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
 dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
 $$('.g-item img').forEach(im=>im.addEventListener('error',()=>{im.closest('.g-item').hidden=true}));}
// Forms: validation + honest submission states
$$('form[data-form]').forEach(f=>{
 const pre=new URLSearchParams(location.search).get('interest'),sel=$('select',f);if(pre&&sel)sel.value=pre;
 const status=$('.status',f),rules={name:v=>v.trim().length<2&&'Enter your full name.',email:v=>!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())&&'Enter a valid email address, like name@example.com.',
 phone:v=>v&&!/^\+?[0-9\s()-]{7,18}$/.test(v.trim())&&'Enter a valid phone number, or leave this blank.',interest:v=>!v&&'Choose an area of interest.',message:v=>v.trim().length<10&&'Write a message of at least 10 characters.'};
 const check=el=>{const m=rules[el.name]&&rules[el.name](el.value),e=$('#'+el.id+'-err');el.setAttribute('aria-invalid',!!m);e.textContent=m||'';return !m};
 $$('input,select,textarea',f).forEach(el=>{if(rules[el.name])el.addEventListener('blur',()=>check(el))});
 f.addEventListener('submit',async ev=>{ev.preventDefault();status.className='status';status.textContent='';
  if($('.hp',f).value)return;
  const bad=$$('input,select,textarea',f).filter(el=>rules[el.name]&&!check(el));
  if(bad.length){status.className='status bad';status.textContent='Please fix '+bad.length+(bad.length>1?' fields':' field')+' marked below.';bad[0].focus();return}
  const url=f.dataset.endpoint;
  if(!url){status.className='status info';status.textContent='Your message has not been sent. This form is not connected to a submission service yet. Please call +232 77 405 407 or +232 90 773 828 instead.';return}
  try{const r=await fetch(url,{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});
   if(!r.ok)throw 0;f.reset();status.className='status ok';status.textContent='Thank you. Your message has been sent to Overtone Sierra Leone.'}
  catch{status.className='status bad';status.textContent='Your message could not be sent. Please try again, or call +232 77 405 407.'}})});
})();
