import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const PHONE='919810958069';
const DESTINATIONS={
  kashmir:{
    name:'KASHMIR',region:'INDIA',accent:'#b9ecff',accent2:'#f3fbff',fog:0xa7c4cf,sky:[0x7897a5,0xdde9ed],mode:'snow',
    tagline:'closer to the sky.',mood:'ALPINE / STILL / COLD LIGHT',
    intro:'Cold air, glassy water and mountains that make the rest of the world feel very far away.',
    scenes:[
      {name:'DAL LAKE',verb:'Drift into morning',image:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=2400&q=92',copy:'Wake to water, cedar silhouettes and a morning that arrives quietly.',cam:[0,.2,5.5],focus:[0,.2,-5]},
      {name:'GULMARG',verb:'Walk into white',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=92',copy:'Trade city noise for alpine air, snow fields and long mountain light.',cam:[-1.1,.7,4.8],focus:[-.6,.4,-5]},
      {name:'PAHALGAM',verb:'Follow the valley',image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=92',copy:'Move slower through pine, river bends and open valley roads.',cam:[1.1,.35,4.9],focus:[.6,.1,-5]}
    ]
  },
  maldives:{
    name:'MALDIVES',region:'INDIAN OCEAN',accent:'#65f0ee',accent2:'#ffe989',fog:0x5fbfc8,sky:[0x0b92ad,0x92e2e6],mode:'ocean',
    tagline:'where time floats.',mood:'LAGOON / WEIGHTLESS / WARM LIGHT',
    intro:'A world reduced to warm water, open horizon and the feeling of having nowhere else to be.',
    scenes:[
      {name:'LAGOON',verb:'Arrive over water',image:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=92',copy:'Step out above a lagoon and let the horizon become the room.',cam:[0,.1,5.5],focus:[0,0,-5]},
      {name:'REEF',verb:'Go below the blue',image:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=92',copy:'Trade gravity for reef light, clear water and slow underwater colour.',cam:[-1,-.25,4.6],focus:[-.5,-.1,-5]},
      {name:'SUNSET',verb:'Stay for last light',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=92',copy:'Let the day end with salt air, a long shoreline and almost no agenda.',cam:[1.15,.15,4.9],focus:[.45,.1,-5]}
    ]
  },
  bali:{
    name:'BALI',region:'INDONESIA',accent:'#93ffbd',accent2:'#ffd27c',fog:0x496f56,sky:[0x315741,0xd5c38d],mode:'firefly',
    tagline:'breathe differently.',mood:'JUNGLE / RITUAL / WARM AIR',
    intro:'Green mornings, temple smoke and salt air — a softer rhythm between jungle and sea.',
    scenes:[
      {name:'JUNGLE',verb:'Wake under green',image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=92',copy:'Begin inside dense green where the air feels slower and everything sounds alive.',cam:[0,.3,5.4],focus:[0,.25,-5]},
      {name:'TEMPLE',verb:'Enter the ritual',image:'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=2400&q=92',copy:'Move through stone, incense and the quiet choreography of an island morning.',cam:[-1,.3,4.7],focus:[-.35,.2,-5]},
      {name:'COAST',verb:'Chase the last sun',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=92',copy:'Finish where warm air meets surf and the light keeps changing until dark.',cam:[1.15,.25,4.8],focus:[.4,.1,-5]}
    ]
  },
  dubai:{
    name:'DUBAI',region:'UAE',accent:'#ffc66a',accent2:'#ff8e70',fog:0xc29b65,sky:[0x9d6b3d,0xf0c37d],mode:'dust',
    tagline:'tomorrow after dark.',mood:'DESERT / FUTURE / ELECTRIC',
    intro:'Desert silence, impossible skylines and a city that can change tempo in a single turn.',
    scenes:[
      {name:'DESERT',verb:'Cross the gold',image:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2400&q=92',copy:'Start outside the city where wind and dunes erase almost every straight line.',cam:[0,.1,5.5],focus:[0,.1,-5]},
      {name:'SKYLINE',verb:'Enter the future',image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=92',copy:'Move from desert scale into glass, light and a skyline built to feel impossible.',cam:[-1.1,.45,4.65],focus:[-.45,.3,-5]},
      {name:'NIGHT',verb:'Stay after dark',image:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=92',copy:'When the heat drops, the city becomes reflections, motion and late-night energy.',cam:[1.1,.25,4.75],focus:[.45,.15,-5]}
    ]
  }
};

const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),4);
const appState={dest:'kashmir',scene:0,entered:false,transition:false,pointerX:0,pointerY:0,targetX:0,targetY:0,sound:false,lastWheel:0};

const loaderEl=qs('.loader'),loaderBar=qs('.loader-bar'),loaderPercent=qs('.loader-percent');
const ui={orbit:qs('.destination-orbit'),rail:qs('.scene-rail'),title:qs('#title'),script:qs('#script'),copy:qs('#sceneCopy'),eyebrow:qs('#eyebrow'),mood:qs('#mood'),status:qs('#statusText'),portal:qs('.portal'),portalWord:qs('.portal-word'),hotspot:qs('.hotspot'),hotspotLabel:qs('.hotspot-label'),trip:qs('.trip-panel'),sound:qs('#sound')};

let renderer,scene,camera,clock,root,plateA,plateB,activePlate,standbyPlate,sky,particles,particleMaterial,environmentGroup;
let camBase=new THREE.Vector3(0,.2,5.5),lookBase=new THREE.Vector3(0,.2,-5);
let camFrom=new THREE.Vector3(),camTo=new THREE.Vector3(),lookFrom=new THREE.Vector3(),lookTo=new THREE.Vector3(),moveStart=0,moveDuration=1400;
let textureCache=new Map(),audioCtx,audioNodes=[];

function webglSupported(){
  try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch{return false}
}
if(!webglSupported()){qs('.fallback').style.display='grid';loaderEl.classList.add('done');throw new Error('WebGL unavailable')}

function initThree(){
  renderer=new THREE.WebGLRenderer({canvas:qs('#webgl'),antialias:true,powerPreference:'high-performance',alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.03;

  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0xa7c4cf,.045);
  camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);
  camera.position.copy(camBase);
  clock=new THREE.Clock();
  root=new THREE.Group();scene.add(root);

  const hemi=new THREE.HemisphereLight(0xe8f6ff,0x102028,1.55);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,1.65);key.position.set(-3,6,4);scene.add(key);

  createSky();
  createPlates();
  createParticles();
  environmentGroup=new THREE.Group();root.add(environmentGroup);
  rebuildEnvironment();
  addEventListeners();
}

function createSky(){
  const geo=new THREE.SphereGeometry(45,32,20);
  const mat=new THREE.ShaderMaterial({
    side:THREE.BackSide,
    uniforms:{top:{value:new THREE.Color(0x7897a5)},bottom:{value:new THREE.Color(0xdde9ed)},offset:{value:8},exponent:{value:.8}},
    vertexShader:'varying vec3 vWorldPosition; void main(){vec4 worldPosition=modelMatrix*vec4(position,1.0);vWorldPosition=worldPosition.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 top;uniform vec3 bottom;uniform float offset;uniform float exponent;varying vec3 vWorldPosition;void main(){float h=normalize(vWorldPosition+offset).y;gl_FragColor=vec4(mix(bottom,top,max(pow(max(h,0.0),exponent),0.0)),1.0);}'
  });
  sky=new THREE.Mesh(geo,mat);scene.add(sky);
}

function createPlates(){
  const geo=new THREE.PlaneGeometry(17.5,10.1,1,1);
  const matA=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1,depthWrite:false});
  const matB=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false});
  plateA=new THREE.Mesh(geo,matA);plateB=new THREE.Mesh(geo,matB);
  plateA.position.set(0,.25,-7.5);plateB.position.copy(plateA.position);plateB.position.z=-7.45;
  root.add(plateA,plateB);activePlate=plateA;standbyPlate=plateB;
}

function createParticles(){
  const count=innerWidth<700?650:1300;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*22;pos[i*3+1]=(Math.random()-.5)*12;pos[i*3+2]=-Math.random()*15+4}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  particleMaterial=new THREE.PointsMaterial({color:0xffffff,size:.025,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending});
  particles=new THREE.Points(geo,particleMaterial);scene.add(particles);
}

function loadTexture(url){
  if(textureCache.has(url))return textureCache.get(url);
  const p=new Promise(resolve=>{
    const l=new THREE.TextureLoader();
    l.setCrossOrigin('anonymous');
    l.load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;resolve(t)},undefined,()=>resolve(null));
  });
  textureCache.set(url,p);return p;
}

async function boot(){
  initThree();
  const preload=[DESTINATIONS.kashmir.scenes[0].image,DESTINATIONS.maldives.scenes[0].image,DESTINATIONS.bali.scenes[0].image,DESTINATIONS.dubai.scenes[0].image];
  let done=0;
  for(const url of preload){await loadTexture(url);done++;const pct=Math.round(done/preload.length*100);loaderBar.style.width=pct+'%';loaderPercent.textContent=pct+'%'}
  const tex=await loadTexture(DESTINATIONS.kashmir.scenes[0].image);if(tex)activePlate.material.map=tex;activePlate.material.needsUpdate=true;
  applyDestinationTheme('kashmir');renderRail();updateText(true);projectHotspot();
  setTimeout(()=>loaderEl.classList.add('done'),280);
  animate();
  DESTINATIONS.kashmir.scenes.slice(1).forEach(s=>loadTexture(s.image));
}

function clearEnvironment(){
  while(environmentGroup.children.length){
    const o=environmentGroup.children.pop();
    o.traverse?.(n=>{n.geometry?.dispose?.();if(n.material){if(Array.isArray(n.material))n.material.forEach(m=>m.dispose?.());else n.material.dispose?.()}});
  }
}

function rebuildEnvironment(){
  if(!environmentGroup)return;
  clearEnvironment();
  const d=DESTINATIONS[appState.dest];
  if(d.mode==='snow')buildMountains();
  if(d.mode==='ocean')buildOcean();
  if(d.mode==='firefly')buildJungle();
  if(d.mode==='dust')buildDesertCity();
}

function buildMountains(){
  const mat=new THREE.MeshStandardMaterial({color:0x9eb6bf,roughness:.96,metalness:0,transparent:true,opacity:.62});
  const snow=new THREE.MeshStandardMaterial({color:0xf2fbff,roughness:.9,transparent:true,opacity:.75});
  [[-4,-2.6,2.8],[0,-3.6,3.8],[4,-3,3.1],[-7,-4.5,4.5],[7,-4.7,4.8]].forEach(([x,z,s],i)=>{
    const g=new THREE.ConeGeometry(s,3.8+s*.4,5,1);const m=new THREE.Mesh(g,mat.clone());m.position.set(x,-.9,z-5);m.rotation.y=i*.47;m.scale.z=.7;environmentGroup.add(m);
    const cap=new THREE.Mesh(new THREE.ConeGeometry(s*.37,1.05,5),snow.clone());cap.position.set(x,.65,z-5);cap.rotation.y=i*.47;cap.scale.z=.7;environmentGroup.add(cap);
  });
  const lake=new THREE.Mesh(new THREE.PlaneGeometry(30,18),new THREE.MeshPhysicalMaterial({color:0x7fb3c1,transparent:true,opacity:.18,roughness:.2,metalness:.05,side:THREE.DoubleSide}));
  lake.rotation.x=-Math.PI/2;lake.position.set(0,-2.05,-2);environmentGroup.add(lake);
}

function buildOcean(){
  const geo=new THREE.PlaneGeometry(32,26,90,70);
  const mat=new THREE.ShaderMaterial({
    transparent:true,side:THREE.DoubleSide,uniforms:{uTime:{value:0},c1:{value:new THREE.Color(0x0d8da0)},c2:{value:new THREE.Color(0x8bf2e9)}},
    vertexShader:'uniform float uTime;varying float vWave;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float w=sin(p.x*.9+uTime)*.13+cos(p.y*.7-uTime*.8)*.1+sin((p.x+p.y)*.45+uTime*.55)*.07;p.z+=w;vWave=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}',
    fragmentShader:'uniform vec3 c1;uniform vec3 c2;varying float vWave;varying vec2 vUv;void main(){float h=smoothstep(-.28,.3,vWave);vec3 col=mix(c1,c2,h*.6+vUv.y*.18);float shine=pow(max(0.0,1.0-abs(vWave)*3.2),7.0);gl_FragColor=vec4(col+shine*.18,.42);}'
  });
  const ocean=new THREE.Mesh(geo,mat);ocean.rotation.x=-Math.PI/2;ocean.position.set(0,-1.8,-3);ocean.userData.water=true;environmentGroup.add(ocean);
  const island=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.8,.35,48),new THREE.MeshStandardMaterial({color:0xd7c78e,roughness:1,transparent:true,opacity:.72}));island.position.set(4.2,-1.65,-7.5);island.scale.z=.65;environmentGroup.add(island);
}

