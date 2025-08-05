const productsData = [
    {
        id: 1,
        title: "The Urban Nomad",
        description: "A perfect blend of modern design and street-ready durability. Featuring a durable rubber outer sole, these are your new everyday essentials.",
        price: 180.00,
        oldPrice: 360.00,
        images: [
            "https://images.unsplash.com/photo-1542291026-79eddc9afe56?q=80&w=1470&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1628122699252-09c3143c2c10?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596766432616-56450f3b4690?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595341888016-a3e7a9df0059?q=80&w=1470&auto=format&fit=crop"
        ],
        category: "men"
    },
    {
        id: 2,
        title: "Eclipse Runners",
        description: "Sleek, minimalist design meets cutting-edge comfort. Engineered for performance and styled for the city, these shoes are a statement piece.",
        price: 220.00,
        oldPrice: 440.00,
        images: [
            "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d3?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549298428-1b20f45532d5?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582759904229-373678508f7b?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596766432616-56450f3b4690?q=80&w=1287&auto=format&fit=crop"
        ],
        category: "women"
    },
    {
        id: 3,
        title: "Desert Hues",
        description: "Inspired by nature, these high-top sneakers are built with sustainable materials and a focus on earthy tones. Perfect for both outdoor trails and urban concrete.",
        price: 195.00,
        oldPrice: 390.00,
        images: [
            "https://images.unsplash.com/photo-1595954628581-2287754d924c?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1628122699252-09c3143c2c10?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595341888016-a3e7a9df0059?q=80&w=1470&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596766432616-56450f3b4690?q=80&w=1287&auto=format&fit=crop"
        ],
        category: "men"
    },
    {
        id: 4,
        title: "Ocean Breeze Trainer",
        description: "Lightweight and breathable, these trainers are designed for both high-intensity workouts and casual, everyday style. The vibrant blue color adds a refreshing touch.",
        price: 140.00,
        oldPrice: 280.00,
        images: [
            "https://images.unsplash.com/photo-1606107555195-0e29c0162590?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549298428-1b20f45532d5?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582759904229-373678508f7b?q=80&w=1287&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596766432616-56450f3b4690?q=80&w=1287&auto=format&fit=crop"
        ],
        category: "women"
    }
];

let cartItems = [];
let currentProductDetailQuantity = 1;
let currentProductInDetail = null;

// DOM Elements
const productsSection = document.getElementById('products');
const productDetailSection = document.getElementById('product-detail');
const productGrid = document.getElementById('product-grid');
const cartCountSpan = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const cartModalTotalItems = document.getElementById('cart-modal-total-items');
const cartModalTotalPrice = document.getElementById('cart-modal-total-price');
const filterButtons = document.querySelectorAll('.filter-btn');
const sectionsToAnimate = document.querySelectorAll('.fade-in');

// --- Utility Functions ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    } else {
        // Fallback to products section if ID is not found
        productsSection.classList.remove('hidden');
    }

    if (sectionId === 'products') {
        renderProductGrid();
    }
    
    window.scrollTo(0, 0);
}

function loadCart() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// --- Product Listing Functions ---
function renderProductGrid(productsToRender = productsData) {
    productGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" />
            <div class="product-info">
                <p class="brand">Sneakers Co.</p>
                <h3>${product.title}</h3>
                <div class="price-block">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-small" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productCard.querySelector('.add-to-cart-small').addEventListener('click', (event) => {
            event.stopPropagation();
            addToCartFromGrid(product.id);
        });
        productCard.addEventListener('click', () => showProductDetail(product.id));
        productGrid.appendChild(productCard);
    });
}

function addToCartFromGrid(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        addItemToCart(product, 1);
        alert(`Added 1 x ${product.title} to cart!`);
    }
}

function filterProducts(category) {
    const filteredProducts = productsData.filter(product => {
        return category === 'all' || product.category === category;
    });
    renderProductGrid(filteredProducts);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts(button.dataset.category);
    });
});

// --- Product Detail Functions ---
function showProductDetail(productId) {
    currentProductInDetail = productsData.find(p => p.id === productId);
    if (!currentProductInDetail) return;

    document.getElementById('detail-main-image').src = currentProductInDetail.images[0];
    document.getElementById('detail-title').textContent = currentProductInDetail.title;
    document.getElementById('detail-description').textContent = currentProductInDetail.description;
    document.getElementById('detail-price').textContent = `$${currentProductInDetail.price.toFixed(2)}`;
    document.getElementById('detail-old-price').textContent = `$${currentProductInDetail.oldPrice.toFixed(2)}`;

    const detailThumbnails = document.getElementById('detail-thumbnails');
    detailThumbnails.innerHTML = '';
    currentProductInDetail.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Thumbnail ${index + 1}`;
        img.addEventListener('click', () => changeDetailImage(img));
        if (index === 0) {
            img.classList.add('active');
        }
        detailThumbnails.appendChild(img);
    });

    currentProductDetailQuantity = 1;
    document.getElementById('detail-quantity').textContent = currentProductDetailQuantity;

    showSection('product-detail');
}

function changeDetailImage(thumbnail) {
    document.getElementById('detail-main-image').src = thumbnail.src;
    const thumbnails = document.querySelectorAll('#detail-thumbnails img');
    thumbnails.forEach(img => img.classList.remove('active'));
    thumbnail.classList.add('active');
}

function incrementQuantity() {
    currentProductDetailQuantity++;
    document.getElementById('detail-quantity').textContent = currentProductDetailQuantity;
}

function decrementQuantity() {
    if (currentProductDetailQuantity > 1) {
        currentProductDetailQuantity--;
        document.getElementById('detail-quantity').textContent = currentProductDetailQuantity;
    }
}

function addToCartFromDetail() {
    if (currentProductInDetail && currentProductDetailQuantity > 0) {
        addItemToCart(currentProductInDetail, currentProductDetailQuantity);
        alert(`Added ${currentProductDetailQuantity} x ${currentProductInDetail.title} to cart!`);
        currentProductDetailQuantity = 1;
        document.getElementById('detail-quantity').textContent = currentProductDetailQuantity;
    } else if (currentProductDetailQuantity === 0) {
        alert("Please select a quantity greater than zero.");
    }
}

// --- Cart Management & Modal Functions ---
function addItemToCart(product, quantity) {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }
    updateCartCount();
    saveCart();
    renderCartItems();
}

function removeItemFromCart(productId) {
    cartItems = cartItems.filter(item => item.productId !== productId);
    updateCartCount();
    saveCart();
    renderCartItems();
}

function toggleCartModal() {
    cartModal.classList.toggle('show-modal');
    if (cartModal.classList.contains('show-modal')) {
        renderCartItems();
    }
}

function renderCartItems() {
    cartItemsList.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start shopping!</p>';
    } else {
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity} = <strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
                </div>
                <button class="remove-item-btn" data-product-id="${item.productId}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartItemDiv.querySelector('.remove-item-btn').addEventListener('click', () => removeItemFromCart(item.productId));
            cartItemsList.appendChild(cartItemDiv);

            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });
    }

    cartModalTotalItems.textContent = totalItems;
    cartModalTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        toggleCartModal();
    }
});

// --- Scroll Animation ---
function checkVisibility() {
    const windowHeight = window.innerHeight;
    sectionsToAnimate.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < windowHeight - 100;
        if (isVisible) {
            el.classList.add('is-visible');
        }
    });
}

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProductGrid();
    checkVisibility(); // Initial check on page load
});

window.addEventListener('scroll', checkVisibility);