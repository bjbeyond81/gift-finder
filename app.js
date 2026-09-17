const state={category:'all',budget:'all',search:'',sort:'featured',shown:24};let products=[];
const budgetLabels={sotto_20:'Sotto \u20ac20','20_50':'\u20ac20\u201350','50_100':'\u20ac50\u2013100',oltre_100:'\u20ac100+'};
const euro=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const I18N={
  it:{
    title:'BJ Beyond Gift Finder | Idee regalo Amazon per Mamma e Pap\u00e0',
    desc:'Trova idee regalo Amazon per Mamma e Pap\u00e0 per fascia di budget. Catalogo BJ Beyond con ricerca e filtri rapidi.',
    h1:'Il regalo giusto,<br>senza perdere ore.',
    lead:'Una selezione di idee regalo per <strong>Mamma</strong> e <strong>Pap\u00e0</strong>, organizzata per budget e pronta da esplorare.',
    how:'COME FUNZIONA',
    step1:'Scegli per chi stai cercando.',
    step2:'Imposta il budget.',
    step3:'Apri il prodotto su Amazon.',
    micro:'I prezzi mostrati sono indicativi e possono cambiare. Verifica sempre prezzo e disponibilit\u00e0 su Amazon.',
    disclosure:'<strong>Trasparenza:</strong> in qualit\u00e0 di Affiliato Amazon, BJ Beyond riceve un guadagno dagli acquisti idonei. Per te il prezzo non cambia.',
    explore:'Esplora i regali',
    search:"Cerca un'idea",
    searchPh:'es. collana, lampada, tazza\u2026',
    budget:'Budget',
    all:'Tutti',
    mamma:'Per Mamma',
    papa:'Per Pap\u00e0',
    featured:'In evidenza',
    priceAsc:'Prezzo crescente',
    priceDesc:'Prezzo decrescente',
    amazon:'Vedi su Amazon',
    indicative:'indicativo',
    more:'Mostra altri',
    emptyTitle:'Nessun risultato',
    emptyText:'Prova a cambiare categoria, budget o parola chiave.',
    footer1:'Curated gift discovery. Links open on Amazon.it.',
    footer2:'Amazon e il logo Amazon sono marchi di Amazon.com, Inc. o delle sue affiliate.',
    footer3:'Questo sito non vende direttamente prodotti e non gestisce pagamenti o spedizioni.',
    count:n=>n+' idee regalo'
  },
  en:{
    title:'BJ Beyond Gift Finder | Amazon gift ideas for Mum and Dad',
    desc:'Find Amazon gift ideas for Mum and Dad by budget. BJ Beyond catalogue with fast search and filters.',
    h1:'The right gift,<br>without losing hours.',
    lead:'A curated set of gift ideas for <strong>Mum</strong> and <strong>Dad</strong>, organised by budget and ready to browse.',
    how:'HOW IT WORKS',
    step1:'Choose who you are shopping for.',
    step2:'Set the budget.',
    step3:'Open the product on Amazon.',
    micro:'Prices shown are indicative and can change. Always check price and availability on Amazon.',
    disclosure:'<strong>Disclosure:</strong> as an Amazon Associate, BJ Beyond earns from qualifying purchases. The price does not change for you.',
    explore:'Browse gifts',
    search:'Search an idea',
    searchPh:'e.g. necklace, lamp, mug\u2026',
    budget:'Budget',
    all:'All',
    mamma:'For Mum',
    papa:'For Dad',
    featured:'Featured',
    priceAsc:'Price: low to high',
    priceDesc:'Price: high to low',
    amazon:'View on Amazon',
    indicative:'indicative',
    more:'Load more',
    emptyTitle:'No results',
    emptyText:'Try another category, budget or keyword.',
    footer1:'Curated gift discovery. Links open on Amazon.it.',
    footer2:'Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.',
    footer3:'This site does not sell products directly and does not handle payments or shipping.',
    count:n=>n+' gift ideas'
  }
};

let currentLang='it';
window.__t=I18N.it;

function applyLang(lang){
  const t=I18N[lang]||I18N.it;
  currentLang=lang;
  window.__t=t;
  document.documentElement.lang=lang;
  document.documentElement.setAttribute('translate',lang==='it'?'no':'yes');
  localStorage.setItem('gf-lang',lang);
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  document.title=t.title;
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content',t.desc);
  document.querySelectorAll('[data-i]').forEach(el=>{const k=el.getAttribute('data-i');if(t[k])el.textContent=t[k]});
  document.querySelectorAll('[data-i-html]').forEach(el=>{const k=el.getAttribute('data-i-html');if(t[k])el.innerHTML=t[k]});
  $('#search').placeholder=t.searchPh;
  document.querySelector('.choice[data-category="all"]').textContent=t.all;
  document.querySelector('.choice[data-category="mamma"]').textContent=t.mamma;
  document.querySelector('.choice[data-category="pap\u00e0"]').textContent=t.papa;
  document.querySelector('.budget[data-budget="all"]').textContent=t.all;
  const sort=$('#sort');
  sort.options[0].text=t.featured;
  sort.options[1].text=t.priceAsc;
  sort.options[2].text=t.priceDesc;
  if(products.length)render();
}

function filtered(){
  let list=products.filter(p=>(state.category==='all'||p.c===state.category)&&(state.budget==='all'||p.b===state.budget)&&(!state.search||p.t.toLowerCase().includes(state.search)));
  if(state.sort==='priceAsc')list.sort((a,b)=>a.p-b.p);
  else if(state.sort==='priceDesc')list.sort((a,b)=>b.p-a.p);
  return list;
}

function card(p){
  const t=window.__t;
  const title=p.t.replace(/[<>]/g,'');
  const cat=p.c==='mamma'?t.mamma:t.papa;
  return `<article class="card"><div class="image-wrap"><img src="${p.i}" alt="${title.replace(/"/g,'&quot;')}" loading="lazy" decoding="async" width="320" height="320" referrerpolicy="no-referrer"></div><div class="card-body"><span class="tag">${cat} \u00b7 ${budgetLabels[p.b]}</span><h2>${title}</h2><div class="price">${euro.format(p.p)} <small>${t.indicative}</small></div><a class="amazon-btn" href="${p.u}" target="_blank" rel="sponsored nofollow noopener">${t.amazon}</a></div></article>`;
}

function render(reset=false){
  if(reset)state.shown=24;
  const t=window.__t;
  const list=filtered(),visible=list.slice(0,state.shown);
  $('#resultCount').textContent=t.count(list.length);
  $('#grid').innerHTML=visible.map(card).join('');
  $('#loadMore').hidden=visible.length>=list.length;
  $('#empty').hidden=list.length>0;
  $('#grid').hidden=list.length===0;
}

$$('.choice').forEach(b=>b.addEventListener('click',()=>{$$('.choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.category=b.dataset.category;render(true);document.querySelector('#catalogo').scrollIntoView({behavior:'smooth'})}));
$$('.budget').forEach(b=>b.addEventListener('click',()=>{$$('.budget').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.budget=b.dataset.budget;render(true)}));
$('#search').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();render(true)});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;render(true)});
$('#loadMore').addEventListener('click',()=>{state.shown+=24;render()});
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.lang)));

products=window.PRODUCTS||[];
applyLang(localStorage.getItem('gf-lang')||'it');
render(true);
