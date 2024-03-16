// parallax effect
const about = document.querySelector('.about');
const twoImageWrappet = document.querySelector('.two-image-wrapper');
const article = document.querySelector('.description-brand');
window.addEventListener('scroll' , function () {
    let scroll = window.scrollY;
    // parallax-->header
    about.previousElementSibling.firstElementChild.firstElementChild.style.transform = `translateY(${0 + (scroll* 0.1)}px)`;
    about.previousElementSibling.firstElementChild.lastElementChild.style.transform = `translateY(${0 + (scroll* 0.1)}px)`;
    about.previousElementSibling.lastElementChild.style.transform = `scale(${1 + (scroll*0.0002)})`;
    // parallax-->about
    about.firstElementChild.firstElementChild.style.transform = `translateY(${140 + (scroll* -0.18)}px)`;
    about.firstElementChild.lastElementChild.style.transform = `translateY(${50 + (scroll* -0.05)}px)`;
    // parallax-->two-image-wrapper
    if(scroll >= twoImageWrappet.offsetTop - window.innerHeight){
        twoImageWrappet.firstElementChild.firstElementChild.classList.add('parallax');
        twoImageWrappet.lastElementChild.lastElementChild.classList.add('parallax');
    }
    else{
        twoImageWrappet.firstElementChild.firstElementChild.classList.remove('parallax');
        twoImageWrappet.lastElementChild.lastElementChild.classList.remove('parallax');
    };
    // parallax-->article
    if(scroll >= article.offsetTop - window.innerHeight){
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

// initial import modules
import {getDataProduct, card, showDetailModal, increment, showFlashMsg, calculation} from "../modules/module.js"

// show product card
const showRecommendation = async function(){
    try{
        const products = await getDataProduct();
        showUICard(products);
    } catch(err) {
        const recommendation = document.querySelector('.scroll-horizontal');
        recommendation.innerHTML = (err);
    };
};
showRecommendation();

function showUICard(products){
    let cards = '';
    products.filter(p => p.recommendation === true).forEach(p => {
        let { id, title, type, price, image } = p;
        cards += card(id, title, type, price, image);
        const containerRecommendation = document.querySelector('.recommendation .container');
        containerRecommendation.innerHTML = cards;
    });
};

// calculation items in widget and display
calculation(cart);

// event listener for modal when card clicked
document.addEventListener('click', async function(e) {
    let cardClicked = e.target.closest('.card');
    if (cardClicked) {
        try{
            const products = await getDataProduct();
            showDetailModal(products , cardClicked);
        } catch(err) {
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
document.addEventListener('click', function(e) {
    if (e.target.closest('.close-btn-pop-up')) {
        const modalBody = document.querySelector('.container-modal');
        modalBody.innerHTML = ""
        document.querySelector('body').classList.remove('stop')
    }
})

// loading
window.addEventListener('load', () => {
    document.querySelector('.container-loader').classList.remove('active');
});
