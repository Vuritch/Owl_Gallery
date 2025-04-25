/* wwwroot/js/search.js */
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".search-box input");
    const outputs = document.querySelectorAll(".search-results");
    let products = null; // cache

    // highlight matched term
    const hl = (txt, term) =>
        txt.replace(new RegExp(`(${term})`, "ig"),
            '<span class="hl">$1</span>');

    // render up to 6 hits
    function render(hits, box, term) {
        box.innerHTML = hits.length
            ? hits.slice(0, 6).map(p => `
                <a href="/Products/Details/${p.id}"
                   class="d-flex align-items-center p-2 text-decoration-none text-dark">
                    <img src="${p.image}" width="40" height="40"
                         class="me-2 rounded" alt="${p.name}">
                    <div>
                        <div>${hl(p.name, term)}</div>
                        <small class="text-muted">
                            ${hl(p.cat, term)} – EGP ${p.price.toFixed(2)}
                        </small>
                    </div>
                </a>`).join("")
            : `<p class="text-muted p-2 mb-0">No results</p>`;
    }

    // fetch products from your API once
    function ensureProducts(cb) {
        if (products) return cb();
        fetch("/api/products/all")
            .then(r => r.json())
            .then(data => { products = data; cb(); })
            .catch(_ => { products = []; cb(); });
    }

    // attach live-search to every input
    inputs.forEach((inp, i) => {
        inp.addEventListener("input", () => ensureProducts(() => {
            const term = inp.value.trim().toLowerCase();
            const hits = term
                ? products.filter(p =>
                    p.name.toLowerCase().includes(term) ||
                    p.cat.toLowerCase().includes(term))
                : [];
            render(hits, outputs[i], term);
        }));

        // hide on blur
        inp.addEventListener("blur", () =>
            setTimeout(() => outputs[i].innerHTML = "", 150));

        // prevent Enter from “submitting” the form if you want only live
        inp.addEventListener("keydown", e => {
            if (e.key === "Enter") e.preventDefault();
        });
    });
});
