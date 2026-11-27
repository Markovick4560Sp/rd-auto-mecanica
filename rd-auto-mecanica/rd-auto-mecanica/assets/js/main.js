/* ==========================================================
   RD Auto Mecânica · interações e animações
   ========================================================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const finePointer=matchMedia('(pointer:fine)').matches;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile=innerWidth<768;

/* ---------- Split text ---------- */
$$('[data-split]').forEach(el=>{
  const txt=el.textContent;el.textContent='';let i=0;
  txt.split(' ').forEach((w,wi,arr)=>{
    const ws=document.createElement('span');ws.style.display='inline-block';ws.style.whiteSpace='nowrap';
    [...w].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;s.style.setProperty('--i',i++);ws.appendChild(s)});
    el.appendChild(ws);if(wi<arr.length-1)el.appendChild(document.createTextNode(' '));
  });
});

/* ---------- Preloader ---------- */
(function(){
  const num=$('#preNum'),bot=$('#preBot'),pre=$('#preloader');let p=0;
  const dur=reduce?200:1700,t0=performance.now();
  function tick(t){
    p=Math.min(100,Math.round((1-Math.pow(1-(t-t0)/dur,3))*100));
    if(t-t0>=dur)p=100;
    num.textContent=p;bot.style.setProperty('--p',p+'%');
    if(p<100)requestAnimationFrame(tick);else setTimeout(start,250);
  }
  requestAnimationFrame(tick);
  function start(){
    pre.classList.add('done');document.body.classList.remove('loading');
    $('#header').classList.add('in');
    setTimeout(()=>{document.body.classList.add('ready');$$('[data-split]').forEach(e=>e.classList.add('go'))},350);
    setTimeout(()=>{$('#whatsFloat').classList.add('in')},1600);
    setTimeout(()=>pre.remove(),1400);
  }
})();

