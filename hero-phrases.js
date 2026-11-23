(() => {
 const box=document.querySelector('.hero-rotator');if(!box)return;
 const layers=[...box.querySelectorAll('.hero-phrase')];
  let index=0,timer=null,cleanup=null,visible=true;
 function fit(){box.style.fontSize='';const base=parseFloat(getComputedStyle(box).fontSize);const width=box.clientWidth;const max=Math.max(...[...box.querySelectorAll('.phrase-line')].map(line=>line.scrollWidth));if(max>width-8)box.style.fontSize=(base*(width-8)/max)+'px'}
 let lastWidth=0;if('ResizeObserver' in window)new ResizeObserver(()=>{if(box.clientWidth!==lastWidth){lastWidth=box.clientWidth;fit()}}).observe(box);
 document.fonts.ready.then(fit);addEventListener('resize',fit);fit();
 const motion=matchMedia('(prefers-reduced-motion:reduce)');
 function schedule(){clearTimeout(timer);timer=null;if(document.hidden||!visible||motion.matches)return;timer=setTimeout(change,5000+Math.random()*2000)}
 function change(){
  const previous=layers[index];previous.classList.add('is-leaving');previous.classList.remove('is-active');previous.setAttribute('aria-hidden','true');
  index=(index+1)%layers.length;const next=layers[index];next.classList.remove('is-leaving');next.classList.add('is-active');next.setAttribute('aria-hidden','false');
  clearTimeout(cleanup);cleanup=setTimeout(()=>layers.forEach(layer=>layer.classList.remove('is-leaving')),700);schedule();
 }
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()}).observe(box);
 document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',schedule);schedule();
})();

