var mobileSearchDropdownItemClassNames = "dropdown-item mobile-search-dropdown-item";
var searchDropdownItemClassNames = "dropdown-item search-dropdown-item";
var isToggleMobileSearchContainerTransitioning = false;
var previousInnerWidth = window.innerWidth;

function addPreconnect(url) {
    if (document.querySelector("link[rel='preconnect'][href='" + url + "']")) {
        return;
    }

    var link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;

    document.head.appendChild(link);
}

function renderYouTubeVideo(id, title, container) {
    var iframe = document.createElement("iframe");
    iframe.classList.add("video-iframe");
    iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1");
    iframe.setAttribute("title", "YouTube videólejátszó - " + title);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "true");

    container.innerHTML = "";
    container.appendChild(iframe);
}

function loadVideo(id, title, container) {
    if (!hasThirdPartyContentConsent()) {
        return;
    }

    renderYouTubeVideo(id, title, container);
}

function getYouTubeThumbnailUrl(videoId) {
    return "https://img.youtube.com/vi/" + encodeURIComponent(videoId) + "/hqdefault.jpg";
}

function initializeYouTubeVideos(hasConsent) {
    document.querySelectorAll(".js-video-container").forEach(function (container) {
        var videoId = container.getAttribute("data-youtube-id");
        var thumbnail = container.querySelector(".js-youtube-thumbnail");
        var playButton = container.querySelector(".js-youtube-play-button");
        var placeholder = container.querySelector(".js-third-party-placeholder");

        if (hasConsent) {
            if (thumbnail) {
                thumbnail.style.backgroundImage = "url('" + getYouTubeThumbnailUrl(videoId) + "')";
                thumbnail.hidden = false;
            }

            if (playButton) {
                playButton.hidden = false;
            }

            if (placeholder) {
                placeholder.hidden = true;
            }

            container.classList.remove("third-party-blocked");
        } else {
            if (thumbnail) {
                thumbnail.style.backgroundImage = "";
                thumbnail.hidden = true;
            }

            if (playButton) {
                playButton.hidden = true;
            }

            if (placeholder) {
                placeholder.hidden = false;
            }

            container.classList.add("third-party-blocked");
        }

        container.addEventListener("click", function (event) {
            if (event.target.closest("button, a")) {
                return;
            }

            if (!hasConsent) {
                return;
            }

            loadVideo(
                container.getAttribute("data-youtube-id"),
                container.getAttribute("data-video-title") || "",
                container
            );
        });

        container.addEventListener("keydown", function (event) {
            if (event.target.closest("button, a")) {
                return;
            }

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();

            if (!hasConsent) {
                return;
            }

            loadVideo(
                container.getAttribute("data-youtube-id"),
                container.getAttribute("data-video-title") || "",
                container
            );
        });
    });
}

function renderGoogleDriveImage(container) {
    var placeholder = container.querySelector(".js-third-party-placeholder");
    var existingImage = container.querySelector("img.image-thumbnail");

    if (placeholder) {
        placeholder.hidden = true;
    }

    if (existingImage) {
        return;
    }

    var image = document.createElement("img");

    image.loading = "lazy";
    image.className = "image-thumbnail";
    image.alt = container.getAttribute("data-image-alt") || "";
    image.src = getGoogleDriveThumbnailUrl(container.getAttribute("data-drive-image-id"));

    container.appendChild(image);
}

function getGoogleDriveThumbnailUrl(imageId) {
    return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(imageId) + "&sz=w528";
}

function initializeGoogleDriveImages(hasConsent) {
    document.querySelectorAll(".js-drive-image-container").forEach(function (container) {
        var placeholder = container.querySelector(".js-third-party-placeholder");
        var existingImage = container.querySelector("img.image-thumbnail");

        if (!hasConsent) {
            if (existingImage) {
                existingImage.remove();
            }

            if (placeholder) {
                placeholder.hidden = false;
            }

            return;
        }

        renderGoogleDriveImage(container);
    });
}

function getConsentWithThirdPartyContentEnabled() {
    var consent = getConsent();

    if (!validateConsent(consent)) {
        return CONSENT_PRESETS.contentOnly;
    }

    return {
        thirdPartyContent: true,
        analytics: consent.analytics === true,
        marketing: consent.marketing === true,
        functional: consent.functional === true,
        personalization: consent.personalization === true
    };
}

