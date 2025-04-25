document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cartBtn = document.getElementById("cartBtn");
  const closeCart = document.getElementById("closeCart");
  const cartSidebar = document.getElementById("cartSidebar");

  const favoritesBtn = document.getElementById("favoritesBtn");
  const closeFavorites = document.getElementById("closeFavorites");
  const favoritesSidebar = document.getElementById("favoritesSidebar");

  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const searchInputs = document.querySelectorAll(".search-box input");
  const searchResults = document.querySelectorAll(".search-results");
  const backToTopBtn = document.getElementById("backToTop");
  const navbarElement = document.querySelector(".navbar");

  // Sample product data for search (in a real app, this would come from a database)
  const sampleProducts = [
    { id: 1, name: "Crystal Pendant Necklace", category: "necklaces", price: 299.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Pearl Drop Earrings", category: "earrings", price: 199.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Gold Chain Bracelet", category: "bracelets", price: 249.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 4, name: "Diamond Ring", category: "rings", price: 399.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 5, name: "Silver Hoop Earrings", category: "earrings", price: 149.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 6, name: "Gemstone Pendant", category: "necklaces", price: 279.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 7, name: "Charm Bracelet", category: "bracelets", price: 189.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 8, name: "Stainless Steel Watch", category: "watches", price: 499.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 9, name: "Beaded Anklet", category: "anklets", price: 129.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 10, name: "Rose Gold Necklace", category: "necklaces", price: 349.99, image: "/placeholder.svg?height=100&width=100" },
  ];

  // Initialize favorites and cart from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Update count badges
  function updateCountBadges() {
    const favCount = document.getElementById("favCount");
    const cartCount = document.getElementById("cartCount");

    if (favCount) favCount.textContent = favorites.length;
    if (cartCount) cartCount.textContent = cart.length;
  }

  // Initialize count badges
  updateCountBadges();

  // Cart sidebar toggle
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cartSidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Favorites sidebar toggle
  if (favoritesBtn) {
    favoritesBtn.addEventListener("click", (e) => {
      e.preventDefault();
      favoritesSidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeFavorites) {
    closeFavorites.addEventListener("click", () => {
      favoritesSidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Overlay click to close sidebars
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      document.querySelectorAll(".cart-sidebar, .favorites-sidebar, .mobile-filters-sidebar").forEach((sidebar) => {
        sidebar.classList.remove("active");
      });
      sidebarOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Enhanced Search Functionality
  searchInputs.forEach((input, index) => {
    const searchResult = searchResults[index];
    
    // Focus event - show empty search results
    input.addEventListener("focus", () => {
      if (searchResult) {
        searchResult.classList.add("active");
        if (input.value.length === 0) {
          searchResult.innerHTML = `
            <div class="search-trending">
              <h6>Trending Searches</h6>
              <div class="trending-tags">
                <a href="products.html?search=necklace">Necklace</a>
                <a href="products.html?search=earrings">Earrings</a>
                <a href="products.html?search=bracelet">Bracelet</a>
                <a href="products.html?search=ring">Ring</a>
                <a href="products.html?search=gold">Gold</a>
                <a href="products.html?search=silver">Silver</a>
              </div>
            </div>
          `;
        }
      }
    });

    // Input event - search as you type
    input.addEventListener("input", () => {
      if (searchResult) {
        const searchTerm = input.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
          // Show trending searches
          searchResult.innerHTML = `
            <div class="search-trending">
              <h6>Trending Searches</h6>
              <div class="trending-tags">
                <a href="products.html?search=necklace">Necklace</a>
                <a href="products.html?search=earrings">Earrings</a>
                <a href="products.html?search=bracelet">Bracelet</a>
                <a href="products.html?search=ring">Ring</a>
                <a href="products.html?search=gold">Gold</a>
                <a href="products.html?search=silver">Silver</a>
              </div>
            </div>
          `;
        } else if (searchTerm.length >= 2) {
          // Filter products based on search term
          const filteredProducts = sampleProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
          );
          
          if (filteredProducts.length > 0) {
            // Show search results
            let resultsHTML = `<h6>Search Results</h6><div class="search-items">`;
            
            filteredProducts.slice(0, 4).forEach(product => {
              resultsHTML += `
                <a href="products.html?product=${product.id}" class="search-item">
                  <img src="${product.image}" alt="${product.name}">
                  <div class="search-item-info">
                    <h6>${product.name}</h6>
                    <p>${product.category}</p>
                    <span class="price">EGP ${product.price.toFixed(2)}</span>
                  </div>
                </a>
              `;
            });
            
            resultsHTML += `</div>`;
            
            if (filteredProducts.length > 4) {
              resultsHTML += `
                <div class="search-more">
                  <a href="products.html?search=${searchTerm}">View all ${filteredProducts.length} results</a>
                </div>
              `;
            }
            
            searchResult.innerHTML = resultsHTML;
          } else {
            // No results found
            searchResult.innerHTML = `
              <div class="search-no-results">
                <p>No results found for "${searchTerm}"</p>
                <div class="search-suggestions">
                  <h6>Suggestions:</h6>
                  <ul>
                    <li>Check your spelling</li>
                    <li>Check your spelling</li>
                    <li>Try more general terms</li>
                    <li>Try different keywords</li>
                  </ul>
                </div>
              </div>
            `;
          }
        }
        
        searchResult.classList.add("active");
      }
    });

    // Click outside to close search results
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !searchResult?.contains(e.target)) {
        if (searchResult) searchResult.classList.remove("active");
      }
    });

    // Search button click
    const searchButton = input.nextElementSibling;
    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm.length > 0) {
          window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
      });
    }

    // Enter key press in search input
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm.length > 0) {
          window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
      }
    });
  });

  // Back to top button
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("active");
      } else {
        backToTopBtn.classList.remove("active");
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Navbar scroll effect
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      navbarElement?.classList.add("navbar-scrolled");
      
      // Hide navbar when scrolling down, show when scrolling up
      if (scrollTop > lastScrollTop) {
        navbarElement?.classList.add("navbar-hidden");
      } else {
        navbarElement?.classList.remove("navbar-hidden");
      }
    } else {
      navbarElement?.classList.remove("navbar-scrolled");
      navbarElement?.classList.remove("navbar-hidden");
    }
    
    lastScrollTop = scrollTop;
  });

  // Initialize animations
  initAnimations();

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  // Recently viewed products
  updateRecentlyViewed();

  // Initialize bootstrap
  // const bootstrap = window.bootstrap; // No longer needed, already available globally
});

