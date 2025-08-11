// Tabs & Theme
function initTabsTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabs = document.querySelectorAll('.tab');
  if (!themeToggle || tabButtons.length === 0 || tabs.length === 0) return;
  themeToggle.addEventListener('click', () => document.documentElement.classList.toggle('light'));
  function activateTab(id) {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab-button[data-tab="${id}"]`)?.classList.add('active');
    document.getElementById(id)?.classList.add('active');
  }
  tabButtons.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.dataset.tab;
      activateTab(id);
      history.replaceState(null, '', '#' + id);
    });
  });
  // Ensure tab and section match on load
  let initBtn = document.querySelector('.tab-button.active');
  let initTab = document.querySelector('.tab.active');
  if (!initBtn && initTab) initBtn = document.querySelector(`.tab-button[data-tab="${initTab.id}"]`);
  if (!initTab && initBtn) initTab = document.getElementById(initBtn.dataset.tab);
  if (!initBtn || !initTab) {
    initBtn = document.querySelector('.tab-button');
    initTab = initBtn ? document.getElementById(initBtn.dataset.tab) : null;
  }
  if (initBtn && initTab) {
    tabButtons.forEach(b => b.classList.toggle('active', b === initBtn));
    tabs.forEach(t => t.classList.toggle('active', t === initTab));
  }
}
initTabsTheme();

navigator.serviceWorker?.addEventListener('message', e => {
  if (e.data?.type === 'SW_READY') document.body.classList.remove('updating');
});

/* -------- Curriculum persistence -------- */
function initCurriculum() {
  const lists = document.querySelectorAll('ul.todo');
  if (lists.length === 0) return;
  lists.forEach(list => {
    const key = 'ccppwa3_' + list.dataset.key;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (saved.length) [...list.querySelectorAll('input[type=checkbox]')].forEach((c, i) => c.checked = !!saved[i]);
    const wrap = list.parentElement;
    const saveBtn = wrap?.querySelector('.saveList');
    const resetBtn = wrap?.querySelector('.resetList');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const arr = [...list.querySelectorAll('input[type=checkbox]')].map(c => c.checked);
        localStorage.setItem(key, JSON.stringify(arr));
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        [...list.querySelectorAll('input[type=checkbox]')].forEach(c => c.checked = false);
        localStorage.removeItem(key);
      });
    }
  });
}
initCurriculum();

/* -------- Lessons -------- */
function initLessons() {
  const lessonSel = document.getElementById('lessonSelect');
  const lessonInfo = document.getElementById('lessonInfo');
  if (!lessonSel || !lessonInfo) return;
  const LESSONS = [
    {id:'L1', level:'A', title:'Accordi aperti 1', goals:['C, G, D, Em, Am','Cambi a tempo lento','Strumming ↓ in 4/4'],
     steps:['Postura e impugnatura plettro','Suona corde a vuoto col metronomo (60 BPM)','Impara le posizioni: C, G, D, Em, Am','Cambia C↔G e G↔D lentamente','Strumming solo ↓ (4 colpi x battuta)'],
     suggest:['beginner guitar chords italian','how to change chords cleanly guitar','strumming patterns 4/4 beginner']},
    {id:'L2', level:'A', title:'Strumming alternato', goals:['↓↑ rilassato','Ghost stroke e dinamica','Muting con palmo'],
     steps:['Metronomo 70–80 BPM','Pattern ↓ ↑ ↓ ↑ su Em','Aggiungi accento sul 2 e 4','Ghost stroke sui movimenti in aria','Palm muting leggero su ponte'],
     suggest:['strumming down up tutorial','accent on 2 and 4 guitar','palm muting acoustic guitar']},
    {id:'L3', level:'B', title:'Barrè base (F forma E)', goals:['Pollice dietro corretto','Pressione minima','Cambi lenti a/b'],
     steps:['Riscalda dita','Forma F al 1° tasto (mini-barrè prime 2 corde)','Aggiungi barrè completo quando pulito','Cambia C → F → C','Metronomo 60 BPM, 1 battuta per cambio'],
     suggest:['how to play F barre chord','barre chord tips acoustic','reduce hand tension guitar']},
    {id:'L4', level:'C', title:'Pentatonica Am Box 1–2', goals:['Box 1 pulito','Connessione a Box 2','Timing con backtrack'],
     steps:['Memorizza Box 1 (quinta posizione)','Aggiungi note passaggio verso 8–10','Backtrack Am 80–100 BPM','Frasi 2 battute, lascia 2 battute di respiro'],
     suggest:['pentatonic box 1 tutorial','connect pentatonic boxes','backing track A minor 90 bpm']},
    {id:'L5', level:'D', title:'CAGED in mix ritmico', goals:['Forme C/A/G/E/D su accordi reali','Transizioni fluide','Strumming + arpeggi'],
     steps:['Tonalità G','Progressione I–V–vi–IV con forme CAGED diverse','Alterna 2 misure strum + 2 misure arpeggio','Registra e riascolta'],
     suggest:['CAGED system explained','pop progression I V vi IV guitar','fingerpicking arpeggio beginner']},
  ];
  LESSONS.forEach(l => { const o = document.createElement('option'); o.value = l.id; o.textContent = `${l.id} · ${l.title}`; lessonSel.appendChild(o); });
  lessonSel.value = LESSONS[0].id;
  function renderLesson(id) {
    const L = LESSONS.find(x => x.id === id);
    if (!L) return;
    lessonInfo.innerHTML = `
      <h3>${L.title} <small class="badge">Livello ${L.level}</small></h3>
      <h4>Obiettivi</h4>
      <ul>${L.goals.map(g => `<li>${g}</li>`).join('')}</ul>
      <h4>Passi</h4>
      <ol class="steps">${L.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    `;
  }
  renderLesson(lessonSel.value);
  lessonSel.addEventListener('change', e => renderLesson(e.target.value));
  document.querySelectorAll('.ytSearch').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = encodeURIComponent(btn.dataset.q);
      window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
    });
  });
  const embedBtn = document.getElementById('embedLessonYt');
  const ytLessonUrl = document.getElementById('ytLessonUrl');
  const ytLessonWrap = document.getElementById('ytLessonWrap');
  if (embedBtn && ytLessonUrl && ytLessonWrap) {
    embedBtn.addEventListener('click', () => {
      const url = ytLessonUrl.value.trim();
      ytLessonWrap.innerHTML = '';
      if (!url) return;
      let embed = '';
      if (url.includes('playlist?list=')) {
        const id = new URL(url).searchParams.get('list');
        embed = `https://www.youtube.com/embed/videoseries?list=${id}`;
      } else {
        let v = null; try { v = new URL(url).searchParams.get('v'); } catch (e) {}
        if (!v && url.includes('youtu.be/')) v = url.split('youtu.be/')[1].split(/[?&]/)[0];
        if (v) embed = `https://www.youtube.com/embed/${v}`;
      }
      if (embed) {
        const iframe = document.createElement('iframe');
        iframe.src = embed;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        ytLessonWrap.appendChild(iframe);
      }
    });
  }
}
initLessons();

