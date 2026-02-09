const API_URL = '/api';
let token = localStorage.getItem('token');
let role = localStorage.getItem('role');
let allProducts = []; 
let cart = JSON.parse(localStorage.getItem('cart')) || []; 

if (token) {
    showShop();
} else {
    showAuth();
}

function showAuth() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('shop-section').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('admin-section').classList.add('hidden');
}

function showShop() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('shop-section').classList.remove('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    
    if (role === 'admin') {
        document.getElementById('admin-section').classList.remove('hidden');
    }

    const userDisplay = role === 'admin' ? 'Admin' : 'User';
    document.getElementById('nav-links').innerHTML = `
        <span style="margin-right:15px; font-size:0.9rem;">Hello, ${userDisplay}</span>
        <a href="#" onclick="logout()" style="color:black; text-decoration:none;">LOGOUT</a>
    `;

    loadProducts();
    updateCartUI();
}

window.toggleAuth = function() {
    document.getElementById('login-form-box').classList.toggle('hidden');
    document.getElementById('register-form-box').classList.toggle('hidden');
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.token) {
            handleAuthSuccess(data);
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (e) { alert('Server error'); }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, 
                email, 
                password,
                role: 'user'
            })
        });
        const data = await res.json();
        
        if (data.token) {
            alert('Account created successfully!');
            handleAuthSuccess(data);
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (e) { alert('Server error'); }
}

function handleAuthSuccess(data) {
    token = data.token;
    role = data.role;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    showShop();
}

function logout() {
    localStorage.clear();
    location.reload();
    localStorage.removeItem('cart');
}

async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);
}

function renderProducts(productsToRender) {
    const container = document.getElementById('product-list');
    container.innerHTML = productsToRender.map(p => {
        let adminButtons = '';
        if (role === 'admin') {
            adminButtons = `
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button onclick="openEditModal('${p._id}')" style="background:#f39c12; color:white; border:none; padding:5px 10px; cursor:pointer; flex:1;">Edit</button>
                    <button onclick="deleteProduct('${p._id}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer; flex:1;">Delete</button>
                </div>
            `;
        }

        return `
        <div class="product-card">
            <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">$${p.price}</div>
                
                <button onclick="addToCart('${p._id}', '${p.name}', ${p.price})" class="btn-black" style="width:100%; margin-top:10px; font-size:0.8rem;">Add to Bag</button>
                
                ${adminButtons}
            </div>
        </div>
        `;
    }).join('');
}

window.openEditModal = function(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    document.getElementById('edit-id').value = product._id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-cat').value = product.category;
    document.getElementById('edit-img').value = product.image;

    document.getElementById('edit-modal').classList.remove('hidden');
}

window.submitEdit = async function() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const price = document.getElementById('edit-price').value;
    const category = document.getElementById('edit-cat').value;
    const image = document.getElementById('edit-img').value;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, price, category, image })
        });

        if (res.ok) {
            alert('Product updated successfully!');
            closeEditModal();
            loadProducts();
        } else {
            alert('Failed to update');
        }
    } catch (e) {
        alert('Server error');
    }
}

window.closeEditModal = function() {
    document.getElementById('edit-modal').classList.add('hidden');
}

window.filterProducts = function(category) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => 
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
        renderProducts(filtered);
    }
}

window.toggleCart = function() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

window.addToCart = function(id, name, price) {
    cart.push({ id, name, price });
    updateCartUI();
    saveCart();
    document.getElementById('cart-sidebar').classList.add('open');
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="padding:20px; color:#666;">Your cart is empty.</p>';
        document.getElementById('cart-total').innerText = '0';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    $${item.price}
                </div>
                <span onclick="removeFromCart(${index})" style="color:red; cursor:pointer;">&times;</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

window.checkout = function() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const orderData = {
        products: cart.map(item => ({ product: item.id, quantity: 1 })),
        totalAmount: cart.reduce((sum, item) => sum + item.price, 0)
    };

    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    })
    .then(res => {
        if (res.ok) {
            cart = [];
            updateCartUI();
            saveCart();
            toggleCart();
            document.getElementById('order-modal').classList.remove('hidden');
        } else {
            alert('Error placing order');
        }
    });
}

window.closeModal = function() {
    document.getElementById('order-modal').classList.add('hidden');
}

window.createProduct = async function() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const category = document.getElementById('p-cat').value;
    const image = document.getElementById('p-img').value || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500';

    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, category, image })
    });
    alert('Product added!');
    loadProducts();
}

window.scrollToShop = function() {
    document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
}

window.deleteProduct = async function(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            alert('Product deleted');
            loadProducts();
        } else {
            alert('Error deleting product');
        }
    } catch (e) {
        alert('Server error');
    }
}