function initializeThirdPartyConsentButtons() {
    document.querySelectorAll(".js-enable-third-party-content").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            setConsent(getConsentWithThirdPartyContentEnabled());
        });
    });
}

function initializeSingleThirdPartyContentButtons() {
    document.querySelectorAll(".js-load-this-youtube-content").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            var container = button.closest(".js-video-container");

            if (!container) {
                return;
            }

            renderYouTubeVideo(
                container.getAttribute("data-youtube-id"),
                container.getAttribute("data-video-title") || "",
                container
            );
        });
    });

    document.querySelectorAll(".js-load-this-drive-content").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            var container = button.closest(".js-drive-image-container");

            if (!container) {
                return;
            }

            renderGoogleDriveImage(container);
        });
    });
}

function initializeThirdPartyContent() {
    var hasConsent = hasThirdPartyContentConsent();

    if (hasConsent) {
        if (document.querySelector(".js-youtube-thumbnail")) {
            addPreconnect("https://img.youtube.com");
            addPreconnect("https://www.youtube-nocookie.com");
        }

        if (document.querySelector(".js-drive-image-container")) {
            addPreconnect("https://drive.google.com");
        }
    }

    initializeYouTubeVideos(hasConsent);
    initializeGoogleDriveImages(hasConsent);
    initializeThirdPartyConsentButtons();
    initializeSingleThirdPartyContentButtons();
}

function getConsentFromSettingsForm() {
    var consentThirdPartyContentCheckbox = document.getElementById("consentThirdPartyContent");
    var consentAnalyticsCheckbox = document.getElementById("consentAnalytics");

    return {
        thirdPartyContent: consentThirdPartyContentCheckbox ? consentThirdPartyContentCheckbox.checked : false,
        analytics: consentAnalyticsCheckbox ? consentAnalyticsCheckbox.checked : false,
        marketing: false,
        functional: false,
        personalization: false
    };
}

function setConsentSettingsFormState(consent) {
    var consentThirdPartyContentCheckbox = document.getElementById("consentThirdPartyContent");
    var consentAnalyticsCheckbox = document.getElementById("consentAnalytics");

    if (!validateConsent(consent)) {
        if (consentThirdPartyContentCheckbox) {
            consentThirdPartyContentCheckbox.checked = false;
        }

        if (consentAnalyticsCheckbox) {
            consentAnalyticsCheckbox.checked = false;
        }

        return;
    }

    if (consentThirdPartyContentCheckbox) {
        consentThirdPartyContentCheckbox.checked = consent.thirdPartyContent === true;
    }

    if (consentAnalyticsCheckbox) {
        consentAnalyticsCheckbox.checked = consent.analytics === true;
    }
}

function initializeConsentHandling() {
    var consent = getConsent();

    var consentBanner = document.getElementById("consentBanner");
    var rejectAllConsentButton = document.getElementById("rejectAllConsent");
    var saveConsentSettingsButton = document.getElementById("saveConsentSettings");
    var acceptAllConsentButton = document.getElementById("acceptAllConsent");
    var consentSettingsLink = document.getElementById("consentSettingsLink");

    if (!consentBanner) {
        initializeThirdPartyContent();
        return;
    }

    setConsentSettingsFormState(consent);

    if (validateConsent(consent)) {
        consentBanner.style.display = "none";
    } else {
        window.localStorage.removeItem(CONSENT_STORAGE_KEY);
        consentBanner.style.display = "block";
    }

    if (rejectAllConsentButton) {
        rejectAllConsentButton.addEventListener("click", function () {
            setConsent(CONSENT_PRESETS.rejected);
        });
    }

    if (saveConsentSettingsButton) {
        saveConsentSettingsButton.addEventListener("click", function () {
            setConsent(getConsentFromSettingsForm());
        });
    }

    if (acceptAllConsentButton) {
        acceptAllConsentButton.addEventListener("click", function () {
            setConsent(CONSENT_PRESETS.accepted);
        });
    }

    if (consentSettingsLink) {
        consentSettingsLink.addEventListener("click", function () {
            setConsent(null);
        });
    }

    initializeThirdPartyContent();
}

async function nativeShare(el) {
    const shareData = {
        title: el.dataset.shareTitle,
        text: el.dataset.shareText,
        url: el.dataset.shareUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch {
            // user cancelled
        }
    } else {
        copyToClipboard(shareData.url, el);
    }
}

