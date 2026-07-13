(() => {
  "use strict";
  const chapters = window.ORBITALIS_V2?.chapters || [],
    modal = document.getElementById("encyclopedia"),
    list = document.getElementById("encyList"),
    article = document.getElementById("encyArticle"),
    search = document.getElementById("encySearch");
  let current = 0;
  const escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function illustration(ch) {
    const type = ch.section;
    if (ch.image)
      return `<figure class="ency-photo"><img src="${escape(ch.image)}" alt="Ilustración oficial de ${escape(ch.title)}"><figcaption>Imagen oficial NASA · abre la fuente al final del capítulo</figcaption></figure>`;
    return `<div class="ency-visual" data-kind="${escape(type)}"><div class="orbit-demo"><i></i><b></b><span></span></div><div><small>DIAGRAMA CONCEPTUAL</small><strong>${escape(type)}</strong><em>${String(ch.id).padStart(2, "0")}</em></div></div>`;
  }
  function renderList(filter = "") {
    list.innerHTML = "";
    let section = "";
    chapters.forEach((ch, i) => {
      const hay = (
        ch.title +
        " " +
        ch.section +
        " " +
        ch.paragraphs.join(" ")
      ).toLowerCase();
      if (filter && !hay.includes(filter.toLowerCase())) return;
      if (ch.section !== section) {
        section = ch.section;
        const h = document.createElement("div");
        h.className = "ency-section";
        h.textContent = section;
        list.appendChild(h);
      }
      const b = document.createElement("button");
      b.className = "ency-link" + (i === current ? " active" : "");
      b.textContent = String(ch.id).padStart(2, "0") + " · " + ch.title;
      b.onclick = () => show(i);
      list.appendChild(b);
    });
  }
  function show(index) {
    current = (index + chapters.length) % chapters.length;
    const ch = chapters[current];
    article.innerHTML = `<span class="ency-kicker">${escape(ch.section)} · CAPÍTULO ${String(ch.id).padStart(2, "0")}</span><h1>${escape(ch.title)}</h1>${illustration(ch)}${ch.paragraphs.map((p) => `<p>${escape(p)}</p>`).join("")}<ul>${ch.bullets.map((x) => `<li>${escape(x)}</li>`).join("")}</ul>${ch.formula ? `<code class="ency-formula">${escape(ch.formula)}</code>` : ""}<a class="ency-source" href="${escape(ch.source)}" target="_blank" rel="noopener">Consultar fuente oficial ↗</a>`;
    document.getElementById("encyPosition").textContent =
      current + 1 + " / " + chapters.length;
    renderList(search.value);
    article.parentElement.scrollTop = 0;
  }
  function open() {
    modal.classList.remove("hidden");
    show(current);
    search.focus();
  }
  function close() {
    modal.classList.add("hidden");
  }
  document.getElementById("infoButton").onclick = open;
  document.getElementById("closeEncyclopedia").onclick = close;
  document.getElementById("encyPrev").onclick = () => show(current - 1);
  document.getElementById("encyNext").onclick = () => show(current + 1);
  search.oninput = () => renderList(search.value);
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
  window.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });
  renderList();
  show(0);
})();