// Initialize animations
function initAnimations() {
  // Animate elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Product card hover animation
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover-animate');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover-animate');
    });
  });
}

// Update recently viewed products
function updateRecentlyViewed() {
  const recentlyViewedContainer = document.getElementById('recentlyViewed');
  if (!recentlyViewedContainer) return;
  
  // Get product ID from URL if available
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  
  if (productId) {
    // Get recently viewed products from localStorage
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Add current product to the beginning of the array if it's not already there
    if (!recentlyViewed.includes(Number(productId))) {
      recentlyViewed.unshift(Number(productId));
      
      // Keep only the last 6 products
      recentlyViewed = recentlyViewed.slice(0, 6);
      
      // Save back to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }
  
  // Display recently viewed products
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  
  if (recentlyViewed.length > 0) {
    // In a real app, you would fetch product details from the server
    // For now, we'll use sample data
    const sampleProducts = [
      { id: 1, name: "Crystal Pendant Necklace", price: 299.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 2, name: "Pearl Drop Earrings", price: 199.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 3, name: "Gold Chain Bracelet", price: 249.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 4, name: "Diamond Ring", price: 399.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 5, name: "Silver Hoop Earrings", price: 149.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 6, name: "Gemstone Pendant", price: 279.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 7, name: "Charm Bracelet", price: 189.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 8, name: "Stainless Steel Watch", price: 499.99, image: "/placeholder.svg?height=200&width=200" },
      { id: 9, name: "Beaded Anklet", price: 129.99, image: "/placeholder.svg?height=200&width=200" },
    ];
    
    const recentProducts = recentlyViewed
      .map(id => sampleProducts.find(p => p.id === id))
      .filter(product => product !== undefined);
    
    if (recentProducts.length > 0) {
      recentlyViewedContainer.innerHTML = `
        <div class="section-title">
          <h2>Recently Viewed</h2>
        </div>
        <div class="row g-4">
          ${recentProducts.map(product => `
            <div class="col-6 col-md-4 col-lg-2">
              <div class="product-card animate-on-scroll">
                <div class="product-image">
                  <img src="${product.image}" alt="${product.name}">
                  <button class="favorite-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                  </button>
                  <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                  </div>
                </div>
                <div class="product-info">
                  <h3>${product.name}</h3>
                  <p class="price">EGP ${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      recentlyViewedContainer.classList.remove('d-none');
    }
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  // Check if toast container exists, if not create it
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastId = 'toast-' + Date.now();
  const toastHTML = `
    <div id="${toastId}" class="toast ${type}-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Owl Gallery</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  toastContainer.innerHTML += toastHTML;
  
  // Initialize and show toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
  
  // Remove toast after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    toastElement.remove();
  });
}
