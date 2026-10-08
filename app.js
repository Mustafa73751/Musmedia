// MusMedia V5 — real-account-ready social shell + 5-column YouTube discovery feed.
// IMPORTANT: set YOUTUBE_API_KEY and connect a real auth/database provider for production.

const posts=[];
const feed=document.getElementById("feed");
const state={theme:localStorage.getItem("musmediaTheme")||"light", profile:JSON.parse(localStorage.getItem("musmediaProfile")||'null')||{name:"Mustafa",handle:"musmediauser",bio:""}, followers:[], following:[]};

function escapeHtml(value){return String(value??"").replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderPosts(){
  if(!feed)return;
  if(!posts.length){feed.innerHTML='<div class="empty-state"><div class="empty-icon">⌂</div><h2>Your real home feed is empty</h2><p>MusMedia will not manufacture posts or fake accounts. Sign in and follow real people to build your feed.</p><button class="primary" data-page="discover">Discover real accounts</button></div>';return;}
  feed.innerHTML=posts.map((p,i)=>`<article class="post"><div class="post-head"><div class="mini-avatar">${escapeHtml((p.user||"U")[0])}</div><div class="post-meta"><b>${escapeHtml(p.user)}</b><small>${escapeHtml(p.time||"now")}</small></div></div><div class="post-media">${escapeHtml(p.media||"📷")}</div><div class="post-actions"><button class="star-like ${p.liked?'liked':''}" onclick="likePost(this,${i})">★</button><button>○</button><button>↗</button></div><div class="post-caption"><b>${p.likes||0} stars</b><br><b>${escapeHtml(p.user)}</b> ${escapeHtml(p.caption||"")}</div></article>`).join("");
}
function likePost(btn,i){const p=posts[i];p.liked=!p.liked;p.likes=Math.max(0,(p.likes||0)+(p.liked?1:-1));renderPosts();const star=feed.querySelectorAll('.star-like')[i];if(star){star.classList.add(p.liked?'star-pop':'star-drop');}}
window.likePost=likePost;

function navigate(page){document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));document.getElementById(page)?.classList.add('active-page');window.scrollTo({top:0,behavior:'smooth'});}
document.addEventListener('click',e=>{const n=e.target.closest('[data-page]');if(n){navigate(n.dataset.page);}});

// Remove fake chats: messages are intentionally empty until real authentication/database is connected.

// Profile editing + followers.
function renderProfile(){document.getElementById('profileName').textContent=state.profile.name;document.getElementById('profileHandle').textContent='@'+state.profile.handle;document.getElementById('followersCount').textContent=state.followers.length;document.getElementById('followingCount').textContent=state.following.length;}
document.getElementById('editProfileBtn')?.addEventListener('click',()=>{const e=document.getElementById('profileEditor');e.hidden=!e.hidden;if(!e.hidden){document.getElementById('editName').value=state.profile.name;document.getElementById('editHandle').value=state.profile.handle;document.getElementById('editBio').value=state.profile.bio||'';}});
document.getElementById('cancelProfileBtn')?.addEventListener('click',()=>document.getElementById('profileEditor').hidden=true);
document.getElementById('saveProfileBtn')?.addEventListener('click',()=>{state.profile={name:document.getElementById('editName').value.trim()||'Mustafa',handle:(document.getElementById('editHandle').value.trim()||'musmediauser').replace(/^@/,''),bio:document.getElementById('editBio').value.trim()};localStorage.setItem('musmediaProfile',JSON.stringify(state.profile));renderProfile();document.getElementById('profileEditor').hidden=true;});
document.getElementById('followersStat')?.addEventListener('click',()=>{const p=document.getElementById('followersPanel');p.hidden=!p.hidden;});

// Theme.
function applyTheme(){document.documentElement.dataset.theme=state.theme;document.getElementById('themeBtn').textContent=state.theme==='dark'?'☀ Light mode':'☾ Dark mode';}
document.getElementById('themeBtn')?.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';localStorage.setItem('musmediaTheme',state.theme);applyTheme();});applyTheme();renderProfile();renderPosts();

// Create: local preview only; real posting requires storage/database.
document.getElementById('postForm')?.addEventListener('submit',e=>{e.preventDefault();alert('Real posting will be enabled after MusMedia is connected to its storage/database.');});
document.getElementById('mediaInput')?.addEventListener('change',e=>{document.getElementById('fileName').textContent=e.target.files[0]?`Selected: ${e.target.files[0].name}`:"";});

// Search across the current page.
document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){navigate('discover');document.getElementById('discoverSearch').value=e.target.value;document.getElementById('discoverSearch').dispatchEvent(new Event('input'));}});

// Discover has no fabricated profiles. Real results are inserted by the connected backend.
const discoverEmpty=document.getElementById('discoverEmpty');
document.getElementById('discoverSearch')?.addEventListener('input',()=>{discoverEmpty.hidden=false;});
document.getElementById('openSignInFromDiscover')?.addEventListener('click',()=>navigate('settings'));

