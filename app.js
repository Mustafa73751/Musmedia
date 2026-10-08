const posts=[
 {user:"Amir",letter:"A",cls:"a",time:"2h",caption:"Just dropped a new video. What do you lot think? 👀",media:"🎥",video:true,likes:128},
 {user:"Sam",letter:"S",cls:"b",time:"5h",caption:"Weekend was different 🔥",media:"🌆",likes:84},
 {user:"Jay",letter:"J",cls:"c",time:"1d",caption:"Football tomorrow. Who's on? ⚽",media:"⚽",likes:56}
];

const feed=document.getElementById("feed");
function renderPosts(){
 feed.innerHTML=posts.map((p,i)=>`
 <article class="post">
  <div class="post-head"><div class="mini-avatar ${p.cls}">${p.letter}</div><div class="post-meta"><b>${p.user}</b><small>${p.time} ago</small></div></div>
  <div class="post-media ${p.video?'video':''}">${p.media}</div>
  <div class="post-actions"><button onclick="likePost(this,${i})">♡</button><button onclick="alert('Comments coming in the next MusMedia update 👀')">○</button><button onclick="navigator.share?.({title:'MusMedia post',text:'Check this out on MusMedia'})">↗</button></div>
  <div class="post-caption"><b>${p.likes} likes</b><br><b>${p.user}</b> ${p.caption}</div>
 </article>`).join("");
}
function likePost(btn,i){posts[i].likes++;btn.textContent="♥";btn.classList.add("liked");renderPosts();}

document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(`[data-page="${btn.dataset.page}"]`).forEach(x=>x.classList.add("active"));
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
 document.getElementById(btn.dataset.page).classList.add("active-page");
 window.scrollTo({top:0,behavior:"smooth"});
}));

document.getElementById("postForm").addEventListener("submit",e=>{
 e.preventDefault();
 const text=document.getElementById("postText").value.trim();
 if(!text){alert("Write something first.");return}
 posts.unshift({user:"Mustafa",letter:"M",cls:"a",time:"now",caption:text,media:"📸",likes:0});
 document.getElementById("postText").value="";
 document.querySelector('[data-page="home"]').click();
 renderPosts();
});
document.getElementById("mediaInput").addEventListener("change",e=>{
 document.getElementById("fileName").textContent=e.target.files[0]?`Selected: ${e.target.files[0].name}`:"";
});
document.getElementById("messageForm").addEventListener("submit",e=>{
 e.preventDefault(); const input=document.getElementById("messageInput"),v=input.value.trim(); if(!v)return;
 document.getElementById("chatBody").insertAdjacentHTML("beforeend",`<div class="bubble mine"></div>`);
 document.querySelector("#chatBody .bubble:last-child").textContent=v; input.value="";
});
document.querySelectorAll(".chat").forEach(c=>c.addEventListener("click",()=>{
 document.querySelectorAll(".chat").forEach(x=>x.classList.remove("active"));c.classList.add("active");
 document.getElementById("chatName").textContent=c.dataset.name;
}));
document.getElementById("searchInput").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 document.querySelectorAll(".post").forEach(p=>p.style.display=p.textContent.toLowerCase().includes(q)?"":"none");
});
renderPosts();
document.getElementById("discoverGrid").innerHTML=["🎬","⚽","🌆","🎮","🏆","🎵","🔥","📸","✈️"].map(x=>`<div>${x}</div>`).join("");

// ---------------- YouTube Media Feed ----------------
// Optional: put a YouTube Data API v3 key here for live search results.
// Never use a secret/private key. A browser-visible API key should be restricted to your GitHub Pages domain.
const YOUTUBE_API_KEY = "";

const mediaGrid = document.getElementById("mediaGrid");
const youtubeSearch = document.getElementById("youtubeSearch");
const youtubeSearchBtn = document.getElementById("youtubeSearchBtn");
const mediaTabs = document.getElementById("mediaTabs");
let youtubeNextPageToken = "";
let lastYouTubeQuery = "";

