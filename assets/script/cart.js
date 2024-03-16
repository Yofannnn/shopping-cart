let cart = JSON.parse(localStorage.getItem("data")) || [];

// initial import modules
import {getDataProduct, calculation} from "../modules/module.js"

const totalPriceProduct = document.querySelector('.total-product');

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

// calculation items in widget and display
calculation(cart);

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

// event listener cart items clicked
document.addEventListener('click', async function(e) {
  const targetElement = e.target.closest('.cart-item .img') || e.target.closest('.cart-item .title')
  if (targetElement) {
    try{
      const product = await getDataProduct();
      showUIDetail(product , targetElement);
    } catch(err){
      const listCart = document.querySelector('.list-product');
      listCart.innerHTML = (err);
    };
  }
})

function showUIDetail(product , cardClicked){
  let productDetails = '';
  cart.forEach(x => {
    let { id, item, size } = x;
    let search = product.find((x) => x.id === id);
    let { image, price, title, type, description } = search;
    productDetails = productDetail(id, title, type, price, image, description, item, size);
    const modalBody = document.querySelector('.container-modal');
    if(cardClicked.parentElement.parentElement.dataset.idcart === id+size){
      modalBody.innerHTML = productDetails;
      document.querySelector('body').classList.add('stop');
    };
  });
};

// event listener for remove modal
document.addEventListener('click', function(e) {
  if (e.target.closest('.close-btn-pop-up')) {
      const modalBody = document.querySelector('.container-modal');
      modalBody.innerHTML = ""
      document.querySelector('body').classList.remove('stop')
  }
})

// event listener for increment btn
document.addEventListener('click', function(e) {
  const incrementBtn = e.target.closest('.increment')
  if (incrementBtn) {
    let selectedItem = incrementBtn.parentElement.parentElement.parentElement;
    let search = cart.find(x => x.id+x.size === selectedItem.dataset.idcart);
    search.item ++;
    showCartItems();
    calculation(cart);
    totalAmount();
    localStorage.setItem("data", JSON.stringify(cart));
  }
})

// event listener for decrement btn
document.addEventListener('click', function(e) {
  const decrementBtn = e.target.closest('.decrement')
  if (decrementBtn) {
    let selectedItem = decrementBtn.parentElement.parentElement.parentElement;
    let search = cart.find(x => x.id+x.size === selectedItem.dataset.idcart);
    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
      search.item --;
    }
    showCartItems();
    calculation(cart);
    totalAmount();
    cart = cart.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(cart));
  }
})

// event listener for remove btn
document.addEventListener('click', function(e) {
  const removeBtn = e.target.closest('.remove')
  if (removeBtn) {
  let selectedItem = removeBtn.parentElement.parentElement;
  cart = cart.filter((x) => x.id+x.size !== selectedItem.dataset.idcart);
  calculation(cart);
  showCartItems();
  totalAmount();
  localStorage.setItem("data", JSON.stringify(cart));
  }
})

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
    return (totalPriceProduct.innerHTML = `
    <div class="wrapped">
      <h1>Summary</h1>
      <p class="subtotal">Subtotal : ${rupiah.format(amount)}</p>
      <p class="discount">Discount : -</p>
      <p class="total">Total : ${rupiah.format(amount)}</p>
      <button class="checkout" onclick="alert('this is just demo')">Checkout</button>
    </div>`);
  } else return;
};

// Format a Number as Currency
let rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits : 0 ,
});

function cartItem(id, title, type, price, image, item, size){
  return `<div class="container cart-item" data-idcart="${id}${size}">
                <div class="image">
                    <img class="img" src="assets/img/img-product/${image}" alt="">
                </div>
                <div class="description">
                    <h3 class="title">${title}</h3>
                    <p class="type">${type}</p>
                    <p class="price">${rupiah.format(price)}</p>
                    <p id="${size}" class="size">EU ${size}</p>
                    <div class="cart-buttons-increment-decrement">
                      <button class="decrement">-</button>
                      <div class="quantity">${item}</div>
                      <button class="increment">+</button>
                    </div>
                    <h3 class="total-price">${rupiah.format(price * item)}</h3>
                    <div class="remove">
                        <img src="assets/svg/garbage-trash-svgrepo-com.svg" alt="">
                    </div>
                </div>
            </div>`
};

function productDetail(id, title, type, price, image, description, item, size){
  return `<div class="modal product-detail-click" data-idmodal="${id}">
            <div class="container-left">
                <div class="img"><img src="assets/img/img-product/${image}" alt=""></div>
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

//loading
window.addEventListener('load', () => {
  document.querySelector('.container-loader').classList.remove('active');
});


// function clear all data in cart
let clearCart = () => {
  cart = [];
  showCartItems();
  calculation(cart);
  localStorage.setItem("data", JSON.stringify(cart));
};
// clearCart();