function buildJungle(){
  const trunkMat=new THREE.MeshStandardMaterial({color:0x243629,roughness:1,transparent:true,opacity:.72});
  const leafMat=new THREE.MeshStandardMaterial({color:0x315f3f,roughness:.9,transparent:true,opacity:.52,side:THREE.DoubleSide});
  for(let i=0;i<28;i++){
    const x=(Math.random()-.5)*18,z=-Math.random()*11-1,y=-1.9+Math.random()*2.3;
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.025,.06,2.2,5),trunkMat);trunk.position.set(x,y,z);trunk.rotation.z=(Math.random()-.5)*.3;environmentGroup.add(trunk);
    const leaf=new THREE.Mesh(new THREE.PlaneGeometry(.75,1.8),leafMat.clone());leaf.position.set(x+(Math.random()-.5)*.5,y+1.1,z);leaf.rotation.z=Math.random()*Math.PI;leaf.rotation.y=Math.random()*Math.PI;environmentGroup.add(leaf);
  }
  const fogPlane=new THREE.Mesh(new THREE.PlaneGeometry(24,5),new THREE.MeshBasicMaterial({color:0xbad1b9,transparent:true,opacity:.09,depthWrite:false}));fogPlane.position.set(0,-.6,-4);environmentGroup.add(fogPlane);
}

