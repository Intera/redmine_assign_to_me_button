document.addEventListener("DOMContentLoaded", function() {
  var template = document.getElementById("assign-to-me-link-template");
  if (!template) return;

  var contextuals = document.querySelectorAll("#content > .contextual");
  if (!contextuals.length) return;

  contextuals.forEach(function(contextual) {
    if (contextual.querySelector(".assign-to-me-link")) return;

    var link = template.content.firstElementChild.cloneNode(true);

    link.addEventListener("click", function(event) {
      event.preventDefault();

      fetch(link.dataset.url, {
        method: "POST",
        headers: {
          "X-CSRF-Token": link.dataset.token,
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

    var logTimeLink = contextual.querySelector("a.icon-time-add");
    var watchLink = contextual.querySelector("a[class*='watcher']");

    if (logTimeLink) {
      logTimeLink.insertAdjacentElement("afterend", link);
      logTimeLink.insertAdjacentText("afterend", "\u00A0");
    } else if (watchLink) {
      contextual.insertBefore(link, watchLink);
      contextual.insertBefore(document.createTextNode("\u00A0"), watchLink);
    }
  });
});