function isMobileDevice() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
}

function updateLink(className, isMobile) {
    var linkElements = document.getElementsByClassName(className);

    for (var i = 0; i < linkElements.length; i++) {
        var mobileUrl = linkElements[i].getAttribute("data-mobile");
        var desktopUrl = linkElements[i].getAttribute("data-desktop");
        linkElements[i].href = isMobile ? mobileUrl : desktopUrl;
    }
}

function initializeShareLinks() {
    var isMobile = isMobileDevice();

    document.querySelectorAll(".share-link-mobile-only").forEach(function (element) {
        if (isMobile) {
            element.classList.remove("d-none");
        } else {
            element.classList.add("d-none");
        }
    });

    updateLink("whatsapp-link", isMobile);
    updateLink("teams-link", isMobile);
    updateLink("gmail-link", isMobile);
}
function openFacebookMessagesWithCopiedLink(el) {
    const shareUrl = el.dataset.shareUrl;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl).catch(function () {
            copyToClipboard(shareUrl, el);
        });
    } else {
        copyToClipboard(shareUrl, el);
    }

    window.open(el.href, "_blank", "noopener,noreferrer");
}

function initializeTagCloud() {
    var tagCloudContainer = document.getElementById("tagCloud");

    if (!tagCloudContainer) {
        return;
    }

    var tagCounts = {};
    memePages.forEach(function (page) {
        page.keywords.forEach(function (keyword) {
            if (tagCounts[keyword]) {
                tagCounts[keyword]++;
            } else {
                tagCounts[keyword] = 1;
            }
        });
    });

    var sortedTags = Object.keys(tagCounts).sort(function (a, b) {
        return tagCounts[b] - tagCounts[a];
    });

    var maxTagsToShow = 20;
    sortedTags.slice(0, maxTagsToShow).forEach(function (tag) {
        var fontSize = 10 + tagCounts[tag] * 4;
        var tagElement = document.createElement("a");

        tagElement.href = "/search.html?query=" + encodeURIComponent(tag.trim());
        tagElement.style.fontSize = fontSize + "px";
        tagElement.innerText = tag;

        tagCloudContainer.appendChild(tagElement);
    });
}

function initializeDailyMeme() {
    var dailyMemeContainer = document.getElementById("dailyMeme");

    if (!dailyMemeContainer) {
        return;
    }

    var startDate = new Date(2000, 0, 1);
    var currentDate = new Date();
    var daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    var memeIndex = daysSinceStart % memePages.length;
    var memePage = memePages[memeIndex];

    var dailyMeme = `
        <a href="${memePage.url}" class="meme-card-link">
            <div class="meme-card d-flex flex-column">
                <h3 class="meme-title">${memePage.title}</h3>
                <div class="meme-card-content d-flex">
                    <div class="meme-thumbnail-container">
                        <img src="${memePage.listingThumbnailUrl}" alt="${memePage.title} bélyegkép" class="meme-thumbnail">
                    </div>
                </div>
            </div>
        </a>
    `;

    dailyMemeContainer.innerHTML = dailyMeme;
}

function initializeCopyrightYear() {
    var copyrightYearSpan = document.getElementById("copyrightYear");

    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }
}

function searchSubmit(isMobile) {
    var searchTerm;
    if (isMobile) {
        searchTerm = document.getElementById("mobileSearchBar").value.trim();
    } else {
        searchTerm = document.getElementById("searchBar").value.trim();
    }

    if (!searchTerm) {
        alert("Kérem adjon meg egy keresési kifejezést!");
        return;
    }

    window.location.href = "/search.html?query=" + encodeURIComponent(searchTerm);
}

function slugify(text) {
    if (typeof text !== "string") {
        return null;
    }

    text = text.normalize("NFKD");
    text = text.toLowerCase();
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/[^a-z0-9\s]/g, "");
    return text;
}

