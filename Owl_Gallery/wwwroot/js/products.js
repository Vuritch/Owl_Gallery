/* products.js – single source of truth for product data & UI – 20 Apr 2025 */
(() => {
    /* ---------- DATA (swap for API call when ready) ---------- */
    const products = [
        { id: 1, name: "Crystal Pendant Necklace", price: 299.99, category: "necklaces", material: "gold", image: "/images/pexels-karolina-grabowska-5201935.jpg", isNew: true, isSale: false, rating: 4.5 },
        { id: 2, name: "Pearl Drop Earrings", price: 199.99, category: "earrings", material: "silver", image: "/images/pexels-godisable-jacob-91777.jpg", isNew: false, isSale: true, rating: 4.0, originalPrice: 249.99 },
        { id: 3, name: "Stackable Ring Set", price: 129.99, category: "rings", material: "rose‑gold", image: "/images/pexels-castorly-stock-3641053.jpg", isNew: false, isSale: false, rating: 4.1 },
        { id: 4, name: "Minimalist Cuff Bracelet", price: 159.99, category: "bracelets", material: "steel", image: "/images/pexels-godisable-jacob-910147.jpg", isNew: false, isSale: true, rating: 4.3, originalPrice: 199.99 }
    ];
    window.products = products;           // <— lets the other modules see it

    /* ---------- STATE ---------- */
    const state = {
        cart: JSON.parse(localStorage.getItem("cart") || "[]"),
        favs: JSON.parse(localStorage.getItem("favourites") || "[]"),
        search: "",
        filters: { category: new Set(), material: new Set(), maxPrice: Infinity }
    };

    /* ---------- HELPERS ---------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const money = n => `EGP ${n.toFixed(2)}`;
    const save = () => {
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("favourites", JSON.stringify(state.favs));
    };

    /* ---------- RENDER PRODUCTS ---------- */
    const grid = $("#productsGrid");
    const render = list => {
        if (!grid) return;
        grid.innerHTML = list.map(p => `
      <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 product-card shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title text-truncate-2">${p.name}</h6>
            <p class="fw-bold mb-1">${money(p.price)}
              ${p.originalPrice ? `<s class="text-muted fw-normal">${money(p.originalPrice)}</s>` : ""}
            </p>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary add-cart" data-id="${p.id}">
                <i class="fas fa-shopping-cart"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger fav ${state.favs.includes(p.id) ? "active" : ""}" data-id="${p.id}">
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`).join("");
    };

    /* ---------- FILTER + SEARCH PIPELINE ---------- */
    const applyFilters = () => {
        let list = [...products];

        /* search */
        if (state.search)
            list = list.filter(p => p.name.toLowerCase().includes(state.search));

        /* category / material check‑boxes */
        for (const key of ["category", "material"])
            if (state.filters[key].size)
                list = list.filter(p => state.filters[key].has(p[key]));

        /* price slider */
        list = list.filter(p => p.price <= state.filters.maxPrice);

        render(list);
    };

    /* ---------- EVENT DELEGATION ---------- */
    document.addEventListener("click", e => {
        /* add to cart */
        const cartBtn = e.target.closest(".add-cart");
        if (cartBtn) {
            const id = +cartBtn.dataset.id;
            if (!state.cart.includes(id)) state.cart.push(id);
            save(); updateBadges();
            return;
        }

        /* toggle favourite */
        const favBtn = e.target.closest(".fav");
        if (favBtn) {
            const id = +favBtn.dataset.id;
            const set = state.favs;
            set.includes(id) ? set.splice(set.indexOf(id), 1) : set.push(id);
            favBtn.classList.toggle("active");
            save(); updateBadges();
        }
    });

    /* search inputs (desktop & mobile) */
    $$(".search-box input").forEach(el =>
        el.addEventListener("input", () => {
            state.search = el.value.trim().toLowerCase();
            applyFilters();
        }));

    /* filter check‑boxes */
    $$(".filter-group input[type=checkbox]").forEach(box =>
        box.addEventListener("change", () => {
            state.filters[box.name][box.checked ? "add" : "delete"](box.value);
            applyFilters();
        }));

    /* price range slider */
    $("#priceRange")?.addEventListener("input",
        e => { state.filters.maxPrice = +e.target.value; applyFilters(); });

    /* ---------- BADGES ---------- */
    const badge = id => $(id);
    const updateBadges = () => {
        badge("#cartCount")?.textContent = state.cart.length;
        badge("#favoritesCount")?.textContent = state.favs.length;
    };

    /* ---------- INIT ---------- */
    render(products); updateBadges();
})();
