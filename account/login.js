let cart = JSON.parse(localStorage.getItem("data")) || [];
let calculation = () => {
    const cartIcon = document.querySelector(".amountCart");
    if(cart.length !== 0){
      cartIcon.style.display = "inline-block"
      cartIcon.innerHTML = cart.map((x) => x.item).reduce((x, y) => x + y, 0);
    } else{
      cartIcon.style.display = "none"
    };
};
calculation()