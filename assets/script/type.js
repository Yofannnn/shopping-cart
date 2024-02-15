// get data from localstorage
let cart = JSON.parse(localStorage.getItem("data")) || [];

const showCards = async function(){
  try{
    const product = await getDataProduct();
    showUICard(product);
  } catch(err){
    const containerCard = document.querySelector('.items');
    containerCard.innerHTML = (err);
  };
};
showCards();

function showUICard(product) {
  let cards = '';
  product.forEach(p => {
    let { id, title, type, price, image } = p;
    cards += card(id, title, type, price, image);
    const containerCard = document.querySelector('.items');
    containerCard.innerHTML = cards;
  });
};

const showProductDetails = async function(el){
  try{
    let cardClicked = el;
    const product = await getDataProduct();
    showUIModal(product , cardClicked);
  } catch(err){
    alert(err);
  };
};

function showUIModal(product , cardClicked){
  let productDetails = '';
  product.forEach(p => {
    let { id, title, type, price, description, image } = p;
    productDetails = productDetail(id, title, type, price, description, image);
    const modalBody = document.querySelector('.container-modal');
    if(cardClicked.dataset.idcard === p.id){
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

function increment(id) {
  let selectedItem = id;
  let size = document.querySelector('#size').value;
  // Find the item in the cart with the same ID and size
  let search = cart.find((x) => x.id === selectedItem.id && x.size === size);
  if (search === undefined) {
    if (size === 'undefined') {
      alert('Please select a size');
    } else {
      cart.push({
        id: selectedItem.id,
        size: size,
        item: 1,
      });
    }
  } else {
    // Increment the quantity of the existing item
    search.item++;
  }
  calculation(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(cart));
};

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
    // to show the category 
    showCardsChoose(this);
  });
});

const showCardsChoose = async function(el){
  try{
    const product = await getDataProduct();
    showUICardChoose(product , el);
  } catch(err){
    const containerCard = document.querySelector('.items');
    containerCard.innerHTML = (err);
  };
};

function showUICardChoose(product , el) {
  let cards = '';
  product.forEach(p => {
    let { id, title, type, price, image, category } = p;
    let chooseType = el.firstElementChild.innerHTML.toLowerCase();
    const containerCard = document.querySelector('.items');
    if(chooseType === category){
      cards += card(id, title, type, price, image);
      containerCard.innerHTML = cards;
    } else if(el.firstElementChild.innerHTML === "All Shoes"){
      showCards();
    };
  });
};

let calculation = () => {
  const cartIcon = document.querySelector(".amountCart");
  if(cart.length !== 0){
    cartIcon.style.display = "inline-block"
    cartIcon.innerHTML = cart.map(x => x.item).reduce((x, y) => x + y, 0);
  } else{
    cartIcon.style.display = "none"
  };
};
calculation();

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

function card(id, title, type, price, image) {
  return ` <div id="${id}" class="card" data-idcard="${id}" onclick="showProductDetails(this)">
                <div class="card-img"><img src="assets/img/img-product/${image}" alt=""></div>
                <div class="card-info">
                    <p class="text-title">${title}</p>
                    <p class="text-type">${type}</p>
                </div>
                <div class="card-footer">
                    <span class="text-price">${rupiah.format(price)}</span>
                </div>
            </div> `
};

function productDetail(id, title, type, price, description, image){
    return `<div class="modal product-detail-click" data-idmodal="${id}">
              <div class="container-left">
                  <div class="img"><img src="assets/img/img-product/${image}" alt=""></div>
              </div>
              <div class="container-right">
                  <h3 class="modal-title">${title}</h3>
                  <p class="modal-type">${type}</p>
                  <h3 class="modal-price">${rupiah.format(price)}</h3>
                  <div class="modal-size">
                      <form>
                          <h3>Size</h3>
                          <select id="size" name="size">
                          <option value="undefined" disabled selected hidden>Choose Your Shoe Size</option>
                          <option value="40">EU 40</option>
                          <option value="41">EU 41</option>
                          <option value="42">EU 42</option>
                          <option value="43">EU 43</option>
                          <option value="44">EU 44</option>
                          <option value="45">EU 45</option>
                          <option value="46">EU 46</option>
                          </select>
                          <span><a href="">Size Guide</a></span>
                      </form>
                  </div>
                  <a class="check-out" href="account/login.html">Check Out</a>
                  <div class="add-cart" onclick="increment(${id})">Add to Cart</div>
                  <p class="modal-description">${description}</p>
                  <div class="close-btn-pop-up">
                      <span></span>
                      <span></span>
                  </div>
              </div>
          </div>`
};
