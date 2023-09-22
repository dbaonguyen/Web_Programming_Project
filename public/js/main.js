(function($) {
    "use strict";
    
    
    /* jQuery MeanMenu */
    $('#mobile-menu-active').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: ".mobile-menu-area .mobile-menu",
    });
    
    /*--
    One Page Nav
    -----------------------------------*/
    var top_offset = $('.header-area').height() - -60;
    $('.hamburger-menu nav ul').onePageNav({
        currentClass: 'active',
        scrollOffset: top_offset,
    });
    
    
    /*--- clickable menu active ----*/
    const slinky = $('#menu').slinky()
    /*====== sidebarmenu ======*/
    function sidebarMainmenu() {
        var menuTrigger = $('.clickable-mainmenu-active'),
            endTrigger = $('button.clickable-mainmenu-close'),
            container = $('.clickable-mainmenu');
        menuTrigger.on('click', function(e) {
            e.preventDefault();
            container.addClass('inside');
        });
        endTrigger.on('click', function() {
            container.removeClass('inside');
        });
    };
    sidebarMainmenu();
    
    
    /* slider active */
    $('.slider-active').owlCarousel({
        loop: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.slider-active-2').owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<img src="assets/img/icon-img/57.png"> next', 'prev <img src="assets/img/icon-img/58.png">'],
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
   
    
    
    
    
    /* book list active */
    $('.book-list-active').owlCarousel({
        loop: true,
        nav: true,
        item: 2,
        margin: 40,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 2
            }
        }
    })
    
    
    
    
    
    
   
    
    
    /* popular-product-active active */
    $('.popular-product-active').owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 5000,
        item: 4,
        margin: 57,
        navText: ['<img src="assets/img/icon-img/left.png">', '<img src="assets/img/icon-img/right.png">'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })
    
    
    /* popular-product-active-2 active */
    $('.popular-product-active-2').owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 5000,
        item: 4,
        margin: 22,
        navText: ['<img src="assets/img/icon-img/left.png">', '<img src="assets/img/icon-img/right.png">'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })
    
    
    /* trandy-product-active active */
    $('.trandy-product-active').owlCarousel({
        loop: true,
        nav: false,
        autoplay: false,
        autoplayTimeout: 5000,
        item: 4,
        margin: 30,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })
    
    
    /* feadback-silder-active active */
    $('.feadback-silder-active').owlCarousel({
        loop: true,
        nav: false,
        autoplay: false,
        autoplayTimeout: 5000,
        item: 3,
        margin: 50,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1000: {
                items: 3
            },
            1200: {
                items: 3
            }
        }
    })
    
    
    /*category left menu*/
    $('.category-heading-2').on('click', function() {
        $('.category-menu-list').slideToggle(300);
    });
    
    
    /*--
    menu-toggle
    ------------------------*/
    $('.menu-toggle').on('click', function() {
        if ($('.menu-toggle').hasClass('is-active')) {
            $('.hamburger-menu nav').removeClass('menu-open');
        } else {
            $('.hamburger-menu nav').addClass('menu-open');
        }
    });
    
    
    /*--
    	Hamburger js
    -----------------------------------*/
    var forEach = function(t, o, r) {
        if ("[object Object]" === Object.prototype.toString.call(t))
            for (var c in t) Object.prototype.hasOwnProperty.call(t, c) && o.call(r, t[c], c, t);
        else
            for (var e = 0, l = t.length; l > e; e++) o.call(r, t[e], e, t)
    };
    
    var hamburgers = document.querySelectorAll(".hamburger");
    if (hamburgers.length > 0) {
        forEach(hamburgers, function(hamburger) {
            hamburger.addEventListener("click", function() {
                this.classList.toggle("is-active");
            }, false);
        });
    }
    
    
    
    
    
    
    
    
    /*--- showlogin toggle function ----*/
    $('#showlogin').on('click', function() {
        $('#checkout-login').slideToggle(900);
    });
    
    /*--- showlogin toggle function ----*/
    $('#showcoupon').on('click', function() {
        $('#checkout_coupon').slideToggle(900);
    });
    
    /*--- showlogin toggle function ----*/
    $('#ship-box').on('click', function() {
        $('#ship-box-info').slideToggle(1000);
    });
    
   
    
    
    /*---------------------
    sidebar sticky
    --------------------- */
    $('.sidebar-active').stickySidebar({
        topSpacing: 80,
        bottomSpacing: 30,
        minWidth: 991,
    });
    
    $('.sidebar-active1').stickySidebar({
        topSpacing: 80,
        bottomSpacing: 30,
        minWidth: 991,
    });
    
    $('.sidebar-active3').stickySidebar({
        topSpacing: 80,
        bottomSpacing: 30,
        minWidth: 991,
    });
    
    /* isotop active */
    // filter items on button click
    $('.blog-mesonry').imagesLoaded(function() {
        // init Isotope
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid-item',
            }
        });
    });
    
    $('.notification-close button').on('click', function() {
        $('.notification-section').slideUp();
    });
    
    
    /*----------------------------
    	Cart Plus Minus Button
    ------------------------------ */
    $(".cart-plus-minus").prepend('<div class="dec qtybutton">-</div>');
    $(".cart-plus-minus").append('<div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function() {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find("input").val(newVal);
    });
    
    /*---------------------
    price slider
    --------------------- */
    var sliderrange = $('#slider-range');
    var amountprice = $('#amount');
    $(function() {
        sliderrange.slider({
            range: true,
            min: 20,
            max: 100,
            values: [0, 100],
            slide: function(event, ui) {
                amountprice.val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        amountprice.val("$" + sliderrange.slider("values", 0) +
            " - $" + sliderrange.slider("values", 1));
    });
    
    /*--------------------------
        09. ScrollUp
    ---------------------------- */
    $.scrollUp({
        scrollText: '<i class="ti-arrow-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });
    
    
    
    /*---------------------
    countdown
  --------------------- */
    $('[data-countdown]').each(function() {
		var $this = $(this), finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function(event) {
		$this.html(event.strftime('<span class="cdown day">%-D <p>Days</p></span> <span class="cdown hour">%-H <p>Hour</p></span> <span class="cdown minutes">%M <p>Min</p></span class="cdown second"> <span>%S <p>Sec</p></span>'));
		});
    });
    
    /*------ Wow Active ----*/
    new WOW().init();
    
    /*--
	Header Search Toggle
    -----------------------------------*/
    var searchToggle = $('.search-toggle');
    searchToggle.on('click', function(){
        if($(this).hasClass('open')){
           $(this).removeClass('open');
           $(this).siblings('.handicraft-content').removeClass('open');
        }else{
           $(this).addClass('open');
           $(this).siblings('.handicraft-content').addClass('open');
        }
    })
    
    



})(jQuery);

//Product alert
$("#add-product").submit(function(event){
    alert("Data Inserted Successfully!")
});

$("#update-product").submit(function (event) {
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {};

    $.map(unindexed_array, function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data);

    var request = {
        "url": `http://localhost:3000/api/products/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })
});

if(window.location.pathname == "/vendor"){
    $ondelete = $("a.delete");
    $ondelete.click(function(){
        console.log("Delete button clicked");
        var id = $(this).attr("data-id")
        console.log("Product ID:", id);
        var request = {
            "url" : `http://localhost:3000/api/products/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}