function getSearchResult(searchTerm) {
    searchTerm = slugify(searchTerm);

    if (!searchTerm) {
        return null;
    }

    // Exact match on originDate
    var exactResults = memePages.filter(memePage => memePage.originDate === searchTerm).map(item => ({ item, score: 0 }));

    // Short field fuse search
    var shortFieldOptions = {
        includeScore: true,
        includeMatches: true,
        threshold: 0.3,
        keys: [
            { name: "searchTitle", weight: 1.0 },
            { name: "searchKeywords", weight: 0.7 },
            { name: "originPlace", weight: 0.7 }
        ]
    };
    var fuseShortFields = new Fuse(memePages, shortFieldOptions);
    var shortFieldResults = fuseShortFields.search(searchTerm);

    // Long field fuse search
    var longFieldOptions = {
        includeScore: true,
        includeMatches: true,
        threshold: 0.1,
        minMatchCharLength: 3,
        ignoreLocation: true,
        keys: [
            { name: "searchShortDescription", weight: 0.5 }
        ]
    };
    var fuseLongFields = new Fuse(memePages, longFieldOptions);
    var longFieldResults = fuseLongFields.search(searchTerm);

    // Deduplicate the combined results and keep the best score
    var resultMap = {};
    var combinedResults = [...exactResults, ...shortFieldResults, ...longFieldResults];
    combinedResults.forEach(result => {
        var resultKey = result.item.urlSafeTitle;
        if (!resultMap[resultKey] || result.score < resultMap[resultKey].score) {
            resultMap[resultKey] = result;
        }
    });

    // Convert resultMap back to an array and sort by score
    var uniqueResults = Object.values(resultMap).sort((a, b) => a.score - b.score);
    return uniqueResults;
}

function showSearchResultsDropdown(isMobile) {
    var dropdown;
    var searchBar;
    var className;
    if (isMobile) {
        dropdown = document.getElementById("mobileSearchResultsDropdown");
        searchBar = document.getElementById("mobileSearchBar");
        className = mobileSearchDropdownItemClassNames;
    } else {
        dropdown = document.getElementById("searchResultsDropdown");
        searchBar = document.getElementById("searchBar");
        className = searchDropdownItemClassNames;
    }

    dropdown.innerHTML = "";
    dropdown.style.width = searchBar.offsetWidth + "px";

    var searchTerm = searchBar.value.trim();
    var results = getSearchResult(searchTerm);
    if (!results || results.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.style.display = "block";
    results.slice(0, 5).forEach(function (result) {
        var item = result.item;
        var dropdownItem = document.createElement("a");
        dropdownItem.href = item.url;
        dropdownItem.className = className;
        dropdownItem.setAttribute("tabindex", 0);

        var thumbnail = document.createElement("img");
        thumbnail.src = item.searchBarThumbnailUrl;
        thumbnail.alt = "";
        thumbnail.className = "thumbnail";
        thumbnail.style.width = "24px";
        thumbnail.style.height = "24px";
        thumbnail.style.marginRight = "4px";

        dropdownItem.appendChild(thumbnail);
        dropdownItem.appendChild(document.createTextNode(item.title));

        dropdown.appendChild(dropdownItem);
    });
}

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(function () {
        var hiddenText = element.querySelector(".visually-hidden");

        clearTimeout(element.copyTimeoutId);

        element.classList.remove("fa-copy");
        element.classList.add("fa-check");
        element.title = "Link másolva!";

        if (hiddenText) {
            hiddenText.textContent = "Link másolva!";
        }

        element.copyTimeoutId = setTimeout(function () {
            element.classList.remove("fa-check");
            element.classList.add("fa-copy");
            element.title = "Link másolása";

            if (hiddenText) {
                hiddenText.textContent = "Link másolása";
            }

            element.copyTimeoutId = null;
        }, 2500);
    }).catch(function (error) {
        console.error("Could not copy text: ", error);
    });
}

function randomMeme() {
    var randomPage = memePages[Math.floor(Math.random() * memePages.length)];
    window.location.href = randomPage.url;
}

function toggleMobileSearchContainer() {
    if (isToggleMobileSearchContainerTransitioning) {
        return;
    }
    isToggleMobileSearchContainerTransitioning = true;

    var mobileSearchContainerOuter = document.getElementById("mobileSearchContainerOuter");
    var mobileSearchResultsDropdown = document.getElementById("mobileSearchResultsDropdown");
    var searchBar = document.getElementById("mobileSearchBar");

    if (mobileSearchResultsDropdown.style.display !== "none") {
        mobileSearchResultsDropdown.style.display = "none";
    }

    if (mobileSearchContainerOuter.style.maxHeight) {
        mobileSearchContainerOuter.style.maxHeight = null;
    } else {
        mobileSearchContainerOuter.style.maxHeight = "46px";
    }

    if (mobileSearchContainerOuter.style.overflow) {
        mobileSearchContainerOuter.style.overflow = null;
        isToggleMobileSearchContainerTransitioning = false;
    } else {
        setTimeout(function () {
            mobileSearchContainerOuter.style.overflow = null;
            mobileSearchContainerOuter.style.overflow = "visible";
            searchBar.focus();
            isToggleMobileSearchContainerTransitioning = false;
        }, 350);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeConsentHandling();
    initializeShareLinks();
    initializeTagCloud();
    initializeDailyMeme();
    initializeCopyrightYear();
});