/* -------- Practice tracker -------- */
function initPracticeTracker() {
  const catSel = document.getElementById('catSelect');
  const startBtn = document.getElementById('startTimer');
  const pauseBtn = document.getElementById('pauseTimer');
  const saveBtn = document.getElementById('saveTimer');
  const timerDisp = document.getElementById('timerDisplay');
  const weekBars = document.getElementById('weekBars');
  const totalsEl = document.getElementById('totals');
  if (!catSel || !startBtn || !pauseBtn || !saveBtn || !timerDisp || !weekBars || !totalsEl) return;
  let t0 = null, acc = 0, ticking = null;
  function fmt(s) { const m = Math.floor(s / 60), r = s % 60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; }
  function tick() { const s = Math.floor((Date.now() - t0) / 1000) + acc; timerDisp.textContent = fmt(s); }
  startBtn.addEventListener('click', () => {
    if (ticking) return; t0 = Date.now(); ticking = setInterval(tick, 250);
    startBtn.disabled = true; pauseBtn.disabled = false; saveBtn.disabled = false;
  });
  pauseBtn.addEventListener('click', () => {
    if (!ticking) return; clearInterval(ticking); ticking = null;
    const seconds = Math.floor((Date.now() - t0) / 1000); acc += seconds; tick();
    startBtn.disabled = false; pauseBtn.disabled = true;
  });
  function loadLog() { return JSON.parse(localStorage.getItem('ccppwa3_log') || '{}'); }
  function saveLog(obj) { localStorage.setItem('ccppwa3_log', JSON.stringify(obj)); }
  saveBtn.addEventListener('click', () => {
    if (t0) {
      if (ticking) { clearInterval(ticking); ticking = null; acc += Math.floor((Date.now() - t0) / 1000); }
      const d = new Date(); const key = d.toISOString().slice(0, 10);
      const log = loadLog(); log[key] = log[key] || {}; const cat = catSel.value;
      log[key][cat] = (log[key][cat] || 0) + acc;
      saveLog(log); acc = 0; timerDisp.textContent = '00:00'; startBtn.disabled = false; pauseBtn.disabled = true; saveBtn.disabled = true;
      renderWeek(); renderTotals();
    }
  });
  function renderWeek() {
    weekBars.innerHTML = '';
    const log = loadLog(); const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i); const key = d.toISOString().slice(0, 10);
      const day = log[key] || {}; const total = Object.values(day).reduce((a, b) => a + b, 0);
      const div = document.createElement('div'); div.className = 'bar';
      const fill = document.createElement('div'); fill.className = 'fill';
      const max = 60 * 45; const h = Math.min(100, Math.round(100 * total / max));
      fill.style.height = h + '%';
      div.appendChild(fill);
      const lab = document.createElement('small'); lab.textContent = key.slice(5); lab.style.position = 'absolute'; lab.style.top = '4px'; lab.style.left = '6px'; lab.style.color = 'var(--muted)';
      div.appendChild(lab);
      weekBars.appendChild(div);
    }
  }
  function renderTotals() {
    const log = loadLog(); const now = new Date(); let week = 0;
    for (let i = 0; i < 7; i++) { const d = new Date(now); d.setDate(now.getDate() - i); const key = d.toISOString().slice(0, 10); const day = log[key] || {}; week += Object.values(day).reduce((a, b) => a + b, 0); }
    const mins = Math.round(week / 60);
    totalsEl.textContent = `Totale 7 giorni: ${mins} min`;
  }
  renderWeek(); renderTotals();
}
initPracticeTracker();

