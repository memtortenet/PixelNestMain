function getStarsFromRelevance(n){return n<=.2?"★★★★★":n<=.4?"★★★★☆":n<=.6?"★★★☆☆":n<=.8?"★★☆☆☆":"★☆☆☆☆"}document.addEventListener("DOMContentLoaded",function(){var e=new URLSearchParams(window.location.search),i=e.get("query"),t=document.getElementById("searchResults"),f=t.parentElement,n=document.createElement("p"),r,u;n.className="results-info";i?(r=getSearchResult(i)||[],n.textContent="Összesen "+r.length+' találat az alábbi keresésre: "'+i+'".',f.insertBefore(n,t),t.innerHTML="",r.length>0?(u=document.createElement("div"),u.className="row",r.forEach(function(n){var t=n.item,y=document.createElement("div"),i,r,h,c,l,f,e,a,o,s,v;y.className="col-lg-6 col-md-12 mb-4";i=document.createElement("a");i.href=t.url;i.className="meme-card-link";r=document.createElement("div");r.className="meme-card d-flex flex-column";h=document.createElement("h3");h.className="meme-title";h.textContent=t.title;c=document.createElement("p");c.className="meme-date";c.innerHTML="<span>"+(t.spreadYear||" ")+"<\/span>";l=document.createElement("p");l.className="meme-relevance";l.innerHTML=`<span><i class="fa-solid fa-search"></i> Relevancia: ${getStarsFromRelevance(n.score)} (${(1-n.score).toFixed(2)})</span>`;f=document.createElement("div");f.className="d-flex justify-content-between";f.appendChild(c);f.appendChild(l);e=document.createElement("div");e.className="meme-card-content d-flex";a=document.createElement("div");a.className="meme-thumbnail-container";o=document.createElement("img");o.src=t.listingThumbnailUrl;o.alt=t.urlSafeTitle+"-belyegkep";o.className="meme-thumbnail";s=document.createElement("div");s.className="meme-card-body d-flex flex-column";v=document.createElement("p");v.className="meme-description";v.textContent=t.shortDescription;a.appendChild(o);e.appendChild(a);e.appendChild(s);s.appendChild(v);s.appendChild(f);r.appendChild(h);r.appendChild(e);i.appendChild(r);y.appendChild(i);u.appendChild(y)}),t.appendChild(u)):(n.textContent='Nincs találat az alábbi keresésre: "'+i+'".',f.insertBefore(n,t))):(n.textContent='Nincs találat az alábbi keresésre: "".',f.insertBefore(n,t))})