function buildDesertCity(){
  const duneGeo=new THREE.PlaneGeometry(30,20,70,45);const p=duneGeo.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x*.48)*.45+Math.cos(y*.62)*.3+Math.sin((x+y)*.23)*.24)}
  duneGeo.computeVertexNormals();
  const dune=new THREE.Mesh(duneGeo,new THREE.MeshStandardMaterial({color:0xc78c4a,roughness:1,transparent:true,opacity:.45,side:THREE.DoubleSide}));
  dune.rotation.x=-Math.PI/2;dune.position.set(0,-2,-2.5);environmentGroup.add(dune);
  const city=new THREE.Group();city.position.set(4.7,-1.6,-9);
  for(let i=0;i<17;i++){const h=.9+Math.random()*4.2,w=.18+Math.random()*.42;const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({color:0x8ea0a7,emissive:0x2d3942,emissiveIntensity:.8,roughness:.35,metalness:.45,transparent:true,opacity:.72}));b.position.set((i-8)*.42,h/2,Math.random()*.7);city.add(b)}
  environmentGroup.add(city);
}

function applyDestinationTheme(id){
  const d=DESTINATIONS[id];
  document.documentElement.style.setProperty('--accent',d.accent);document.documentElement.style.setProperty('--accent2',d.accent2);
  scene.fog.color.setHex(d.fog);sky.material.uniforms.top.value.setHex(d.sky[0]);sky.material.uniforms.bottom.value.setHex(d.sky[1]);
  particleMaterial.color.set(d.accent);particleMaterial.size=d.mode==='firefly'?.045:d.mode==='dust'?.022:.026;particleMaterial.opacity=d.mode==='ocean'?.34:.6;
  rebuildEnvironment();resetAudioTone();
}

