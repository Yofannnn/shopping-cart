let cart = JSON.parse(localStorage.getItem("data")) || [];

const label = document.querySelector('.total-product')//gantiii variabel inii

const showCartItems = async function(){
  try{
    const product = await getDataProduct();
    showUICard(product);
  } catch(err){
    const listCart = document.querySelector('.list-product');
    listCart.innerHTML = (err);
  };
};
showCartItems();

function showUICard(product){
  if (cart.length !== 0) {
    let cards = '';
    cart.forEach(x => {
      let { id, item, size } = x;
      let search = product.find((x) => x.id === id) || [];
      let { image, price, title, type } = search;
      cards += cartItem(id, title, type, price, image, item, size);
      const listCart = document.querySelector('.list-product');
      listCart.innerHTML = cards;
    });
  } else {
    const bodyCart = document.querySelector('.body-cart');
    bodyCart.innerHTML = "";
    bodyCart.innerHTML = `
    <h1 class="cart-empty">Cart is Empty</h1>
    `;
  };
};

const showCartItemsDetails = async function(el){
  try{
    let cartCliked = el
    const product = await getDataProduct();
    showUIDetail(product , cartCliked);
  } catch(err){
    const listCart = document.querySelector('.list-product');
    listCart.innerHTML = (err);
  };
};

function showUIDetail(product , cardClicked){
  let productDetails = '';
    cart.forEach(x => {
      let { id, item, size } = x;
      let search = product.find((x) => x.id === id) || [];
      let { image, price, title, type, description } = search;
      productDetails = productDetail(id, title, type, price, image, description, item, size);
      const modalBody = document.querySelector('.container-modal');
      if(cardClicked.parentElement.parentElement.dataset.idcart === id+size){
        modalBody.innerHTML = productDetails;
        // make body can't scroll
        const body = document.querySelector('body');
        body.classList.add('stop');
        // close product detail
        const closeProductDetail = document.querySelector('.close-btn-pop-up');
        closeProductDetail.addEventListener('click' , function() {
            closeProductDetail.parentElement.parentElement.classList.add('close');
            body.classList.remove('stop');
        });
      };
    });
};

let increment = (el) => {
  let selectedItem = el.parentElement.parentElement.parentElement;
  let search = cart.find(x => x.id+x.size === selectedItem.dataset.idcart);
  search.item ++;
  showCartItems();
  calculation(selectedItem);
  totalAmount();
  localStorage.setItem("data", JSON.stringify(cart));
};

let decrement = (el) => {
  let selectedItem = el.parentElement.parentElement.parentElement;
  let search = cart.find(x => x.id+x.size === selectedItem.dataset.idcart);
  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item --;
  }
  showCartItems();
  calculation(selectedItem);
  totalAmount();
  cart = cart.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(cart));
};

let removeItem = (el) => {
  let selectedItem = el.parentElement.parentElement;
  cart = cart.filter((x) => x.id+x.size !== selectedItem.dataset.idcart);
  calculation();
  showCartItems();
  totalAmount();
  localStorage.setItem("data", JSON.stringify(cart));
};

const totalAmount = async function(){
  try{
    const product = await getDataProduct();
    showUITotalAmount(product);
  } catch(err){
    const listCart = document.querySelector('.list-product');
    listCart.innerHTML = (err);
  };
};
totalAmount();

function showUITotalAmount(product){
  if(cart.length !== 0){
    let amount = cart
    .map(x => {
      let {id, item} = x;
      let filterData = product.find(x => x.id === id);
      return filterData.price * item;
    })
    .reduce((x, y) => x + y, 0);
    return (label.innerHTML = `
    <div class="wrapped">
      <h1>Summary</h1>
      <p class="subtotal">Subtotal : ${rupiah.format(amount)}</p>
      <p class="discount">Discount : -</p>
      <p class="total">Total : ${rupiah.format(amount)}</p>
      <button class="checkout" onclick="alert('this is just demo')">Checkout</button>
    </div>`);
  } else return;
};

// navbar bedge total amount
let calculation = () => {
  const cartIcon = document.querySelector(".amountCart");
  if(cart.length !== 0){
    cartIcon.style.display = "inline-block"
    cartIcon.innerHTML = cart.map((x) => x.item).reduce((x, y) => x + y, 0);
  } else{
    cartIcon.style.display = "none"
  };
};
calculation();

// fetch json
function getDataProduct(){
  return fetch('assets/data/product.json')
  .then(response => {
    if(!response.ok){
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(response => {
    if(response.Response === 'False'){
      throw new Error(response.Error);
    }
    return response.product;
  });
};

// Format a Number as Currency
let rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits : 0 ,
});

function cartItem(id, title, type, price, image, item, size){
  return `<div class="container" data-idcart="${id}${size}">
                <div class="image">
                    <img src="../assets/img/img-product/${image}" alt="" onclick="showCartItemsDetails(this)">
                </div>
                <div class="description">
                    <h3 class="title" onclick="showCartItemsDetails(this)">${title}</h3>
                    <h3 class="total-price">${rupiah.format(price * item)}</h3>
                    <p class="type">${type}</p>
                    <p class="price">${rupiah.format(price)}</p>
                    <p id="${size}" class="size">EU ${size}</p>
                    <div class="cart-buttons-increment-decrement">
                      <i onclick="decrement(this)" class="decrement">-</i>
                      <div class="quantity">${item}</div>
                      <i onclick="increment(this)" class="increment">+</i>
                    </div>
                    <div class="remove" onclick="removeItem(this)">
                        <img src="../assets/svg/garbage-trash-svgrepo-com.svg" alt="">
                    </div>
                </div>
            </div>`
};

function productDetail(id, title, type, price, image, description, item, size){
  return `<div class="modal product-detail-click" data-idmodal="${id}">
            <div class="container-left">
                <div class="img"><img src="../assets/img/img-product/${image}" alt=""></div>
            </div>
            <div class="container-right">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-type">${type}</p>
                <h3 class="modal-price">${rupiah.format(price)}</h3>
                <div class="modal-size-item">
                  <p>Quantity : ${item}</p>
                  <p>Size : EU ${size}</p>
                </div>
                <p class="modal-description">${description}</p>
                <div class="close-btn-pop-up">
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>`
};


// function clear all data in cart
let clearCart = () => {
  cart = [];
  showCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(cart));
};
// clearCart();