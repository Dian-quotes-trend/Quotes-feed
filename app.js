// LocalStorage Management
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Post Template
const createPostHTML = (post) => `
<div class="post" data-id="${post.id}">
    <div class="post-header">
        <span class="author">${post.author || '@user'}</span>
        <button class="delete-btn">×</button>
    </div>
    <p class="quote">"${post.text}"</p>
    ${post.media ? `
        ${post.mediaType === 'image' ? 
            `<img src="${post.media}" class="post-media">` : 
            `<div class="video-container"><video class="post-media" controls><source src="${post.media}"></video></div>`
        }
    ` : ''}
    <div class="post-actions">
        <button class="like-btn">♥ <span class="like-count">${post.likes}</span></button>
        <input type="text" class="comment-input" placeholder="Add a comment...">
    </div>
    <div class="comments">
        ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
    </div>
</div>
`;

// Load Posts
function loadPosts() {
    const feed = document.querySelector('.feed-container');
    if (feed) {
        posts = JSON.parse(localStorage.getItem('posts')) || [];
        feed.innerHTML = posts.map(post => createPostHTML(post)).reverse().join('');
    }
}

// Create Post
function handleCreateForm() {
    const form = document.getElementById('createForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            const newPost = {
                id: Date.now(),
                text: formData.get('text'),
                media: formData.get('media'),
                mediaType: formData.get('mediaType'),
                likes: 0,
                comments: [],
                date: new Date().toISOString()
            };

            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));
            window.location.href = 'index.html';
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    handleCreateForm();

    // Global Event Delegation
    document.body.addEventListener('click', (e) => {
        // Like Button
        if (e.target.closest('.like-btn')) {
            const postElement = e.target.closest('.post');
            const postId = postElement.dataset.id;
            const post = posts.find(p => p.id == postId);
            post.likes++;
            localStorage.setItem('posts', JSON.stringify(posts));
            postElement.querySelector('.like-count').textContent = post.likes;
        }

        // Delete Post
        if (e.target.classList.contains('delete-btn')) {
            const postId = e.target.closest('.post').dataset.id;
            posts = posts.filter(p => p.id != postId);
            localStorage.setItem('posts', JSON.stringify(posts));
            e.target.closest('.post').remove();
        }
    });

    // Comment System
    document.body.addEventListener('keypress', (e) => {
        if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
            e.preventDefault();
            const input = e.target;
            const comment = input.value.trim();
            
            if (comment) {
                const postElement = input.closest('.post');
                const postId = postElement.dataset.id;
                const post = posts.find(p => p.id == postId);
                post.comments.push(comment);
                localStorage.setItem('posts', JSON.stringify(posts));

                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.textContent = comment;
                postElement.querySelector('.comments').appendChild(commentDiv);
                input.value = '';
            }
        }
    });
});