/* -------- Songs (with capo per-song and transposition) + autoscroll -------- */
const SONGS = [
  {id:'P1', name:'Pop 4/4 — I–V–vi–IV (G)', bpm:92, chart:[
    'Intro | G  D  Em  C | x2',
    'Verse | G  D  Em  C | G  D  C  C |',
    'Chorus| G  D  Em  C | x2',
    'Bridge| Em D C  C |',
    'Chorus| G  D  Em  C | x2 | End on G'
  ]},
  {id:'DW', name:'Doo-wop — I–vi–IV–V (C)', bpm:78, chart:[
    'Intro | C  Am  F  G | x2',
    'Verse | C  Am  F  G | x2',
    'Chorus| C  Am  F  G | x2',
    'Bridge| F  G   C  Am | F  G   C  C |',
    'Chorus| C  Am  F  G | x2 | End on C'
  ]},
  {id:'BL', name:'Blues 12-bar (A)', bpm:96, chart:[
    'A | A  A  A  A |',
    'D | D  D  A  A |',
    'E | E  D  A  E | (repeat)'
  ]},
  {id:'FG', name:'Folk Train — I–IV–V (D)', bpm:96, chart:[
    'Verse | D  G  D  D | G  G  D  D | A  G  D  D | (repeat)'
  ]},
  {id:'S1', name:'Stile “Stand By Me” — I–vi–IV–V (A)', bpm:80, chart:[
    'All | A  F#m  D  E | (ripeti)'
  ]},
  {id:'S2', name:'Stile “Let It Be” — I–V–vi–IV (C)', bpm:72, chart:[
    'Prog | C  G  Am  F | C  G  F  C | (ripeti)'
  ]},
  {id:'S3', name:'Stile “Wonderwall” — Em7–G–D–A7sus4', bpm:87, chart:[
    'All | Em7  G  D  A7sus4 | (ripeti)'
  ]},
  {id:'S4', name:'Stile “Knockin’ on Heaven’s Door” — G–D–Am7/C', bpm:68, chart:[
    'All | G  D  Am7  G | G  D  C  C | (ripeti)'
  ]}
];
const songSel = document.getElementById('songSelect');
SONGS.forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.name; songSel.appendChild(o); });
songSel.value = SONGS[0].id;
const songChart = document.getElementById('songChart');
const capoInput = document.getElementById('capo');
const CAPO_KEY = 'ccppwa3_capos';
function loadCapos(){ return JSON.parse(localStorage.getItem(CAPO_KEY)||'{}'); }
function saveCapos(obj){ localStorage.setItem(CAPO_KEY, JSON.stringify(obj)); }