/* ---------- Header / progress / active pill ---------- */
const header=$('#header'),prog=$('#progress');
addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',scrollY>50);
  const h=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${scrollY/h})`;
},{passive:true});
const ham=$('#hamburger');
ham.addEventListener('click',()=>header.classList.toggle('open'));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('open')));
const pill=$('#menuPill'),links=$$('#menu a');
function movePill(a){if(!a){pill.style.opacity=0;return}pill.style.opacity=1;pill.style.left=a.offsetLeft+'px';pill.style.width=a.offsetWidth+'px';links.forEach(l=>l.classList.toggle('active',l===a))}
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){movePill(links.find(l=>l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
['inicio','servicos','sobre','galeria','avaliacoes','contato'].forEach(id=>secIO.observe(document.getElementById(id)));

/* ---------- Status aberto/fechado (horário de São Luís) ---------- */
(function(){
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Fortaleza'}));
  const d=now.getDay(),h=now.getHours()+now.getMinutes()/60;
  let open=false,txt;
  if(d>=1&&d<=5){open=h>=8&&h<18;txt=open?'ABERTO AGORA':h<8?'FECHADO · ABRE ÀS 08H':(d===5?'FECHADO · ABRE SÁB 08H':'FECHADO · ABRE AMANHÃ 08H')}
  else if(d===6){open=h>=8&&h<14;txt=open?'ABERTO ATÉ 14H':h<8?'FECHADO · ABRE ÀS 08H':'FECHADO · ABRE SEG 08H'}
  else txt='DOMINGO · COM AGENDAMENTO';
  const st=$('#status');st.classList.toggle('closed',!open);$('#statusTxt').textContent=txt;
  $$('#hours span').forEach(s=>{const r=s.dataset.d;const hit=r==='1-5'?(d>=1&&d<=5):(+r===d);if(hit)s.classList.add('today')});
})();

/* ---------- Rotating text ---------- */
(function(){const items=$$('#rotator span');let i=0;setInterval(()=>{const cur=items[i];cur.classList.remove('on');cur.classList.add('off');setTimeout(()=>cur.classList.remove('off'),600);i=(i+1)%items.length;items[i].classList.add('on')},2400)})();

/* ---------- Hero sparks (faíscas de esmerilhadeira) ---------- */
(function(){
  const c=$('#heroSparks'),x=c.getContext('2d');let W,H,parts=[],visible=true;
  const N=reduce?0:(isMobile?45:120);
  function size(){const r=c.getBoundingClientRect();W=c.width=r.width*devicePixelRatio;H=c.height=r.height*devicePixelRatio}
  size();addEventListener('resize',size);
  function spawn(){const fromRight=Math.random()<.6;return{x:fromRight?W*(.55+Math.random()*.45):Math.random()*W,y:H+10,vx:(Math.random()-.5)*1.4*devicePixelRatio,vy:-(1+Math.random()*3.2)*devicePixelRatio,life:0,max:120+Math.random()*160,s:(Math.random()*1.8+.6)*devicePixelRatio,hue:Math.random()<.75?0+Math.random()*30:45}}
  for(let i=0;i<N;i++){const p=spawn();p.y=Math.random()*H;p.life=Math.random()*p.max;parts.push(p)}
  new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(c);
  let mx=-1e4,my=-1e4;c.parentElement.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();mx=(e.clientX-r.left)*devicePixelRatio;my=(e.clientY-r.top)*devicePixelRatio});
  (function loop(){
    requestAnimationFrame(loop);if(!visible)return;
    x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
    parts.forEach((p,i)=>{
      p.life++;p.vy-=.006;p.vx+=Math.sin((p.life+i)*.05)*.02;
      const dx=p.x-mx,dy=p.y-my,dd=dx*dx+dy*dy;if(dd<22000*devicePixelRatio){p.vx+=dx/Math.sqrt(dd)*.25;p.vy+=dy/Math.sqrt(dd)*.25}
      p.x+=p.vx;p.y+=p.vy;const a=1-p.life/p.max;
      if(a<=0||p.y<-20){parts[i]=spawn();return}
      x.strokeStyle=`hsla(${p.hue},100%,${55+a*25}%,${a})`;x.lineWidth=p.s;x.lineCap='round';
      x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*4,p.y-p.vy*4);x.stroke();
      x.fillStyle=`hsla(${p.hue},100%,60%,${a*.15})`;x.beginPath();x.arc(p.x,p.y,p.s*4,0,7);x.fill();
    });
    x.globalCompositeOperation='source-over';
  })();
})();

/* ---------- Parallax hero ---------- */
if(finePointer&&!reduce){
  const bg=$('#heroBg'),stack=$('#stack');
  $('#inicio').addEventListener('pointermove',e=>{
    const rx=(e.clientX/innerWidth-.5),ry=(e.clientY/innerHeight-.5);
    bg.style.translate=`${rx*-24}px ${ry*-24}px`;
    stack.style.transform=`rotateY(${rx*14}deg) rotateX(${ry*-10}deg)`;
  });
}

/* ---------- Custom cursor + magnetic ---------- */
if(finePointer){
  const dot=$('#cDot'),ring=$('#cRing');let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.translate=`${mx}px ${my}px`});
  (function l(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.translate=`${rx}px ${ry}px`;requestAnimationFrame(l)})();
  document.addEventListener('pointerover',e=>{ring.classList.toggle('hover',!!e.target.closest('a,button,.ig-post,.hl,[data-hover]'))});
  $$('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
  });
}

/* ---------- Click sparks ---------- */
(function(){
  const c=$('#sparkCanvas'),x=c.getContext('2d');let sparks=[];
  function size(){c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio}size();addEventListener('resize',size);
  addEventListener('pointerdown',e=>{if(reduce)return;const t=performance.now();for(let i=0;i<9;i++)sparks.push({x:e.clientX,y:e.clientY,a:i/9*Math.PI*2+Math.random()*.3,t})});
  (function l(now){
    requestAnimationFrame(l);if(!sparks.length)return;
    x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);x.clearRect(0,0,innerWidth,innerHeight);
    sparks=sparks.filter(s=>{const p=(now-s.t)/450;if(p>=1)return false;const e=p*(2-p),d=e*38,len=14*(1-e);
      x.strokeStyle=`rgba(227,20,27,${1-p})`;x.lineWidth=2.2;x.beginPath();
      x.moveTo(s.x+Math.cos(s.a)*d,s.y+Math.sin(s.a)*d);x.lineTo(s.x+Math.cos(s.a)*(d+len),s.y+Math.sin(s.a)*(d+len));x.stroke();return true});
  })(0);
})();

/* ---------- Scroll velocity marquee ---------- */
(function(){
  const ms=$$('.marquee').map(m=>{m.innerHTML=m.innerHTML.repeat(4);return{el:m,x:0,dir:+m.dataset.speed}});
  let last=scrollY,vel=0;
  (function l(){
    const d=scrollY-last;last=scrollY;vel+=(d-vel)*.1;
    ms.forEach(m=>{const half=m.el.scrollWidth/2;m.x-=(1.1+Math.abs(vel)*.35)*m.dir*(vel<0?-1:1);if(m.x<=-half)m.x+=half;if(m.x>0)m.x-=half;
      m.el.style.transform=`translateX(${m.x}px) skewX(${Math.max(-12,Math.min(12,-vel*.6))}deg)`});
    requestAnimationFrame(l);
  })();
})();

/* ---------- Reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target;el.classList.add('active');io.unobserve(el);
  setTimeout(()=>el.style.transitionDelay='0s',1700);
  el.querySelectorAll('[data-count]').forEach(countUp);
}),{threshold:.12});
function observeReveals(){$$('.reveal,.mask-line').forEach(el=>{if(!el.classList.contains('active'))io.observe(el)})}

/* ---------- Count up ---------- */
function countUp(el){
  const end=+el.dataset.count,dec=+(el.dataset.dec||0),t0=performance.now(),dur=1800;
  (function f(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=(end*e).toFixed(dec).replace('.',',');if(p<1)requestAnimationFrame(f)})(t0);
}

/* ---------- Tilt + spotlight ---------- */
if(finePointer&&!reduce)$$('.tilt').forEach(c=>{
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',px*100+'%');c.style.setProperty('--my',py*100+'%');
    c.style.transform=`perspective(900px) rotateX(${(py-.5)*-10}deg) rotateY(${(px-.5)*12}deg) translateY(-8px)`});
  c.addEventListener('pointerleave',()=>{c.style.transform=''});
});

/* ---------- Scroll-driven: statement words, steps, giant footer ---------- */
const st=$('#scrollText');
st.innerHTML=st.textContent.split(' ').map(w=>w.startsWith('*')?`<span class="w hi">${w.replace(/\*/g,'')}</span>`:`<span class="w">${w}</span>`).join(' ');
const words=$$('#scrollText .w'),steps=$$('.step'),line=$('#stepsLine'),giant=$('#giant');
function onScroll(){
  let r=st.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(r.height+innerHeight*.45);
  p=Math.max(0,Math.min(1,p));const n=Math.floor(p*words.length*1.05);words.forEach((w,i)=>w.classList.toggle('on',i<n));
  const sr=$('#steps').getBoundingClientRect();let sp=(innerHeight*.75-sr.top)/(sr.height*.9);sp=Math.max(0,Math.min(1,sp));
  line.style.setProperty('--prog',sp);steps.forEach((s,i)=>s.classList.toggle('lit',sp>=i/(steps.length-1)-.02||(isMobile&&s.getBoundingClientRect().top<innerHeight*.75)));
  const gr=giant.getBoundingClientRect();let gp=(innerHeight-gr.top)/(gr.height+Math.min(260,innerHeight*.3));giant.style.setProperty('--fill',Math.max(0,Math.min(100,gp*100))+'%');
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- Marcas ---------- */
const marcas=['Chevrolet','Volkswagen','Fiat','Ford','Toyota','Honda','Jeep','Nissan','Mitsubishi','Renault','Peugeot','Citroën'];
$('#logoLoop').innerHTML=[...marcas,...marcas].map((m,i)=>`<span class="${i%2?'r':''}">${m}</span>`).join('');

/* ---------- Instagram grid ---------- */
const posts=[
  {img:'assets/img/cuidado.jpg',cap:'Aqui seu carro recebe cuidado de verdade',t:'p',l:24,c:3},
  {img:'assets/img/vapor.jpg',cap:'Serviço a todo vapor!',t:'r',l:41,c:5},
  {img:'assets/img/equipe.jpg',cap:'A equipe RD Auto Mecânica',t:'p',l:57,c:9},
  {img:'assets/img/confianca.jpg',cap:'Serviço automotivo de confiança',t:'r',l:33,c:4},
  {img:'assets/img/inauguracao.jpg',cap:'Grande inauguração: 13/06/2026',t:'p',l:62,c:14},
  {img:'assets/img/hilux.jpg',cap:'Segundou na RD! Bora pra cima',t:'r',l:29,c:2},
  {img:'assets/img/troca-de-oleo.jpg',cap:'Óleo em dia com economia',t:'r',l:38,c:6},
  {img:'assets/img/branco.jpg',cap:'Estrutura pronta para receber seu carro',t:'r',l:27,c:1},
  {img:'assets/img/fachada.jpg',cap:'Nossa fachada no Jardim São Cristóvão',t:'p',l:45,c:7},
  {img:'assets/img/caneca.jpg',cap:'O sucesso é resultado de esforço e dedicação',t:'p',l:31,c:2},
  {img:'assets/img/elevador.jpg',cap:'Elevador em ação',t:'p',l:22,c:1},
  {img:'assets/img/marcas.jpg',cap:'Especialistas em carros de passeio e caminhonetes 4x4',t:'p',l:36,c:3}
];
$('#igGrid').innerHTML=posts.map((p,i)=>`<div class="ig-post reveal" style="transition-delay:${(i%3)*.08+Math.floor(i/3)*.05}s" data-i="${i}">
  <img src="${p.img}" alt="${p.cap}" loading="lazy">${p.t==='r'?'<i class="fa-solid fa-play type"></i>':''}
  <div class="ov"><span><i class="fa-solid fa-heart"></i>${p.l}</span><span><i class="fa-solid fa-comment"></i>${p.c}</span></div></div>`).join('');

/* ---------- Lightbox com transição FLIP ---------- */
(function(){
  const lb=$('#lightbox'),img=$('#lbImg'),cap=$('#lbCap');let cur=0,srcEl=null;
  function target(nw,nh){const mw=innerWidth*(isMobile?.94:.8),mh=innerHeight*(isMobile?.72:.84);const s=Math.min(mw/nw,mh/nh);const w=nw*s,h=nh*s;return{x:(innerWidth-w)/2,y:(innerHeight-h)/2-(isMobile?30:0),w,h}}
  function place(r,anim){img.style.transition=anim?'transform .6s cubic-bezier(0.25,1,0.5,1)':'none';img.style.width=img._t.w+'px';img.style.height=img._t.h+'px';
    img.style.transform=`translate(${r.x}px,${r.y}px) scale(${r.w/img._t.w},${r.h/img._t.h})`}
  function open(i){
    cur=i;srcEl=$(`.ig-post[data-i="${i}"] img`);const p=posts[i];
    img.src=p.img;cap.textContent=p.cap;
    const go=()=>{img._t=target(img.naturalWidth,img.naturalHeight);const r=srcEl.getBoundingClientRect();
      place({x:r.left,y:r.top,w:r.width,h:r.height},false);lb.classList.add('open');img.style.opacity=1;
      requestAnimationFrame(()=>requestAnimationFrame(()=>place(img._t,true)))};
    img.complete?go():img.onload=go;document.body.style.overflow='hidden';
  }
  function close(){const r=srcEl.getBoundingClientRect();place({x:r.left,y:r.top,w:r.width,h:r.height},true);lb.classList.remove('open');
    setTimeout(()=>{img.style.opacity=0},560);document.body.style.overflow=''}
  function nav(d){cur=(cur+d+posts.length)%posts.length;srcEl=$(`.ig-post[data-i="${cur}"] img`);img.style.transition='opacity .2s';img.style.opacity=0;
    setTimeout(()=>{img.src=posts[cur].img;cap.textContent=posts[cur].cap;const f=()=>{img._t=target(img.naturalWidth,img.naturalHeight);place(img._t,false);img.style.transition='opacity .3s';img.style.opacity=1};img.complete?f():img.onload=f},200)}
  img.style.opacity=0;
  $('#igGrid').addEventListener('click',e=>{const p=e.target.closest('.ig-post');if(p)open(+p.dataset.i)});
  $('#lbClose').onclick=close;$('#lbBg').onclick=close;$('#lbPrev').onclick=()=>nav(-1);$('#lbNext').onclick=()=>nav(1);
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')nav(1);if(e.key==='ArrowLeft')nav(-1)});
  addEventListener('resize',()=>{if(lb.classList.contains('open')){img._t=target(img.naturalWidth,img.naturalHeight);place(img._t,false)}});
})();

/* ---------- Stories ---------- */
(function(){
  const sv=$('#story'),slides=$$('.story-slide'),bars=$('#storyBars');let i=0,raf,t0,DUR=5000,paused=false,pauseAt=0;
  bars.innerHTML=slides.map(()=>'<div><i></i></div>').join('');const fills=$$('#storyBars i');
  function show(n){if(n<0)n=0;if(n>=slides.length){close();return}i=n;slides.forEach((s,k)=>s.classList.toggle('on',k===i));fills.forEach((f,k)=>f.style.width=k<i?'100%':'0%');t0=performance.now();}
  function loop(t){raf=requestAnimationFrame(loop);if(paused)return;const p=(t-t0)/DUR;fills[i].style.width=Math.min(100,p*100)+'%';if(p>=1)show(i+1)}
  function open(n){sv.classList.add('open');document.body.style.overflow='hidden';show(n);cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  function close(){sv.classList.remove('open');cancelAnimationFrame(raf);document.body.style.overflow=''}
  $$('.hl').forEach(h=>h.addEventListener('click',()=>open(+h.dataset.story)));
  $('#storyClose').onclick=close;$('#storyL').onclick=()=>show(i-1);$('#storyR').onclick=()=>show(i+1);
  sv.addEventListener('click',e=>{if(e.target===sv)close()});
  const fr=$('.story-frame');fr.addEventListener('pointerdown',()=>{paused=true;pauseAt=performance.now()});
  fr.addEventListener('pointerup',()=>{paused=false;t0+=performance.now()-pauseAt});
  addEventListener('keydown',e=>{if(!sv.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(i+1);if(e.key==='ArrowLeft')show(i-1)});
})();

/* ---------- Avaliações reais (Google Maps) ---------- */
const avaliacoes=[
  {"nome": "Andrew Mendes", "estrelas": 5, "texto": "Serviço e espaço de qualidade, preço justo e tudo nos conformes. Recomendo sem sombra de dúvidas!", "tempo": "uma semana atrás"},
  {"nome": "Thays Costa", "estrelas": 5, "texto": "Chamei de última hora, foram rapidamente me atender e ganharam a cliente. Atendimento sem igual, preço justo e, principalmente, DE CONFIANÇA! Já fiz vários serviços com eles, e cada atendimento sinto mais confiança no trabalho deles. Mêcanica de qualidade, confiança e preço justo", "tempo": "3 meses atrás"},
  {"nome": "Lucas Carvalho", "estrelas": 5, "texto": "Gostei muito do atendimento e do cuidado com o meu carro, fiquei muito satisfeito com o resultado do trabalho feito, a loja é toda equipe está de parabéns, Já me ganharam como cliente!👏🏼👏🏼", "tempo": "um mês atrás"},
  {"nome": "Jose Benedito Vieira Da Silva", "estrelas": 5, "texto": "Gostei muito do atendimento em geral, o meu problema foi resolvido, local bem organizado e limpo, o pessoal super educado, resumindo (Super indico).", "tempo": "5 meses atrás"},
  {"nome": "Laís Mendes", "estrelas": 5, "texto": "A melhor que há em toda a ilha de São Luís. Serviço e atendimento de excelência, uma equipe que trabalha fortemente para solucionar os problemas do seu veículo, com honestidade e confiança 🥰👏🏻❤️🖤", "tempo": "5 meses atrás"},
  {"nome": "Milena Cardoso Moreira", "estrelas": 5, "texto": "Excelente experiência! Atendimento muito atencioso, serviço de qualidade e profissionais que realmente se preocupam com o cliente. Com certeza voltarei quando precisar e recomendo sem hesitar. Parabéns pelo excelente trabalho!", "tempo": "5 meses atrás"}
];
const card=a=>`<div class="review-card"><div class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(a.estrelas)}</div><p>"${a.texto}"</p>
  <div class="reviewer"><div class="avatar">${a.nome.trim().charAt(0).toUpperCase()}</div><div><strong>${a.nome}</strong><span>${a.tempo}</span></div><i class="fa-brands fa-google g"></i></div></div>`;
const rh=avaliacoes.map(card).join('');$('#track').innerHTML=rh+rh;

/* ---------- Formulário -> WhatsApp ---------- */
$('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  ['nome','tel','veiculo'].forEach(id=>{const f=document.getElementById(id),w=f.parentElement;w.classList.remove('err');if(!f.value.trim()){void w.offsetWidth;w.classList.add('err');ok=false}});
  if(!ok)return;
  const v=id=>document.getElementById(id).value.trim();
  const texto=`Olá, RD Auto Mecânica! Vim pelo site e gostaria de agendar um serviço.\n\n*Nome:* ${v('nome')}\n*Telefone:* ${v('tel')}\n*Veículo:* ${v('veiculo')}\n*Mensagem:* ${v('msg')||'-'}`;
  const b=$('#sendBtn');b.classList.add('sent');
  window.open('https://wa.me/5598988233321?text='+encodeURIComponent(texto),'_blank');
  setTimeout(()=>b.classList.remove('sent'),3000);
});

function fitGiant(){const g=$('#giant'),s=$('#giantIn');g.style.fontSize='';const fs=parseFloat(getComputedStyle(g).fontSize);const target=g.clientWidth*.92;if(s.offsetWidth>target)g.style.fontSize=(fs*target/s.offsetWidth)+'px'}
fitGiant();addEventListener('resize',fitGiant);document.fonts&&document.fonts.ready.then(fitGiant);
$('#toTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});
$('#ano').textContent=new Date().getFullYear();
observeReveals();
