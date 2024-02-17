const menuList = document.querySelector('nav .menu');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', function(){
    menuToggle.firstElementChild.classList.toggle('slide');
    menuToggle.lastElementChild.classList.toggle('slide');
    menuToggle.firstElementChild.nextElementSibling.classList.toggle('slide');
    menuList.classList.toggle('slide');
    document.querySelector('body').classList.toggle('stop');
});

// search
const search = document.querySelector('.search_input');
search.addEventListener('keypress' , function(e) {
    if(e.keyCode == 13){
        // if(search.value !== ""){
            fetch('assets/data/product.json')
            .then(response => response.json())
            .then(response => {
                let product = response.product
                product.forEach(s => {
                    if(search.value === s.title){
                        alert(s.title);
                        // console.log('yes');
                    }else if(search.value !== s.title) {
                        console.log('wrong');
                    };
                });
            });
        // }else{
        //     alert('empty')
        // }
    };
});