const starterVideos = [
  {id:"GRoa6w-wnT4", title:"Playboi Carti — R.I.P.", meta:"Music · Official artist channel"},
  {id:"j3EwWAMWM6Q", title:"Playboi Carti — Shoota", meta:"Music · Official artist channel"},
  {id:"-fh8XeuBfz0", title:"UEFA Champions League", meta:"Football · Official UEFA"},
  {id:"M7lc1UVf-VE", title:"YouTube Player API demo", meta:"YouTube · Demo"},
  {id:"dQw4w9WgXcQ", title:"Music video", meta:"YouTube · Music"},
  {id:"aqz-KE-bpKQ", title:"Motivation / inspiration", meta:"YouTube · Motivation"},
  {id:"ScMzIvxBSi4", title:"Basketball video", meta:"YouTube · Basketball"},
  {id:"kJQP7kiw5Fk", title:"Popular music", meta:"YouTube · Music"},
  {id:"9bZkp7q19f0", title:"Viral video", meta:"YouTube · Entertainment"},
  {id:"L_jWHffIx5E", title:"Classic music", meta:"YouTube · Music"}
];

function videoCard(v){
  return `<article class="media-card">
    <div class="embed-wrap"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.id)}" title="${escapeHtml(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
    <div class="media-card-body"><b>${escapeHtml(v.title)}</b><small>${escapeHtml(v.meta || "YouTube")}</small></div>
  </article>`;
}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderStarterVideos(query=""){
  const q=query.toLowerCase().trim();
  const filtered=q ? starterVideos.filter(v=>(v.title+" "+v.meta).toLowerCase().includes(q)) : starterVideos;
  mediaGrid.innerHTML=(filtered.length ? filtered : starterVideos).slice(0,10).map(videoCard).join("");
}

async function searchYouTube(query, append=false){
  const clean=query.trim();
  if(!clean) { renderStarterVideos(); return; }
  if(!YOUTUBE_API_KEY){
    window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(clean), "_blank", "noopener,noreferrer");
    return;
  }
  if(!append){youtubeNextPageToken=""; lastYouTubeQuery=clean; mediaGrid.innerHTML='<div class="media-loading">Searching YouTube...</div>';}
  try{
    const token=youtubeNextPageToken ? `&pageToken=${encodeURIComponent(youtubeNextPageToken)}` : "";
    const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&videoEmbeddable=true&q=${encodeURIComponent(clean)}${token}&key=${encodeURIComponent(YOUTUBE_API_KEY)}`;
    const res=await fetch(url);
    const data=await res.json();
    if(!res.ok) throw new Error(data.error?.message || "YouTube search failed");
    const results=(data.items||[]).filter(x=>x.id?.videoId).map(x=>({id:x.id.videoId,title:x.snippet.title,meta:x.snippet.channelTitle}));
    const html=results.map(videoCard).join("");
    if(append) mediaGrid.insertAdjacentHTML("beforeend",html); else mediaGrid.innerHTML=html || '<div class="media-loading">No videos found.</div>';
    youtubeNextPageToken=data.nextPageToken||"";
    let load=document.getElementById("loadMoreYouTube");
    if(!load){load=document.createElement("button");load.id="loadMoreYouTube";load.className="primary media-load-more";mediaGrid.insertAdjacentElement("afterend",load);}
    load.textContent=youtubeNextPageToken?"Load more YouTube videos":"No more results";
    load.disabled=!youtubeNextPageToken;
    load.onclick=()=>searchYouTube(lastYouTubeQuery,true);
  }catch(err){
    mediaGrid.innerHTML=`<div class="media-loading">${escapeHtml(err.message)}<br><small>Check your API key in app.js.</small></div>`;
  }
}
if(mediaGrid){
  renderStarterVideos();
  youtubeSearchBtn?.addEventListener("click",()=>searchYouTube(youtubeSearch.value));
  youtubeSearch?.addEventListener("keydown",e=>{if(e.key==="Enter")searchYouTube(youtubeSearch.value)});
  mediaTabs?.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    mediaTabs.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const q=btn.dataset.query||"";
    if(q && YOUTUBE_API_KEY) searchYouTube(q); else renderStarterVideos(q);
  }));
}