function transposeChord(ch, semis){
  const m = ch.match(/^([A-G])(#{1}|b{1})?(.*)$/);
  if (!m) return ch;
  let [_, root, acc, rest] = m;
  const N_SH = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const N_FL = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const use = acc === 'b' ? N_FL : N_SH;
  let idx = use.indexOf(root + (acc||''));
  if (idx<0){
    idx = (acc==='b' ? N_SH.indexOf(root+'#') : N_FL.indexOf(root+'b'));
    if (idx<0) idx = N_SH.indexOf(root);
  }
  let newIdx = (idx + semis) % 12; if (newIdx<0) newIdx+=12;
  const newRoot = use[newIdx];
  return newRoot + (rest||'');
}
function transposeLine(line, semis){
  return line.replace(/\b([A-G](?:#|b)?(?:m|maj|dim|aug)?(?:7|9|11|13)?(?:sus2|sus4)?(?:add9)?(?:m7|maj7)?(?:\/[A-G](?:#|b)?)?)\b/g, (m)=>{
    if (m.includes('/')){
      const parts = m.split('/');
      return transposeChord(parts[0], semis) + '/' + transposeChord(parts[1], semis);
    }
    return transposeChord(m, semis);
  });
}
function renderSong(id){
  const S = SONGS.find(x=>x.id===id); songChart.innerHTML='';
  const capos = loadCapos(); const capo = capos[id] || 0;
  capoInput.value = capo;
  S.chart.forEach(line=>{
    const d=document.createElement('div'); d.className='line';
    d.textContent = capo ? transposeLine(line, capo) : line;
    songChart.appendChild(d);
  });
}
renderSong(songSel.value);
songSel.addEventListener('change', e=>renderSong(e.target.value));
capoInput.addEventListener('input', ()=>{
  const id = songSel.value; const capos = loadCapos(); capos[id] = parseInt(capoInput.value,10)||0; saveCapos(capos); renderSong(id);
});

const speed = document.getElementById('scrollSpeed');
const speedVal = document.getElementById('speedVal');
speed.addEventListener('input', ()=>speedVal.textContent = speed.value);
speedVal.textContent = speed.value;

let scrollTimer=null, last=0;
document.getElementById('startScroll').addEventListener('click', ()=>{
  const pxs = parseInt(speed.value,10);
  last = performance.now();
  function step(ts){
    const dt = ts - last; last = ts;
    songChart.scrollTop += (pxs/1000)*dt;
    scrollTimer = requestAnimationFrame(step);
  }
  scrollTimer = requestAnimationFrame(step);
  document.getElementById('startScroll').disabled=true; document.getElementById('stopScroll').disabled=false;
});
document.getElementById('stopScroll').addEventListener('click', ()=>{
  if (scrollTimer) cancelAnimationFrame(scrollTimer);
  scrollTimer=null; document.getElementById('startScroll').disabled=false; document.getElementById('stopScroll').disabled=true;
});

/* -------- Fingerpicking trainer -------- */
const CHORDS={ "C":[0,1,0,2,3,'x'], "G":[3,0,0,0,2,3], "D":[2,3,2,0,'x','x'],
  "A":[0,2,2,2,0,'x'], "E":[0,0,1,2,2,0], "Am":[0,1,2,2,0,'x'],
  "Em":[0,0,0,2,2,0], "Dm":[1,3,2,0,'x','x'], "F":[1,1,2,3,3,1]
};
const BASS_ROOT = { "C":5, "G":6, "D":4, "A":5, "E":6, "Am":5, "Em":6, "Dm":4, "F":6 };
function initFingerpicking() {
  const fpChordSel = document.getElementById('fpChord');
  const fpViz = document.getElementById('fpViz');
  const startBtn = document.getElementById('startFp');
  const stopBtn = document.getElementById('stopFp');
  const patternSel = document.getElementById('fpPattern');
  const bpmInput = document.getElementById('fpBpm');
  if (!fpChordSel || !fpViz || !startBtn || !stopBtn || !patternSel || !bpmInput) return;
  Object.keys(CHORDS).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=k; fpChordSel.appendChild(o); });
  fpChordSel.value='C';
  function renderFpStrings(){
    fpViz.innerHTML='';
    const names=['1^ e','2^ B','3^ G','4^ D','5^ A','6^ E'];
    for (let i=6;i>=1;i--){
      const d = document.createElement('div'); d.className='s'; d.dataset.str = names[6-i];
      d.id = 'fp-s'+i; fpViz.appendChild(d);
    }
  }
  renderFpStrings();
  let fpTimer=null, fpCtx=null;
  function playString(stringIdx, chordName){
    const freqsOpen = {1:329.63,2:246.94,3:196.00,4:146.83,5:110.00,6:82.41};
    const shape = CHORDS[chordName];
    const val = shape[6-stringIdx];
    let base = freqsOpen[stringIdx];
    let f = (typeof val==='number' && val>0) ? base * Math.pow(2, val/12) : base;
    if (!fpCtx) fpCtx = new (window.AudioContext||window.webkitAudioContext)();
    const o=fpCtx.createOscillator(), g=fpCtx.createGain();
    o.type='triangle'; o.frequency.value=f; g.gain.value=0.0001; o.connect(g); g.connect(fpCtx.destination);
    const t = fpCtx.currentTime;
    o.start(t); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.12, t+0.02); g.gain.exponentialRampToValueAtTime(0.0001, t+0.35); o.stop(t+0.4);
  }
  function highlight(stringIdx){
    [...fpViz.children].forEach(el=>el.classList.remove('active'));
    const el = document.getElementById('fp-s'+stringIdx); if (el) el.classList.add('active');
  }
  function startFingerpicking(){
    stopFingerpicking();
    const patternId = patternSel.value;
    const bpm = parseInt(bpmInput.value,10);
    const chord = fpChordSel.value;
    const bass = BASS_ROOT[chord] || 6;
    const alt = Math.max(4, bass-2);
    let seq = [];
    if (patternId==='arp'){ seq = [6,3,2,1,3,2,1,2]; }
    else if (patternId==='travis'){ seq = ['B',3,'b',2,'B',3,'b',2]; }
    else if (patternId==='waltz'){ seq = [5,3,2,5,3,2]; }
    seq = seq.map(x=> x==='B'? bass : (x==='b'? alt : x) );
    const interval = 60000/bpm/2;
    let i=0;
    fpTimer = setInterval(()=>{
      const s = seq[i % seq.length];
      highlight(s);
      playString(s, chord);
      i++;
    }, interval);
    startBtn.disabled=true; stopBtn.disabled=false;
  }
  function stopFingerpicking(){
    if (fpTimer) clearInterval(fpTimer);
    fpTimer=null;
    startBtn.disabled=false; stopBtn.disabled=true;
    [...fpViz.children].forEach(el=>el.classList.remove('active'));
  }
  startBtn.addEventListener('click', startFingerpicking);
  stopBtn.addEventListener('click', stopFingerpicking);
}
initFingerpicking();

