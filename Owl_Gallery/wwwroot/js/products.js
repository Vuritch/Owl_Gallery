document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const productsGrid = document.getElementById("productsGrid")
    const sortOptions = document.getElementById("sortOptions")
    const showFiltersBtn = document.getElementById("showFilters")
    const closeFiltersBtn = document.getElementById("closeFilters")
    const mobileFiltersSidebar = document.getElementById("mobileFiltersSidebar")
    const sidebarOverlay = document.getElementById("sidebarOverlay")
    const priceRange = document.getElementById("priceRange")
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]')
    const applyFiltersBtn = document.querySelector(".filters-sidebar .btn-primary")
    const resetFiltersBtn = document.querySelector(".filters-sidebar .btn-outline-secondary")
    const favoriteBtns = document.querySelectorAll(".favorite-btn")
    const addToCartBtns = document.querySelectorAll(".add-to-cart")
    const paginationLinks = document.querySelectorAll(".pagination .page-link")
  
    // Sample product data (in a real app, this would come from a database)
    const products = [
      {
        id: 1,
        name: "Crystal Pendant Necklace",
        price: 299.99,
        category: "necklaces",
        material: "gold",
        image: "/placeholder.svg?height=400&width=300",
        isNew: true,
        isSale: false,
        rating: 4.5,
      },
      {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 199.99,
        originalPrice: 249.99,
        category: "earrings",
        material: "silver",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: true,
        rating: 5,
      },
      {
        id: 3,
        name: "Gold Chain Bracelet",
        price: 249.99,
        category: "bracelets",
        material: "gold",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: false,
        rating: 4,
      },
      {
        id: 4,
        name: "Diamond Ring",
        price: 399.99,
        category: "rings",
        material: "platinum",
        image: "/placeholder.svg?height=400&width=300",
        isNew: true,
        isSale: false,
        rating: 4.5,
      },
      {
        id: 5,
        name: "Silver Hoop Earrings",
        price: 149.99,
        originalPrice: 179.99,
        category: "earrings",
        material: "silver",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: true,
        rating: 4,
      },
      {
        id: 6,
        name: "Gemstone Pendant",
        price: 279.99,
        category: "necklaces",
        material: "gold",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: false,
        rating: 3.5,
      },
      {
        id: 7,
        name: "Charm Bracelet",
        price: 189.99,
        category: "bracelets",
        material: "silver",
        image: "/placeholder.svg?height=400&width=300",
        isNew: true,
        isSale: false,
        rating: 4,
      },
      {
        id: 8,
        name: "Stainless Steel Watch",
        price: 499.99,
        originalPrice: 599.99,
        category: "watches",
        material: "stainlessSteel",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: true,
        rating: 5,
      },
      {
        id: 9,
        name: "Beaded Anklet",
        price: 129.99,
        category: "anklets",
        material: "silver",
        image: "/placeholder.svg?height=400&width=300",
        isNew: false,
        isSale: false,
        rating: 3.5,
      },
    ]
  
    // Initialize favorites and cart from localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []
    let cart = JSON.parse(localStorage.getItem("cart")) || []
  
    // Update favorites and cart count badges
    function updateCountBadges() {
      const favCount = document.getElementById("favCount")
      const cartCount = document.getElementById("cartCount")
  
      if (favCount) favCount.textContent = favorites.length
      if (cartCount) cartCount.textContent = cart.length
    }
  
    // Initialize count badges
    updateCountBadges()
  
    // Render star ratings
    function renderStarRating(rating) {
      const fullStars = Math.floor(rating)
      const halfStar = rating % 1 >= 0.5
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  
      let starsHTML = ""
  
      // Full stars
      for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>'
      }
  
      // Half star
      if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>'
      }
  
      // Empty stars
      for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>'
      }
  
      return starsHTML
    }
  
    // Render products to grid
    function renderProducts(productsToRender) {
      if (!productsGrid) return
  
      // Clear current products
      productsGrid.innerHTML = ""
  
      if (productsToRender.length === 0) {
        // No products found
        productsGrid.innerHTML = `
                  <div class="col-12 no-products">
                      <i class="fas fa-search"></i>
                      <h3>No products found</h3>
                      <p>Try adjusting your filters or search criteria to find what you're looking for.</p>
                  </div>
              `
        return
      }
  
      // Render each product
      productsToRender.forEach((product) => {
        const isFavorite = favorites.includes(product.id)
  
        const productHTML = `
                  <div class="col-6 col-md-4 col-lg-4">
                      <div class="product-card">
                          <div class="product-image">
                              <img src="${product.image}" alt="${product.name}">
                              ${product.isNew ? '<span class="product-badge new">New</span>' : ""}
                              ${product.isSale ? '<span class="product-badge sale">Sale</span>' : ""}
                              <button class="favorite-btn ${isFavorite ? "active" : ""}" data-product-id="${product.id}">
                                  <i class="${isFavorite ? "fas" : "far"} fa-heart"></i>
                              </button>
                              <div class="product-actions">
                                  <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                              </div>
                          </div>
                          <div class="product-info">
                              <h3>${product.name}</h3>
                              <div class="product-rating">
                                  ${renderStarRating(product.rating)}
                              </div>
                              <p class="price">
                                  ${product.originalPrice ? `<span class="original-price">EGP ${product.originalPrice.toFixed(2)}</span>` : ""}
                                  EGP ${product.price.toFixed(2)}
                              </p>
                          </div>
                      </div>
                  </div>
              `
  
        productsGrid.innerHTML += productHTML
      })
  
      // Reattach event listeners to new elements
      attachProductEventListeners()
    }
  
    // Attach event listeners to product elements
    function attachProductEventListeners() {
      // Favorite buttons
      document.querySelectorAll(".favorite-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          toggleFavorite(productId, this)
        })
      })
  
      // Add to cart buttons
      document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          addToCart(productId)
        })
      })
    }
  
    // Toggle favorite status
    function toggleFavorite(productId, button) {
      const index = favorites.indexOf(productId)
  
      if (index === -1) {
        // Add to favorites
        favorites.push(productId)
        button.classList.add("active")
        button.querySelector("i").classList.replace("far", "fas")
        showToast("Product added to favorites!")
      } else {
        // Remove from favorites
        favorites.splice(index, 1)
        button.classList.remove("active")
        button.querySelector("i").classList.replace("fas", "far")
        showToast("Product removed from favorites!")
      }
  
      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites))
  
      // Update count badge
      updateCountBadges()
  
      // Update favorites sidebar if open
      updateFavoritesSidebar()
    }
  
    // Add product to cart
    function addToCart(productId) {
      const product = products.find((p) => p.id === productId)
  
      if (!product) return
  
      // Check if product is already in cart
      const existingItem = cart.find((item) => item.id === productId)
  
      if (existingItem) {
        // Increment quantity
        existingItem.quantity += 1
        showToast("Product quantity updated in cart!")
      } else {
        // Add new item
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
        showToast("Product added to cart!")
      }
  
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))
  
      // Update count badge
      updateCountBadges()
  
      // Update cart sidebar if open
      updateCartSidebar()
    }
  
    // Update favorites sidebar content
    function updateFavoritesSidebar() {
      const favoritesItems = document.getElementById("favoritesItems")
      if (!favoritesItems) return
  
      favoritesItems.innerHTML = ""
  
      if (favorites.length === 0) {
        favoritesItems.innerHTML = '<p class="text-center py-4">No favorites yet.</p>'
        return
      }
  
      favorites.forEach((favId) => {
        const product = products.find((p) => p.id === favId)
        if (!product) return
  
        const itemHTML = `
                  <div class="sidebar-item d-flex align-items-center mb-3">
                      <img src="${product.image}" alt="${product.name}" class="sidebar-item-img">
                      <div class="sidebar-item-info flex-grow-1 px-3">
                          <h5>${product.name}</h5>
                          <p class="price">EGP ${product.price.toFixed(2)}</p>
                      </div>
                      <div class="sidebar-item-actions">
                          <button class="btn btn-sm btn-primary add-to-cart-from-fav" data-product-id="${product.id}">
                              <i class="fas fa-cart-plus"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger remove-favorite" data-product-id="${product.id}">
                              <i class="fas fa-trash-alt"></i>
                          </button>
                      </div>
                  </div>
              `
  
        favoritesItems.innerHTML += itemHTML
      })
  
      // Attach event listeners to new elements
      document.querySelectorAll(".add-to-cart-from-fav").forEach((btn) => {
        btn.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          addToCart(productId)
        })
      })
  
      document.querySelectorAll(".remove-favorite").forEach((btn) => {
        btn.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          const button = document.querySelector(`.favorite-btn[data-product-id="${productId}"]`)
          toggleFavorite(productId, button)
        })
      })
    }
  
    // Update cart sidebar content
    function updateCartSidebar() {
      const cartItems = document.getElementById("cartItems")
      const cartTotal = document.getElementById("cartTotal")
      if (!cartItems || !cartTotal) return
  
      cartItems.innerHTML = ""
  
      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center py-4">Your cart is empty.</p>'
        cartTotal.textContent = "EGP 0.00"
        return
      }
  
      let total = 0
  
      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity
        total += itemTotal
  
        const itemHTML = `
                  <div class="cart-item d-flex align-items-center mb-3">
                      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                      <div class="cart-item-info flex-grow-1 px-3">
                          <h5>${item.name}</h5>
                          <p class="price">EGP ${item.price.toFixed(2)} x ${item.quantity}</p>
                      </div>
                      <div class="cart-item-actions">
                          <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-product-id="${item.id}">
                              <i class="fas fa-minus"></i>
                          </button>
                          <span class="quantity mx-2">${item.quantity}</span>
                          <button class="btn btn-sm btn-outline-secondary increase-quantity" data-product-id="${item.id}">
                              <i class="fas fa-plus"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger remove-from-cart ms-2" data-product-id="${item.id}">
                              <i class="fas fa-trash-alt"></i>
                          </button>
                      </div>
                  </div>
              `
  
        cartItems.innerHTML += itemHTML
      })
  
      cartTotal.textContent = `EGP ${total.toFixed(2)}`
  
      // Attach event listeners to new elements
      document.querySelectorAll(".increase-quantity").forEach((btn) => {
        btn.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          updateCartItemQuantity(productId, 1)
        })
      })
  
      document.querySelectorAll(".decrease-quantity").forEach((btn) => {
        btn.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          updateCartItemQuantity(productId, -1)
        })
      })
  
      document.querySelectorAll(".remove-from-cart").forEach((btn) => {
        btn.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-product-id"))
          removeFromCart(productId)
        })
      })
    }
  
    // Update cart item quantity
    function updateCartItemQuantity(productId, change) {
      const item = cart.find((item) => item.id === productId)
      if (!item) return
  
      item.quantity += change
  
      if (item.quantity <= 0) {
        removeFromCart(productId)
        return
      }
  
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCountBadges()
      updateCartSidebar()
      showToast("Cart updated!")
    }
  
    // Remove item from cart
    function removeFromCart(productId) {
      cart = cart.filter((item) => item.id !== productId)
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCountBadges()
      updateCartSidebar()
      showToast("Product removed from cart!")
    }
  
    // Show toast notification
    function showToast(message) {
      // Check if toast container exists, if not create it
      let toastContainer = document.querySelector(".toast-container")
      if (!toastContainer) {
        toastContainer = document.createElement("div")
        toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
        document.body.appendChild(toastContainer)
      }
  
      // Create toast element
      const toastId = "toast-" + Date.now()
      const toastHTML = `
              <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                  <div class="toast-header">
                      <strong class="me-auto">Owl Gallery</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                  <div class="toast-body">
                      ${message}
                  </div>
              </div>
          `
  
      toastContainer.innerHTML += toastHTML
  
      // Initialize and show toast
      const toastElement = document.getElementById(toastId)
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 })
      toast.show()
  
      // Remove toast after it's hidden
      toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove()
      })
    }
  
    // Filter and sort products
    function filterAndSortProducts() {
      let filteredProducts = [...products]
  
      // Apply category filters
      const selectedCategories = []
      document.querySelectorAll('.filter-group input[name="category"]:checked').forEach((checkbox) => {
        selectedCategories.push(checkbox.value)
      })
  
      if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category))
      }
  
      // Apply material filters
      const selectedMaterials = []
      document.querySelectorAll('.filter-group input[name="material"]:checked').forEach((checkbox) => {
        selectedMaterials.push(checkbox.value)
      })
  
      if (selectedMaterials.length > 0) {
        filteredProducts = filteredProducts.filter((product) => selectedMaterials.includes(product.material))
      }
  
      // Apply price range filter
      const minPrice = Number.parseFloat(document.querySelector('.price-inputs input[placeholder="Min"]').value) || 0
      const maxPrice = Number.parseFloat(document.querySelector('.price-inputs input[placeholder="Max"]').value) || 1000
  
      filteredProducts = filteredProducts.filter((product) => product.price >= minPrice && product.price <= maxPrice)
  
      // Apply sorting
      const sortBy = sortOptions.value
  
      switch (sortBy) {
        case "priceAsc":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "priceDesc":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        case "featured":
        default:
          // Default sorting (by rating)
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
      }
  
      // Render filtered and sorted products
      renderProducts(filteredProducts)
    }
  
    // Initialize products on page load
    renderProducts(products)
  
    // Event Listeners
    if (sortOptions) {
      sortOptions.addEventListener("change", filterAndSortProducts)
    }
  
    if (showFiltersBtn) {
      showFiltersBtn.addEventListener("click", () => {
        mobileFiltersSidebar.classList.add("active")
        sidebarOverlay.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }
  
    if (closeFiltersBtn) {
      closeFiltersBtn.addEventListener("click", () => {
        mobileFiltersSidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", () => {
        document.querySelectorAll(".mobile-filters-sidebar, .cart-sidebar, .favorites-sidebar").forEach((sidebar) => {
          sidebar.classList.remove("active")
        })
        sidebarOverlay.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    if (priceRange) {
      priceRange.addEventListener("input", function () {
        document.querySelector('.price-inputs input[placeholder="Max"]').value = this.value
      })
    }
  
    // Filter checkboxes
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        // Add name attribute if not present (for filtering)
        if (!this.hasAttribute("name")) {
          if (this.id === "necklaces" || this.id === "earrings" || this.id === "bracelets" || this.id === "rings") {
            this.setAttribute("name", "category")
            this.setAttribute("value", this.id)
          } else if (
            this.id === "gold" ||
            this.id === "silver" ||
            this.id === "platinum" ||
            this.id === "stainlessSteel"
          ) {
            this.setAttribute("name", "material")
            this.setAttribute("value", this.id)
          }
        }
      })
    })
  
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        filterAndSortProducts()
  
        // Close mobile filters if open
        if (mobileFiltersSidebar.classList.contains("active")) {
          mobileFiltersSidebar.classList.remove("active")
          sidebarOverlay.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    }
  
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        // Reset all checkboxes
        filterCheckboxes.forEach((checkbox) => {
          checkbox.checked = false
        })
  
        // Reset price range
        if (priceRange) {
          priceRange.value = 1000
        }
  
        document.querySelector('.price-inputs input[placeholder="Min"]').value = ""
        document.querySelector('.price-inputs input[placeholder="Max"]').value = ""
  
        // Reset sorting
        if (sortOptions) {
          sortOptions.value = "featured"
        }
  
        // Render all products
        renderProducts(products)
      })
    }
  
    // Initialize product event listeners
    attachProductEventListeners()
  
    // Pagination (for demo purposes)
    paginationLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Remove active class from all links
        paginationLinks.forEach((l) => {
          l.parentElement.classList.remove("active")
        })
  
        // Add active class to clicked link
        this.parentElement.classList.add("active")
  
        // In a real app, this would load the next page of products
        // For demo, we'll just scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
    })
  
    // Clone filters for mobile view
    const filtersContent = document.querySelector(".filters-sidebar").cloneNode(true)
    if (mobileFiltersSidebar) {
      mobileFiltersSidebar.appendChild(filtersContent)
    }
  
    // Cart and Favorites sidebar functionality
    const cartBtn = document.getElementById("cartBtn")
    const closeCart = document.getElementById("closeCart")
    const cartSidebar = document.getElementById("cartSidebar")
  
    const favoritesBtn = document.getElementById("favoritesBtn")
    const closeFavorites = document.getElementById("closeFavorites")
    const favoritesSidebar = document.getElementById("favoritesSidebar")
  
    if (cartBtn) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault()
        cartSidebar.classList.add("active")
        sidebarOverlay.classList.add("active")
        document.body.style.overflow = "hidden"
        updateCartSidebar()
      })
    }
  
    if (closeCart) {
      closeCart.addEventListener("click", () => {
        cartSidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    if (favoritesBtn) {
      favoritesBtn.addEventListener("click", (e) => {
        e.preventDefault()
        favoritesSidebar.classList.add("active")
        sidebarOverlay.classList.add("active")
        document.body.style.overflow = "hidden"
        updateFavoritesSidebar()
      })
    }
  
    if (closeFavorites) {
      closeFavorites.addEventListener("click", () => {
        favoritesSidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    // Import bootstrap
    const bootstrap = window.bootstrap
  })
  
  