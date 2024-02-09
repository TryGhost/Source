function getAnchorParentContainer(anchor) {
  let el = anchor;
  while (!el.parentNode.classList.contains("gh-content")) {
    el = el.parentNode;
  }
  return el;
}

function insertSidenotes({ showFootnotes, showReferences }) {
  const articleContent = document.querySelector("article .gh-content");
  for (const child of articleContent.children) {
    if (
      child.classList.contains("gh-notes-wrapper") ||
      child.classList.contains("footnotes") ||
      child.classList.contains("references")
    ) {
      // Don't add sidenotes for refs used within sidenotes
      continue;
    }
    const toSelect = [showFootnotes && ".footnote-anchor", showReferences && ".reference-anchor"].filter(Boolean);
    const anchors = child.querySelectorAll(toSelect.join(","));
    if (anchors.length) {
      // Extra wrapper helps with initial positioning
      const sidenoteContainer = document.createElement("div");
      sidenoteContainer.setAttribute("class", "gh-notes-wrapper");
      for (anchor of anchors) {
        const id = anchor.id;
        const contentId = id.replace("anchor-", "");
        const content = document.getElementById(contentId);
        const sidenoteWrapper = document.createElement("aside");
        sidenoteWrapper.setAttribute("id", id.replace("anchor-", "sidenote-"));
        sidenoteWrapper.setAttribute("class", "gh-note");
        sidenoteWrapper.setAttribute("role", "note");
        sidenoteWrapper.setAttribute("data-anchor-id", id);

        // Remove "jump back to text" link, since it'll be right next to the anchor
        sidenoteWrapper.innerHTML = content.innerHTML;
        const links = sidenoteWrapper.querySelectorAll("a");
        const lastLink = links[links.length - 1];
        if (lastLink && lastLink.textContent === "↩") {
          lastLink.remove();
        }

        // Add sidenote to DOM
        sidenoteWrapper.insertAdjacentHTML("afterbegin", `<div class='note-identifier'>${anchor.textContent}.</div>`);
        sidenoteContainer.insertAdjacentElement("beforeend", sidenoteWrapper);
      }
      child.insertAdjacentElement("afterend", sidenoteContainer);
    }
  }
}

function positionSidenotes() {
  const sidenotes = document.querySelectorAll("aside.gh-note");
  for (let i = 0; i < sidenotes.length; i++) {
    const sidenote = sidenotes[i];
    const anchorId = sidenote.getAttribute("data-anchor-id");
    const anchor = document.querySelector(
      `.gh-content > *:not(.gh-notes-wrapper, .footnotes, .references) #${anchorId}`
    );
    const anchorParent = getAnchorParentContainer(anchor);

    const anchorPosition = anchor.getBoundingClientRect().top;
    const anchorParentPosition = anchorParent.getBoundingClientRect().top;

    // Bump down sidenote if it would overlap with the previous one
    let newPosition = anchorPosition;
    if (i > 0) {
      const prevSideNote = sidenotes[i - 1];
      const prevSidenoteEnd = prevSideNote.getBoundingClientRect().bottom;
      if (anchorPosition < prevSidenoteEnd) {
        newPosition = prevSidenoteEnd;
      }
    }

    sidenote.style.top = `${Math.round(newPosition - anchorParentPosition)}px`;
  }
}

function showSidenotes() {
  document.querySelector(".gh-article").classList.remove("hide-sidenotes");
}

function hideSidenotes() {
  document.querySelector(".gh-article").classList.add("hide-sidenotes");
}

function removeSidenotes() {
  document.querySelectorAll("div.gh-notes-wrapper").forEach((e) => e.remove());
}

function insertAndPositionSidenotes({ showFootnotes, showReferences }) {
  const mediaQuery = window.matchMedia("(min-width: 1349px)");
  if (mediaQuery.matches) {
    insertSidenotes({ showFootnotes, showReferences });
    positionSidenotes();
    setTimeout(() => positionSidenotes(), 200); // Janky, but this will help with issue where sidenotes don't repaint during for loop
  }
}

function redoSidenotes({ showFootnotes, showReferences }) {
  removeSidenotes();
  insertAndPositionSidenotes({ showFootnotes, showReferences });
}

function onResize() {
  const sidenotesInDom = Boolean(document.querySelector("div.gh-notes-wrapper"));
  const mediaQuery = window.matchMedia("(min-width: 1349px)");
  if (mediaQuery.matches) {
    if (!sidenotesInDom) {
      insertSidenotes(getSidenotesSettings());
    }
    showSidenotes();
    positionSidenotes();
  } else {
    if (sidenotesInDom) {
      hideSidenotes();
    }
  }
}

function onAnchorClick(evt) {
  const mediaQuery = window.matchMedia("(min-width: 1349px)");
  if (mediaQuery.matches) {
    evt.preventDefault();
    evt.stopPropagation();
    dehilightNotes();
    evt.target.classList.add("active-sidenote");
    const sidenote = document.getElementById(evt.target.parentNode.id.replace("anchor-", "sidenote-"));
    sidenote.classList.add("active-sidenote");
  }
}

function dehilightNotes(evt) {
  const highlighted = document.querySelectorAll(".active-sidenote");
  for (let highlight of highlighted) {
    highlight.classList.remove("active-sidenote");
  }
}

function getSidenotesSettings() {
  return {
    showFootnotes: getLocalStorage("sidenotesFootnotes", true),
    showReferences: getLocalStorage("sidenotesReferences", false),
  };
}

function sidenotes({ showFootnotes = true, showReferences = false } = {}) {
  if (document.body.classList.contains("post-template")) {
    if (showFootnotes || showReferences) {
      window.addEventListener("resize", debounce(onResize, 100));
      const anchors = document.querySelectorAll(".footnote-anchor, .reference-anchor");
      for (const anchor of anchors) {
        anchor.addEventListener("click", onAnchorClick);
      }
      document.addEventListener("click", (evt) => {
        if (evt.target.nodeName !== "A") {
          dehilightNotes();
        }
      });
      insertAndPositionSidenotes({ showFootnotes, showReferences });
    }
  }
}
