//  get data from local storage
let cart = JSON.parse(localStorage.getItem("data-cart")) || [];

// func render to html
const cartItems = async () => {
  try {
    const products = await getDataProduct();
    showUICard(products);
  } catch (err) {
    const containerCard = document.querySelector(".container");
    containerCard.innerHTML = err;
  }
};
cartItems();

// func to generate UI
const showUICard = (products) => {
  if (cart.length === 0) {
    const bodyCart = document.querySelector("body");
    bodyCart.innerHTML = "";
    bodyCart.innerHTML = `
    <div class="container position-absolute top-50 start-50 translate-middle text-center">
    <h4 class="cart-empty">
    Cart is Empty
    <a href="index.html" class="btn btn-primary ms-1">Back</a>
    </h4>
    </div>
    `;
  }
  let cardsAtCart = "";
  cart.forEach((p) => {
    const filterDataCart = products.find((product) => product.id === p.id);
    const { id, title, type, price, description, image } = filterDataCart;
    cardsAtCart += card(id, title, type, price, description, image, p.quantity);
    const containerCard = document.querySelector(".container-card");
    containerCard.innerHTML = cardsAtCart;
  });
};

// func to increment product and call at button increment --> onclick('id')
function increment(id) {
  const search = cart.find((product) => product.id === id);
  search.quantity++;
  cartItems();
  totalAmount();
  localStorage.setItem("data-cart", JSON.stringify(cart));
}

// func to decrement product and call at button decrement --> onclick('id')
function decrement(id) {
  const search = cart.find((product) => product.id === id);
  if (search === undefined) return;
  else if (search.quantity === 0) return;
  else {
    search.quantity--;
  }
  cartItems();
  totalAmount();
  cart = cart.filter((product) => product.quantity !== 0);
  localStorage.setItem("data-cart", JSON.stringify(cart));
}

// func to remove product and call at button remove --> onclick('id')
function removeItem(id) {
  cart = cart.filter((product) => product.id !== id);
  cartItems();
  totalAmount();
  localStorage.setItem("data-cart", JSON.stringify(cart));
}

// func render to html
const totalAmount = async function () {
  try {
    const product = await getDataProduct();
    showUITotalAmount(product);
  } catch (err) {
    const listCart = document.querySelector(".list-product");
    listCart.innerHTML = err;
  }
};
totalAmount();

// func to generate UI and total price all products
function showUITotalAmount(product) {
  if (cart.length !== 0) {
    const amount = cart
      .map((x) => {
        let { id, quantity } = x;
        let filterData = product.find((x) => x.id === id);
        return filterData.price * quantity;
      })
      .reduce((x, y) => x + y, 0);
    return (document.querySelector(".card-total-ammount").innerHTML = `
      <p class="p-3">Total price all items : ${rupiah.format(amount)}</p>
      `);
  }
}

// fetch data json
function getDataProduct() {
  return fetch("data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.product;
    });
}

// Format a Number as Currency
let rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

// UI card products
function card(id, title, type, price, description, image, quantity) {
  return `<div class="card position-relative">
            <img src="img-products/${image}" class="card-img-top" alt="image-products">
            <p class="position-absolute top-0 end-0 mt-2 me-2">${rupiah.format(
              price * quantity
            )}</p>
            <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-title">${type}</p>
            <h6 class="card-title">${rupiah.format(price)}</h6>
            <div class="d-flex gap-3 align-items-center">
              <button type="button" class="btn d-flex justify-content-center align-items-center p-2" onclick=decrement('${id}')>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                </svg>
              </button>
              <span>${quantity}</span>
              <button type="button" class="btn d-flex justify-content-center align-items-center p-2" onclick=increment('${id}')>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
              </button>
            </div>
            </div>
            <button type="button" class="btn position-absolute bottom-0 end-0 mb-3 me-2" onclick=removeItem('${id}')>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
        </div>`;
}
