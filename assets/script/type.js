// get data from localstorage
let cart = JSON.parse(localStorage.getItem("data")) || [];

// initial import module
import {getDataProduct, card, showDetailModal, increment, showFlashMsg, calculation} from "../modules/module.js"

const showCards = async function(){
  try{
    const products = await getDataProduct();
    showUICard(products);
  } catch(err){
    const containerCard = document.querySelector('.wrapped-items');
    containerCard.innerHTML = (err);
  };
};
showCards();

function showUICard(products) {
  let cards = '';
  products.forEach(p => {
    let { id, title, type, price, image } = p;
    cards += card(id, title, type, price, image);
    const containerCard = document.querySelector('.wrapped-items');
    containerCard.innerHTML = cards;
  });
};

// calculation items in widget and display
calculation(cart);

// event listener display modal when card clicked
document.addEventListener('click', async function(e) {
  let cardClicked = e.target.closest('.card');
  if (cardClicked){
    try{
      const products = await getDataProduct();
      showDetailModal(products , cardClicked);
    } catch(err){
      alert(err);
    };
  }
})

// event listener for adding items to cart and flash msg at button
document.addEventListener('click', async function(e) {
  if(e.target.classList.contains('add-cart')) {
      increment(cart, e.target)
      showFlashMsg(e.target)
  }
})

// event listener for remove modal
document.addEventListener('click', async function(e) {
  if (e.target.closest('.close-btn-pop-up')) {
    const modalBody = document.querySelector('.container-modal');
    modalBody.innerHTML = ""
    document.querySelector('body').classList.remove('stop')
  }
})

// sort option
const sortOpt = document.querySelector('#sort');
// select type active style
const selected = document.querySelectorAll('.choice-type ul li');
selected.forEach(el => {
  el.addEventListener('click', function () {
    selected.forEach(element => {
      element.classList.remove('active');
    });
    const isActive = this.classList.contains('active');
    if (!isActive) {
      this.classList.add('active');
    };
    // to reset the sort
    sortOpt.value = "undefined";
    // to show the category 
    showCardsChoose(this);
  });
});

const showCardsChoose = async function(el){
  try{
    const product = await getDataProduct();
    showUICardChoose(product , el);
  } catch(err){
    const containerCard = document.querySelector('.wrapped-items');
    containerCard.innerHTML = (err);
  };
};

function showUICardChoose(product, el) {
  let cards = '';
  const chooseType = el.firstElementChild.innerHTML.toLowerCase();
  const containerCard = document.querySelector('.wrapped-items');
  let filteredProducts;

  if (chooseType === 'all shoes') {
    filteredProducts = product;
  } else {
    filteredProducts = product.filter(p => chooseType === p.category.toLowerCase());
  };

  if (sortOpt.value === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOpt.value === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  };

  filteredProducts.forEach(p => {
    const { id, title, type, price, image } = p;
    cards += card(id, title, type, price, image);
  });

  containerCard.innerHTML = cards;
};

sortOpt.addEventListener('change', function () {
  const activeCategory = document.querySelector('.choice-type ul li.active');
  showCardsChoose(activeCategory);
});

//loading
window.addEventListener('load', () => {
  document.querySelector('.container-loader').classList.remove('active');
});
