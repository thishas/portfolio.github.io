document.addEventListener('DOMContentLoaded', function() {
    // Only run on post.html
    if (!window.location.pathname.endsWith('post.html')) return;

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Define your blog posts data
    const posts = {
        '1': {
            title: 'Simple Post With Image',
            author: 'Thisha Smith',
            date: '14 June 2015',
            comments: '5',
            image: 'img/bg3.jpg',
            content: `
                <p>Cu illud lorem putent vel. Eum in movet nostrum referrentur. His ne tantas tractatos. Sit eu saperet antiopam scripserit. Ei albucius consequuntur sea, no nominavi fabellas phaedrum his.</p>
                <p>No dolorem blandit theophrastus eos, nam eu persecuti repudiandae, duo hinc vide aliquip et. Ex atqui voluptatibus eum, cu case intellegebat eum, mea ex regione patrioque signiferumque.</p>
                <p>No dolorem blandit theophrastus eos, nam eu persecuti repudiandae, duo hinc vide aliquip et. Ex atqui voluptatibus eum, cu case intellegebat eum, mea ex regione patrioque signiferumque. Pri ei solet graecis. Ea appetere referrentur vituperatoribus cum, vix sanctus meliore cu. Nec in sale prima nostrud.</p>
            `
        },
        '2': {
            title: 'Another Post Example',
            author: 'Thisha Smith',
            date: '11 June 2015',
            comments: '3',
            image: 'img/bg2.jpg',
            content: `
                <p>Cu illud lorem putent vel. Eum in movet nostrum referrentur. His ne tantas tractatos. Sit eu saperet antiopam scripserit.</p>
                <p>No dolorem blandit theophrastus eos, nam eu persecuti repudiandae, duo hinc vide aliquip et. Ex atqui voluptatibus eum, cu case intellegebat eum, mea ex regione patrioque signiferumque.</p>
            `
        },
        '3': {
            title: 'One More Post',
            author: 'Thisha Smith',
            date: '9 June 2015',
            comments: '4',
            image: 'img/bg1.jpg',
            content: `
                <p>Cu illud lorem putent vel. Eum in movet nostrum referrentur. His ne tantas tractatos. Sit eu saperet antiopam scripserit.</p>
                <p>No dolorem blandit theophrastus eos, nam eu persecuti repudiandae, duo hinc vide aliquip et. Ex atqui voluptatibus eum, cu case intellegebat eum, mea ex regione patrioque signiferumque.</p>
            `
        }
    };

    // Get the post data
    const post = posts[postId];
    if (!post) return;

    // Update the page content
    document.querySelector('.post .media img').src = post.image;
    document.querySelector('.post .content h4 a').textContent = post.title;
    document.querySelector('.post .content .post-icons li:nth-child(1) span').textContent = post.author;
    document.querySelector('.post .content .post-icons li:nth-child(2) span').textContent = post.date;
    document.querySelector('.post .content .post-icons li:nth-child(3) span').textContent = post.comments;
    document.querySelector('.post .content').innerHTML = 
        document.querySelector('.post .content').innerHTML.split('</ul>')[0] + 
        '</ul>' + post.content;
});
