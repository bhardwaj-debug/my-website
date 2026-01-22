document.addEventListener('DOMContentLoaded', function() {
    // Sample products array (expandable for real business use)
    const products = [
        { id: 1, name: 'Casual T-Shirt', price: 20, size: 'M', color: 'White', style: 'Casual', brand: 'Nike', image: 'https://i.pinimg.com/736x/aa/be/b5/aabeb5e202185509200a543e9168c88d.jpg' },
        { id: 2, name: 'Formal Shirt', price: 50, size: 'L', color: 'White', style: 'Formal', brand: 'Adidas', image: 'https://i.pinimg.com/1200x/7f/95/6f/7f956f373a6f8f1f2dc73c61f89baa57.jpg' },
        { id: 3, name: 'Sport Shorts', price: 30, size: 'S', color: 'Black', style: 'Sport', brand: 'Puma', image: 'https://i.pinimg.com/1200x/8f/75/85/8f7585225263dd0968565af6fd04fe83.jpg' },
        { id: 4, name: 'Straightfit Jeans', price: 80, size: 'XL', color: 'Light Blue', style: 'Casual', brand: 'Nike', image: 'https://i.pinimg.com/1200x/36/ce/43/36ce43344b92305e283cd489b906641a.jpg' },
        { id: 5, name: 'Straightfit Jeans', price: 75, size: 'L', color: 'Light Blue', style: 'Casual', brand: 'Nike', image: 'https://i.pinimg.com/1200x/36/ce/43/36ce43344b92305e283cd489b906641a.jpg' },
        { id: 6, name: 'Mens Suits', price: 100, size: 'L', color: 'Grey', style: 'Formal', image: 'https://i.pinimg.com/736x/4a/c1/61/4ac161c084942b1667cac39e7733fd9c.jpg' },
        { id: 7, name: 'Mens Suits', price: 100, size: 'XL', color: 'Light Grey', style: 'Formal', image: 'https://i.pinimg.com/1200x/fe/eb/9a/feeb9a33652396e506fc916430601cc8.jpg' },
        // Add more products as needed
    ];

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productGrid = document.getElementById('product-grid');
    const wishlistGrid = document.getElementById('wishlist-grid');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const searchBar = document.getElementById('search-bar');
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

    // Navigation
    document.getElementById('home-link').addEventListener('click', showHome);
    document.getElementById('products-link').addEventListener('click', showProducts);
    document.getElementById('wishlist-link').addEventListener('click', showWishlist);
    document.getElementById('cart-link').addEventListener('click', showCart);

    // Initial render
    renderProducts(products);

    // Search and filters
    searchBar.addEventListener('input', filterProducts);
    priceSlider.addEventListener('input', function() {
        priceValue.textContent = `$0 - $${this.value}`;
        filterProducts();
    });
    filterCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));

    function filterProducts() {
        const searchTerm = searchBar.value.toLowerCase();
        const maxPrice = parseInt(priceSlider.value);
        const activeFilters = {};
        filterCheckboxes.forEach(cb => {
            if (cb.checked) {
                if (!activeFilters[cb.dataset.filter]) activeFilters[cb.dataset.filter] = [];
                activeFilters[cb.dataset.filter].push(cb.value);
            }
        });

        const filtered = products.filter(product => {
            return product.name.toLowerCase().includes(searchTerm) &&
                   product.price <= maxPrice &&
                   Object.keys(activeFilters).every(filter => activeFilters[filter].includes(product[filter]));
        });
        renderProducts(filtered);
    }

    function renderProducts(productList) {
        productGrid.innerHTML = '';
        productList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <p>Size: ${product.size} | Color: ${product.color}</p>
                <button class="btn view-detail" data-id="${product.id}">View Details</button>
                <button class="btn add-wishlist" data-id="${product.id}">Add to Wishlist</button>
                <button class="btn add-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(card);
        });

        // Event listeners for buttons
        document.querySelectorAll('.view-detail').forEach(btn => btn.addEventListener('click', viewDetail));
        document.querySelectorAll('.add-wishlist').forEach(btn => btn.addEventListener('click', addToWishlist));
        document.querySelectorAll('.add-cart').forEach(btn => btn.addEventListener('click', addToCart));
    }

    function viewDetail(e) {
        const id = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === id);
        document.getElementById('detail-content').innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>Size: ${product.size} | Color: ${product.color} | Style: ${product.style} | Brand: ${product.brand}</p>
            <button class="btn add-wishlist" data-id="${product.id}">Add to Wishlist</button>
            <button class="btn add-cart" data-id="${product.id}">Add to Cart</button>
        `;
        showSection('product-detail');
    }

    function addToWishlist(e) {
        const id = parseInt(e.target.dataset.id);
        if (!wishlist.includes(id)) {
            wishlist.push(id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert('Added to wishlist!');
        }
    }

    function addToCart(e) {
        const id = parseInt(e.target.dataset.id);
        if (!cart.includes(id)) {
            cart.push(id);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            alert('Added to cart!');
        }
    }

    function showWishlist() {
        const wishlistProducts = products.filter(p => wishlist.includes(p.id));
        wishlistGrid.innerHTML = '';
        wishlistProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="btn add-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn remove-wishlist" data-id="${product.id}">Remove</button>
            `;
            wishlistGrid.appendChild(card);
        });
        document.querySelectorAll('.remove-wishlist').forEach(btn => btn.addEventListener('click', removeFromWishlist));
        showSection('wishlist-section');
    }

    function removeFromWishlist(e) {
        const id = parseInt(e.target.dataset.id);
        wishlist = wishlist.filter(wid => wid !== id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showWishlist();
    }

    function showCart() {
        updateCart();
        showSection('cart-section');
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(id => {
            const product = products.find(p => p.id === id);
            total += product.price;
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `<span>${product.name} - $${product.price}</span><button class="btn remove-cart" data-id="${id}">Remove</button>`;
            cartItems.appendChild(item);
        });
        cartTotal.textContent = `Total: $${total}`;
        document.querySelectorAll('.remove-cart').forEach(btn => btn.addEventListener('click', removeFromCart));
    }

    function removeFromCart(e) {
        const id = parseInt(e.target.dataset.id);
        cart = cart.filter(cid => cid !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Checkout successful! (Simulation)');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        } else {
            alert('Cart is empty!');
        }
    });

    document.getElementById('back-to-products').addEventListener('click', showProducts);

    function showHome() { showSection('products-section'); }
    function showProducts() { showSection('products-section'); }

    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');
    }
});