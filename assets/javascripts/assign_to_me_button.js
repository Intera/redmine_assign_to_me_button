document.addEventListener("DOMContentLoaded", function() {
  if (!window.redmineAssignToMeButton) return;

  var contextuals = document.querySelectorAll("#content > .contextual");
  if (!contextuals.length) return;

  contextuals.forEach(function(contextual) {
    if (contextual.querySelector(".assign-to-me-link")) return;

    var link = document.createElement("a");
    link.href = "#";
    link.className = "icon icon-user assign-to-me-link";
    link.textContent = window.redmineAssignToMeButton.label;

    link.addEventListener("click", function(event) {
      event.preventDefault();

      fetch(window.redmineAssignToMeButton.url, {
        method: "POST",
        headers: {
          "X-CSRF-Token": window.redmineAssignToMeButton.token,
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json"
        },
        credentials: "same-origin"
      }).then(function(response) {
        if (response.ok) {
          window.location.reload();
        }
      });
    });

    var logTimeLink = contextual.querySelector(".icon-time-add");
    var watchLink = contextual.querySelector("[class*='watcher']");

    if (logTimeLink) {
      var anchor = logTimeLink.nextSibling;

      if (anchor && anchor.nodeType === Node.TEXT_NODE) {
        contextual.insertBefore(document.createTextNode("\u00A0"), anchor);
        contextual.insertBefore(link, anchor);
      } else {
        logTimeLink.insertAdjacentText("afterend", "\u00A0");
        logTimeLink.insertAdjacentElement("afterend", link);
        link.insertAdjacentText("afterend", "\u00A0");
      }
    } else if (watchLink) {
      var prev = watchLink.previousSibling;

      contextual.insertBefore(link, watchLink);

      if (!(prev && prev.nodeType === Node.TEXT_NODE)) {
        contextual.insertBefore(document.createTextNode("\u00A0"), link);
      }

      contextual.insertBefore(document.createTextNode("\u00A0"), watchLink);
    } else {
      contextual.appendChild(document.createTextNode("\u00A0"));
      contextual.appendChild(link);
      contextual.appendChild(document.createTextNode("\u00A0"));
    }
  });
});
