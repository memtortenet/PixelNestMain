const CONSENT_STORAGE_KEY = "siteConsent";

const CONSENT_KEYS = [
    "thirdPartyContent",
    "analytics",
    "marketing",
    "functional",
    "personalization"
];

const CONSENT_PRESETS = {
    accepted: {
        thirdPartyContent: true,
        analytics: true,
        marketing: false,
        functional: false,
        personalization: false
    },
    contentOnly: {
        thirdPartyContent: true,
        analytics: false,
        marketing: false,
        functional: false,
        personalization: false
    },
    rejected: {
        thirdPartyContent: false,
        analytics: false,
        marketing: false,
        functional: false,
        personalization: false
    }
};

const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-6ZRJJ5SWB9";
// const GOOGLE_ADS_CONVERSION_ID = "AW-XXXXXXXXX"; // Later, only if Google Ads is implemented.

const GOOGLE_DEFAULT_CONSENT = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted"
};

function validateConsent(consent) {
    if (!consent || typeof consent !== "object" || Array.isArray(consent)) {
        return false;
    }

    var actualKeys = Object.keys(consent);

    if (actualKeys.length !== CONSENT_KEYS.length) {
        return false;
    }

    return CONSENT_KEYS.every(function (key) {
        return Object.prototype.hasOwnProperty.call(consent, key) && typeof consent[key] === "boolean";
    });
}

function getConsent() {
    try {
        var rawConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);

        if (!rawConsent) {
            return null;
        }

        var parsedConsent = JSON.parse(rawConsent);

        return validateConsent(parsedConsent) ? parsedConsent : null;
    } catch {
        return null;
    }
}

function setConsent(consent) {
    var isValidConsent = validateConsent(consent);

    try {
        if (isValidConsent) {
            window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
        } else {
            window.localStorage.removeItem(CONSENT_STORAGE_KEY);
        }
    } catch { }

    window.location.reload();
}

function hasThirdPartyContentConsent() {
    var consent = getConsent();
    return validateConsent(consent) && consent.thirdPartyContent === true;
}

function toGoogleConsentValue(value) {
    return value === true ? "granted" : "denied";
}

function toGoogleConsent(consent) {
    if (!validateConsent(consent)) {
        return null;
    }

    return {
        analytics_storage: toGoogleConsentValue(consent.analytics),

        ad_storage: toGoogleConsentValue(consent.marketing),
        ad_user_data: toGoogleConsentValue(consent.marketing),
        ad_personalization: toGoogleConsentValue(consent.marketing),

        functionality_storage: toGoogleConsentValue(consent.functional),
        personalization_storage: toGoogleConsentValue(consent.personalization),

        security_storage: "granted"
    };
}

function setupGtagQueue() {
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };
}

function clearCookiesByPredicate(predicate) {
    var cookieNames = document.cookie
        .split(";")
        .map(function (cookie) {
            return cookie.trim().split("=")[0];
        })
        .filter(predicate);

    if (!cookieNames.length) {
        return;
    }

    var hostname = window.location.hostname;
    var parts = hostname.split(".");
    var domains = [undefined, hostname];

    for (var i = 0; i < parts.length - 1; i++) {
        domains.push("." + parts.slice(i).join("."));
    }

    domains = domains.filter(function (domain, index, array) {
        return array.indexOf(domain) === index;
    });

    cookieNames.forEach(function (name) {
        domains.forEach(function (domain) {
            var cookie =
                name +
                "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";

            if (domain) {
                cookie += "; domain=" + domain;
            }

            document.cookie = cookie;
        });
    });
}

function clearGoogleAnalyticsCookies() {
    clearCookiesByPredicate(function (name) {
        return (
            name === "_ga" ||
            name === "_gid" ||
            name.indexOf("_ga_") === 0 ||
            name.indexOf("_gat") === 0
        );
    });
}

function clearGoogleMarketingCookies() {
    clearCookiesByPredicate(function (name) {
        return name.indexOf("_gcl_") === 0;
    });

    try {
        window.localStorage.removeItem("_gcl_ls");
    } catch { }
}

function loadGoogleTagScript() {
    if (document.getElementById("google-tag-script")) {
        return;
    }

    var script = document.createElement("script");
    script.id = "google-tag-script";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GOOGLE_ANALYTICS_MEASUREMENT_ID);
    document.head.appendChild(script);
}

function initGoogleTags() {
    setupGtagQueue();

    window.gtag("consent", "default", GOOGLE_DEFAULT_CONSENT);

    var consent = getConsent();

    if (!validateConsent(consent) || (consent.analytics !== true && consent.marketing !== true)) {
        clearGoogleAnalyticsCookies();
        clearGoogleMarketingCookies();
        window.__googleTagLoaded = false;
        return;
    }

    var analyticsConsentGranted = consent.analytics === true;
    var marketingConsentGranted = consent.marketing === true;
    var googleConsent = toGoogleConsent(consent);

    window.gtag("consent", "update", googleConsent);

    window.gtag("set", "ads_data_redaction", !marketingConsentGranted);

    window.gtag("js", new Date());

    if (analyticsConsentGranted) {
        window.gtag("config", GOOGLE_ANALYTICS_MEASUREMENT_ID, {
            send_page_view: true,
            allow_google_signals: marketingConsentGranted,
            allow_ad_personalization_signals: marketingConsentGranted
        });
    } else {
        clearGoogleAnalyticsCookies();
    }

    if (marketingConsentGranted) {
        // Later, only if you actually add Google Ads implement GOOGLE_ADS_CONVERSION_ID and the following code:
        // window.gtag("config", GOOGLE_ADS_CONVERSION_ID);
    } else {
        clearGoogleMarketingCookies();
    }

    loadGoogleTagScript();

    window.__googleTagLoaded = true;
}

initGoogleTags();
