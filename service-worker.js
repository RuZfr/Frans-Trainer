const CACHE="frans-trainer-v1-15-2";
const FILES=["./","./index.html","./manifest.json","./css/style.css","./js/words.js","./js/storage.js","./js/app.js","./icons/icon-192.png","./icons/icon-512.png","./data/lists/index.json","./data/lists/basis.json","./data/lists/game-on.json","./data/lists/sport-action.json","./data/lists/music-live.json","./data/lists/my-crew.json","./data/lists/school-mode.json","./data/lists/snack-chill.json","./data/lists/style-check.json","./data/lists/online.json","./data/lists/on-the-go.json","./data/lists/weekend-vibes.json","./data/lists/home-chill.json","./data/lists/holiday-mode.json","./data/lists/fit-healthy.json","./data/lists/outdoor.json","./js/list-import.js","./data/templates/woordenlijst-voorbeeld.csv","./icons/logo-mark.svg","./icons/favicon.svg","./icons/favicon.ico","./icons/favicon-32.png","./icons/favicon-16.png","./icons/icon-moon.svg","./icons/icon-sun.svg","./icons/icon-settings.svg","./icons/icon-close.svg"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;

  event.respondWith(
    fetch(event.request)
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      })
      .catch(async()=>{
        // De app gebruikt cache-busting zoals app.js?v=1.15.0 en
        // data/lists/basis.json?v=1.15.0. De vooraf gecachte bestanden
        // staan zonder querystring in de cache; ignoreSearch maakt die
        // ook direct na een verse offline-installatie vindbaar.
        const cached=await caches.match(event.request,{ignoreSearch:true});
        if(cached)return cached;

        const acceptsHtml=(event.request.headers.get("accept")||"").includes("text/html");
        if(acceptsHtml)return caches.match("./index.html",{ignoreSearch:true});

        return Response.error();
      })
  );
});
