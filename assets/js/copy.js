// Customized SREDevOps
function copyToClipboard() {
  var url = window.location.href;

  if (navigator.clipboard && navigator.clipboard.writeText) {
  navigator.clipboard
    .writeText(url)
    .then(function () {
      alert("Link copied to clipboard!");
    })
    .catch(function (error) {
      console.error("Failed to copy text: ", error);
    });
  } else {
    console.error("Clipboard writeText is not supported.");
  }
}
