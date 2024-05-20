// get data from localstorage
let cart = JSON.parse(localStorage.getItem("data-cart")) || [];

// func render to html
const cardProducts = async () => {
  try {
    const products = await getDataProduct();
    showUICard(products);
  } catch (err) {
    const containerCard = document.querySelector(".container");
    containerCard.innerHTML = err;
  }
};
cardProducts();

// func to generate UI
const showUICard = (products) => {
  let cards = "";
  products.forEach((product) => {
    const { id, title, type, price, description, image } = product;
    cards += card(id, title, type, price, description, image);
    const containerCard = document.querySelector(".container");
    containerCard.innerHTML = cards;
  });
};

// func add to cart and call at button add to cart --> onclick('id')
function addToCart(id) {
  // Find the item in the cart with the same ID
  const search = cart.find((x) => x.id === id);
  if (search === undefined) {
    // adding new items when items do not exist
    cart.unshift({
      id: id,
      quantity: 1,
    });
  } else {
    // Increment the quantity of the existing item
    search.quantity++;
  }
  calculation(cart);
  localStorage.setItem("data-cart", JSON.stringify(cart));
}

//  func to calculate item at cart and render to badge
function calculation(cart) {
  const cartIcon = document.querySelector(".cart-nav");
  if (cart.length !== 0) {
    cartIcon.classList.remove("d-none");
    cartIcon.innerHTML = cart.map((x) => x.quantity).reduce((x, y) => x + y, 0);
  }
}
calculation(cart);

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
function card(id, title, type, price, description, image) {
  return `<div class="card">
            <img src="img-products/${image}" class="card-img-top" alt="image-products">
            <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${type}</p>
            <h6 class="card-title">${rupiah.format(price)}</h6>
            <button type="button" class="btn btn-primary d-flex justify-content-center align-items-center" onclick=addToCart('${id}')>
            Add to Cart
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart ms-2" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            </button>
            </div>
        </div>`;
}
