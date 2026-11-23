// Reveal lower-page content as it enters the viewport; no-JS stays fully visible.
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
const revealTargets=[...document.querySelectorAll('.section-intro,.service-row,.steps-content,.steps-photo,.experience,.casco-callout,.amiabila,.contact h2,.contact-bottom,footer')];
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}})},{rootMargin:'0px 0px -35px 0px',threshold:.06});
 revealTargets.forEach((el,i)=>{el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',(el.matches('.service-row')?i%3*65:0)+'ms');revealObserver.observe(el)});
 document.addEventListener('focusin',e=>e.target.closest('.scroll-reveal')?.classList.add('is-revealed'));
}

// Year counts down once, when visible. The accessible heading always says 2008.
const year=document.querySelector('.year-count');
let yearStarted=false,yearFrame=0;
function finishYear(){cancelAnimationFrame(yearFrame);year.textContent='2008';year.dataset.state='complete'}
function startYear(){
 if(yearStarted)return;yearStarted=true;
 if(reducedMotion.matches){finishYear();return}
 const currentYear=Math.max(2008,Number(new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Europe/Bucharest'}).format(new Date())));
 year.textContent=String(currentYear);year.dataset.state='running';let started=null;
 function tick(now){if(started===null)started=now;const progress=Math.min(1,(now-started)/2700);year.textContent=String(currentYear-Math.floor(progress*(currentYear-2008)));if(progress<1)yearFrame=requestAnimationFrame(tick);else finishYear()}
 yearFrame=requestAnimationFrame(tick);
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){startYear();observer.disconnect()}},{threshold:.5});observer.observe(year)}else startYear();
// Blue Motion-style seamless horizontal strip with reading/touch pauses.
const reviewSection=document.querySelector('.testimonials');
const reviewWindow=document.querySelector('.review-window');
const reviewDialog=document.querySelector('.review-dialog');
const pool=JSON.parse(document.getElementById('review-data').textContent);
let dialogOpener=null,touchTimer=null;
function syncReviewPage(){reviewSection.classList.toggle('page-idle',document.hidden)}
document.addEventListener('visibilitychange',syncReviewPage);syncReviewPage();
if('IntersectionObserver' in window){new IntersectionObserver(entries=>reviewSection.classList.toggle('motion-idle',!entries[0].isIntersecting)).observe(reviewWindow)}
reviewWindow.addEventListener('pointerdown',()=>{clearTimeout(touchTimer);reviewSection.classList.add('touch-reading')});
function releaseTouch(){clearTimeout(touchTimer);touchTimer=setTimeout(()=>reviewSection.classList.remove('touch-reading'),2500)}
reviewWindow.addEventListener('pointerup',releaseTouch);reviewWindow.addEventListener('pointercancel',releaseTouch);
let loopWidth=0,lastFrame=0,scrollFraction=0;
function measureReviewLoop(){loopWidth=reviewWindow.querySelector('.review-group').getBoundingClientRect().width}
measureReviewLoop();if('ResizeObserver' in window)new ResizeObserver(measureReviewLoop).observe(reviewWindow.querySelector('.review-group'));
function wrapReviewScroll(){if(!reducedMotion.matches&&loopWidth>0&&reviewWindow.scrollLeft>=loopWidth)reviewWindow.scrollLeft%=loopWidth}
reviewWindow.addEventListener('scroll',wrapReviewScroll,{passive:true});
reviewWindow.addEventListener('wheel',()=>{reviewSection.classList.add('touch-reading');releaseTouch()},{passive:true});
reviewWindow.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End','PageDown','PageUp'].includes(event.key)){reviewSection.classList.add('touch-reading');releaseTouch()}});
function animateReviews(now){
 const dt=lastFrame?Math.min(now-lastFrame,50):0;lastFrame=now;
 if(!reducedMotion.matches&&!document.hidden&&!reviewSection.matches('.motion-idle,.touch-reading,.reader-open')&&!reviewWindow.matches(':hover,:focus-within')&&loopWidth>0){scrollFraction+=dt*.028;const pixels=Math.floor(scrollFraction);scrollFraction-=pixels;reviewWindow.scrollLeft+=pixels;wrapReviewScroll()}
 requestAnimationFrame(animateReviews);
}
requestAnimationFrame(animateReviews);

reviewWindow.addEventListener('click',event=>{
 const button=event.target.closest('.review-read-more');if(!button)return;const r=pool.find(r=>r.id===button.dataset.reviewId);if(!r)return;
 dialogOpener=button;reviewDialog.querySelector('h2').textContent=r.author;reviewDialog.querySelector('.review-dialog-text').textContent=r.text;
 reviewDialog.querySelector('.review-dialog-partial').textContent=r.isPartial?'Fragment din recenzia publicată pe Google.':'';
 reviewSection.classList.add('reader-open');reviewDialog.showModal();reviewDialog.querySelector('.review-dialog-close').focus();
});
reviewDialog.querySelector('.review-dialog-close').addEventListener('click',()=>reviewDialog.close());
reviewDialog.addEventListener('click',e=>{if(e.target===reviewDialog){const r=reviewDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)reviewDialog.close()}});
reviewDialog.addEventListener('close',()=>{reviewSection.classList.remove('reader-open');dialogOpener?.focus()});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){finishYear();revealTargets.forEach(el=>el.classList.add('is-revealed'))}});

// Reveal the sticky header on upward scroll, with a small jitter threshold.
const siteHeader=document.querySelector('.header');
let headerHeight=siteHeader.offsetHeight,lastHeaderY=Math.max(0,scrollY),headerScheduled=false;
function measureHeader(){headerHeight=siteHeader.offsetHeight;document.documentElement.style.setProperty('--header-height',headerHeight+'px')}
function updateHeader(){
 headerScheduled=false;
 const y=Math.max(0,scrollY),delta=y-lastHeaderY;
 siteHeader.classList.toggle('is-scrolled',y>headerHeight);
 if(y<=headerHeight+24){siteHeader.classList.remove('is-hidden');lastHeaderY=y;return}
 if(Math.abs(delta)<8)return;
 const keyboardInHeader=siteHeader.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');
 siteHeader.classList.toggle('is-hidden',delta>0&&!keyboardInHeader);
 lastHeaderY=y;
}
addEventListener('scroll',()=>{if(!headerScheduled){headerScheduled=true;requestAnimationFrame(updateHeader)}},{passive:true});
siteHeader.addEventListener('focusin',()=>siteHeader.classList.remove('is-hidden'));
addEventListener('resize',measureHeader);
if('ResizeObserver' in window)new ResizeObserver(measureHeader).observe(siteHeader);
measureHeader();updateHeader();

