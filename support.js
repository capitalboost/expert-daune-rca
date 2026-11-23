(() => {
 'use strict';
 const inlineContacts = [...document.querySelectorAll('main a[href^="https://wa.me/"]')];
 const contactHeader = document.querySelector('.header');
 document.body.insertAdjacentHTML('beforeend', `<nav class="floating-contact mobile-contact-bar" aria-label="Contact rapid" hidden><a href="tel:+40728608688" class="mobile-call"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6 3h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4a3 3 0 0 1-3 3C9 20 4 15 3 6a3 3 0 0 1 3-3Z"/></svg><span>Sună-ne</span></a><a href="https://wa.me/40728608688" class="mobile-whatsapp" target="_blank" rel="noopener noreferrer"><svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.26-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.92-5.35 11.92-11.93 0-3.18-1.24-6.18-3.45-8.42ZM12.05 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.43-9.9 9.89-9.9a9.82 9.82 0 0 1 7 2.9 9.84 9.84 0 0 1 2.89 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg><span>Hai pe WhatsApp</span><span class="contact-bubble" aria-hidden="true" hidden></span></a></nav>`);
 const floatingContact = document.querySelector('.mobile-contact-bar');
 const contactBubble = floatingContact.querySelector('.contact-bubble');
 const bubbleMessages = ['Trimite-ne pozele pe WhatsApp', 'Ai avut un accident? Scrie-ne.', 'Ai întrebări? Hai să vorbim.'];
 let bubbleIndex = 0;
 function showContactBubble() {
  if (!document.hidden && !floatingContact.hidden && !document.body.classList.contains('cookie-notice-open')) {
   contactBubble.textContent = bubbleMessages[bubbleIndex++ % bubbleMessages.length];
   contactBubble.hidden = false;
   setTimeout(() => { contactBubble.hidden = true; }, 5000);
  }
  setTimeout(showContactBubble, 25000);
 }
 setTimeout(showContactBubble, 10000);
 document.addEventListener('visibilitychange', () => { if (document.hidden) contactBubble.hidden = true; });
 const mobileViewport = matchMedia('(max-width: 760px)');
 let contactFrame = 0;
 function updateFloatingContact() {
  contactFrame = 0;
  const headerBottom = contactHeader ? Math.max(0, contactHeader.getBoundingClientRect().bottom) : 0;
  const inlineContactVisible = inlineContacts.some(link => {
   const bounds = link.getBoundingClientRect();
   return bounds.width > 0 && bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > headerBottom && bounds.right > 0 && bounds.left < innerWidth;
  });
  const editing = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
  const showContact = mobileViewport.matches && !inlineContactVisible && !editing;
  if (floatingContact.hidden === showContact) {
   floatingContact.hidden = !showContact;
   if (!showContact) contactBubble.hidden = true;
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
 const measurementId = 'G-LN173SN47N';
 window.dataLayer = window.dataLayer || [];
 window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
 window.gtag('consent', 'default', {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
 let analyticsAllowed = false, analyticsLoaded = false, clarityLoaded = false;
 window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
 window.clarity('consentv2', {ad_Storage:'denied', analytics_Storage:'denied'});
 function applyAnalytics(allowed) {
  if (allowed === analyticsAllowed) return;
  analyticsAllowed = allowed;
  window['ga-disable-' + measurementId] = !allowed;
  window.gtag('consent', 'update', {analytics_storage:allowed?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.clarity('consentv2', {ad_Storage:'denied', analytics_Storage:allowed?'granted':'denied'});
  if (allowed && !clarityLoaded) {
   clarityLoaded = true;
   const tag = document.createElement('script'); tag.async = true;
   tag.src = 'https://www.clarity.ms/tag/ziafqk2cqa';
   document.head.append(tag);
  }
  if (allowed && !analyticsLoaded) {
   analyticsLoaded = true;
   window.gtag('js', new Date());
   window.gtag('config', measurementId, {allow_google_signals:false,allow_ad_personalization_signals:false});
   const tag = document.createElement('script'); tag.async = true;
   tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
   document.head.append(tag);
  }
  if (!allowed) {
   // Unload Clarity as well: denied consent alone still permits cookieless collection.
   if (clarityLoaded) setTimeout(() => location.reload(), 0);
   for (const part of document.cookie.split(';')) {
    const name = part.trim().split('=')[0];
    if (!/^(_ga(?:_|$)|_clck$|_clsk$)/.test(name)) continue;
    const domains = location.hostname.split('.');
    document.cookie = name + '=; Max-Age=0; path=/';
    for (let i=0;i<domains.length-1;i++) document.cookie = name + '=; Max-Age=0; path=/; domain=' + domains.slice(i).join('.');
   }
  }
 }
 document.addEventListener('click', event => {
  if (!analyticsAllowed) return;
  const link = event.target.closest?.('a'); if (!link) return;
  if (link.protocol === 'tel:') window.gtag('event','click_telefon',{numar:link.getAttribute('href').slice(4)});
  else if (['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(link.hostname)) window.gtag('event','click_whatsapp');
 });
 const key='edrca_privacy_v4',lifetime=180*86400000;
 const read=()=>{try{const s=JSON.parse(localStorage.getItem(key));return s?.version===4&&typeof s.maps==='boolean'&&typeof s.analytics==='boolean'&&s.until>Date.now()&&s.until<=Date.now()+lifetime?s:null}catch{return null}};
 try{localStorage.removeItem('edrca_cookie_notice_v1')}catch{}
 let choice=read(),opener=null;
 const panel=document.createElement('section');panel.className='cookie-banner';panel.hidden=true;panel.setAttribute('aria-labelledby','cookie-title');
 panel.innerHTML='<h2 id="cookie-title">Cookies și confidențialitate</h2><p>Folosim cookie-uri pentru a înțelege cum este folosit site-ul și Google Maps ca să ne găsești mai ușor. Tu alegi ce permiți.</p><p><a href="/politica-cookies/">Citește politica de cookies</a></p><div id="cookie-options" data-consent-options hidden><p><label><input type="checkbox" data-consent-analytics> Analiza traficului (Google Analytics și Microsoft Clarity)</label><br><label><input type="checkbox" data-consent-maps> Harta Google Maps</label></p></div><div class="cookie-actions"><button class="support-button secondary" type="button" data-notice="reject">Refuză</button><button class="support-button secondary" type="button" data-notice="customize" aria-expanded="false" aria-controls="cookie-options">Personalizează</button><button class="support-button" type="button" data-notice="save" hidden>Salvează alegerea</button><button class="support-button" type="button" data-notice="accept">Acceptă toate</button></div><p class="cookie-status" role="status"></p>';
 document.body.append(panel);
 const apply=()=>{applyAnalytics(choice?.analytics===true);document.querySelectorAll('[data-map-src]').forEach(frame=>{const enabled=choice?.maps===true;frame.hidden=!enabled;frame.parentElement.querySelector('.map-placeholder').hidden=enabled;if(enabled){if(!frame.hasAttribute('src'))frame.src=frame.dataset.mapSrc}else frame.removeAttribute('src')});};
 const show=(focus=false)=>{panel.querySelector('[data-consent-options]').hidden=true;panel.querySelector('[data-notice=save]').hidden=true;panel.querySelector('[data-notice=customize]').hidden=false;panel.querySelector('[data-notice=customize]').setAttribute('aria-expanded','false');panel.hidden=false;document.body.classList.add('cookie-notice-open');panel.querySelector('[data-consent-analytics]').checked=choice?.analytics===true;panel.querySelector('[data-consent-maps]').checked=choice?.maps===true;panel.querySelector('.cookie-status').textContent='';if(focus)panel.querySelector('button').focus()};
 const hide=()=>{panel.hidden=true;document.body.classList.remove('cookie-notice-open');if(opener?.isConnected)opener.focus();opener=null};
 const choose=(maps,analytics)=>{choice={version:4,maps,analytics,until:Date.now()+lifetime};try{localStorage.setItem(key,JSON.stringify(choice))}catch{}apply();hide()};
 panel.addEventListener('click',e=>{const a=e.target.closest('[data-notice]')?.dataset.notice;if(a==='customize'){panel.querySelector('[data-consent-options]').hidden=false;panel.querySelector('[data-notice=save]').hidden=false;const customize=panel.querySelector('[data-notice=customize]');customize.setAttribute('aria-expanded','true');customize.hidden=true;panel.querySelector('[data-consent-analytics]').focus();return;}if(a==='save')choose(panel.querySelector('[data-consent-maps]').checked,panel.querySelector('[data-consent-analytics]').checked);else if(a)choose(a==='accept',a==='accept')});
 document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{opener=button;show(true)}));
 document.querySelectorAll('[data-enable-map]').forEach(button=>button.addEventListener('click',()=>{choose(true,choice?.analytics===true);button.closest('.map-stage').querySelector('iframe').focus()}));
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){choice=read();apply();if(!choice)show();else hide()}});
 window.addEventListener('focus',()=>{if(choice&&choice.until<=Date.now()){choice=null;apply();show()}});
 apply();if(!choice)show();
 const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('primary-nav'),header=document.querySelector('.header');
 if(menu&&nav){menu.hidden=false;header.classList.add('menu-ready');const set=open=>{menu.setAttribute('aria-expanded',String(open));header.classList.toggle('menu-open',open)};menu.addEventListener('click',()=>set(menu.getAttribute('aria-expanded')!=='true'));nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){set(false);menu.focus()}});document.addEventListener('click',e=>{if(!header.contains(e.target))set(false)});nav.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement))set(false)},0))}
})();
