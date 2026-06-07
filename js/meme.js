document.addEventListener("DOMContentLoaded", function () {
    var isMobile = isMobileDevice();
    var anchors = document.querySelectorAll(".header-anchor");
    anchors.forEach(function (anchor) {
        anchor.style.display = isMobile ? "none" : "block";
    });

    var toggleButton = document.getElementById("description-toggle-button");
    var toggleContent = document.getElementById("description-toggle-content");
    var toggleIcon = document.getElementById("description-toggle-icon");
    var toggleText = document.getElementById("description-toggle-text");
    toggleButton.addEventListener("click", function () {
        if (toggleContent.classList.contains("expanded")) {
            toggleContent.style.maxHeight = "0";
            toggleContent.classList.remove("expanded");
            toggleIcon.style.transform = "rotate(0)";
            toggleText.textContent = "(lenyitás)";
        } else {
            toggleContent.style.maxHeight = toggleContent.scrollHeight + "px";
            toggleContent.classList.add("expanded");
            toggleIcon.style.transform = "rotate(90deg)";
            toggleText.textContent = "(összecsukás)";
        }
    });

    var acceptedContentWarning = localStorage.getItem(`accepted-content-warning-${currentPage}`);
    if (!acceptedContentWarning) {
        var warningOverlay = document.getElementById("contentWarningOverlay");
        if (warningOverlay) {
            warningOverlay.classList.add("active");

            document.getElementById("acceptContentWarning").addEventListener("click", function () {
                localStorage.setItem(`accepted-content-warning-${currentPage}`, "true");
                warningOverlay.classList.remove("active");
            });

            document.getElementById("leaveContentWarning").addEventListener("click", function () {
                window.location.href = "/";
            });
        }
    }
});