document.addEventListener("keydown", function (event) {
    var mobileSearchBar = document.getElementById("mobileSearchBar");
    var searchBar = document.getElementById("searchBar");

    var mobileSearchResultsDropdown = document.getElementById("mobileSearchResultsDropdown");
    var searchResultsDropdown = document.getElementById("searchResultsDropdown");

    var mobileSearchResultsDropdownItems = mobileSearchResultsDropdown.querySelectorAll(".mobile-search-dropdown-item");
    var searchResultsDropdownItems = searchResultsDropdown.querySelectorAll(".search-dropdown-item");

    if (event.target === mobileSearchBar && event.key === "Enter") {
        searchSubmit(true);
    } else if (event.target === searchBar && event.key === "Enter") {
        searchSubmit(false);
    } else if (mobileSearchResultsDropdownItems.length > 0 && (event.target === mobileSearchBar || event.target.className === mobileSearchDropdownItemClassNames)) {
        var mobileCurrentIndex = -1;
        mobileSearchResultsDropdownItems.forEach((item, index) => {
            if (document.activeElement === item) {
                mobileCurrentIndex = index;
            }
        });

        if (event.key === "ArrowDown") {
            event.preventDefault();
            var mobileNextIndex = (mobileCurrentIndex + 1) % mobileSearchResultsDropdownItems.length;
            mobileSearchResultsDropdownItems[mobileNextIndex].focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (mobileCurrentIndex === -1) {
                mobileCurrentIndex = 0;
            }
            var mobilePreviousIndex = (mobileCurrentIndex - 1 + mobileSearchResultsDropdownItems.length) % mobileSearchResultsDropdownItems.length;
            mobileSearchResultsDropdownItems[mobilePreviousIndex].focus();
        } else if (event.key === "Escape") {
            mobileSearchResultsDropdown.style.display = "none";
            mobileSearchBar.focus();
        }
    } else if (searchResultsDropdownItems.length > 0 && (event.target === searchBar || event.target.className === searchDropdownItemClassNames)) {
        var currentIndex = -1;
        searchResultsDropdownItems.forEach((item, index) => {
            if (document.activeElement === item) {
                currentIndex = index;
            }
        });

        if (event.key === "ArrowDown") {
            event.preventDefault();
            var nextIndex = (currentIndex + 1) % searchResultsDropdownItems.length;
            searchResultsDropdownItems[nextIndex].focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (currentIndex === -1) {
                currentIndex = 0;
            }
            var previousIndex = (currentIndex - 1 + searchResultsDropdownItems.length) % searchResultsDropdownItems.length;
            searchResultsDropdownItems[previousIndex].focus();
        } else if (event.key === "Escape") {
            searchResultsDropdown.style.display = "none";
            searchBar.focus();
        }
    }
});

window.addEventListener("resize", function () {
    var currentInnerWidth = window.innerWidth;

    if (currentInnerWidth !== previousInnerWidth) {
        var mobileSearchResultsDropdown = document.getElementById("mobileSearchResultsDropdown");
        if (mobileSearchResultsDropdown.style.display !== "none") {
            mobileSearchResultsDropdown.style.display = "none";
        }

        var mobileSearchContainerOuter = document.getElementById("mobileSearchContainerOuter");
        if (mobileSearchContainerOuter.style.overflow) {
            mobileSearchContainerOuter.style.overflow = null;
        }
        if (mobileSearchContainerOuter.style.maxHeight) {
            mobileSearchContainerOuter.style.maxHeight = null;
        }

        var searchResultsDropdown = document.getElementById("searchResultsDropdown");
        if (searchResultsDropdown.style.display !== "none") {
            searchResultsDropdown.style.display = "none";
        }

        previousInnerWidth = currentInnerWidth;
    }
});
