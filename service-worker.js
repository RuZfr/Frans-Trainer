const CACHE="frans-trainer-v1-8-2";
const FILES=[
  "./","./index.html","./manifest.json","./css/style.css",
  "./js/words.js","./js/storage.js","./js/app.js",
  "./data/lists/index.json","./data/lists/basis.json",
  "./icons/icon-192.png","./icons/icon-512.png"
];

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
        const cached=await caches.match(event.request);
        if(cached)return cached;

        const acceptsHtml=(event.request.headers.get("accept")||"").includes("text/html");
        if(acceptsHtml)return caches.match("./index.html");

        return Response.error();
      })
  );
});
