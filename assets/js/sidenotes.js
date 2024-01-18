function getAnchorParentContainer(anchor) {
  let el = anchor;
  while (!el.parentNode.classList.contains("gh-content")) {
    el = el.parentNode;
  }
  return el;
}

function insertSidenotes() {
  const articleContent = document.querySelector("article .gh-content");
  for (const child of articleContent.children) {
    const anchors = child.querySelectorAll(".footnote-anchor, .reference-anchor");
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
        const lastChild = sidenoteWrapper.querySelector("a:last-child");
        if (lastChild && lastChild.textContent === "↩") {
          lastChild.remove();
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
    const anchor = document.getElementById(sidenote.getAttribute("data-anchor-id"));
    const anchorPosition = anchor.getBoundingClientRect().top;
    const anchorParent = getAnchorParentContainer(anchor);
    const anchorParentPosition = anchorParent.getBoundingClientRect().top;

    // Bump down sidenote if it would overlap with the previous one
    let newPosition = anchorPosition;
    if (i > 0) {
      const prevSideNote = sidenotes[i - 1];
      prevSidenoteEnd = prevSideNote.getBoundingClientRect().bottom;
      if (anchorPosition < prevSidenoteEnd) {
        newPosition = prevSidenoteEnd + 20; // 20px bottom margin from prev note
      }
    }

    sidenote.style.top = `${Math.round(newPosition - anchorParentPosition)}px`;
  }
}

function onResize() {
  const sidenotesInDom = Boolean(document.querySelector("div.gh-notes-wrapper"));
  const mediaQuery = window.matchMedia("(min-width: 1349px)");
  if (mediaQuery.matches) {
    if (!sidenotesInDom) {
      insertSidenotes();
    }
    positionSidenotes();
  } else {
    if (sidenotesInDom) {
      document.querySelectorAll("div.gh-notes-wrapper").forEach((e) => e.remove());
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

function sidenotes() {
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

  const mediaQuery = window.matchMedia("(min-width: 1349px)");
  if (mediaQuery.matches) {
    insertSidenotes();
    positionSidenotes();
  }
}
