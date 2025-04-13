document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const searchInputs = document.querySelectorAll(".search-box input")
    const searchButtons = document.querySelectorAll(".search-box button")
    const searchResultsContainers = document.querySelectorAll(".search-results")
  
    // Sample product data for search (in a real app, this would come from a database)
    const products = [
      {
        id: 1,
        name: "Crystal Pendant Necklace",
        price: 299.99,
        category: "necklaces",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["crystal", "pendant", "gold", "jewelry"],
      },
      {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 199.99,
        category: "earrings",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["pearl", "drop", "silver", "jewelry"],
      },
      {
        id: 3,
        name: "Gold Chain Bracelet",
        price: 249.99,
        category: "bracelets",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["gold", "chain", "jewelry"],
      },
      {
        id: 4,
        name: "Diamond Ring",
        price: 399.99,
        category: "rings",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["diamond", "platinum", "jewelry"],
      },
      {
        id: 5,
        name: "Silver Hoop Earrings",
        price: 149.99,
        category: "earrings",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["silver", "hoop", "jewelry"],
      },
      {
        id: 6,
        name: "Gemstone Pendant",
        price: 279.99,
        category: "necklaces",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["gemstone", "pendant", "gold", "jewelry"],
      },
      {
        id: 7,
        name: "Charm Bracelet",
        price: 189.99,
        category: "bracelets",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["charm", "silver", "jewelry"],
      },
      {
        id: 8,
        name: "Stainless Steel Watch",
        price: 499.99,
        category: "watches",
        image: "/placeholder.svg?height=400&width=300",
        tags: ["watch", "stainless steel", "accessories"],
      },
    ]
  
    // Search history
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []
  
    // Initialize search functionality for all search inputs
    searchInputs.forEach((input, index) => {
      const resultsContainer = searchResultsContainers[index]
      const searchButton = searchButtons[index]
  
      // Create search results container if it doesn't exist
      if (!resultsContainer) {
        const newResultsContainer = document.createElement("div")
        newResultsContainer.className = "search-results"
        input.parentNode.appendChild(newResultsContainer)
        searchResultsContainers[index] = newResultsContainer
      }
  
      // Input event for live search
      input.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase()
  
        if (query.length >= 2) {
          const results = searchProducts(query)
          displaySearchResults(results, searchResultsContainers[index], query)
        } else {
          searchResultsContainers[index].innerHTML = ""
          searchResultsContainers[index].classList.remove("active")
        }
      })
  
      // Focus event to show search history
      input.addEventListener("focus", function () {
        const query = this.value.trim().toLowerCase()
  
        if (query.length < 2 && searchHistory.length > 0) {
          displaySearchHistory(searchResultsContainers[index])
        }
      })
  
      // Click outside to close search results
      document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !searchResultsContainers[index].contains(e.target)) {
          searchResultsContainers[index].innerHTML = ""
          searchResultsContainers[index].classList.remove("active")
        }
      })
  
      // Search button click
      if (searchButton) {
        searchButton.addEventListener("click", () => {
          const query = input.value.trim().toLowerCase()
  
          if (query.length >= 2) {
            performSearch(query)
          }
        })
      }
  
      // Enter key press
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const query = this.value.trim().toLowerCase()
  
          if (query.length >= 2) {
            performSearch(query)
          }
        }
      })
    })
  
    // Search products function
    function searchProducts(query) {
      return products.filter((product) => {
        // Check product name
        if (product.name.toLowerCase().includes(query)) {
          return true
        }
  
        // Check product category
        if (product.category.toLowerCase().includes(query)) {
          return true
        }
  
        // Check product tags
        if (product.tags.some((tag) => tag.toLowerCase().includes(query))) {
          return true
        }
  
        return false
      })
    }
  
    // Display search results
    function displaySearchResults(results, container, query) {
      container.innerHTML = ""
  
      if (results.length === 0) {
        container.innerHTML = `
                  <div class="search-no-results">
                      <p>No results found for "${query}"</p>
                      <p class="search-suggestion">Try checking your spelling or use more general terms</p>
                  </div>
              `
        container.classList.add("active")
        return
      }
  
      const resultsHTML = results
        .slice(0, 5)
        .map(
          (product) => `
              <div class="search-result-item" data-product-id="${product.id}">
                  <div class="search-result-image">
                      <img src="${product.image}" alt="${product.name}">
                  </div>
                  <div class="search-result-info">
                      <h4>${highlightQuery(product.name, query)}</h4>
                      <p class="search-result-category">${product.category}</p>
                      <p class="search-result-price">EGP ${product.price.toFixed(2)}</p>
                  </div>
              </div>
          `,
        )
        .join("")
  
      const viewAllHTML =
        results.length > 5
          ? `
              <div class="search-view-all">
                  <a href="products.html?search=${encodeURIComponent(query)}">
                      View all ${results.length} results for "${query}"
                  </a>
              </div>
          `
          : ""
  
      container.innerHTML = resultsHTML + viewAllHTML
      container.classList.add("active")
  
      // Add click event to search results
      container.querySelectorAll(".search-result-item").forEach((item) => {
        item.addEventListener("click", function () {
          const productId = this.getAttribute("data-product-id")
          window.location.href = `product-detail.html?id=${productId}`
        })
      })
    }
  
    // Display search history
    function displaySearchHistory(container) {
      container.innerHTML = ""
  
      if (searchHistory.length === 0) {
        return
      }
  
      const historyHTML = `
              <div class="search-history">
                  <div class="search-history-header">
                      <h4>Recent Searches</h4>
                      <button class="clear-history">Clear</button>
                  </div>
                  <div class="search-history-items">
                      ${searchHistory
                        .slice(0, 5)
                        .map(
                          (term) => `
                          <div class="search-history-item">
                              <i class="fas fa-history"></i>
                              <span>${term}</span>
                          </div>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
          `
  
      container.innerHTML = historyHTML
      container.classList.add("active")
  
      // Add click event to history items
      container.querySelectorAll(".search-history-item").forEach((item, index) => {
        item.addEventListener("click", () => {
          const term = searchHistory[index]
          performSearch(term)
        })
      })
  
      // Add click event to clear history button
      container.querySelector(".clear-history").addEventListener("click", (e) => {
        e.stopPropagation()
        searchHistory = []
        localStorage.removeItem("searchHistory")
        container.innerHTML = ""
        container.classList.remove("active")
      })
    }
  
    // Perform search
    function performSearch(query) {
      // Add to search history
      if (!searchHistory.includes(query)) {
        searchHistory.unshift(query)
        searchHistory = searchHistory.slice(0, 10) // Keep only 10 most recent searches
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
      }
  
      // Redirect to search results page
      window.location.href = `products.html?search=${encodeURIComponent(query)}`
    }
  
    // Highlight query in search results
    function highlightQuery(text, query) {
      const regex = new RegExp(`(${query})`, "gi")
      return text.replace(regex, '<span class="highlight">$1</span>')
    }
  })
  
  