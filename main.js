const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';

let inCartItems = 0; //ile jest produktów w koszyku
let totalCost = 0; //koszt całkowity zamówienia


fetch(url)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        appendData(data);
    })
    .catch(function (err){
        console.log(err)
    });


function appendData(data) {
    const pizzasList = document.getElementById("pizzas-list");
    
    data.forEach(item => {
        item.counter = 0;
        pizzasList.insertAdjacentHTML('beforeend', `
            <div class='product'>
            <img src='${item.image}' class='product-image' />
            <h3 class='title-product'>${item.title}</h3>
            <h3 class='price-product'>${item.price.toFixed(2)}</h3>
            <h3 class='ingredients-product'>${item.ingredients.join(', ')}</h3>
            <a class='add-cart cart-button' id='product` + item.id + `'>Zamów</a>
            </div>
            `)
        const button = document.getElementById("product" + item.id);
        button.addEventListener('click', () => {
            addToCart(item);
        })
    
    })
}

function addToCart(product){ //funkcja, która wykonuje się po kliknięciu przycisku zamów
    inCartItems++;
    checkCart();
    addTotalCost(product);
    setItemInCart(product);
}

function checkCart(){ //sprawdzanie czy koszyk jest pusty
    const emptyCart = document.getElementById("emptyCart");
    
    if(inCartItems != 0){
        emptyCart.className="full-cart";
    }
    else if(inCartItems == 0){
        emptyCart.className="empty-cart";
    }
}

function addTotalCost(product){
    totalCost += product.price;
}

function setItemInCart(product){ //umieszczenie produktu w koszyku
    const cart = document.getElementById("cart");
    const index = product.id - 1;
    const total = document.getElementById("costs"); //koszt zamówienia

    if(!total){
        cart.insertAdjacentHTML('beforeend', `
        <div class='total-price' id='costs'>
        <h4 class='total-price-title'>Koszt zamówienia: </h4>
        <h4 class='total-price-number' id='costs-number'>${totalCost.toFixed(2)}</h4>
        </div>
        `)
    }

    if (product.counter === 0){
        const sum = document.getElementById("costs-number");
        sum.innerHTML = totalCost.toFixed(2);

        product.counter += 1; //zwiększanie liczby danego elementu w koszyku

        cart.insertAdjacentHTML('beforeend',`
        <div class='cart-product' id='${product.id}'>
        <h5 class='cart-product-title'>${product.title}</h5>
        <h5 class='cart-product-price'>${product.price.toFixed(2)}</h5>
        <h5 class='cart-product-amount' id='amount${product.id}'>x${product.counter}</h5>
        <a class='remove-cart' id="remove${product.id}">Usuń</button>
        </div>`)

        const removeButton = document.getElementById("remove" + product.id);
        removeButton.addEventListener('click', () => {
            removeFromCart(product);
        }) 

    }
    else{
        const sum = document.getElementById("costs-number");
        sum.innerHTML = totalCost.toFixed(2);
        product.counter += 1; 
        const amount = document.getElementById("amount" + product.id);
        amount.innerHTML = "x" + product.counter;
    }
}

function removeFromCart(product){ //usuwanie produktu z koszyka
    subtractTotalCost(product);
    const cart = document.getElementById("cart");
    inCartItems--;
    const total = document.getElementById("costs"); 

    if(total && inCartItems == 0){
        cart.removeChild(total);
    }

    if(product.counter === 1){
        product.counter -= 1;
        cart.removeChild(document.getElementById(product.id));
        const sum = document.getElementById("costs-number");
        if(sum){
            sum.innerHTML = totalCost.toFixed(2);
        }

    }
    else{
        const sum = document.getElementById("costs-number");
        sum.innerHTML = totalCost.toFixed(2);
        product.counter -= 1;
        const amount = document.getElementById("amount" + product.id);
        amount.innerHTML = "x" + product.counter;
    }
    checkCart();
}

function subtractTotalCost(product){
    totalCost -= product.price;
}
