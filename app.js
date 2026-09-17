const state={category:'all',budget:'all',theme:'all',sort:'featured',shown:24};
let products=[];
const budgetLabels={sotto_20:'Sotto \u20ac20','20_50':'\u20ac20\u201350','50_100':'\u20ac50\u2013100',oltre_100:'\u20ac100+'};
const euro=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const THEMES=[
  {id:'all', keys:[]},
  {id:'gioielli', keys:['collana','bracciale','anello','orecchini','argento','gioiell']},
  {id:'fiori', keys:['rosa','fiore','girasole','uncinetto','eterna']},
  {id:'luce', keys:['lampada','luce','notturna']},
  {id:'foto', keys:['personalizzat','foto','inciso','incisa','iniziale','dedica']},
  {id:'tavola', keys:['tazza','mug','vino','calice','birra','tagliere','caff']},
  {id:'ricordi', keys:['libro','domande','ricordi','coperta','cuscino','targa']},
  {id:'accessori', keys:['portachiavi','borsa','tote','sciarpa','orologio','portafoglio','t-shirt','maglia']}
];
function themeOf(title){
  const t=title.toLowerCase();
  const hits=[];
  for(const th of THEMES){
    if(th.id==='all') continue;
    if(th.keys.some(k=>t.includes(k))) hits.push(th.id);
  }
  return hits;
}
const I18N={
  it:{
    title:'BJ Beyond Gift Finder | Trova il regalo in 3 domande',
    h1:'Tre domande.<br>Poi il regalo.',
    lead:'Niente lista infinita. Scegli per chi, il budget e la categoria. Ok, e vedi solo quello che ha senso.',
    qWho:'Per chi stai cercando?',
    qBudget:'Quale budget?',
    qCat:'Che tipo di regalo?',
    all:'Tutti',
    mamma:'Per Mamma',
    papa:'Per Pap\u00e0',
    cats:'Categorie',
    back:'\u2190 Cambia risposte',
    featured:'In evidenza',
    priceAsc:'Prezzo crescente',
    priceDesc:'Prezzo decrescente',
    amazon:'Vedi su Amazon',
    indicative:'indicativo',
    more:'Mostra altri',
    emptyTitle:'Nessun risultato',
    emptyText:'Cambia categoria o torna al quiz.',
    footer1:'Quiz, poi i link Amazon.it.',
    footer2:'Amazon e il logo Amazon sono marchi di Amazon.com, Inc. o delle sue affiliate.',
    footer3:'Questo sito non vende direttamente prodotti e non gestisce pagamenti o spedizioni.',
    disclosure:'<strong>Trasparenza:</strong> in qualit\u00e0 di Affiliato Amazon, BJ Beyond riceve un guadagno dagli acquisti idonei. Per te il prezzo non cambia.',
    count:n=>n+' idee regalo',
    themes:{all:'Tutte',gioielli:'Gioielli',fiori:'Fiori',luce:'Casa e luce',foto:'Personalizzati',tavola:'Tavola',ricordi:'Ricordi',accessori:'Accessori'}
  },
  en:{
    title:'BJ Beyond Gift Finder | Find the gift in 3 questions',
    h1:'Three questions.<br>Then the gift.',
    lead:'No endless list. Choose who, budget and category. Ok, and you only see what fits.',
    qWho:'Who is it for?',
    qBudget:'What budget?',
    qCat:'What kind of gift?',
    all:'All',
    mamma:'For Mum',
    papa:'For Dad',
    cats:'Categories',
    back:'\u2190 Change answers',
    featured:'Featured',
    priceAsc:'Price: low to high',
    priceDesc:'Price: high to low',
    amazon:'View on Amazon',
    indicative:'indicative',
    more:'Load more',
    emptyTitle:'No results',
    emptyText:'Change category or go back to the quiz.',
    footer1:'Quiz, then Amazon.it links.',
    footer2:'Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.',
    footer3:'This site does not sell products directly and does not handle payments or shipping.',
    disclosure:'<strong>Disclosure:</strong> as an Amazon Associate, BJ Beyond earns from qualifying purchases. The price does not change for you.',
    count:n=>n+' gift ideas',
    themes:{all:'All',gioielli:'Jewellery',fiori:'Flowers',luce:'Home & light',foto:'Personalised',tavola:'Table',ricordi:'Memories',accessori:'Accessories'}
  }
};
window.__t=I18N.it;
function renderThemeButtons(){
  const t=window.__t;
  const html=THEMES.map(th=>{
    const active=state.theme===th.id?' active':'';
    return '<button type="button" class="theme'+active+'" data-theme="'+th.id+'">'+t.themes[th.id]+'</button>';
  }).join('');
  $('#catBtns').innerHTML=html;
  $('#catBtnsResults').innerHTML=html;
  $$('#catBtns .theme, #catBtnsResults .theme').forEach(b=>{
    b.addEventListener('click',()=>{
      state.theme=b.dataset.theme;
      renderThemeButtons();
      if(!$('#results').hidden) render(true);
    });
  });
}
function applyLang(lang){
  const t=I18N[lang]||I18N.it;
  window.__t=t;
  document.documentElement.lang=lang;
  document.documentElement.setAttribute('translate',lang==='it'?'no':'yes');
  localStorage.setItem('gf-lang',lang);
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  document.title=t.title;
  document.querySelectorAll('[data-i]').forEach(el=>{const k=el.getAttribute('data-i');if(t[k])el.textContent=t[k]});
  document.querySelectorAll('[data-i-html]').forEach(el=>{const k=el.getAttribute('data-i-html');if(t[k])el.innerHTML=t[k]});
  document.querySelector('#whoBtns .choice[data-category="all"]').textContent=t.all;
  document.querySelector('#whoBtns .choice[data-category="mamma"]').textContent=t.mamma;
  const papaBtn=document.querySelector('#whoBtns .choice[data-category="pap\u00e0"]')||document.querySelector('#whoBtns .choice[data-category="papa"]');
  if(papaBtn) papaBtn.textContent=t.papa;
  document.querySelector('#budgetBtns .budget[data-budget="all"]').textContent=t.all;
  $('#backQuiz').textContent=t.back;
  $('#loadMore').textContent=t.more;
  const sort=$('#sort');
  sort.options[0].text=t.featured;
  sort.options[1].text=t.priceAsc;
  sort.options[2].text=t.priceDesc;
  renderThemeButtons();
  if(!$('#results').hidden) render();
}
function filtered(){
  return products.filter(p=>{
    if(state.category!=='all' && p.c!==state.category) return false;
    if(state.budget!=='all' && p.b!==state.budget) return false;
    if(state.theme!=='all' && !themeOf(p.t).includes(state.theme)) return false;
    return true;
  }).sort((a,b)=>{
    if(state.sort==='priceAsc') return a.p-b.p;
    if(state.sort==='priceDesc') return b.p-a.p;
    return 0;
  });
}
function card(p){
  const t=window.__t;
  const title=p.t.replace(/[<>]/g,'');
  const cat=p.c==='mamma'?t.mamma:t.papa;
  return '<article class="card"><div class="image-wrap"><img src="'+p.i+'" alt="'+title.replace(/"/g,'&quot;')+'" loading="lazy" decoding="async" width="320" height="320" referrerpolicy="no-referrer"></div><div class="card-body"><span class="tag">'+cat+' \u00b7 '+budgetLabels[p.b]+'</span><h2>'+title+'</h2><div class="price">'+euro.format(p.p)+' <small>'+t.indicative+'</small></div><a class="amazon-btn" href="'+p.u+'" target="_blank" rel="sponsored nofollow noopener">'+t.amazon+'</a></div></article>';
}
function render(reset){
  if(reset)state.shown=24;
  const t=window.__t;
  const list=filtered(),visible=list.slice(0,state.shown);
  $('#resultCount').textContent=t.count(list.length);
  $('#grid').innerHTML=visible.map(card).join('');
  $('#loadMore').hidden=visible.length>=list.length;
  $('#empty').hidden=list.length>0;
  $('#grid').hidden=list.length===0;
}
function showResults(){
  $('#quiz').hidden=true;
  $('#results').hidden=false;
  render(true);
  window.scrollTo({top:0,behavior:'smooth'});
}
function showQuiz(){
  $('#results').hidden=true;
  $('#quiz').hidden=false;
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('#whoBtns .choice').forEach(b=>b.addEventListener('click',()=>{
  $$('#whoBtns .choice').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  state.category=b.dataset.category;
}));
$$('#budgetBtns .budget').forEach(b=>b.addEventListener('click',()=>{
  $$('#budgetBtns .budget').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  state.budget=b.dataset.budget;
}));
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;render(true)});
$('#loadMore').addEventListener('click',()=>{state.shown+=24;render()});
$('#quizOk').addEventListener('click',showResults);
$('#backQuiz').addEventListener('click',showQuiz);
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.lang)));
products=window.PRODUCTS||[];
applyLang(localStorage.getItem('gf-lang')||'it');
