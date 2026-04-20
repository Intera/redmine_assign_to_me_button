document.addEventListener("DOMContentLoaded", function() {
  if (!window.redmineAssignToMeButton) return;

  var contextuals = document.querySelectorAll("#content > .contextual");
  if (!contextuals.length) return;

  contextuals.forEach(function(contextual) {
    if (contextual.querySelector(".assign-to-me-link")) return;

    var link = document.createElement("a");
    link.href = "#";
    link.className = "icon icon-user assign-to-me-link";
    link.textContent = "Assign to me";

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
    var anchor = logTimeLink ? logTimeLink.nextSibling : watchLink;

    var spaceBefore = document.createTextNode("\u00A0");
    var spaceAfter = document.createTextNode("\u00A0");

    if (anchor) {
      contextual.insertBefore(spaceBefore, anchor);
      contextual.insertBefore(link, anchor);
      contextual.insertBefore(spaceAfter, anchor);
    } else {
      contextual.appendChild(spaceBefore);
      contextual.appendChild(link);
      contextual.appendChild(spaceAfter);
    }
  });
});
