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

// func show modal
function showDetailModal(products , cardClicked){
  let productDetails = '';
  const currentCard = products.find(product => product.id === cardClicked.dataset.idcard)
  let { id, title, type, price, description, image } = currentCard;
  productDetails = productDetail(id, title, type, price, description, image);
  const modalBody = document.querySelector('.container-modal');
  modalBody.innerHTML = productDetails;
  document.querySelector('body').classList.add('stop')
};

function increment(cart, el) {
  let selectedItem = el;
  let size = document.querySelector('#size').value;
  // Find the item in the cart with the same ID and size
  let search = cart.find((x) => x.id === selectedItem.id && x.size === size);
  if (search === undefined) {
    if (size === 'undefined') {
      return false
    } else {
      cart.unshift({
        id: selectedItem.id,
        size: size,
        item: 1,
      });
    }
  } else {
    // Increment the quantity of the existing item
    search.item++;
  }
  calculation(cart);
  localStorage.setItem("data", JSON.stringify(cart));
};

const showFlashMsg = async function(el){
  try{
      let clicked = el;
      const products = await getDataProduct();
      showUIFlashMsg(products , clicked);
  } catch(err) {
      const containerFlashMsg = document.querySelector('.container-flash-msg');
      containerFlashMsg.innerHTML = `<div class="flash-msg">${err}</div>`
  };
}

function showUIFlashMsg (products, clicked){
  let productFlashMsg = '';
  const filtered = products.find(x => x.id === clicked.parentElement.parentElement.dataset.idmodal);
  const size = clicked.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.nextElementSibling.value
  const containerFlashMsg = document.querySelector('.container-flash-msg');
  productFlashMsg = flashMsg(filtered.title, size)
  containerFlashMsg.innerHTML = productFlashMsg;
  const myTimeout = setTimeout(stopFlashMsg, 4000);
  function stopFlashMsg(){
    containerFlashMsg.innerHTML = '';
  }
}

function flashMsg(title, size){
  if (size === 'undefined') {
    return `<div class="flash-msg">Please select size</div>`
  } else {
    return `<div class="flash-msg">${title} size ${size} success add to cart</div>`
  }
}

let calculation = (cart) => {
    const cartIcon = document.querySelector(".amountCart");
    if(cart.length !== 0){
      cartIcon.style.display = "inline-block"
      cartIcon.innerHTML = cart.map((x) => x.item).reduce((x, y) => x + y, 0);
    } else{
      cartIcon.style.display = "none"
    };
};

let rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits : 0 ,
});

function card(id, title, type, price, image){
  return ` <div class="card card-recommendation" data-idcard="${id}">
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
                          <label for="size">Size</label>
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
                  <button id="${id}" class="add-cart">Add to Cart</button>
                  <p class="modal-description">${description}</p>
                  <div class="close-btn-pop-up">
                      <span></span>
                      <span></span>
                  </div>
              </div>
          </div>`
};


export {getDataProduct, card, showDetailModal, increment, showFlashMsg, calculation}
