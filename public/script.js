AOS.init();

window.addEventListener("scroll",()=>{
    if(globalMenu.style.display === "block"){
        globalMenu.style.display = "none";
        btn.style.display = "block";
        cancel.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const btnCart = document.querySelector('.btn-cart');
    const cart = document.querySelector('.cart');
    const btnClose = document.querySelector('#cart-close');
    const btnBuy = document.querySelector('.btn-buy');
    const cartCount = document.querySelector('.cart-count');
    const totalValue = document.querySelector('.total-price');
    
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    updateCartUI();
    
    function hamburger(){
        const globalMenu = document.getElementById('globalMenu');
        const btn = document.getElementById('btn');
        const cancel = document.getElementById('cancel');
        const check = document.getElementById('check');

            btn.addEventListener('click',()=>{
                btn.style.display = 'none';
                cancel.style.display = 'block';
               globalMenu.style.display = 'block';
            });
            cancel.addEventListener('click',()=>{
                 cancel.style.display = 'none';
                btn.style.display = 'block';
                globalMenu.style.display = 'none';
            })


    }
    hamburger();

    btnCart.addEventListener('click', function() {
        cart.classList.add('cart-active');
    });

    
    btnClose.addEventListener('click', function() {
        cart.classList.remove('cart-active');
    });

    
    btnBuy.addEventListener('click', function() {
        if (confirm('Are you sure you want to place the order?')) {
            alert('Order placed successfully!');
            
            sessionStorage.removeItem('cartItems');
            cartItems = [];
            updateCartUI();
            cart.classList.remove('cart-active');
        }
    });

    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-cart')) {
            let foodBox = event.target.closest('.food-box');
            let title = foodBox.querySelector('.food-title').textContent;
            let price = foodBox.querySelector('.food-price').textContent;
            let imgSrc = foodBox.querySelector('img').src;

            
            cartItems.push({ title: title, price: price, imgSrc: imgSrc });
           
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

            updateCartUI();
        }
    });

    
    cart.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-trash')) {
            if (confirm('Are you sure you want to remove this item?')) {
                let cartItem = event.target.closest('.cart-box');
                let index = Array.from(cartItem.parentNode.children).indexOf(cartItem);

                
                cartItems.splice(index, 1);
                
                sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

                updateCartUI();
            }
        }
    });

    
    function updateCartUI() {
        let cartContent = document.querySelector('.cart-content');
        cartContent.innerHTML = '';

        let totalPrice = 0;
        cartItems.forEach(function(item, index) {
            let newProductElement = createCartProduct(item.title, item.price, item.imgSrc, index);
            cartContent.insertAdjacentHTML('beforeend', newProductElement);
            totalPrice += parseFloat(item.price.replace("Rs.", ""));
        });

        totalValue.textContent = 'Rs.' + totalPrice.toFixed(2);
        cartCount.textContent = cartItems.length;

       
        if (cartItems.length === 0) {
            btnBuy.style.display = 'none';
        } else {
            btnBuy.style.display = 'block';
        }
    }

    
    function createCartProduct(title, price, imgSrc, index) {
        return `
        <div class="cart-box">
            <img src="${imgSrc}" class="cart-img">
            <div class="detail-box">
                <div class="cart-food-title">${title}</div>
                <div class="price-box">
                    <div class="cart-price">${price}</div>
                    <div class="cart-amt">${price}</div>
                </div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class="fa fa-trash cart-remove" data-index="${index}"></i>
        </div>`;
    }

    cart.addEventListener('change', function(event) {
        if (event.target.classList.contains('cart-quantity')) {
            updateCartItem(event.target);
        }
    });

    function updateCartItem(input) {
        let cartItem = input.closest('.cart-box');
        let price = parseFloat(cartItem.querySelector('.cart-price').textContent.replace("Rs.", "").trim());
        let quantity = parseInt(input.value);
        let subtotal = price * quantity;
        cartItem.querySelector('.cart-amt').textContent = "Rs." + subtotal.toFixed(2);

        
        let totalPrice = 0;
        document.querySelectorAll('.cart-box').forEach(function(item) {
            totalPrice += parseFloat(item.querySelector('.cart-amt').textContent.replace("Rs.", "").trim());
        });
        totalValue.textContent = 'Rs.' + totalPrice.toFixed(2);
    }
});
