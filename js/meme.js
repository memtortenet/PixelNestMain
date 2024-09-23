document.addEventListener('DOMContentLoaded', function () {
    var referrer = document.referrer;
    var backLink = document.querySelector(".backLink");

    if (referrer && referrer !== window.location.href) {
        backLink.href = referrer;
    } else {
        backLink.href = "../../";
    }
});

function loadVideo(url, title, container) {
    var iframe = document.createElement('iframe');
    iframe.classList.add('video-iframe');
    iframe.setAttribute('src', url + '?autoplay=1');
    iframe.setAttribute('title', 'YouTube videólejátszó - ' + title);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', 'true');

    container.innerHTML = '';
    container.appendChild(iframe);
}
