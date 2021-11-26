url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';

let inCartItems = 0; //ile jest produktów w koszyku
let productsInCart = []; //tablica do zapisywania ile jest danego produktu w koszyku
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


function appendData(data){ //załadowanie danych na stronie

    let column1 = document.getElementById("col1");
    let div;
    let img;
    let title;
    let price;
    let ingredients;
    let button;

    for(let i = 0; i < data.length; i++){

        productsInCart.push({"inCart": 0});

        div = document.createElement("div");
        div.classList.add('product');

        img = document.createElement('img');
        img.src = data[i].image;
        img.classList.add('product-image');
        div.appendChild(img);

        title = document.createElement("h3");
        title.classList.add('title-product');
        title.innerHTML = data[i].title;
        div.appendChild(title);

        price = document.createElement("h3");
        price.classList.add('price-product');
        price.innerHTML = data[i].price.toFixed(2); 
        div.appendChild(price);

        ingredients = document.createElement("h3");
        ingredients.classList.add('ingredients-product');
        ingredients.innerHTML = data[i].ingredients.join(", ");
        div.appendChild(ingredients);

        button = document.createElement("a");
        button.classList.add('add-cart', 'cart-button');
        button.innerHTML = "Zamów";
        button.addEventListener('click', () => {
            addToCart(data[i]);
        })
        
        div.appendChild(button);
        column1.appendChild(div);

    }

}

function addToCart(product){ //funkcja, która wykonuje się po kliknięciu przycisku zamów

    inCartItems++;
    checkCart();
    addTotalCost(product);
    setItemInCart(product);
}

function checkCart(){ //sprawdzanie czy koszyk jest pusty
    let cart = document.getElementById("col2");
    let emptyCart = document.getElementById("emptyCart");
    
    if(inCartItems != 0 && emptyCart){
        cart.removeChild(emptyCart);
    }
    else if(inCartItems == 0 && !emptyCart){
        emptyCart = document.createElement("h3");
        emptyCart.id = "emptyCart";
        emptyCart.classList.add('empty-cart');
        emptyCart.innerHTML = "Głodny? Zamów naszą pizzę!"
        cart.appendChild(emptyCart);
    }
}

function addTotalCost(product){
    totalCost += product.price;
}

function setItemInCart(product){ //umieszczenie produktu w koszyku
    let cart = document.getElementById("col2");
    let index = product.id - 1;
    let total = document.getElementById("tp"); //koszt zamówienia

    if(!total){
        total = document.createElement("div");
        total.classList.add('total-price');
        total.id = "tp";

        let totalPriceTitle = document.createElement("h4");
        totalPriceTitle.classList.add('total-price-title');
        totalPriceTitle.innerHTML = "Koszt zamówienia: ";

        total.appendChild(totalPriceTitle);

        let totalPrice = document.createElement("h4");
        totalPrice.classList.add('total-price-number');
        totalPrice.id = "tpn";
        totalPrice.innerHTML = totalCost.toFixed(2);

        total.appendChild(totalPrice);
        cart.appendChild(total);
    }

    if (productsInCart[index].inCart == 0){

        let sum = document.getElementById("tpn");
        sum.innerHTML = totalCost.toFixed(2);

        productsInCart[index].inCart += 1; //zwiększanie liczby danego elementu w koszyku

        let div = document.createElement("div");
        div.classList.add('cart-product');
        div.id = product.id;

        let title = document.createElement("h5");
        title.classList.add('cart-product-title');
        title.innerHTML = product.title;
        div.appendChild(title);

        let price = document.createElement("h5");
        price.classList.add('cart-product-price');
        price.innerHTML = product.price.toFixed(2);
        div.appendChild(price);

        let amount = document.createElement("h5");
        amount.classList.add('cart-product-amount');
        amount.id = "amount" + product.id;
        amount.innerHTML = "x" + productsInCart[index].inCart;
        div.appendChild(amount);

        removeButton = document.createElement("a");
        removeButton.classList.add('remove-cart');
        removeButton.innerHTML = "Usuń";
        removeButton.addEventListener('click', () => {
            removeFromCart(product);
        }) 
        div.appendChild(removeButton);
        cart.appendChild(div);

    }
    else{
        let sum = document.getElementById("tpn");
        sum.innerHTML = totalCost.toFixed(2);
        productsInCart[index].inCart += 1; 
        let amount = document.getElementById("amount" + product.id);
        amount.innerHTML = "x" + productsInCart[index].inCart;
    }
}

function removeFromCart(product){ //usuwanie produktu z koszyka

    subtractTotalCost(product);
    let cart = document.getElementById("col2");
    let index = product.id - 1;
    inCartItems--;
    let total = document.getElementById("tp"); 

    if(total && inCartItems == 0){
        cart.removeChild(total);
    }

    if(productsInCart[index].inCart == 1){
        productsInCart[index].inCart -= 1;
        cart.removeChild(document.getElementById(product.id));
        let sum = document.getElementById("tpn");
        if(sum){
            sum.innerHTML = totalCost.toFixed(2);
        }

    }
    else{
        let sum = document.getElementById("tpn");
        sum.innerHTML = totalCost.toFixed(2);
        productsInCart[index].inCart -= 1;
        let amount = document.getElementById("amount" + product.id);
        amount.innerHTML = "x" + productsInCart[index].inCart;
    }
    checkCart();
}

function subtractTotalCost(product){
    totalCost -= product.price;
}
