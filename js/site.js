function isMobileDevice(){return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent)}function updateLink(n,t){for(var u,f,r=document.getElementsByClassName(n),i=0;i<r.length;i++)u=r[i].getAttribute("data-mobile"),f=r[i].getAttribute("data-desktop"),r[i].href=t?u:f}function slugify(n){return n=n.normalize("NFKD"),n=n.toLowerCase(),n=n.replace(/\s+/g," ").trim(),n.replace(/[^a-z0-9\s]/g,"")}function sanitize(n){var t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"};return n.replace(/[&<>"'/]/ig,n=>t[n])}function getSearchResult(n){if(!n)return null;n=slugify(n);var i=memePages.filter(t=>t.spreadYear===n).map(n=>({item:n,score:0})),r=new Fuse(memePages,{includeScore:!0,includeMatches:!0,threshold:.3,keys:[{name:"searchTitle",weight:1},{name:"searchKeywords",weight:.7}]}),u=r.search(n),f=new Fuse(memePages,{includeScore:!0,includeMatches:!0,threshold:.1,minMatchCharLength:3,ignoreLocation:!0,keys:[{name:"searchShortDescription",weight:.5},{name:"searchDescription",weight:.4}]}),e=f.search(n),t={},o=[...i,...u,...e];return o.forEach(n=>{var i=n.item.title;(!t[i]||n.score<t[i].score)&&(t[i]=n)}),Object.values(t).sort((n,t)=>n.score-t.score)}function searchSubmit(n){var t;if(t=n?document.getElementById("mobileSearchBar").value.trim():document.getElementById("searchBar").value.trim(),!t){alert("Kérem adjon meg egy keresési kifejezést!");return}window.location.href="/search.html?query="+encodeURIComponent(t)}function showSearchResultsDropdown(n){var t,i,u,f,r;if(n?(t=document.getElementById("mobileSearchResultsDropdown"),i=document.getElementById("mobileSearchBar"),u=mobileSearchDropdownItemClassName):(t=document.getElementById("searchResultsDropdown"),i=document.getElementById("searchBar"),u=searchDropdownItemClassName),t.innerHTML="",t.style.width=i.offsetWidth+"px",f=i.value.trim(),r=getSearchResult(f),!r||r.length===0){t.style.display="none";return}t.style.display="block";r.slice(0,5).forEach(function(n){var f=n.item,r=document.createElement("a"),i;r.href=f.url;r.className=u;r.setAttribute("tabindex",0);i=document.createElement("img");i.src=f.searchBarThumbnailUrl;i.alt="";i.className="thumbnail";i.style.width="24px";i.style.height="24px";i.style.marginRight="4px";r.appendChild(i);r.appendChild(document.createTextNode(f.title));t.appendChild(r)})}function copyToClipboard(n,t){navigator.clipboard.writeText(n).then(function(){var n=t.outerHTML;t.outerHTML='<a class="share-link fa-solid fa-check" href="javascript:void(0)" id="copiedMessage" title="Link másolva!"><\/a>';setTimeout(function(){document.getElementById("copiedMessage").outerHTML=n},2500)}).catch(function(n){console.error("Could not copy text: ",n)})}function randomMeme(){var n=memePages[Math.floor(Math.random()*memePages.length)];window.location.href=n.url}function toggleMobileSearchContainer(){if(!isToggleMobileSearchContainerTransitioning){isToggleMobileSearchContainerTransitioning=!0;var n=document.getElementById("mobileSearchContainerOuter"),t=document.getElementById("mobileSearchResultsDropdown"),i=document.getElementById("mobileSearchBar");t.style.display!=="none"&&(t.style.display="none");n.style.maxHeight=n.style.maxHeight?null:"46px";n.style.overflow?(n.style.overflow=null,isToggleMobileSearchContainerTransitioning=!1):setTimeout(function(){n.style.overflow=null;n.style.overflow="visible";i.focus();isToggleMobileSearchContainerTransitioning=!1},350)}}var mobileSearchDropdownItemClassName="dropdown-item mobile-search-dropdown-item",searchDropdownItemClassName="dropdown-item search-dropdown-item",isToggleMobileSearchContainerTransitioning=!1,previousInnerWidth=window.innerWidth;document.addEventListener("keydown",function(n){var f=document.getElementById("mobileSearchBar"),e=document.getElementById("searchBar"),o=document.getElementById("mobileSearchResultsDropdown"),s=document.getElementById("searchResultsDropdown"),t=o.querySelectorAll(".mobile-search-dropdown-item"),i=s.querySelectorAll(".search-dropdown-item"),r,h,c,u,l,a;n.target===f&&n.key==="Enter"?searchSubmit(!0):n.target===e&&n.key==="Enter"?searchSubmit(!1):t.length>0&&(n.target===f||n.target.className===mobileSearchDropdownItemClassName)?(r=-1,t.forEach((n,t)=>{document.activeElement===n&&(r=t)}),n.key==="ArrowDown"?(n.preventDefault(),h=(r+1)%t.length,t[h].focus()):n.key==="ArrowUp"?(n.preventDefault(),r===-1&&(r=0),c=(r-1+t.length)%t.length,t[c].focus()):n.key==="Escape"&&(o.style.display="none",f.focus())):i.length>0&&(n.target===e||n.target.className===searchDropdownItemClassName)&&(u=-1,i.forEach((n,t)=>{document.activeElement===n&&(u=t)}),n.key==="ArrowDown"?(n.preventDefault(),l=(u+1)%i.length,i[l].focus()):n.key==="ArrowUp"?(n.preventDefault(),u===-1&&(u=0),a=(u-1+i.length)%i.length,i[a].focus()):n.key==="Escape"&&(s.style.display="none",e.focus()))});window.addEventListener("resize",function(){var r=window.innerWidth,t,n,i;r!==previousInnerWidth&&(t=document.getElementById("mobileSearchResultsDropdown"),t.style.display!=="none"&&(t.style.display="none"),n=document.getElementById("mobileSearchContainerOuter"),n.style.overflow&&(n.style.overflow=null),n.style.maxHeight&&(n.style.maxHeight=null),i=document.getElementById("searchResultsDropdown"),i.style.display!=="none"&&(i.style.display="none"),previousInnerWidth=r)});document.addEventListener("DOMContentLoaded",function(){var r=localStorage.getItem("cookiesConsent"),n,t;document.getElementById("cookieBanner").style.display=r?"none":"block";document.getElementById("acceptCookies").addEventListener("click",function(){localStorage.setItem("cookiesConsent","accepted");document.getElementById("cookieBanner").style.display="none";location.reload()});document.getElementById("declineCookies").addEventListener("click",function(){localStorage.setItem("cookiesConsent","declined");document.getElementById("cookieBanner").style.display="none";location.reload()});document.getElementById("cookieSettingsLink").addEventListener("click",function(){localStorage.removeItem("cookiesConsent");document.getElementById("cookieBanner").style.display="block"});n=isMobileDevice();updateLink("facebook-messenger-link",n);updateLink("whatsapp-link",n);updateLink("viber-link",n);updateLink("telegram-link",n);updateLink("skype-link",n);updateLink("slack-link",n);updateLink("teams-link",n);updateLink("gmail-link",n);t={};memePages.forEach(function(n){n.keywords.forEach(function(n){t[n]?t[n]++:t[n]=1})});var u=Object.keys(t).sort(function(n,i){return t[i]-t[n]}),f=document.getElementById("tagCloud");u.slice(0,20).forEach(function(n){var r=10+t[n]*4,i=document.createElement("a");i.href="/search.html?query="+encodeURIComponent(n.trim());i.style.fontSize=r+"px";i.innerText=n;f.appendChild(i)});var e=new Date(2e3,0,1),o=new Date,s=Math.floor((o-e)/864e5),h=s%memePages.length,i=memePages[h],c=`
        <a href="${i.url}" class="meme-card-link">
            <div class="meme-card d-flex flex-column">
                <h3 class="meme-title">${i.title}</h3>
                <div class="meme-card-content d-flex">
                    <div class="meme-thumbnail-container">
                        <img src="${i.listingThumbnailUrl}" alt="${i.urlSafeTitle}-belyegkep" class="meme-thumbnail">
                    </div>
                </div>
            </div>
        </a>
    `;document.getElementById("dailyMeme").innerHTML=c})