/* -------- Tuner -------- */
let audioCtx2, analyser, micSource, rafId;
const bufLen = 2048; let buf = new Float32Array(bufLen);
const noteEl = document.getElementById('note'), freqEl=document.getElementById('freq'), centsEl=document.getElementById('cents'), needle=document.getElementById('needle'), refA=document.getElementById('refA');
function freqToIndex(f,A4=440){ return Math.round(12*Math.log2(f/A4)); }
function idxToName(n){ const N=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; return N[((n+9)%12+12)%12]; }
function targetFreq(n,A4=440){ return A4 * Math.pow(2, n/12); }
function centsOff(f,t){ return Math.floor(1200*Math.log2(f/t)); }
function autoCorrelate(buffer, sampleRate){
  let SIZE=buffer.length, rms=0; for (let i=0;i<SIZE;i++){ let v=buffer[i]; rms+=v*v; } rms=Math.sqrt(rms/SIZE); if (rms<0.01) return -1;
  let c=new Array(SIZE).fill(0); for (let i=0;i<SIZE;i++) for (let j=0;j<SIZE-i;j++) c[i]+= buffer[j]*buffer[j+i];
  let d=0; while(c[d]>c[d+1]) d++; let maxv=-1, maxp=-1; for (let i=d;i<SIZE;i++){ if (c[i]>maxv){maxv=c[i]; maxp=i;} }
  let T0=maxp; if (c[T0-1]&&c[T0+1]){ let x1=c[T0-1], x2=c[T0], x3=c[T0+1]; let a=(x1+x3-2*x2)/2, b=(x3-x1)/2; if (a) T0 = T0 - b/(2*a); }
  return sampleRate/T0;
}
async function startTuner(){
  if (audioCtx2) return;
  audioCtx2 = new (window.AudioContext||window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({audio:true});
  micSource = audioCtx2.createMediaStreamSource(stream); analyser = audioCtx2.createAnalyser(); analyser.fftSize=2048; micSource.connect(analyser);
  const loop = ()=>{
    analyser.getFloatTimeDomainData(buf);
    const f = autoCorrelate(buf, audioCtx2.sampleRate);
    if (f>0){ const A=parseFloat(refA.value||440); const n=freqToIndex(f,A); const name=idxToName(n); const tgt=targetFreq(n,A); const cents=centsOff(f,tgt);
      noteEl.textContent=name; freqEl.textContent=f.toFixed(2)+' Hz'; centsEl.textContent=(cents>0?'+':'')+cents+'¢';
      const clamp=Math.max(-50,Math.min(50,cents)), percent=(clamp+50)/100; needle.style.left=(8+percent*84)+'%'; needle.style.background=Math.abs(cents)<5?'var(--ok)':'var(--warn)';
    } else { noteEl.textContent='--'; freqEl.textContent='0.0 Hz'; centsEl.textContent='0¢'; needle.style.left='50%'; needle.style.background='var(--warn)'; }
    rafId = requestAnimationFrame(loop);
  }; loop();
  document.getElementById('startTuner').disabled=true; document.getElementById('stopTuner').disabled=false;
}
function stopTuner(){ if (rafId) cancelAnimationFrame(rafId); if (audioCtx2){ audioCtx2.close(); audioCtx2=null; } document.getElementById('startTuner').disabled=false; document.getElementById('stopTuner').disabled=true; }
document.getElementById('startTuner').addEventListener('click', startTuner);
document.getElementById('stopTuner').addEventListener('click', stopTuner);

/* -------- Metronome -------- */
let metroCtx, metroTimer;
const startMetro=document.getElementById('startMetro'), stopMetro=document.getElementById('stopMetro'), bpmInput=document.getElementById('bpm'), timeSig=document.getElementById('timeSig'), accentChk=document.getElementById('accent'), lights=document.getElementById('metroLights');
function setupLights(){ lights.innerHTML=''; const count=parseInt(timeSig.value,10); for(let i=0;i<count;i++){ const d=document.createElement('div'); d.className='light'; lights.appendChild(d);} }
setupLights(); timeSig.addEventListener('change', setupLights);
function clickSound(accent=false){ if(!metroCtx) metroCtx=new (window.AudioContext||window.webkitAudioContext)(); const o=metroCtx.createOscillator(), g=metroCtx.createGain(); o.type='square'; o.frequency.value=accent?1200:880; g.gain.value=accent?0.15:0.08; o.connect(g); g.connect(metroCtx.destination); o.start(); o.stop(metroCtx.currentTime+0.05); }
function startMetronome(){ const bpm=parseInt(bpmInput.value,10); const interval=60000/bpm; const beats=parseInt(timeSig.value,10); let beat=0; stopMetronome(); const lightsEls=[...lights.children];
  metroTimer=setInterval(()=>{ lightsEls.forEach(el=>el.classList.remove('active')); const accent=accentChk.checked && beat===0; lightsEls[beat].classList.add('active'); clickSound(accent); beat=(beat+1)%beats; }, interval);
  startMetro.disabled=true; stopMetro.disabled=false; }
function stopMetronome(){ if(metroTimer) clearInterval(metroTimer); startMetro.disabled=false; stopMetro.disabled=true; }
startMetro.addEventListener('click', startMetronome); stopMetro.addEventListener('click', stopMetronome);

/* -------- Chords (diagram & arpeggio) -------- */
const chordSelect=document.getElementById('chordSelect'); Object.keys(CHORDS).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=k; chordSelect.appendChild(o); }); chordSelect.value='C';
const chordSvg=document.getElementById('chordDiagram');
function drawChord(name){ const shape=CHORDS[name]; const w=260,h=220; chordSvg.setAttribute('viewBox',`0 0 ${w} ${h}`); chordSvg.innerHTML=''; const title=document.createElementNS('http://www.w3.org/2000/svg','text'); title.setAttribute('x','10'); title.setAttribute('y','20'); title.setAttribute('fill','currentColor'); title.setAttribute('font-size','18'); title.textContent=name; chordSvg.appendChild(title);
  const left=30, top=30, right=w-20, bottom=h-20, frets=5, strings=6;
  for (let i=0;i<=frets;i++){ const y=top+i*((bottom-top)/frets); const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',left); l.setAttribute('x2',right); l.setAttribute('y1',y); l.setAttribute('y2',y); l.setAttribute('stroke','#2a3170'); chordSvg.appendChild(l); }
  for (let s=0;s<strings;s++){ const x=left+s*((right-left)/(strings-1)); const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',x); l.setAttribute('x2',x); l.setAttribute('y1',top); l.setAttribute('y2',bottom); l.setAttribute('stroke','#2a3170'); chordSvg.appendChild(l); }
  const marksY=top-8; ['e','B','G','D','A','E'].forEach((_,i)=>{ const val=shape[i]; const x=left+i*((right-left)/5); const m=document.createElementNS('http://www.w3.org/2000/svg','text'); m.setAttribute('x',x-4); m.setAttribute('y',marksY); m.setAttribute('fill','currentColor'); m.setAttribute('font-size','14'); m.textContent = val==='x'?'✕':(val===0?'○':''); chordSvg.appendChild(m); });
  shape.forEach((val,i)=>{ if(typeof val==='number' && val>0){ const x=left+i*((right-left)/5); const y=top+(val-0.5)*((bottom-top)/5); const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',10); c.setAttribute('fill','var(--accent)'); chordSvg.appendChild(c);} });
}
drawChord(chordSelect.value); chordSelect.addEventListener('change', e=>drawChord(e.target.value));
document.getElementById('playChord').addEventListener('click', ()=>{
  const shape=CHORDS[chordSelect.value]; const freqs=[329.63,246.94,196.00,146.83,110.00,82.41]; const ctx=new (window.AudioContext||window.webkitAudioContext)(); let t=ctx.currentTime;
  shape.forEach((val,i)=>{ if(val==='x') return; const base=freqs[i]; const f=typeof val==='number'? base*Math.pow(2,val/12):base; const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='triangle'; o.frequency.value=f; g.gain.value=0.0001; o.connect(g); g.connect(ctx.destination); o.start(t); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.1,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.6); o.stop(t+0.7); t+=0.12; });
});

/* -------- Progressions player -------- */
function initProgressions() {
  const keySel=document.getElementById('keySelect');
  const progSel=document.getElementById('progSelect');
  const progNow=document.getElementById('progNow');
  const progBpm=document.getElementById('progBpm');
  const startBtn=document.getElementById('startProg');
  const stopBtn=document.getElementById('stopProg');
  if (!keySel || !progSel || !progNow || !progBpm || !startBtn || !stopBtn) return;
  const KEYS=["C","G","D","A","E","B","F#","C#","F","Bb","Eb","Ab","Db","Gb","Cb"];
  KEYS.forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=k; keySel.appendChild(o); }); keySel.value='C';
  let progTimer, progCtx;
  function chordName(key, degree){ const SEMI=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; const mapFlat={'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B'}; key = mapFlat[key]||key; const keyIndex=SEMI.indexOf(key); const major=[0,2,4,5,7,9,11]; const deg={"I":0,"ii":1,"iii":2,"IV":3,"V":4,"vi":5,"vii":6}[degree]; const pitch=(keyIndex+major[deg])%12; const name=SEMI[pitch]; const qual = degree===degree.toUpperCase()? '':'m'; return name+qual; }
  function noteFreq(name){ const SEMI={"C":261.63,"C#":277.18,"D":293.66,"D#":311.13,"E":329.63,"F":349.23,"F#":369.99,"G":392.00,"G#":415.30,"A":440.00,"A#":466.16,"B":493.88}; return SEMI[name]; }
  function playTriad(freq){ if(!progCtx) progCtx=new (window.AudioContext||window.webkitAudioContext)(); const g=progCtx.createGain(); g.gain.value=0.1; g.connect(progCtx.destination);
    [0,4,7].forEach(semi=>{ const o=progCtx.createOscillator(), gg=progCtx.createGain(); o.type='triangle'; o.frequency.value=freq*Math.pow(2,semi/12); gg.gain.value=0.0001; o.connect(gg); gg.connect(g);
      const t=progCtx.currentTime; o.start(t); gg.gain.setValueAtTime(0.0001,t); gg.gain.exponentialRampToValueAtTime(0.15,t+0.02); gg.gain.exponentialRampToValueAtTime(0.0001,t+0.8); o.stop(t+0.9);
    });
  }
  function startProg(){ stopProg(); const bpm=parseInt(progBpm.value,10); const interval=60000/bpm; const scheme=progSel.value.split('-'); let i=0;
    progTimer=setInterval(()=>{ const deg=scheme[i%scheme.length]; const nm=chordName(keySel.value,deg); const f=noteFreq(nm.replace('m','')); if(f) playTriad(f); progNow.textContent=`→ ${deg} : ${nm}`; i++; }, interval*2);
    startBtn.disabled=true; stopBtn.disabled=false; }
  function stopProg(){ if(progTimer) clearInterval(progTimer); startBtn.disabled=false; stopBtn.disabled=true; progNow.textContent='Pronto…'; }
  startBtn.addEventListener('click', startProg); stopBtn.addEventListener('click', stopProg);
}
initProgressions();

/* -------- Ear, Scales, Exercises, Resources -------- */
const scaleSvg=document.getElementById('scaleDiagram'), scaleSelect=document.getElementById('scaleSelect'), boxSelect=document.getElementById('boxSelect');
function drawScale(scaleId, boxN){ const w=360,h=260; scaleSvg.setAttribute('viewBox',`0 0 ${w} ${h}`); scaleSvg.innerHTML=''; const left=40, top=30, right=w-20, bottom=h-20, frets=4, strings=6;
  const t=document.createElementNS('http://www.w3.org/2000/svg','text'); t.setAttribute('x','10'); t.setAttribute('y','20'); t.setAttribute('fill','currentColor'); t.setAttribute('font-size','18'); t.textContent=scaleId.replace('_',' ').toUpperCase()+' — Box '+boxN; scaleSvg.appendChild(t);
  for(let i=0;i<=frets;i++){ const y=top+i*((bottom-top)/frets); const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',left); l.setAttribute('x2',right); l.setAttribute('y1',y); l.setAttribute('y2',y); l.setAttribute('stroke','#2a3170'); scaleSvg.appendChild(l); }
  for(let s=0;s<strings;s++){ const x=left+s*((right-left)/(strings-1)); const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',x); l.setAttribute('x2',x); l.setAttribute('y1',top); l.setAttribute('y2',bottom); l.setAttribute('stroke','#2a3170'); scaleSvg.appendChild(l); }
  for(let s=0;s<6;s++){ for(let p=0;p<2;p++){ const x=left+s*((right-left)/(strings-1)); const y=top+(p+0.5)*((bottom-top)/4); const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',8); c.setAttribute('fill','var(--accent)'); scaleSvg.appendChild(c); } } }
drawScale(scaleSelect.value, boxSelect.value); scaleSelect.addEventListener('change', ()=>drawScale(scaleSelect.value, boxSelect.value)); boxSelect.addEventListener('change', ()=>drawScale(scaleSelect.value, boxSelect.value));
document.getElementById('playScale').addEventListener('click', ()=>{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); let t=ctx.currentTime; const scale=[55,65.41,73.42,82.41,98,110,130.81,146.83,164.81];
  scale.forEach(f=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.type='triangle'; o.frequency.value=f; g.gain.value=0.001; o.connect(g); g.connect(ctx.destination); o.start(t); g.gain.exponentialRampToValueAtTime(0.08,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.35); o.stop(t+0.4); t+=0.22; });
});

let correctInterval=null; function intervalSemis(name){ return {"Unisono":0,"2ª min":1,"2ª mag":2,"3ª min":3,"3ª mag":4,"4ª giusta":5,"Tritono":6,"5ª giusta":7,"6ª min":8,"6ª mag":9,"7ª min":10,"7ª mag":11,"Ottava":12}[name]; }
function playTwo(freq1,freq2){ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const t=ctx.currentTime; const mk=(f,dt)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine'; o.frequency.value=f; g.gain.value=0.0001; o.connect(g); g.connect(ctx.destination); o.start(t+dt); g.gain.setValueAtTime(0.0001,t+dt); g.gain.exponentialRampToValueAtTime(0.15,t+dt+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+dt+0.6); o.stop(t+dt+0.7); }; mk(freq1,0); mk(freq2,0.75); }
document.getElementById('playInterval').addEventListener('click',()=>{ const base=220; const semis=Math.floor(Math.random()*13); correctInterval=semis; playTwo(base, base*Math.pow(2,semis/12)); document.getElementById('earResult').textContent='Ascolta e scegli l\'intervallo…'; });
document.getElementById('checkInterval').addEventListener('click',()=>{ const chosen=document.getElementById('intervalGuess').value; const ok=intervalSemis(chosen)===correctInterval; document.getElementById('earResult').textContent = ok? '✅ Corretto!' : '❌ Non esatto. Riprova!'; });

const todoEl=document.getElementById('todo'), newTask=document.getElementById('newTask'), addTask=document.getElementById('addTask'), resetDay=document.getElementById('resetDay'); const KEY='ccppwa3_tasks_v1';
function loadTasks(){ let d=JSON.parse(localStorage.getItem(KEY)||'[]'); if(d.length===0){ d=[{t:'Riscaldamento dita 5 min',done:false},{t:'Barrè F transizioni lente',done:false},{t:'Strumming Pop 4/4 10 min',done:false},{t:'Pentatonica Box 1–2 5 min',done:false},{t:'Canzone: arpeggio semplice',done:false},]; localStorage.setItem(KEY, JSON.stringify(d)); } return d; }
function renderTasks(){ const data=loadTasks(); todoEl.innerHTML=''; data.forEach((item,idx)=>{ const li=document.createElement('li'); li.className='row'; const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=item.done; cb.addEventListener('change',()=>{ const d=loadTasks(); d[idx].done=cb.checked; localStorage.setItem(KEY, JSON.stringify(d)); });
  const span=document.createElement('span'); span.textContent=item.t; span.style.marginLeft='8px';
  const del=document.createElement('button'); del.textContent='✕'; del.style.marginLeft='auto';
  del.addEventListener('click',()=>{ const d=loadTasks(); d.splice(idx,1); localStorage.setItem(KEY, JSON.stringify(d)); renderTasks(); });
  li.appendChild(cb); li.appendChild(span); li.appendChild(del); todoEl.appendChild(li); });
}
renderTasks(); addTask.addEventListener('click',()=>{ const t=newTask.value.trim(); if(!t) return; const d=loadTasks(); d.push({t,done:false}); localStorage.setItem(KEY, JSON.stringify(d)); newTask.value=''; renderTasks(); }); resetDay.addEventListener('click',()=>{ const d=loadTasks(); d.forEach(x=>x.done=false); localStorage.setItem(KEY, JSON.stringify(d)); renderTasks(); });

document.getElementById('embedYt').addEventListener('click', ()=>{
  const url=document.getElementById('ytUrl').value.trim(); const wrap=document.getElementById('ytWrap'); wrap.innerHTML=''; if(!url) return;
  let embed=''; if(url.includes('playlist?list=')){ const id=new URL(url).searchParams.get('list'); embed=`https://www.youtube.com/embed/videoseries?list=${id}`; }
  else { let v=null; try{ v=new URL(url).searchParams.get('v'); }catch(e){} if(!v && url.includes('youtu.be/')) v=url.split('youtu.be/')[1].split(/[?&]/)[0]; if(v) embed=`https://www.youtube.com/embed/${v}`; }
  if(embed){ const iframe=document.createElement('iframe'); iframe.src=embed; iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; iframe.allowFullscreen=true; wrap.appendChild(iframe); } else { wrap.innerHTML='<p class="hint">URL non riconosciuto.</p>'; }
});

/* -------- Settings: Backup export/import + install prompt -------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt=e; document.getElementById('installMsg').textContent='Installazione disponibile. Premi "Prova a installare".'; });
document.getElementById('tryInstall').addEventListener('click', async ()=>{
  if (deferredPrompt){ deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice; document.getElementById('installMsg').textContent = 'Scelta: '+choice.outcome; deferredPrompt=null; }
  else { document.getElementById('installMsg').textContent='Su iOS usa Condividi → Aggiungi a Home.'; }
});

function gatherAll(){
  const all = {};
  for (let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if (k.startsWith('ccppwa3_')) all[k] = localStorage.getItem(k);
  }
  const CAPO_KEY = 'ccppwa3_capos';
  all[CAPO_KEY] = localStorage.getItem(CAPO_KEY) || '{}';
  return all;
}
function applyAll(all){
  Object.keys(all).forEach(k=> localStorage.setItem(k, all[k]));
}
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const data = gatherAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='chitarra_coach_backup.json'; a.click();
  URL.revokeObjectURL(url);
  document.getElementById('backupMsg').textContent='Backup esportato.';
});
document.getElementById('importBtn').addEventListener('click', ()=>{
  const f = document.getElementById('importFile').files[0];
  if (!f){ document.getElementById('backupMsg').textContent='Seleziona un file JSON.'; return; }
  const r = new FileReader();
  r.onload = ()=>{
    try{
      const data = JSON.parse(r.result);
      applyAll(data);
      document.getElementById('backupMsg').textContent='Backup importato. Ricarica la pagina.';
    } catch(e){
      document.getElementById('backupMsg').textContent='File non valido.';
    }
  };
  r.readAsText(f);
});
document.getElementById('resetAll').addEventListener('click', ()=>{
  if (confirm('Cancellare tutti i dati locali dell’app?')){
    const keys = [];
    for (let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if (k.startsWith('ccppwa3_') || k==='ccppwa3_capos') keys.push(k);
    }
    keys.forEach(k=> localStorage.removeItem(k));
    document.getElementById('backupMsg').textContent='Dati azzerati.';
  }
});
