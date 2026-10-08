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
