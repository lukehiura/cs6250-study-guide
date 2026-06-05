/*
 * Custom feedback handler — opens a pre-filled GitHub issue instead of
 * sending data to Google Analytics. See .cursor/rules/mkdocs-theme.mdc.
 */
document$.subscribe(function () {
  var feedback = document.forms.feedback;
  if (typeof feedback === "undefined") return;

  feedback.hidden = false;

  feedback.addEventListener("submit", function (ev) {
    ev.preventDefault();

    var page = document.location.pathname;
    var data = ev.submitter.getAttribute("data-md-value");
    var title = document.title.replace(/ — .+$/, "");

    if (data === "0") {
      var issueTitle = encodeURIComponent("[Feedback] " + title + " — " + page);
      var issueBody = encodeURIComponent(
        "Page: " + page + "\n\nWhat could be improved?\n\n"
      );
      window.open(
        "https://github.com/lukehiura/cs6250-study-guide/issues/new/?title=" +
          issueTitle +
          "&body=" +
          issueBody,
        "_blank",
        "noopener"
      );
    }

    feedback.firstElementChild.disabled = true;

    var note = feedback.querySelector(
      ".md-feedback__note [data-md-value='" + data + "']"
    );
    if (note) note.hidden = false;
  });
});
