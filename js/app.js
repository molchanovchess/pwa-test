window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker register success', reg);
        } catch (e) {
            console.error('Service worker register fail', e);
        }
    }

    try {
        await loadPosts();
    } catch (e) {
        console.error('Failed to load posts', e);
        // Optionally display an error message in the UI
        const container = document.querySelector('#posts');
        container.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
});

async function loadPosts() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=11');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();

        const container = document.querySelector('#posts');
        container.innerHTML = data.map(toCard).join('\n');
    } catch (e) {
        console.error('Error fetching posts', e);
        // Optionally display an error message in the UI
        const container = document.querySelector('#posts');
        container.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
}

function toCard(post) {
    return `
        <div class="card">
            <div class="card-title">
                ${post.title}
            </div>
            <div class="card-body">
                ${post.body}
            </div>
        </div>
    `
}