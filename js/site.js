function copyToClipboard(n,t){navigator.clipboard.writeText(n).then(function(){const n=t.outerHTML;t.outerHTML='<span id="copied-message">Copied!<\/span>';setTimeout(function(){document.getElementById("copied-message").outerHTML=n},2500)})}