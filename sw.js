const staticCacheName = 's-app-v2'
const dynamicCacheName = 'd-app-v2'

const assetUrls = [
    'index.html',
    '/js/app.js',
    '/css/styles.css',
    '/offline.html'
]

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
    const cachedNames = await caches.keys()
    await Promise.all(
        cachedNames
            .filter(name => name !== staticCacheName)
            .filter(name => name !== dynamicCacheName)
            .map(name => caches.delete(name))
    )
})

self.addEventListener('fetch', event => {
    const {request} = event

    const url = new URL(request.url)
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request))
    } else {
        event.respondWith(networkFirst(request))
    }
})

async function cacheFirst(request) {
    const cached = await caches.match(request);
    
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        console.error('Fetch failed, returning offline page:', error);
        // Optionally return a fallback response, such as a default offline page
        // return new Response('Network error occurred', {
        //     status: 408, // Request Timeout
        //     statusText: 'Network error occurred'
        // });
    }
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        cache.put(request, response.clone())
        return response
    } catch(e) {
        const cached = await cache.match(request)
        return cached ?? await caches.match('/offline.html')
    }
    
}