function updateText(initial=false){
  const d=DESTINATIONS[appState.dest],s=d.scenes[appState.scene];
  ui.title.childNodes[0]?.remove();ui.title.insertBefore(document.createTextNode(d.name),ui.script);
  ui.script.textContent=d.tagline;ui.copy.textContent=appState.entered?s.copy:d.intro;
  ui.eyebrow.textContent=d.name+' / '+d.region+' / SCENE 0'+(appState.scene+1);
  ui.mood.textContent=d.mood;ui.status.textContent=appState.entered?'LIVE DESTINATION PREVIEW':'DESTINATION PORTAL READY';
  ui.hotspotLabel.textContent=appState.scene<2?'ENTER '+d.scenes[appState.scene+1].name:'BUILD THIS JOURNEY';
  if(initial)qs('#fDest').value=d.name;
}

function renderRail(){
  const d=DESTINATIONS[appState.dest];ui.rail.innerHTML='';
  d.scenes.forEach((s,i)=>{const b=document.createElement('button');b.className='scene-button'+(i===appState.scene?' active':'');b.innerHTML='<span>0'+(i+1)+' / '+d.name+'</span><b>'+s.name+' — '+s.verb+'</b>';b.onclick=()=>goScene(i);ui.rail.appendChild(b)});
}

function animateCamera(target,focus){
  camFrom.copy(camBase);camTo.set(...target);lookFrom.copy(lookBase);lookTo.set(...focus);moveStart=performance.now();
}

