/* Cosmonauta custom JavaScript
 *
 * Keep all local JavaScript enhancements in this file. Gulp includes it last
 * in assets/built/source.js so it can depend on Source's own scripts.
 */

/* Open external links in a new tab, including links in post content */
(function () {
    const siteHostname = window.location.hostname.replace(/^www\./, '');

    document.querySelectorAll('a[href]').forEach(function (link) {
        const url = new URL(link.href, window.location.href);
        const isExternal = ['http:', 'https:'].includes(url.protocol)
            && url.hostname.replace(/^www\./, '') !== siteHostname;

        if (isExternal) {
            link.target = '_blank';
            link.relList.add('noopener');
        }
    });
})();
