document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart and favorites
    initCart();
    initFavorites();
    
    // Update badges on page load
    updateCountBadges();
    
    // Cart functionality
    function initCart() {
        // Elements
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCartBtn = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const checkoutBtn = document.querySelector('.cart-footer .btn-primary');
        
        // Event listeners
        if (cartBtn) {
            cartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', closeCart);
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                closeCart();
                closeFavorites();
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                window.location.href = 'checkout.html';
            });
        }
        
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-product-id'));
                addToCart(productId, 1);
            });
        });
        
        // Open cart
        function openCart() {
            updateCartDisplay();
            cartSidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            
            // Add animation classes
            cartSidebar.classList.add('animate-slide-in');
            setTimeout(() => {
                cartSidebar.classList.remove('animate-slide-in');
            }, 500);
        }
        
        // Close cart
        window.closeCart = function() {
            cartSidebar.classList.add('animate-slide-out');
            sidebarOverlay.classList.remove('active');
            
            setTimeout(() => {
                cartSidebar.classList.remove('active');
                cartSidebar.classList.remove('animate-slide-out');
                document.body.classList.remove('sidebar-open');
            }, 300);
        };
        
        // Add to cart
        window.addToCart = function(productId, quantity = 1) {
            // Get cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Get product details
            const product = getProductById(productId);
            
            if (!product) {
                console.error('Product not found:', productId);
                return;
            }
            
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Update quantity
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count badge
            updateCountBadges();
            
            // Show animation
            showAddedAnimation(productId);
            
            // Show toast notification
            showToast('Product added to cart!', 'success');
            
            // Update cart display if open
            if (cartSidebar.classList.contains('active')) {
                updateCartDisplay();
            }
        };
        
        // Remove from cart
        window.removeFromCart = function(productId) {
            // Get cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Remove item
            cart = cart.filter(item => item.id !== productId);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count badge
            updateCountBadges();
            
            // Update cart display
            updateCartDisplay();
            
            // Show toast notification
            showToast('Product removed from cart', 'info');
        };
        
        // Update quantity
        window.updateCartQuantity = function(productId, quantity) {
            // Get cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Find item
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                // Update quantity
                cart[itemIndex].quantity = quantity;
                
                // Remove item if quantity is 0
                if (quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count badge
                updateCountBadges();
                
                // Update cart display
                updateCartDisplay();
            }
        };
        
        // Update cart display
        function updateCartDisplay() {
            // Get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Clear cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                // Show empty cart message
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="products.html" class="btn btn-outline-primary">Start Shopping</a>
                    </div>
                `;
                cartTotal.textContent = 'EGP 0.00';
                return;
            }
            
            // Calculate total
            let total = 0;
            
            // Add cart items
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item animate-fade-in';
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">EGP ${item.price.toFixed(2)}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                            <input type="number" min="1" value="${item.quantity}" data-product-id="${item.id}" class="quantity-input">
                            <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        <p>EGP ${itemTotal.toFixed(2)}</p>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                cartItems.appendChild(itemElement);
                
                // Add event listeners for quantity controls
                setTimeout(() => {
                    const quantityInput = itemElement.querySelector('.quantity-input');
                    const minusBtn = itemElement.querySelector('.quantity-btn.minus');
                    const plusBtn = itemElement.querySelector('.quantity-btn.plus');
                    const removeBtn = itemElement.querySelector('.remove-item');
                    
                    quantityInput.addEventListener('change', function() {
                        const productId = parseInt(this.getAttribute('data-product-id'));
                        const quantity = parseInt(this.value);
                        
                        if (quantity > 0) {
                            updateCartQuantity(productId, quantity);
                        } else {
                            this.value = 1;
                            updateCartQuantity(productId, 1);
                        }
                    });
                    
                    minusBtn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-product-id'));
                        const input = this.parentNode.querySelector('.quantity-input');
                        let quantity = parseInt(input.value) - 1;
                        
                        if (quantity > 0) {
                            input.value = quantity;
                            updateCartQuantity(productId, quantity);
                            
                            // Add animation
                            this.classList.add('animate-click');
                            setTimeout(() => {
                                this.classList.remove('animate-click');
                            }, 300);
                        }
                    });
                    
                    plusBtn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-product-id'));
                        const input = this.parentNode.querySelector('.quantity-input');
                        let quantity = parseInt(input.value) + 1;
                        
                        input.value = quantity;
                        updateCartQuantity(productId, quantity);
                        
                        // Add animation
                        this.classList.add('animate-click');
                        setTimeout(() => {
                            this.classList.remove('animate-click');
                        }, 300);
                    });
                    
                    removeBtn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-product-id'));
                        
                        // Add animation
                        const cartItem = this.closest('.cart-item');
                        cartItem.classList.add('animate-fade-out');
                        
                        setTimeout(() => {
                            removeFromCart(productId);
                        }, 300);
                    });
                }, 100);
            });
            
            // Update total
            cartTotal.textContent = `EGP ${total.toFixed(2)}`;
        }
        
        // Show added animation
        function showAddedAnimation(productId) {
            const button = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);
            
            if (button) {
                // Create animation element
                const animationElement = document.createElement('div');
                animationElement.className = 'add-to-cart-animation';
                animationElement.innerHTML = '<i class="fas fa-check"></i>';
                
                // Get button position
                const buttonRect = button.getBoundingClientRect();
                const cartRect = cartBtn.getBoundingClientRect();
                
                // Set initial position
                animationElement.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
                animationElement.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
                
                // Append to body
                document.body.appendChild(animationElement);
                
                // Trigger animation
                setTimeout(() => {
                    animationElement.style.top = `${cartRect.top + cartRect.height / 2}px`;
                    animationElement.style.left = `${cartRect.left + cartRect.width / 2}px`;
                    animationElement.style.opacity = '0';
                    animationElement.style.transform = 'scale(0.5)';
                }, 10);
                
                // Remove animation element
                setTimeout(() => {
                    animationElement.remove();
                    
                    // Animate cart icon
                    cartBtn.classList.add('animate-bounce');
                    setTimeout(() => {
                        cartBtn.classList.remove('animate-bounce');
                    }, 1000);
                }, 500);
            }
        }
    }
    
    // Favorites functionality
    function initFavorites() {
        // Elements
        const favoritesBtn = document.getElementById('favoritesBtn');
        const favoritesSidebar = document.getElementById('favoritesSidebar');
        const closeFavoritesBtn = document.getElementById('closeFavorites');
        const favoritesItems = document.getElementById('favoritesItems');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        // Event listeners
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openFavorites();
            });
        }
        
        if (closeFavoritesBtn) {
            closeFavoritesBtn.addEventListener('click', closeFavorites);
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                closeCart();
                closeFavorites();
            });
        }
        
        // Favorite buttons
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            
            // Check if product is in favorites
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.includes(productId)) {
                button.classList.add('active');
                button.querySelector('i').classList.replace('far', 'fas');
            }
            
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = parseInt(this.getAttribute('data-product-id'));
                toggleFavorite(productId, this);
            });
        });
        
        // Open favorites
        function openFavorites() {
            updateFavoritesDisplay();
            favoritesSidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            
            // Add animation classes
            favoritesSidebar.classList.add('animate-slide-in');
            setTimeout(() => {
                favoritesSidebar.classList.remove('animate-slide-in');
            }, 500);
        }
        
        // Close favorites
        window.closeFavorites = function() {
            favoritesSidebar.classList.add('animate-slide-out');
            sidebarOverlay.classList.remove('active');
            
            setTimeout(() => {
                favoritesSidebar.classList.remove('active');
                favoritesSidebar.classList.remove('animate-slide-out');
                document.body.classList.remove('sidebar-open');
            }, 300);
        };
        
        // Toggle favorite
        window.toggleFavorite = function(productId, button) {
            // Get favorites from localStorage
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Check if product is already in favorites
            const index = favorites.indexOf(productId);
            
            if (index === -1) {
                // Add to favorites
                favorites.push(productId);
                
                if (button) {
                    button.classList.add('active');
                    button.querySelector('i').classList.replace('far', 'fas');
                    
                    // Add animation
                    button.classList.add('animate-pulse');
                    setTimeout(() => {
                        button.classList.remove('animate-pulse');
                    }, 1000);
                }
                
                // Show toast notification
                showToast('Product added to favorites!', 'success');
            } else {
                // Remove from favorites
                favorites.splice(index, 1);
                
                if (button) {
                    button.classList.remove('active');
                    button.querySelector('i').classList.replace('fas', 'far');
                }
                
                // Show toast notification
                showToast('Product removed from favorites', 'info');
            }
            
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Update favorites count badge
            updateCountBadges();
            
            // Update favorites display if open
            if (favoritesSidebar && favoritesSidebar.classList.contains('active')) {
                updateFavoritesDisplay();
            }
        };
        
        // Update favorites display
        function updateFavoritesDisplay() {
            // Get favorites from localStorage
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Clear favorites items
            favoritesItems.innerHTML = '';
            
            if (favorites.length === 0) {
                // Show empty favorites message
                favoritesItems.innerHTML = `
                    <div class="empty-favorites">
                        <i class="fas fa-heart-broken"></i>
                        <p>Your favorites list is empty</p>
                        <a href="products.html" class="btn btn-outline-primary">Discover Products</a>
                    </div>
                `;
                return;
            }
            
            // Add favorites items
            favorites.forEach(productId => {
                const product = getProductById(productId);
                
                if (product) {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'favorite-item animate-fade-in';
                    itemElement.innerHTML = `
                        <div class="favorite-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="favorite-item-details">
                            <h4>${product.name}</h4>
                            <p class="favorite-item-price">EGP ${product.price.toFixed(2)}</p>
                            <div class="favorite-item-actions">
                                <button class="btn btn-sm btn-primary add-to-cart-from-favorites" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                        <button class="remove-favorite" data-product-id="${product.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    favoritesItems.appendChild(itemElement);
                    
                    // Add event listeners
                    setTimeout(() => {
                        const addToCartBtn = itemElement.querySelector('.add-to-cart-from-favorites');
                        const removeBtn = itemElement.querySelector('.remove-favorite');
                        
                        addToCartBtn.addEventListener('click', function() {
                            const productId = parseInt(this.getAttribute('data-product-id'));
                            addToCart(productId, 1);
                            
                            // Add animation
                            this.classList.add('animate-click');
                            setTimeout(() => {
                                this.classList.remove('animate-click');
                            }, 300);
                        });
                        
                        removeBtn.addEventListener('click', function() {
                            const productId = parseInt(this.getAttribute('data-product-id'));
                            
                            // Add animation
                            const favoriteItem = this.closest('.favorite-item');
                            favoriteItem.classList.add('animate-fade-out');
                            
                            setTimeout(() => {
                                // Update button on product page if visible
                                const favoriteBtn = document.querySelector(`.favorite-btn[data-product-id="${productId}"]`);
                                if (favoriteBtn) {
                                    favoriteBtn.classList.remove('active');
                                    favoriteBtn.querySelector('i').classList.replace('fas', 'far');
                                }
                                
                                toggleFavorite(productId);
                            }, 300);
                        });
                    }, 100);
                }
            });
        }
    }
    
    // Update count badges
    function updateCountBadges() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const favCount = document.getElementById('favCount');
        const cartCount = document.getElementById('cartCount');
        
        if (favCount) {
            favCount.textContent = favorites.length;
            
            if (favorites.length > 0) {
                favCount.classList.add('active');
            } else {
                favCount.classList.remove('active');
            }
        }
        
        if (cartCount) {
            // Count total items in cart
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCount.classList.add('active');
            } else {
                cartCount.classList.remove('active');
            }
        }
    }
    
    // Get product by ID
    function getProductById(productId) {
        // Sample product data (in a real app, this would come from a database)
        const products = [
            {
                id: 1,
                name: "Crystal Pendant Necklace",
                price: 299.99,
                originalPrice: null,
                description: "Elegant crystal pendant necklace with a gold chain. Perfect for special occasions or everyday wear.",
                category: "necklaces",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.5
            },
            {
                id: 2,
                name: "Pearl Drop Earrings",
                price: 199.99,
                originalPrice: 249.99,
                description: "Beautiful pearl drop earrings with silver hooks. These classic earrings add elegance to any outfit.",
                category: "earrings",
                image: "/placeholder.svg?height=400&width=300",
                rating: 5
            },
            {
                id: 3,
                name: "Gold Chain Bracelet",
                price: 249.99,
                originalPrice: null,
                description: "Stunning gold chain bracelet with a secure clasp. A timeless piece that complements any style.",
                category: "bracelets",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4
            },
            {
                id: 4,
                name: "Diamond Ring",
                price: 399.99,
                originalPrice: 499.99,
                description: "Exquisite diamond ring with a platinum band. A perfect gift for someone special.",
                category: "rings",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.8
            },
            {
                id: 5,
                name: "Silver Hoop Earrings",
                price: 149.99,
                originalPrice: null,
                description: "Classic silver hoop earrings that go with any outfit. Lightweight and comfortable for all-day wear.",
                category: "earrings",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.2
            },
            {
                id: 6,
                name: "Gemstone Pendant",
                price: 279.99,
                originalPrice: null,
                description: "Vibrant gemstone pendant on a delicate gold chain. A colorful addition to your jewelry collection.",
                category: "necklaces",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.6
            },
            {
                id: 7,
                name: "Charm Bracelet",
                price: 189.99,
                originalPrice: 229.99,
                description: "Silver charm bracelet with various decorative charms. Customize it with your favorite charms.",
                category: "bracelets",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.3
            },
            {
                id: 8,
                name: "Stainless Steel Watch",
                price: 499.99,
                originalPrice: null,
                description: "Elegant stainless steel watch with a minimalist design. Water-resistant and durable for everyday use.",
                category: "watches",
                image: "/placeholder.svg?height=400&width=300",
                rating: 4.7
            }
        ];
        
        return products.find(product => product.id === productId);
    }

    // Dummy showToast function
    function showToast(message, type) {
        console.log(`Toast: ${message} (Type: ${type})`);
    }
});
