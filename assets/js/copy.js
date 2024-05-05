function copyToClipboard() {
    var copiarurl = document.createElement('input'),
    text = window.location.href;

    document.body.appendChild(copiarurl);
    copiarurl.value = text;
    copiarurl.select();
    document.execCommand('copy');
    document.body.removeChild(copiarurl);

    alert("Link copied to clipboard!");
}