async function goScene(index){
  if(appState.transition||index===appState.scene)return;
  appState.transition=true;
  const d=DESTINATIONS[appState.dest],s=d.scenes[index],tex=await loadTexture(s.image);
  if(tex){standbyPlate.material.map=tex;standbyPlate.material.needsUpdate=true}
  standbyPlate.material.opacity=0;standbyPlate.visible=true;
  const start=performance.now(),duration=1050,old=activePlate,next=standbyPlate;
  appState.scene=index;renderRail();updateText();animateCamera(s.cam,s.focus);
  function cross(t){const p=ease((t-start)/duration);next.material.opacity=p;old.material.opacity=1-p*.98;next.scale.setScalar(1.06-.06*p);old.scale.setScalar(1+.055*p);if(p<1)requestAnimationFrame(cross);else{old.material.opacity=0;old.scale.setScalar(1);next.material.opacity=1;[activePlate,standbyPlate]=[next,old];standbyPlate.visible=false;appState.transition=false;projectHotspot()}}requestAnimationFrame(cross);
}

async function enterDestination(id){
  if(appState.transition)return;appState.transition=true;
  const d=DESTINATIONS[id];ui.portalWord.textContent=d.name;ui.portal.classList.add('on');
  const tex=await loadTexture(d.scenes[0].image);
  setTimeout(()=>{
    appState.dest=id;appState.scene=0;appState.entered=true;applyDestinationTheme(id);if(tex){activePlate.material.map=tex;activePlate.material.needsUpdate=true;activePlate.material.opacity=1}
    standbyPlate.visible=false;ui.orbit.classList.add('hidden');qs('#fDest').value=d.name;renderRail();updateText();animateCamera(d.scenes[0].cam,d.scenes[0].focus);
    d.scenes.slice(1).forEach(s=>loadTexture(s.image));
    setTimeout(()=>{ui.portal.classList.remove('on');appState.transition=false;projectHotspot()},180);
  },430);
}

function projectHotspot(){
  if(!appState.entered){ui.hotspot.classList.remove('visible');return}
  const anchors=[new THREE.Vector3(2.2,.45,-4),new THREE.Vector3(-1.9,.3,-3.8),new THREE.Vector3(1.8,-.15,-3.6)];
  const v=anchors[appState.scene].clone().project(camera);const x=(v.x*.5+.5)*innerWidth,y=(-v.y*.5+.5)*innerHeight;
  ui.hotspot.style.left=x+'px';ui.hotspot.style.top=y+'px';ui.hotspot.classList.add('visible');
}

function updateParticles(dt,t){
  const pos=particles.geometry.attributes.position,d=DESTINATIONS[appState.dest];
  for(let i=0;i<pos.count;i++){
    let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
    if(d.mode==='snow'){y-=dt*(.18+(i%7)*.025);x+=Math.sin(t*.00055+i)*dt*.04;if(y<-6)y=6}
    else if(d.mode==='ocean'){y+=Math.sin(t*.0004+i)*dt*.01;z+=Math.sin(t*.0002+i)*dt*.015}
    else if(d.mode==='firefly'){x+=Math.cos(t*.0008+i)*dt*.035;y+=Math.sin(t*.001+i)*dt*.03}
    else{x+=dt*(.12+(i%5)*.015);y+=Math.sin(t*.0007+i)*dt*.025;if(x>11)x=-11}
    pos.setXYZ(i,x,y,z);
  }
  pos.needsUpdate=true;
  environmentGroup.children.forEach(o=>{if(o.userData?.water&&o.material.uniforms)o.material.uniforms.uTime.value=t*.001});
}

function animate(){
  const dt=Math.min(clock.getDelta(),.04),now=performance.now();
  appState.pointerX=lerp(appState.pointerX,appState.targetX,.045);appState.pointerY=lerp(appState.pointerY,appState.targetY,.045);
  const mp=ease((now-moveStart)/moveDuration);if(mp<1){camBase.lerpVectors(camFrom,camTo,mp);lookBase.lerpVectors(lookFrom,lookTo,mp)}
  camera.position.x=camBase.x+appState.pointerX*.28;camera.position.y=camBase.y-appState.pointerY*.18;camera.position.z=camBase.z+Math.abs(appState.pointerX)*.04;
  camera.lookAt(lookBase.x+appState.pointerX*.18,lookBase.y-appState.pointerY*.11,lookBase.z);
  sky.rotation.y+=dt*.004;particles.rotation.y+=dt*.008;
  if(activePlate){activePlate.position.x=appState.pointerX*-.14;activePlate.position.y=.25+appState.pointerY*.08}
  if(standbyPlate){standbyPlate.position.x=appState.pointerX*-.14;standbyPlate.position.y=.25+appState.pointerY*.08}
  updateParticles(dt,now);renderer.render(scene,camera);if(appState.entered&&Math.random()<.08)projectHotspot();requestAnimationFrame(animate);
}

