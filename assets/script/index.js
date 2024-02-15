// parallax effect
const about = document.querySelector('.about');
const twoImageWrappet = document.querySelector('.two-image-wrapper');
const article = document.querySelector('.description-brand');
window.addEventListener('scroll' , function () {
    let scroll = window.scrollY;
    // parallax-->header
    about.previousElementSibling.firstElementChild.firstElementChild.style.transform = `translateX(${0 + (scroll* -0.15)}px)`;
    about.previousElementSibling.firstElementChild.lastElementChild.style.transform = `translateX(${0 + (scroll* 0.15)}px)`;
    about.previousElementSibling.lastElementChild.style.transform = `scale(${1 + (scroll*0.0002)})`;
    // parallax-->about
    about.firstElementChild.firstElementChild.style.transform = `translateY(${140 + (scroll* -0.18)}px)`;
    about.firstElementChild.lastElementChild.style.transform = `translateY(${50 + (scroll* -0.05)}px)`;
    // parallax-->two-image-wrapper
    if(scroll >= twoImageWrappet.previousElementSibling.offsetTop + 5){
        twoImageWrappet.firstElementChild.firstElementChild.classList.add('parallax');
        twoImageWrappet.lastElementChild.lastElementChild.classList.add('parallax');
    }
    else{
        twoImageWrappet.firstElementChild.firstElementChild.classList.remove('parallax');
        twoImageWrappet.lastElementChild.lastElementChild.classList.remove('parallax');
    };
    // parallax-->article
    if(scroll >= article.previousElementSibling.offsetTop + 10){
        article.firstElementChild.firstElementChild.classList.add('parallax');
        article.firstElementChild.lastElementChild.classList.add('parallax');
        article.lastElementChild.firstElementChild.firstElementChild.classList.add('parallax');
    }else{
        article.firstElementChild.firstElementChild.classList.remove('parallax');
        article.firstElementChild.lastElementChild.classList.remove('parallax');
        article.lastElementChild.firstElementChild.firstElementChild.classList.remove('parallax');
    };
    article.lastElementChild.lastElementChild.firstElementChild.style.transform = `translate(50px , ${150 + (scroll* -0.09)}px)`;
    article.lastElementChild.lastElementChild.lastElementChild.style.transform = `translateY(${200 + (scroll* -0.18)}px)`;
});

// get data from localstorage
let cart = JSON.parse(localStorage.getItem("data")) || [];

const showRecommendation = async function(){
    try{
        const product = await getDataRecommendation();
        showUICard(product);
    } catch(err) {
        const recommendation = document.querySelector('.scroll-horizontal');
        recommendation.innerHTML = (err);
    };
};
showRecommendation();

function showUICard(product){
    let cards = '';
    product.forEach(p => {
        if (p.recommendation === true) {
            let { id, title, type, price, image } = p;
            cards += card(id, title, type, price, image);
            const containerRecommendation = document.querySelector('.recommendation .container');
            containerRecommendation.innerHTML = cards;
        };
    });
};

const showRecommendationDetail = async function(el){
    try{
        let cardClicked = el;
        const products = await getDataRecommendation();
        showDetail(products , cardClicked);
    } catch(err) {
        alert(err);
    };
};

function showDetail(product , cardClicked){
    let productDetails = '';
    product.forEach(p => {
        let { id, title, type, price, description, image } = p;
        productDetails = productDetail(id, title, type, price, description, image);
        const modalBody = document.querySelector('.container-modal');
        if (cardClicked.dataset.idcard === p.id){
            modalBody.innerHTML = productDetails;
            // make body can't scroll
            const body = document.querySelector('body');
            body.classList.add('stop');
            // close product detail
            const closeProductDetail = document.querySelector('.close-btn-pop-up');
            closeProductDetail.addEventListener('click' , function(e) {
                e.target.parentElement.parentElement.classList.add('close');
                body.classList.remove('stop');
            });
        };
    });
};

function increment(id) {
  let selectedItem = id;
  let size = document.querySelector('#size').value;
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
    search.item++;
  }
  calculation(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(cart));
};

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

function getDataRecommendation(){
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

function card(id, title, type, price, image){
  return ` <div id="${id}" class="card card-recommendation" data-idcard="${id}" onclick="showRecommendationDetail(this)">
                <div class="card-img"><img src="assets/img/img-product/${image}" alt=""></div>
                <div class="card-info">
                    <p class="text-title">${title}</p>
                    <p class="text-type">${type}</p>
                </div>
                <div class="card-footer">
                    <span class="text-title">${rupiah.format(price)}</span>
                </div>
            </div> `
};

function productDetail(id, title, type, price, description, image){
    return `<div class="modal product-detail-click" data-idmodal="${id}">
              <div class="container-left">
                  <div class="img"><img src="../assets/img/img-product/${image}" alt=""></div>
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