// ---------------- YouTube 5-column infinite discovery feed ----------------
const YOUTUBE_API_KEY=""; // Put your restricted YouTube Data API v3 browser key here.
const mediaGrid=document.getElementById('mediaGrid'), youtubeSearch=document.getElementById('youtubeSearch'), youtubeSearchBtn=document.getElementById('youtubeSearchBtn');
let youtubeNextPageToken='',lastYouTubeQuery='',mediaBusy=false,activeMediaQuery='';
const starterVideos=[
 {id:'GRoa6w-wnT4',title:'Playboi Carti — R.I.P.',meta:'Official artist channel'},
 {id:'j3EwWAMWM6Q',title:'Playboi Carti — Shoota',meta:'Official artist channel'},
 {id:'-fh8XeuBfz0',title:'UEFA Champions League',meta:'Official UEFA'},
 {id:'M7lc1UVf-VE',title:'YouTube Player API demo',meta:'YouTube'},
 {id:'aqz-KE-bpKQ',title:'Motivation / inspiration',meta:'YouTube'},
 {id:'ScMzIvxBSi4',title:'Basketball',meta:'YouTube'},
 {id:'kJQP7kiw5Fk',title:'Music',meta:'YouTube'},
 {id:'9bZkp7q19f0',title:'Entertainment',meta:'YouTube'},
 {id:'L_jWHffIx5E',title:'Music classic',meta:'YouTube'},
 {id:'dQw4w9WgXcQ',title:'Music video',meta:'YouTube'}
];
function videoCard(v){return `<article class="media-card"><div class="embed-wrap"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.id)}?rel=0" title="${escapeHtml(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="media-card-body"><b>${escapeHtml(v.title)}</b><small>${escapeHtml(v.meta||'YouTube')}</small></div></article>`;}
function renderStarterVideos(){mediaGrid.innerHTML=starterVideos.map(videoCard).join('');}
function showSearchSetup(){mediaGrid.innerHTML='<div class="media-loading"><b>YouTube search needs one API key.</b><br>Add your restricted YouTube Data API v3 key to <code>YOUTUBE_API_KEY</code> in app.js. Search results will then render as videos here.</div>';}
async function searchYouTube(query,append=false){const clean=query.trim();if(!clean){youtubeNextPageToken='';lastYouTubeQuery='';renderStarterVideos();return;}if(!YOUTUBE_API_KEY){showSearchSetup();return;}if(mediaBusy)return;mediaBusy=true;if(!append){youtubeNextPageToken='';lastYouTubeQuery=clean;mediaGrid.innerHTML='<div class="media-loading">Searching…</div>';}try{const token=youtubeNextPageToken?`&pageToken=${encodeURIComponent(youtubeNextPageToken)}`:'';const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&videoEmbeddable=true&videoSyndicated=true&q=${encodeURIComponent(clean)}${token}&key=${encodeURIComponent(YOUTUBE_API_KEY)}`;const r=await fetch(url);const d=await r.json();if(!r.ok)throw Error(d.error?.message||'YouTube search failed');const items=(d.items||[]).filter(x=>x.id?.videoId).map(x=>({id:x.id.videoId,title:x.snippet.title,meta:x.snippet.channelTitle}));if(append)mediaGrid.insertAdjacentHTML('beforeend',items.map(videoCard).join(''));else mediaGrid.innerHTML=items.map(videoCard).join('')||'<div class="media-loading">No results.</div>';youtubeNextPageToken=d.nextPageToken||'';}catch(err){mediaGrid.innerHTML=`<div class="media-loading">${escapeHtml(err.message)}<br><small>Check your API configuration.</small></div>`;}finally{mediaBusy=false;}}
youtubeSearchBtn?.addEventListener('click',()=>searchYouTube(youtubeSearch.value));youtubeSearch?.addEventListener('keydown',e=>{if(e.key==='Enter')searchYouTube(youtubeSearch.value);});
document.querySelectorAll('#mediaTabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#mediaTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeMediaQuery=btn.dataset.query||'';if(YOUTUBE_API_KEY)searchYouTube(activeMediaQuery);else renderStarterVideos();}));
let scrollBusy=false;window.addEventListener('scroll',()=>{if(!document.getElementById('media')?.classList.contains('active-page')||scrollBusy)return;if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-1000){if(YOUTUBE_API_KEY&&youtubeNextPageToken&&lastYouTubeQuery){scrollBusy=true;searchYouTube(lastYouTubeQuery,true).finally(()=>setTimeout(()=>scrollBusy=false,500));}}},{passive:true});
renderStarterVideos();

// Auth buttons are intentionally honest placeholders until OAuth credentials are configured.
document.querySelectorAll('.auth,[data-provider]').forEach(btn=>btn.addEventListener('click',()=>alert('This provider needs to be connected in MusMedia\'s authentication backend first. The UI is ready, but a static GitHub Pages site cannot securely complete OAuth by itself.')));