function addEventListeners(){
  addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();projectHotspot()});
  addEventListener('pointermove',e=>{appState.targetX=(e.clientX/innerWidth-.5)*2;appState.targetY=(e.clientY/innerHeight-.5)*2},{passive:true});
  addEventListener('wheel',e=>{if(!appState.entered||ui.trip.classList.contains('open'))return;const now=performance.now();if(now-appState.lastWheel<900||Math.abs(e.deltaY)<18)return;appState.lastWheel=now;goScene((appState.scene+(e.deltaY>0?1:2))%3)},{passive:true});
  let sx=0,sy=0;addEventListener('touchstart',e=>{if(e.touches[0]){sx=e.touches[0].clientX;sy=e.touches[0].clientY}},{passive:true});
  addEventListener('touchmove',e=>{if(e.touches[0]){appState.targetX=(e.touches[0].clientX/innerWidth-.5)*2;appState.targetY=(e.touches[0].clientY/innerHeight-.5)*2}},{passive:true});
  addEventListener('touchend',e=>{if(!appState.entered||!e.changedTouches[0])return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy))goScene((appState.scene+(dx<0?1:2))%3)},{passive:true});
}

qsa('.dest').forEach(b=>b.onclick=()=>enterDestination(b.dataset.dest));
qs('.change-destination').onclick=()=>{ui.orbit.classList.remove('hidden');ui.hotspot.classList.remove('visible')};
qsa('.open-trip').forEach(b=>b.onclick=()=>ui.trip.classList.add('open'));
qs('.trip-close').onclick=()=>ui.trip.classList.remove('open');
qs('.hotspot button').onclick=()=>{if(appState.scene<2)goScene(appState.scene+1);else ui.trip.classList.add('open')};

qs('#whatsapp').onclick=()=>{
  const name=qs('#fName').value.trim(),phone=qs('#fPhone').value.trim();if(!name||!phone){alert('Please add your name and phone / WhatsApp number.');return}
  const d=DESTINATIONS[appState.dest],s=d.scenes[appState.scene];
  const msg='Hi MyTravel4Sure, I want to plan '+d.name+'.\nName: '+name+'\nPhone: '+phone+'\nStarting city: '+qs('#fFrom').value+'\nTravel style: '+qs('#fStyle').value+'\nDuration: '+qs('#fDays').value+'\nVisual experience selected: '+s.name;
  window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(msg),'_blank','noopener');
};

function stopAudio(){audioNodes.forEach(n=>{try{n.stop?.()}catch{}try{n.disconnect?.()}catch{}});audioNodes=[];if(audioCtx){audioCtx.close();audioCtx=null}}
function resetAudioTone(){if(appState.sound){stopAudio();appState.sound=false;document.body.classList.remove('sound-on');startAudio()}}
function startAudio(){
  if(appState.sound){stopAudio();appState.sound=false;document.body.classList.remove('sound-on');return}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  audioCtx=new AC();const master=audioCtx.createGain();master.gain.value=.055;master.connect(audioCtx.destination);
  const d=DESTINATIONS[appState.dest],base={snow:82,ocean:110,firefly:146,dust:96}[d.mode];
  const osc=audioCtx.createOscillator(),og=audioCtx.createGain();osc.type='sine';osc.frequency.value=base;og.gain.value=.12;osc.connect(og).connect(master);osc.start();audioNodes.push(osc,og);
  const src=audioCtx.createBufferSource(),buf=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),arr=buf.getChannelData(0);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()*2-1)*.2;src.buffer=buf;src.loop=true;
  const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=d.mode==='ocean'?800:d.mode==='firefly'?540:400;src.connect(filter).connect(master);src.start();audioNodes.push(src,filter,master);
  appState.sound=true;document.body.classList.add('sound-on');
}
ui.sound.onclick=startAudio;

boot().catch(err=>{console.error(err);qs('.fallback').style.display='grid';loaderEl.classList.add('done')});
