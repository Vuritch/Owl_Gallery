/* cart‑favorites.js – uses the shared state created by products.js */
(() => {
    const overlay = $("#sidebarOverlay");
    const cartBar = $("#cartSidebar"), favBar = $("#favoritesSidebar");
    const cartBtn = $("#cartBtn"), favBtn = $("#favoritesBtn");
    const closeCart = $("#closeCart"), closeFav = $("#closeFavorites");
    const cartWrap = $("#cartItems"), favWrap = $("#favoritesItems");
    const cartTot = $("#cartTotal");

    const open = (bar, render) => { bar.classList.add("active"); overlay.classList.add("active"); document.body.style.overflow = "hidden"; render(); };
    const close = bar => { bar.classList.remove("active"); overlay.classList.remove("active"); document.body.style.overflow = ""; };

    cartBtn?.addEventListener("click", () => open(cartBar, drawCart));
    favBtn?.addEventListener("click", () => open(favBar, drawFavs));
    closeCart?.addEventListener("click", () => close(cartBar));
    closeFav?.addEventListener("click", () => close(favBar));
    overlay?.addEventListener("click", () => { close(cartBar); close(favBar); });

    /* --------- RENDERERS --------- */
    const drawCart = () => {
        const ids = JSON.parse(localStorage.getItem("cart") || "[]");
        const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
        cartWrap.innerHTML = items.map(p => `
      <div class="d-flex align-items-center mb-3">
        <img src="${p.image}" width="48" height="48" class="me-2 rounded">
        <div class="flex-grow-1">${p.name}<br><small class="text-muted">${p.price.toFixed(2)}</small></div>
        <button class="btn btn-sm btn-link text-danger remove-cart" data-id="${p.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>`).join("");

        cartTot.textContent = "EGP " + items.reduce((s, p) => s + p.price, 0).toFixed(2);

        cartWrap.querySelectorAll(".remove-cart").forEach(btn =>
            btn.addEventListener("click", () => {
                const id = +btn.dataset.id;
                const arr = JSON.parse(localStorage.getItem("cart") || "[]");
                arr.splice(arr.indexOf(id), 1); localStorage.setItem("cart", JSON.stringify(arr));
                drawCart(); document.querySelector("#cartCount").textContent = arr.length;
            }));
    };

    const drawFavs = () => {
        const ids = JSON.parse(localStorage.getItem("favourites") || "[]");
        favWrap.innerHTML = ids.map(id => {
            const p = products.find(x => x.id === id); if (!p) return "";
            return `<div class="d-flex align-items-center mb-3">
        <img src="${p.image}" width="48" height="48" class="me-2 rounded">
        <div class="flex-grow-1">${p.name}</div>
        <button class="btn btn-sm btn-link text-danger remove-fav" data-id="${p.id}">
          <i class="fas fa-heart-broken"></i>
        </button>
      </div>`;
        }).join("");

        favWrap.querySelectorAll(".remove-fav").forEach(btn =>
            btn.addEventListener("click", () => {
                const id = +btn.dataset.id;
                const arr = JSON.parse(localStorage.getItem("favourites") || "[]");
                arr.splice(arr.indexOf(id), 1); localStorage.setItem("favourites", JSON.stringify(arr));
                drawFavs(); document.querySelector("#favoritesCount").textContent = arr.length;
            }));
    };

    /* utility */
    function $(sel, root = document) { return root.querySelector(sel); }
})();
