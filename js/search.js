function getStarsFromRelevance(score) {
    if (score <= 0.2) {
        return "★★★★★";
    } else if (score <= 0.4) {
        return "★★★★☆";
    } else if (score <= 0.6) {
        return "★★★☆☆";
    } else if (score <= 0.8) {
        return "★★☆☆☆";
    } else {
        return "★☆☆☆☆";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var searchTerm = (urlParams.get("query") || "").trim();

    var resultsContainer = document.getElementById("searchResults");
    var parentContainer = resultsContainer.parentElement;
    var resultsInfo = document.createElement("p");
    resultsInfo.className = "results-info";

    if (searchTerm) {
        var results = getSearchResult(searchTerm) || [];

        if (results.length > 0) {
            resultsInfo.textContent = "Összesen " + results.length + " találat az alábbi keresésre: \"" + searchTerm + "\".";
            parentContainer.insertBefore(resultsInfo, resultsContainer);

            var memeList = document.createElement("div");
            memeList.className = "row";

            results.forEach(function (result) {
                var item = result.item;

                var relevancePercent = Math.round((1 - result.score) * 100);

                var colDiv = document.createElement("div");
                colDiv.className = "col-lg-6 col-md-12 mb-4";

                var link = document.createElement("a");
                link.href = item.url;
                link.className = "meme-card-link";

                var memeCard = document.createElement("div");
                memeCard.className = "meme-card d-flex flex-column";

                var title = document.createElement("h3");
                title.className = "meme-title";
                title.textContent = item.title;

                var originDate = document.createElement("p");
                originDate.className = "meme-date";
                originDate.innerHTML = "<span>" + (item.originDate || " ") + "</span>";

                var relevanceStars = document.createElement("p");
                relevanceStars.className = "meme-relevance";
                relevanceStars.innerHTML = `<span><i class="fa-solid fa-search"></i> Relevancia: ${getStarsFromRelevance(result.score)} (${relevancePercent}%)</span>`;

                var infoRow = document.createElement("div");
                infoRow.className = "d-flex justify-content-between";

                infoRow.appendChild(originDate);
                infoRow.appendChild(relevanceStars);

                var contentDiv = document.createElement("div");
                contentDiv.className = "meme-card-content d-flex";

                var thumbnailContainer = document.createElement("div");
                thumbnailContainer.className = "meme-thumbnail-container";

                var img = document.createElement("img");
                img.src = item.listingThumbnailUrl;
                img.alt = item.title + " bélyegkép";
                img.className = "meme-thumbnail";

                var bodyDiv = document.createElement("div");
                bodyDiv.className = "meme-card-body d-flex flex-column";

                var description = document.createElement("p");
                description.className = "meme-description text-justify";
                description.textContent = item.shortDescription;

                thumbnailContainer.appendChild(img);
                contentDiv.appendChild(thumbnailContainer);
                contentDiv.appendChild(bodyDiv);
                bodyDiv.appendChild(description);
                bodyDiv.appendChild(infoRow);

                memeCard.appendChild(title);
                memeCard.appendChild(contentDiv);
                link.appendChild(memeCard);
                colDiv.appendChild(link);
                memeList.appendChild(colDiv);
            });

            resultsContainer.appendChild(memeList);
        } else {
            resultsInfo.textContent = "Nincs találat az alábbi keresésre: \"" + searchTerm + "\".";
            parentContainer.insertBefore(resultsInfo, resultsContainer);
        }
    } else {
        resultsInfo.textContent = "A találatok megjelenítéséhez keresési szöveg megadása szükséges.";
        parentContainer.insertBefore(resultsInfo, resultsContainer);
    }
});
