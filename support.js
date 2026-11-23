(() => {
 'use strict';
 const inlineContacts = [...document.querySelectorAll('main a[href^="https://wa.me/"]')];
 const hero = document.querySelector('main .hero, main .page-hero');
 document.body.insertAdjacentHTML('beforeend', `<a class="floating-contact" href="https://wa.me/40728608688" target="_blank" rel="noopener noreferrer" aria-label="Scrie-ne pe WhatsApp" hidden><svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.26-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.92-5.35 11.92-11.93 0-3.18-1.24-6.18-3.45-8.42ZM12.05 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.43-9.9 9.89-9.9a9.82 9.82 0 0 1 7 2.9 9.84 9.84 0 0 1 2.89 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg><span class="floating-contact-message" aria-hidden="true" hidden></span></a>`);
 const floatingContact = document.querySelector('.floating-contact');
 const contactMessage = floatingContact.querySelector('.floating-contact-message');
 const contactQuestions = ['Ai nevoie de ajutor?', 'Ai avut un accident?', 'Ai întrebări despre dosar?'];
 let contactQuestionIndex = 0;
 let contactMessageTimer;
 function showContactMessage() {
  contactMessage.textContent = contactQuestions[contactQuestionIndex];
  contactQuestionIndex = (contactQuestionIndex + 1) % contactQuestions.length;
  contactMessage.hidden = false;
  contactMessageTimer = setTimeout(() => {
   contactMessage.hidden = true;
   contactMessageTimer = setTimeout(showContactMessage, 18000);
  }, 5000);
 }
 const mobileViewport = matchMedia('(max-width: 760px)');
 let contactFrame = 0;
 function updateFloatingContact() {
  contactFrame = 0;
  const inlineContactVisible = inlineContacts.some(link => {
   const bounds = link.getBoundingClientRect();
   return bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > 0;
  });
  const heroPassed = !hero || hero.getBoundingClientRect().bottom <= 0;
  const editing = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
  const showContact = mobileViewport.matches && heroPassed && !inlineContactVisible && !editing;
  if (floatingContact.hidden === showContact) {
   floatingContact.hidden = !showContact;
   clearTimeout(contactMessageTimer);
   contactMessage.hidden = true;
   if (showContact) contactMessageTimer = setTimeout(showContactMessage, 1800);
  }
  document.body.classList.toggle('has-floater', showContact);
 }
 function scheduleFloatingContact() {
  if (!contactFrame) contactFrame = requestAnimationFrame(updateFloatingContact);
 }
 document.addEventListener('focusin', scheduleFloatingContact);
 document.addEventListener('focusout', scheduleFloatingContact);
 addEventListener('scroll', scheduleFloatingContact, { passive: true });
 addEventListener('resize', scheduleFloatingContact);
 updateFloatingContact();
 document.querySelectorAll('[data-current-year]').forEach(el=>el.textContent=new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Europe/Bucharest'}).format(new Date()));
 const key='edrca_privacy_v2',lifetime=180*86400000;
 const read=()=>{try{const s=JSON.parse(localStorage.getItem(key));return s?.version===2&&typeof s.maps==='boolean'&&s.until>Date.now()&&s.until<=Date.now()+lifetime?s:null}catch{return null}};
 try{localStorage.removeItem('edrca_cookie_notice_v1')}catch{}
 let choice=read(),opener=null;
 const panel=document.createElement('section');panel.className='cookie-banner';panel.hidden=true;panel.setAttribute('aria-labelledby','cookie-title');
 panel.innerHTML='<h2 id="cookie-title">Cookies și confidențialitate</h2><p>Folosim Google Maps ca să ne găsești mai ușor. Permiți încărcarea hărții și tehnologiilor Google? Restul site-ului funcționează și fără ele.</p><p><a href="/politica-cookies/">Citește politica de cookies</a></p><div class="cookie-actions"><button class="support-button secondary" type="button" data-notice="reject">Nu</button><button class="support-button" type="button" data-notice="accept">Da, am înțeles</button></div><p class="cookie-status" role="status"></p>';
 document.body.append(panel);
 const apply=()=>document.querySelectorAll('[data-map-src]').forEach(frame=>{const enabled=choice?.maps===true;frame.hidden=!enabled;frame.parentElement.querySelector('.map-placeholder').hidden=enabled;if(enabled){if(!frame.hasAttribute('src'))frame.src=frame.dataset.mapSrc}else frame.removeAttribute('src')});
 const show=(focus=false)=>{panel.hidden=false;document.body.classList.add('cookie-notice-open');panel.querySelector('.cookie-status').textContent=choice?'Harta Google este '+(choice.maps?'permisă. Poți schimba alegerea oricând.':'dezactivată. Poți schimba alegerea oricând.') : '';if(focus)panel.querySelector('button').focus()};
 const hide=()=>{panel.hidden=true;document.body.classList.remove('cookie-notice-open');if(opener?.isConnected)opener.focus();opener=null};
 const choose=maps=>{choice={version:2,maps,until:Date.now()+lifetime};try{localStorage.setItem(key,JSON.stringify(choice))}catch{}apply();hide()};
 panel.addEventListener('click',e=>{const a=e.target.closest('[data-notice]')?.dataset.notice;if(a)choose(a==='accept')});
 document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{opener=button;show(true)}));
 document.querySelectorAll('[data-enable-map]').forEach(button=>button.addEventListener('click',()=>{choose(true);button.closest('.map-stage').querySelector('iframe').focus()}));
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){choice=read();apply();if(!choice)show();else hide()}});
 window.addEventListener('focus',()=>{if(choice&&choice.until<=Date.now()){choice=null;apply();show()}});
 apply();if(!choice)show();
 const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('primary-nav'),header=document.querySelector('.header');
 if(menu&&nav){menu.hidden=false;header.classList.add('menu-ready');const set=open=>{menu.setAttribute('aria-expanded',String(open));header.classList.toggle('menu-open',open)};menu.addEventListener('click',()=>set(menu.getAttribute('aria-expanded')!=='true'));nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){set(false);menu.focus()}});document.addEventListener('click',e=>{if(!header.contains(e.target))set(false)});nav.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement))set(false)},0))}
 const form=document.getElementById('contact-form'),dialog=document.getElementById('callback-dialog'),trigger=document.getElementById('open-callback');
 if(form&&dialog&&trigger){
  const submit=form.querySelector('[type=submit]'),note=document.getElementById('form-note'),status=document.getElementById('form-status');let ready=false,busy=false;
  const unavailable=()=>{ready=false;submit.disabled=true;note.textContent='Pentru moment, sună-ne la 0728 608 688 sau scrie-ne pe WhatsApp.'};
  const check=async()=>{submit.disabled=true;try{const r=await fetch('/api/contact.php',{headers:{Accept:'application/json'},cache:'no-store'}),data=await r.json();ready=r.ok&&data.ready===true;if(!ready)unavailable();else{submit.disabled=false;note.textContent='Te sunăm în câteva minute, în programul luni–vineri, 09:00–18:00. În afara programului, revenim în următoarea zi lucrătoare.'}}catch{unavailable()}};
  trigger.addEventListener('click',()=>{dialog.showModal();document.body.classList.add('callback-open');check()});
  dialog.querySelector('.callback-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
  dialog.addEventListener('close',()=>{document.body.classList.remove('callback-open');trigger.focus()});
  form.addEventListener('submit',async e=>{e.preventDefault();if(!ready||busy||!form.reportValidity())return;busy=true;submit.disabled=true;submit.textContent='Se trimite…';status.textContent='';try{const r=await fetch('/api/contact.php',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:form.elements.name.value,phone:form.elements.phone.value,subject:form.elements.subject.value,terms:form.elements.terms.checked,website:form.elements.website.value})});const data=await r.json().catch(()=>{throw new Error('Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne.')});if(!r.ok||!data.ok)throw new Error(data.message||'Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne.');status.textContent='Solicitarea a fost trimisă. Te vom contacta în programul de lucru.';form.reset()}catch(error){status.textContent=error.message==='Failed to fetch'?'Conexiunea a fost întreruptă. Încearcă din nou sau sună-ne.':error.message}finally{busy=false;submit.disabled=!ready;submit.textContent='Trimite solicitarea'}});
 }
})();
