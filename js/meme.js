function loadVideo(n,t,i){var r=document.createElement("iframe");r.classList.add("video-iframe");r.setAttribute("src",n+"?autoplay=1");r.setAttribute("title","YouTube videólejátszó - "+t);r.setAttribute("frameborder","0");r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");r.setAttribute("referrerpolicy","strict-origin-when-cross-origin");r.setAttribute("allowfullscreen","true");i.innerHTML="";i.appendChild(r)}document.addEventListener("DOMContentLoaded",function(){var n=isMobileDevice(),t=document.querySelectorAll(".header-anchor");t.forEach(function(t){t.style.display=n?"none":"block"})})