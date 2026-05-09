/*  避免監聽事件 */
jQuery.event.special.touchstart = {
    setup: function (_, ns, handle) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function (_, ns, handle) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.wheel = {
    setup: function (_, ns, handle) {
        this.addEventListener("wheel", handle, { passive: true });
    }
};
jQuery.event.special.mousewheel = {
    setup: function (_, ns, handle) {
        this.addEventListener("mousewheel", handle, { passive: true });
    }
};

/*  避免監聽事件 */


var rootUrl = $("#ctl00_initValue_HiddenFieldUrl").val();


$(document).ready(function () {

    $("body").addClass(nation_class);
    $("body").addClass(scroll_ani_class);

    $(".header .nav-big-wrapper").addClass(logo_class);

    if (Modernizr.touch) {
        $("body").addClass("is_touch");
    }

    //判斷 content 
    if ($("main .side").is(':empty') && $("main .content").is(':empty')) $("main").remove();

    //for editor
    $(".editor table.scroll").wrap("<div class='table-responsive'></div>");


    if ($("body.home.preview .navbar.bsnav-left .navbar-brand img").length > 0) {
        $("body.home.preview .navbar.bsnav-left .navbar-brand").css("background", "none");
    }

    /*$(".editor iframe[src*='youtube']").each(function (e) {
        if (!$(this).hasClass("embed-responsive-item")) {
            var w = ($(this).attr("width")) ? $(this).attr("width") : "",
                u = (w && w.search(/px|%/) === -1) ? "px" : "";
            $(this)
                .removeAttr("height")
                .removeAttr("width")
                .addClass("embed-responsive-item")
                .attr("allowfullscreen", "1")
                .wrap("<div class='youtube_wrap' style='max-width:" + w + u + ";margin:auto;'><div class='embed-responsive embed-responsive-16by9' style='width:100%;'></div></div>");
        }
    });*/

    $(window).scroll(function (e) {
        var win_h = $(window).scrollTop();
        var win_w = $(window).width();
        (win_h > 10) ? $("body").addClass("is_scroll") : $("body").removeClass("is_scroll");

    });

    $('.btn-floating').click(function (e) {
        e.preventDefault();
        $('.wid-float-section').toggleClass("open");
    });

    //節慶主題
    $(".header .wrp-deco.avatar").addClass(avatar_class);

    //floating
    var fixedBox = $(".wid-float-section");
    var bodyObj = $("body");
    //var fixedBox = $("body");
    if (fixedBox.length > 0 || $(".scrolldownHeader").length > 0) {
        pushFixedHeight(fixedBox);
        $(window).resize(function () {
            pushFixedHeight(fixedBox);
        });


        var senseSpeed = 5;
        var previousScroll = 0;
        var detectLast = fixedBox.outerHeight();
        $(window).scroll(function (event) {
            var scroller = $(this).scrollTop();
            if (scroller - senseSpeed > previousScroll) {
                bodyObj.addClass("scroll-down");
                if ($(".floating_circle").length > 0) { $('.floating_circle #fmenu-open').prop('checked', false); }

                //console.log("Down");

            } else if (scroller + senseSpeed < previousScroll) {
                
                bodyObj.removeClass("scroll-down");
                //console.log("Up");
            }
            previousScroll = scroller;


            if ((scroller + $(window).height() + 10) > ($(document).height() - detectLast)) {
                    bodyObj.removeClass("scroll-down");
                    bodyObj.addClass("scroll-to-bottom");
                } else {
                    bodyObj.removeClass("scroll-to-bottom");
                }
        });
    }


    //側選單的開合按鈕
    $('.side-toggle').click(function (e) {
        e.preventDefault();
        $('.side1').toggleClass("menu-open");
    });

    //side has subnav
    if ($(".side .filter-sidebar").length <= 0) {
        $(".side .function-bar").addClass("d-none")
    }

    //gotop Animate
    if ($(".footer .gotop").length > 0) {
        $(".footer .gotop .top_btn a").click(function (e) {
            e.preventDefault();
            $("html,body").animate({ scrollTop: 0 }, "fast");
            //return false;
        });
    }
    if ($(".floating_circle .fcgotop").length > 0) {
        $(".floating_circle .fcgotop").click(function (e) {
            $("html,body").animate({ scrollTop: 0, behavior: 'auto' }, 600);
            $('.floating_circle #fmenu-open').prop('checked', false);
            return false;
        });

    }

    //onepage
    $("a[data-op=Y]").attr("href", "javascript:void(0);");
    



    //banner
    if ($('.banner .slick').length > 0) {

        //$('.banner .slick').slick({
        //    dots: false,
        //    infinite: true,
        //    autoplaySpeed: 2000,
        //    fade: true,
        //    cssEase: 'linear',
        //    autoplay: true
        //});

    }

    //logo置中，往下滑消失
    if ($(".bsnav-brand-center-wrapper").length > 0) {
        var brandH = $(".header .navbar .navbar-brand").outerHeight() + parseInt($('.header .navbar .navbar-brand').css('margin-top'), 10) * 2;
        $(".bsnav-brand-center-wrapper").css("height", brandH);
        //$(window).resize(function () {
        //    var brandH_rwd = $(".header .navbar .navbar-brand").outerHeight() + parseInt($('.header .navbar .navbar-brand').css('margin-top'), 10) * 2;
        //    $(".bsnav-brand-center-wrapper").css("height", brandH_rwd);
        //});
    }

    //fixedTop
    if ($(".banner:not(.banner_trigger) .banner-top").length > 0) {
        //$(".banner").css("padding-top", $(".header .navbar").outerHeight());
        pushHeaderFixedHeight($(".header .navbar"));
        $(window).resize(function () {
            //var resizeH = $(".header .navbar").outerHeight();
            //$(".banner").css("padding-top", resizeH);

            pushHeaderFixedHeight($(".header .navbar"));
        });
    }

    if ($(".banner:not(.banner_trigger) .banner-mob-bg").length > 0) {

        $(".banner:not(.banner_trigger) .item").each(function () {
            var iimg = $(this).children(".banner-pic").find(".img-small").attr("src");
            $(this).css("background-image", "url(" + iimg + ")");
        });


        //if ($(window).width() <= 991) {
            
        //}
        //$(window).resize(function () {
        //    if ($(window).width() <= 991) {
        //        $(".banner .item").each(function () {
        //            var iimg = $(this).children(".banner-pic").find(".img-small").attr("src");
        //            $(this).css("background-image", "url(" + iimg + ")");
        //        });
        //    }
        //});
    }
    if ($(".banner:not(.banner_trigger) .banner-full").length > 0) {

        ieFixImg($(".banner:not(.banner_trigger) .banner-full .item"));

        $("body").addClass("header-animation");
    }

    if ($(".header.scrolldownHeader").length > 0) {
        $("body").addClass("header-animation");
    }


    
    


    //bsnav
    $(".bsnav .navbar-toggler").click(function () {


        if ($(".bsnavclose.close-btn").length > 0 && $(".bsnav-mobile").hasClass("full") || $(".bsnav-mobile").hasClass("down")) {
            if ($(".bsnavclose.close-btn").hasClass("active")) {
                $(".bsnavclose.close-btn").removeClass("active");
            } else {
                $(".bsnavclose.close-btn").addClass("active");
            }
            
        }

        $(".bsnav-mobile .navbar-nav.navbar-mobile > .nav-item > .nav-link").click(function () {
            $(".bsnav-mobile .navbar-nav.navbar-mobile > .nav-item > .nav-link").not(this).parent("li").removeClass("in");
            $(".bsnav-mobile .navbar-nav.navbar-mobile > .nav-item > .nav-link").not(this).next("ul").slideUp();
          
        });

        //if ($(".bsnav-addToMobile").length > 0) {

        //    $(".bsnav-addToMobile > ul").clone().appendTo(".bsnav-mobile > .navbar");

        //    if ($(".bsnav-mobile .dropdown").length > 0) {
        //        $(".bsnav-mobile li").removeClass("dropdown");
        //        $(".bsnav-mobile ul").removeClass("dropdown-menu");
        //        $(".bsnav-mobile a").removeClass("dropdown-toggle");
        //        $(".bsnav-mobile a").removeClass("dropdown-item");
        //        $(".bsnav-mobile a").removeAttr("data-toggle");
        //        $(".bsnav-mobile a").removeAttr("aria-haspopup");
        //        $(".bsnav-mobile a").removeAttr("aria-expanded");
        //    }
        //}

        return false;
    });


    


    //手機選單關閉按鈕 
    if ($(".bsnavclose.close-btn").length > 0) {
        $(".bsnavclose.close-btn").click(function () {
            $(".bsnav-mobile").removeClass("in");
            $(".bsnav .navbar-toggler").removeClass("active");
            $(this).removeClass("active");
        });
        $(window).resize(function () {
            // if ($(".bsnavclose.close-btn").hasClass("active")) {
            //     $(".bsnavclose.close-btn").removeClass("active")
            // }
        });
    }

    //滑動顯示選單 改 點擊顯示選單
    if (openHover == "False") {
        $('.navbar-collapse > .navbar-nav').addClass("noHover");
        $('.navbar-nav .nav-item').unbind('mouseenter mouseleave');
        //$('.navbar-nav .nav-item').click(function () {

        //    $(this).children(".navbar-nav").toggleClass("in");
        //});

        //點外層關閉下拉選單
        $(document).mouseup(function (e) {
            var container = $(".header .navbar-nav .nav-link");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                //container.hide();
                $(".nav-item.dropdown").removeClass("openMenu");
                $(".nav-item.dropdown .navbar-nav.in").removeClass("in");
            }
        });

        $(".navbar-collapse > .navbar-nav > .nav-item").each(function () {
            if ($(this).children("ul").length > 0) {
                $(this).children("a").removeAttr("href");
                if ($(this).children("ul").children("li").children("ul").length > 0) {
                    $(this).children("ul").children("li").children("a").removeAttr("href");
                }
            }
        });
        //第一層
        $(".navbar-collapse > .navbar-nav > .nav-item > a").click(function () {
            if ($(this).parents(".nav-item").children(".navbar-nav").length > 0) {
                $(".navbar-collapse > .navbar-nav > .nav-item > a").not(this).parent("li").removeClass("openMenu");
                $(".navbar-collapse > .navbar-nav > .nav-item > a").not(this).parent("li").find("ul").removeClass("in");
                if ($(this).parents(".nav-item").hasClass("openMenu")) {
                    $(this).parents(".nav-item").removeClass("openMenu");
                    $(this).parents(".nav-item").children(".navbar-nav").removeClass("in");
                } else {
                    $(this).parents(".nav-item").addClass("openMenu");
                    $(this).parents(".nav-item").children(".navbar-nav").addClass("in");
                }
            }
        });

        //第二層
        $(".navbar-collapse > .navbar-nav > .nav-item > .navbar-nav > li > a").click(function () {
            if ($(this).parent("li").children("ul").length > 0) {
                $(".navbar-collapse > .navbar-nav > .nav-item > .navbar-nav > li > a").not(this).parent("li").children("ul").removeClass("in");
                if ($(this).parent("li").children("ul").hasClass("in")) {
                    //$(this).parent("li").removeClass("openMenu");
                    $(this).parent("li").children("ul").removeClass("in");
                } else {
                    //$(this).parent("li").addClass("openMenu");
                    $(this).parent("li").children("ul").addClass("in");
                }
            }
        });

        
    }


    //搜尋按鈕
    if ($(".header .search-area").length > 0) {

        if ($(".nav-search-box").hasClass("slide-down-st")) {
            var header_oh = $(".header > .navbar").outerHeight();
            $(".header .search-area").css("top", "auto");
            if ($(window).width() < 768) {
                $(".header .search-area").css("top", header_oh);
            }
            $(window).resize(function () {
                var header_mob_oh = $(".header > .navbar").outerHeight();
                $(".header .search-area").css("top", "auto");
                if ($(window).width() < 768) {
                    $(".header .search-area").css("top", header_mob_oh);
                }
            });
        }

        $(".header nav .btn-search").click(function (e) {
            e.preventDefault();
            if ($(".nav-search-box").hasClass("slide-down-st")) {
                $(".header .search-area").slideToggle();
            } else if ($(".nav-search-box").hasClass("full-st")) {
                $(this).toggleClass("active full-active");
                $(".nav-search-box").toggleClass("active");
            }

        });

    }

    //購物車按鈕
    if ($(".nav-cart-info").length > 0) {

        var drop_cart_h = $(".header .nav-cart-info .cart-drop-box").parents(".small-btn-box").outerHeight();
        $(".header .nav-cart-info .cart-drop-box .nav-cart-list").css("top", drop_cart_h);


        if ($(window).width() < 768) {
            $(".header .nav-cart-info .cart-drop-box .nav-cart-list").css("top", "100%");
            $(".nav-cart-info-btn").click(function (e) {
                e.preventDefault();
                $(this).parents("li").toggleClass("open");
            });
        }
        //$(window).resize(function () {
        //    var drop_cart_h = $(".header .nav-cart-info .cart-drop-box").parents(".small-btn-box").outerHeight();
        //    $(".header .nav-cart-info .cart-drop-box .nav-cart-list").css("top", drop_cart_h);
        //    if ($(window).width() < 768) {
        //        $(".header .nav-cart-info .cart-drop-box .nav-cart-list").css("top", "100%");
        //        $(".nav-cart-info-btn").click(function (e) {
        //            e.preventDefault();
        //            $(this).parents("li").toggleClass("open");
        //        });
        //    }
        //});
    }


    

    //scroll to fixed
    if ($("nav").hasClass("scrollToFixed")) {
        let topDis = ($(".top_marquee").length > 0) ? $(".top_marquee").outerHeight():0;
        
        $(".navbar.scrollToFixed").scrollToFixed({
            marginTop: topDis,
        });
    }

    //isotope
    //initIsotope();
    if ($(".iso-sec:not(.removeIsoTope)").length > 0) {
        var $grid = $('.iso-area .grid.grid-normal');
        var options = {
            itemSelector: '.grid-normal .grid-item',
            filter: '*',
            percentPosition: true
        }
        if ($('.iso-area .grid.grid-normal .priceAmount').length > 0) {
            options = {
                itemSelector: '.grid-normal .grid-item',
                filter: '*',
                percentPosition: true,
                getSortData: {
                    priceAmount: function (itemElem) {
                        var priceamount = $(itemElem).attr('data-priceAmount');
                        return parseInt(priceamount);
                    }
                }
            }
        }
        
        $grid.isotope(options);


        //masonry
        //var $gridmasonry = $('.iso-area .grid.grid-masonry');
        //$gridmasonry.isotope({
        //    itemSelector: '.grid-masonry .grid-item',
        //    filter: '*',
        //    percentPosition: true,
        //    masonry: {
        //        //columnWidth: '.grid-sizer'
        //    }
        //});


        $('.iso-kind a').click(function () {
            var selector = $(this).attr('data-filter');
            var $isoSelf = $(this).parents(".iso-sec").children(".iso-area").children(".grid");
            $isoSelf.isotope({ filter: selector });

            $(".iso-kind ul li a").not(this).parent("li").removeClass("active");
            $(this).parent("li").addClass("active");

            return false;
        });


        if ($(".function-bar .sort-area").length > 0) {

            $(".function-bar .sort-area .dropdown-menu a").click(function (e) {

                e.preventDefault();

                var sortValue = $(this).attr('data-sort-value');
                var direction = $(this).attr('data-sort-direction');

                var isAscending = (direction === 'asc');
                var newDirection = (isAscending) ? 'desc' : 'asc';

                $grid.isotope({ sortBy: sortValue, sortAscending: isAscending });

                //$(this).attr('data-sort-direction', newDirection);

            });

            
        }


    }


    //datetimepicker
    if ($(".datetimepicker").length > 0) {
        $(".datetimepicker").bootstrapMaterialDatePicker({
            weekStart: 0,
            time: false,
            lang: 'zh-tw'
        });
    }

   


    //fancybox
    if ($('.btn-fancy').length > 0) {
        $('.btn-fancy').fancybox();
    }

    //banner trigger
    if ($(".banner_trigger").length > 0) {

        $("body").addClass("btrigger");

        $(".bannertrigger-btn").trigger("click");

        fixedSlick(".banner_trigger .slick");

    }

    //swiper

    //new Swiper('.kv__slider', {
    //    speed: 2000,
    //    loop: true,
    //    autoplay: {
    //        delay: 2000,
    //        disableOnInteraction: false,
    //    },
    //    effect: 'fade',
    //    fadeEffect: {
    //        crossFade: true
    //    },
    //});


    //$(window).scroll(function () {
    //    scroll_Fade_Logo();
    //    scroll_Fade_body();
    //});

    if ($('.swiper-container').length > 0) {
        //initSwipper(".banner_006 .swiper-container",true,8000);
        //(obj, autoplayMode, autoplaySpeedMode, id = "")


        
    }


    //slick
    if ($(".slick-mode").length > 0) {
        if ($('.news-sec .multiple-slick').length > 0) {
           // runNewsSlick();
        }
        if ($('.link-sec .multiple-slick').length > 0) {
            //runlinkSlick();
        }
        
    }

    

    //if ($(".flatPicker").length > 0) {
    //    flatpickr(".flatPicker", {
    //        "locale": "zh"
    //    });
    //    //$(".flatPicker").flatpickr({
    //    //    enableTime: true,
    //    //    dateFormat: "Y-m-d H:i"
    //    //});
    //}

    var nav = animateTime = 500

    //filter-sidebar
    if ($(".function-bar .filter-btn-area").length > 0) {
        $(".function-bar .filter-btn-area .btn").click(function (e) {
            e.preventDefault();
            $(".side.filter-side").toggleClass("open");

            if ($(window).width() < 768) {
                $(".side.filter-side .filter-sidebar").slideToggle();
            }
        });

        //$(window).resize(function () {
        //    if ($(window).width() < 768) {
        //        $(".side.filter-side").slideToggle();
        //    }
        //});

        $(".side .filter-title .collapsed-btn").each(function () {
            if ($(this).next("ul").length > 0) {

            } else {
                $(this).removeAttr("data-toggle");
            }
        });

    }

    //側選單單層收合
    if ($(".side .filter-title .collapsed-btn").length > 0 && $(".filter-sidebar.accordion.accordion-blocks.one-accordion").length > 0) {

        $(".side .filter-title .collapsed-btn").each(function (index, element) {
            
            var filterCont = $(this).parents(".filter-item").find(".filter-content");
            if (filterCont.length > 0) {
                var originNum = $(this).data("num");
                $(this).attr("data-toggle", "collapse");
                $(this).attr("aria-expanded", "true");
                $(this).attr("aria-controls", "collapse_" + originNum);
                $(this).attr("href", "#collapse_" + originNum);
                $(this).addClass("dropdown-toggle");
                filterCont.attr("id", "collapse_" + originNum);
                filterCont.removeClass("show");

            }
            //if (index > 0) { filterCont.removeClass("show"); }
        });   
    }

    //main 側選單收合
    if ($(".side .wid-collapse-onesub").length > 0) {
        $(".side .wid-collapse-onesub .collapsed-btn").each(function (index, element) {
            var filterCont = $(this).parents(".filter-item").find(".filter-content");
            if (filterCont.length > 0) {
                var originNum = $(this).data("num");
                $(this).attr("data-bs-toggle", "collapse");
                $(this).attr("aria-expanded", "true");
                $(this).attr("aria-controls", "collapse_" + originNum);
                $(this).attr("href", "#collapse_" + originNum);
                $(this).addClass("dropdown-toggle");
                filterCont.attr("id", "collapse_" + originNum);
                filterCont.removeClass("show");
            }
        });
    }


    //側選單收合
    multiSideMenu(true);

    //側選單checkbox
    if ($(".wid.wid-check-filter").length > 0) {
        checkStatus();
    }


    //選單固定
    if ($(".section .anchor-title").length > 0) {
        exeScrollToFixed();
    }

    if ($(".navbar .anchor-title").length > 0) {
        if (typeof (getUrlVars()["anchor"]) !== "undefined") {
            if (getUrlVars()["anchor"].length > 0) {
                var currLink = $(".navbar .anchor-title a[data-anchortitle='" + getUrlVars()["anchor"] + "']");
                scrollToAnchor(getUrlVars()["anchor"], currLink);
            }
        }
    }

    //tab dropdown
    if ($(".tab-dropdown").length > 0) {
        tabDropdownStyle();
        $(window).resize(function () {
            tabDropdownStyle();
        });
    }

    //lightgallery
    if ($(".lightgallery-box").length > 0) {
        $(".lightgallery-box").lightGallery();
    }

    //Modal
    if ($(".btn-modal").length > 0) {
        //exeModal();
    }


    //nav fixed top
    if ($(".self-pad-top").length > 0) {
        var outH = $(".self-pad-top > .fixed-top").outerHeight();
        $(".self-pad-top").css("height", outH);

        $(window).resize(function () {
            var outH = $(".self-pad-top > .fixed-top").outerHeight();
            $(".self-pad-top").css("height", outH);
        });

    }

    

    //marquee
    if ($(".marquee").length > 0) {
        $('.marquee-box').marquee();

        if ($('.marquee').hasClass("fixed") && $(".header > .navbar").hasClass("fixed-top")) {
            $(".header > .navbar").css("top", $('.marquee').outerHeight());
        }
    }

    //countdown
    if ($(".countdown-sec").length > 0) {
        $(".footer_content").css("padding-bottom", $(".countdown-sec").outerHeight() + 40);
    }

    //product mode
    if ($("body.product .mode-switch").length > 0) {
        $(".display-mode").show();
        $("body.product .btn-mode").click(function (e) {
            e.preventDefault();
            $("body.product .btn-mode").not(this).removeClass("active");
            $(this).addClass("active");

            var prevModeData = $("body.product .btn-mode").not(this).data("mode");
            var modeClass = $(this).data("mode");
            $("body.product .gallery-list").fadeOut(300, function () {
                //$(".mode-switch").removeClass(prevModeData);
                //$(".mode-switch").addClass(modeClass);
                $("body.product .mode-switch").attr('data-mode', modeClass);
            }).fadeIn();

            //$(".mode-switch").data('mode', modeClass);

            //$(".mode-switch").attr('data-mode', modeClass);

            //console.log(modeClass);

        });
    } else {
        $("body.product .display-mode").hide();
    }


    //slide banner
    if ($('.wid-slideBanner .jcarousel').length > 0) {


        $('.wid-slideBanner .jcarousel').slick({

            dots: false,
            infinite: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: ".jcarousel-control-prev",
            nextArrow: ".jcarousel-control-next",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        

        //var jcarousel = $('.wid-slideBanner .jcarousel');

        //jcarousel
        //    .on('jcarousel:reload jcarousel:create', function () {
        //        var carousel = $(this),
        //            width = carousel.innerWidth();
        //        //width = width / 3;
        //        if (width >= 600) {
        //            width = width / 3;
        //        } else if (width >= 350) {
        //            width = width / 2;
        //        }

        //        carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
        //    })
        //    .jcarousel({
        //        wrap: 'circular'
        //    });

        //jcarousel.siblings('.jcarousel-control-prev')
        //    .jcarouselControl({
        //        target: '-=1'
        //    });

        //jcarousel.siblings('.jcarousel-control-next')
        //    .jcarouselControl({
        //        target: '+=1'
        //    });
    }

    //if ($(".header .search-area").length > 0) {
    //    $(".header .search-area").on('keypress', function (e) {
    //        if (e.which == 13) {
    //            e.preventDefault();
    //            searchPro($(this).find(".btn-submit-search"));
    //        }
    //    });
    //}

    //動畫
    //滑鼠滑過元素微動
    if ($(".twm-ani-liteHover").length > 0) {
        $.fn.parallax = function (resistance, mouse, num, negative, negative2) {
            $el = $(this);
            TweenLite.to($el, num, {
                x: -((mouse.clientX - window.innerWidth / 4) / resistance) * negative,
                y: -((mouse.clientY - window.innerHeight / 2) / resistance) * negative2
            });
        };
        $(document).mousemove(function (e) {
            $(".parallax_level_1").parallax(50, e, 0.8, 1, -1);
            $(".parallax_level_2").parallax(20, e, 0.3, 1, 1);
            $(".parallax_level_3").parallax(80, e, 0.9, -1, 1);
            $(".parallax_level_4").parallax(120, e, 0.9, 1, 1);
        });
    }
    

    
    //if ($("body").hasClass("PagescrollAni")) {
        
    //}
    //if ($(".aniFadeGrade").length > 0) {
    //    var ranMax = $(".aniFadeGrade").text().trim().length;
    //    var html = $(".aniFadeGrade").html();
    //    var chars = $.trim(html).split("");
    //    $(".aniFadeGrade").empty();
    //    $.each(chars, function (i) {
    //        $(".aniFadeGrade").append('<span style="transition-delay: ' + makeUniqueRandom(ranMax) / 10 + 's;" data-aos="ani-fade-up">' + chars[i] + '</span>');
    //    });
    //    $(".aniFadeGrade > span").wrapAll("<div class='overflow-hidden'></div>");
    //}


    //banner 兩段
    if ($('.banner-expend-eff-slider').length > 0) {
        $("body").addClass("bannerExpand");
        $("body:not(.home) .banner-exa-sec").remove();
        $(window).on("load", function () {
            
            let option_basic = {
                speed: 2000,
                loop: true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
            };
            let option_slide = {
                speed: 2000,
                loop: true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                }
            };
            let final_option = option_basic;
            if ($(".banner-expend-eff-inner").hasClass("banner-ani-slide")) {
                final_option = option_slide;
            }

            kv_slider = new Swiper('.banner-expend-eff-slider', final_option);

            $(window).scroll(function () {
                scroll_Fade_Logo();
                scroll_Fade_body('.banner-expend-eff .sec2');
            });
        });
    }

    //header newtop
    if (window.innerWidth > 300) {
        $(window).scroll(function () {
            //nav 動畫
            if ($(this).scrollTop() > 300) {
                $('.header > .navbar').addClass("newtop");
            } else {
                $('.header > .navbar').removeClass("newtop");
            }
        });
    }

    //footer、nav 圖片以js 來指定寬高
    if ($(".footer .footer-logo img").length > 0) {
        getPicWH($(".footer .footer-logo img"));
    }
    if ($(".navbar-brand.navbar-nav img").length > 0) {
        if ($(".navbar-brand.navbar-nav img.logo").length > 0) getPicWH($(".navbar-brand.navbar-nav img.logo"));
        if ($(".navbar-brand.navbar-nav img.logo-ani").length > 0) getPicWH($(".navbar-brand.navbar-nav img.logo-ani"));
        if ($(".navbar-brand.navbar-nav img.logo-mob").length > 0) getPicWH($(".navbar-brand.navbar-nav img.logo-mob"));
    }


    //延遲加載圖片
    if ($(".lazyload").length > 0) {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
            // for fancybox
            if ($(".picset").length > 0) {
                initPic();
            }
        } else {
            // Dynamically import the LazySizes library
            const script = document.createElement('script');
            script.src =
                'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }


});


function getPicWH(f_obj) {
    let flogo_w = f_obj.outerWidth();
    let flogo_h = f_obj.outerHeight();
    f_obj.attr("width", flogo_w);
    f_obj.attr("height", flogo_h);
}

$(window).on("load",function () {
    $("body").addClass("load-completed");
});
//動畫


var uniqueRandoms = [];
function makeUniqueRandom(numRandoms) {
    // refill the array if needed
    if (!uniqueRandoms.length) {
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
    }
    var index = Math.floor(Math.random() * uniqueRandoms.length);
    var val = uniqueRandoms[index];

    // now remove that value from the array
    uniqueRandoms.splice(index, 1);

    return val;

}

function pushFixedHeight(t) {
    var winW = $(window).width(),
        pushH = t.outerHeight();
    if ($(window).width() <= 991) {
        $("body").css("padding-bottom", pushH);
    } else {
        $("body").css("padding-bottom", 0);
    }
}

function pushHeaderFixedHeight(t) {
    var winW = $(window).width(),
        pushH = t.outerHeight();
    if ($(".top_marquee").length > 0) {
        pushH += $(".top_marquee").outerHeight();
    }

    if (t.hasClass("scrollToFixed") || t.parents(".header").hasClass("scrolldownHeader")) {
        pushH = ($(".top_marquee").length > 0)?$(".top_marquee").outerHeight():0;
    }
    

    $(".banner:not(.banner_trigger)").css("padding-top", pushH);
}

//***************

function fixedSlick(obj) {
    $(obj).get(0).slick.setPosition();
}

function initSwipper(obj, autoplayMode, autoplaySpeedMode, id = "") {
    var swiper = new Swiper(obj, {
        on: {
            init: function () {
                swiperAnimateCache(this); //隐藏动画元素 
                swiperAnimate(this); //初始化完成开始动画
            },
            slideChangeTransitionEnd: function () {
                swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                //this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); 动画只展现一次，去除ani类名
            },
            slideChange: function (el) {
                console.log('1');
                $(obj + ' .swiper-slide').each(function () {
                    var youtubePlayer = $(this).find('iframe').get(0);
                    if (youtubePlayer) {
                        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                });
            },
        },
        //spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: autoplaySpeedMode,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })

    if (!autoplayMode) {
        //swiper.autoplay = false;
        swiper.autoplay.stop();
    }

    //banner 圖片上寬高屬性
    bannerImgSetWH(obj + " .banner-pic");
    $(window).resize(function () {
        //banner 圖片上寬高屬性
        bannerImgSetWH(obj);
    })

}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady(id) {
    let player = document.querySelectorAll('[iframe-video]');
    let buttons = document.querySelectorAll('[video-buttons]');

    player.forEach(item => {
        var itemElem = item.dataset.videolink;
        itemElem = new YT.Player(item, {
            videoId: item.dataset.iframeid
        });

        buttons.forEach(item => {
            item.addEventListener('click', function (e) {
                itemElem.pauseVideo();
            });
        });
    })
}


function ieFixImg(obj) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        if (obj.length) {
            obj.each(function () {
                //$(this).children("a").css({
                $(this).find("img").parents(".pic-wrapper").css({
                    "background-image": function () {
                        //var b = $(this).children("img").attr("src");
                        var b = $(this).find("img").attr("src");
                        //$(this).children("img").remove();
                        $(this).find("img").remove();
                        return "url(" + b + ")";
                    }
                });
                $(this).addClass("fixedSupport");
            });
        }
    }
}


function openSideMenu() {
    if ($(".main .wid.wid-collapse-onesub").length > 0) {
        if ($(".side .filter-sidebar .collapse.navbar-collapse").hasClass("show")) {
            $(".side .filter-sidebar .collapse.navbar-collapse").removeClass("show");
        } else {
            $(".side .filter-sidebar .collapse.navbar-collapse").addClass("show");
        }
    } else {
        if ($(".collapse-side-btn").length > 0) {
            $(".collapse-side-btn").click(function () {
                if ($(".collapse-side-content").length > 0) {
                    if ($(".collapse-side-content").hasClass("show")) {
                        $(".collapse-side-content").removeClass("show");
                    } else {
                        $(".collapse-side-content").addClass("show");
                    }
                }
                if ($(".collapse-side-content").length > 0) {
                    if ($(".side .navbar > .collapse").hasClass("show")) {
                        $(".side .navbar > .collapse").removeClass("show");
                    } else {
                        $(".side .navbar > .collapse").addClass("show");
                    }
                }
                //$(".collapse-side-content").toggleClass("show");
                //$(".side .navbar > .collapse").toggleClass("show");

                if ($('.wid-slideBanner .jcarousel').length > 0) {
                    $('.wid-slideBanner .jcarousel').get(0).slick.setPosition();
                }

            });
        }
        //else {
        //    if ($(".side .filter-sidebar").length > 0) {
        //        if ($(".side .filter-sidebar").is(':visible')) {
        //            $(".side .filter-sidebar").slideUp();
        //        } else {
        //            $(".side .filter-sidebar").slideDown();
        //        }
        //    }
        //    //$(".side .filter-sidebar").slideToggle();
        //}
    }
    
    
}

function multiSideMenu(closeother) {

    //<ul class="dropdown-menu show" x-placement="top-start">
    //wid-multiple-collapse
    //$(".filter-sidebar.multiple-collapse .navbar-nav li").each(function () {
    $(".wid.wid-multiple-collapse .wid-cont .navbar-nav li").each(function () {
        if ($(this).children("ul").length > 0) {
            $(this).addClass("dropdown");
        }
    });

    //var dropdownBtn = $(".filter-sidebar.multiple-collapse .navbar-nav > .nav-item.dropdown > .nav-link");
    //var dropdownContent = $(".filter-sidebar.multiple-collapse .navbar-nav > .nav-item.dropdown > .nav-link").next("ul");
    var dropdownBtn = $(".wid.wid-multiple-collapse .wid-cont .navbar-nav > .nav-item.dropdown > .nav-link");
    var dropdownContent = $(".wid.wid-multiple-collapse .wid-cont .navbar-nav > .nav-item.dropdown > .nav-link").next("ul");
    var dropdownIitem = dropdownContent.children("li").children("a");


    dropdownBtn.attr("data-toggle", "dropdown");
    dropdownBtn.attr("aria-haspopup", "true");
    dropdownBtn.attr("aria-expanded", "true");
    dropdownBtn.addClass("dropdown-toggle");

    dropdownContent.addClass("dropdown-menu");
    dropdownBtn.attr("x-placement", "top-start");

    dropdownIitem.addClass("dropdown-item");

    //避免點外面關閉下拉
    //$('.side:not(.side-top) .filter-sidebar.multiple-collapse').on('hide.bs.dropdown', function (e) {
    //    if (e.clickEvent) {
    //        e.preventDefault();
    //    }
    //});
    $('.side:not(.side-top) .wid.wid-multiple-collapse').on('hide.bs.dropdown', function (e) {
        if (e.clickEvent) {
            e.preventDefault();
        }
    });


    $(".collapse-side-btn").click(function () {
        $(".collapse-side-content").toggleClass("show");
        $(".side .navbar > .collapse").toggleClass("show");
        if ($('.wid-slideBanner .jcarousel').length > 0) {
            $('.wid-slideBanner .jcarousel').get(0).slick.setPosition();
        }
    });


    //side 多層
    $('.side .dropdown-menu .dropdown-toggle').on('click', function () {
        var $el = $(this);
        var $parent = $el.offsetParent(".side .dropdown-menu");

        if (!$el.next().hasClass("show")) {
            $el.parents('.side .dropdown-menu').first().find(".show").removeClass("show");
        }
        $el.next(".side .dropdown-menu").toggleClass("show").parent("li").toggleClass("show");

        $el.parents(".side li.nav-item.dropdown.show").on("hidden.bs.dropdown", function () {
            $(".side .dropdown-menu .show").removeClass("show");
        });

        if (!$parent.parent().hasClass("navbar-nav")) {
            $el.next().css({ "top": $el[0].offsetTop, "left": $parent.outerWidth() });
        }

        return false;
    });

    //nav cart
    if ($(".modal-body .cart-list-collapse .cart-list-collapse-title").length > 0) {
        $(".modal-body .cart-list-collapse .cart-list-collapse-title").click(function () {
            $(".modal-body .cart-list-collapse .cart-list-collapse-cont").slideToggle();
        });
    }
    

}

function checkStatus() {
    //全選/checkbox
    $(".wid.wid-check-filter .filter-title .chkall").click(function () {
        $(this).parents(".filter-item").children(".filter-content").find(".chksuball").prop('checked', $(this).prop('checked'));
        $(this).parents(".filter-item").children(".filter-content").find(".chksub").prop('checked', $(this).prop('checked'));

    });
    $(".wid.wid-check-filter .filter-content .chksuball").change(function () {
        if (!$(this).prop("checked")) {
            $(".filter-sidebar .filter-title .chkall").prop("checked", false);
            //$(".country-menu #chkall").prop("checked", false);
        }
    });
    $(".wid.wid-check-filter .filter-content .chksub").change(function () {
        if (!$(this).prop("checked")) {
            $(".filter-sidebar .filter-title .chkall").prop("checked", false);
            $(this).parents(".filter-item").children(".filter-content").find(".chksuball").prop('checked', false);
            $(this).parent(".filter-item").children(".filter-title").find(".chkall").prop("checked", false);
        }
    });

    $(".wid.wid-check-filter .filter-content .chksuball").click(function () {
        var subObj = $(this).parent("label").next(".filter-content").find(".chksub");
        subObj.prop('checked', $(this).prop('checked'));
    });
}


function initIsotope() {
    if ($(".iso-sec").length > 0) {
        var $grid = $('.iso-area .grid.grid-normal');
        var options = {
            itemSelector: '.grid-normal .grid-item',
            filter: '*',
            percentPosition: true
        }
        if ($('.iso-area .grid.grid-normal .priceAmount').length > 0) {
            options = {
                itemSelector: '.grid-normal .grid-item',
                filter: '*',
                percentPosition: true,
                getSortData: {
                    priceAmount: function (itemElem) {
                        var priceamount = $(itemElem).attr('data-priceAmount');
                        return parseInt(priceamount);
                    }
                }
            }
        }

        $grid.isotope(options);


        //masonry
        var $gridmasonry = $('.iso-area .grid.grid-masonry');
        $gridmasonry.isotope({
            itemSelector: '.grid-masonry .grid-item',
            filter: '*',
            percentPosition: true,
            masonry: {
                //columnWidth: '.grid-sizer'
            }
        });


        $('.iso-kind a').click(function () {
            var selector = $(this).attr('data-filter');
            var $isoSelf = $(this).parents(".iso-sec").children(".iso-area").children(".grid");
            $isoSelf.isotope({ filter: selector });

            $(".iso-kind ul li a").not(this).parent("li").removeClass("active");
            //$(this).parent("li").addClass("active");

            return false;
        });


        if ($(".function-bar .sort-area").length > 0) {

            $(".function-bar .sort-area .dropdown-menu a").click(function (e) {

                e.preventDefault();

                var sortValue = $(this).attr('data-sort-value');
                var direction = $(this).attr('data-sort-direction');

                var isAscending = (direction === 'asc');
                var newDirection = (isAscending) ? 'desc' : 'asc';

                $grid.isotope({ sortBy: sortValue, sortAscending: isAscending });

                //$(this).attr('data-sort-direction', newDirection);

            });


        }



    }
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function scrollToAnchor(aid, obj, url = "") {
    var aTag = $("div[data-anchor='" + aid + "']");
    if (url !== "" && aTag.length <= 0) {
        window.location.href = url + "?anchor=" + aid;
    } else {

        var addiDistance = 80;

        if ($(".anchor-title").length > 0) {
            $(obj).parents(".anchor-title").find("a").not(obj).removeClass("active");
            $(obj).addClass("active");
            addiDistance += $(".anchor-title").outerHeight();
            if ($(".header > .navbar").hasClass("fixed-top")) {
                if (typeof ($(".banner").attr("style")) != "undefined") {
                    addiDistance = addiDistance - $(".header > .navbar").outerHeight();
                } else {
                    addiDistance = addiDistance - ($(".header > .navbar").outerHeight()/2);
                }
            }

        }

        
        if ($(window).width() <= 768) {
            addiDistance = 80;
            $(".bsnav-mobile").removeClass("in");
        }

        var topDistance = aTag.offset().top - addiDistance;


        $('html,body').animate({ scrollTop: topDistance }, 'slow');
    }
}

function exeScrollToFixed() {
      //主選單的 anchor 不需要執行
    $(".section .anchor-title").scrollToFixed({
        marginTop: $(".header > .navbar").outerHeight(),

        preFixed: function () {
            $("body").addClass("scroll_to_fixed");
            setTimeout(function () {
                $(".anchor-title").css("top", "0");
            }, 10);
        },
        postFixed: function () {
            $("body").removeClass("scroll_to_fixed");
            $(".section .anchor-title").css("top", "auto");
            console.log("postFixed");
        },

    });

    //滑到該區域，標題變色
    $(window).scroll(function () {

        var scrollPos = $(document).scrollTop();
        var aTag = $("div[data-anchor]");
        aTag.each(function () {
            var currLink = $(this);
            var currAnchor = $(this).data("anchor");
            var currTitleAnchor = $(".anchor-title a[data-anchortitle=" + currAnchor + "]");
            
            if (currLink.position().top - 100 <= scrollPos && currLink.position().top + currLink.height() - 100 > scrollPos) {    
                $("div[data-anchor]").not(this).find("a").removeClass("active");
                //$(".anchor-title a").removeClass("active");
                if (!currTitleAnchor.hasClass("active")) currTitleAnchor.addClass("active");
                

            }
            else {
                currTitleAnchor.removeClass("active");
            }
        });
    });


}

function tabDropdownStyle() {
    var screen_w = $(window).width();
    if (screen_w < 768) {
        //if ($(".dropdown-toggle").length <= 0) {
            var tab_header = $('.tab-dropdown .nav-tabs a.active').text();
        //    $('.tab-dropdown').addClass('dropdown');
        $('.tab-dropdown .tab_dropdown_title').html(tab_header + '<span class="caret"></span>');
        //    //$('.tab-dropdown ul').before('<button class="btn btn-primary dropdown-toggle tab_dropdown_title w-100" type="button" data-bs-toggle="dropdown" id="dropdownTab" aria-expanded="false">' + tab_header + '<span class="caret"></span></button>');
        //    $(".tab-dropdown ul").addClass("dropdown-menu");
            $(".tab-dropdown .dropdown-menu li").click(function () {
                var dropdown_select = jQuery(this).find("a").text();
                $('.tab_dropdown_title').html(dropdown_select + '<span class="caret"></span>');

            });

        //}
    } else {
        //$(".dropdown-toggle").remove();
        //$('.tab-dropdown').removeClass("dropdown");
        //$(".tab-dropdown ul").removeClass("dropdown-menu");

    }
}

function fixAccordion() {
    $('.accordion-list-cont').on('shown.bs.collapse', function (e) {
        var $panel = $(this).closest('.accordion-list-item');
        $('html,body').animate({
            scrollTop: $panel.offset().top - $(".header .navbar").outerHeight()
        }, 'fast');
    });
}


function exeModal() {
    //toast
    $(".btn-modal").click(function (e) {
        e.preventDefault();
        $('#myModal').modal('hide');
        if ($('.toast').length > 0) {
            $('.toast').toast('show');
        }
    });
}


//localstorage 

function setWithExpiry(key, value, ttl) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))


    //console.log(localStorage.getItem(key));
}
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }
    
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time

    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null

        //console.log("EXPIRED");
        localStorage.removeItem(key)
        return null
    }

    //console.log(item.value);

    return item.value
}

/*** 驗證 email 格式 ***/
function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/) != -1)
        return true;
    else
        return false;
}


/*********** share ************/
var thisUrl = window.location.href;
var windowSize = "height=500,width=600";
var thisTitle = document.title;
function shareTo(target, currUrl = "") {

    if (currUrl === "") {
        currUrl = thisUrl;
    }

    switch (target) {
        case "fb":
            window.open('http://www.facebook.com/share.php?u='.concat(encodeURIComponent(currUrl)), '', config = windowSize);
            break;
        case "line":
            window.open('https://lineit.line.me/share/ui?url=' + encodeURIComponent(currUrl) + '&text=' + encodeURIComponent(document.title), '_blank', config = windowSize);
            break;
        case "twitter":
            window.open('http://twitter.com/home/?status='.concat(encodeURIComponent(document.title)).concat(' ').concat(encodeURIComponent(currUrl)), '', config = windowSize);
            break;
        case "mail":
            window.location = "mailto:?subject=" + thisTitle + "&body=" + thisTitle + currUrl, '', config = windowSize;
            break;
        case "linkedin":
            window.open('https://www.linkedin.com/shareArticle?mini=true&url='.concat(encodeURIComponent(currUrl)).concat('&title=').concat(encodeURIComponent(document.title)).concat('&summary=').concat(encodeURIComponent(document.title)).concat('&source=LinkedIn').concat(' '), '', config = windowSize);
            break;
    }
}

/**=============  sweet alert =============**/
function msgbox(html, icon = '', url = '') {
    Swal.fire({
        icon: icon,
        html: html,
        confirmButtonText: '關閉',
        onClose: () => {
            if (url != '') {
                window.location = url;
            }
        }
    });
}

function msgtop(html, icon = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        heightAuto: false,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        html: '<div class="swal2-toast-cus">' + html + '</div>'
    })
}

var mctmp = '0';
function msgconfirm(html, btn, icon = 'question') {
    if (mctmp == '0') {
        Swal.fire({
            html: html,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-check"></i> 確定',
            cancelButtonText: '<i class="fas fa-times"></i> 取消'
        }).then((result) => {
            if (result.value) {
                mctmp = '1';
                if ($(btn)[0].hasAttribute('href')) {
                    var href = $(btn).attr('href');
                    window.location.href = href;
                } else {
                    $(btn).click();
                }
            }
        })
        mctmp = '0';
        return false;
    } else {
        mctmp = '0';
        return true;
    }
}

//======= 購物車增減數字 =======
function qtyadd(A) {
    event.preventDefault();
    var qtyInput = $(A).parents(".input-group").children(".qty-quantity");

    $(qtyInput).val((parseInt($(qtyInput).val()) + 1).toString());
}

function qtyminus(B) {
    event.preventDefault();
    var qtyInput = $(B).parents(".input-group").children(".qty-quantity");
    if ((parseInt($(qtyInput).val())) < 2) {
        $(qtyInput).val("2");
    }
    $(qtyInput).val((parseInt($(qtyInput).val()) - 1).toString());

}

//============  檢查只能輸入英、數字  ==============
function ValidateCNWord(value) {
    var re = /[\W]/g;
    if (!re.test(value)) {
        return true;
    } else {
        return false;
    }
}



//============  地址  ==============
function getAddressList(value,obj,drop) {

    var nPostObj = $(obj).parents(".address-box").find(".postObj");
    
    if (drop === 'city') {
        var nAreaObj = $(obj).parents(".address-box").find(".areaObj");
        
        nPostObj.val("");
        
        $.get(rootUrl + "api/RegionData/" + value + "." + $(".nation-val").val(), function () {
            //alert("success");
        }).done(function (data) {
            if (data) {
                var dataList = data.addressdata;
                nAreaObj.html("");
                nAreaObj.append("<option value=''></option>")
                $.each(dataList, function (index, item) {
                    //alert(index + ": " + value);
                    nAreaObj.append("<option value='" + item.value + "/" + item.zip + "'>" + item.text + "</option>");
                });
            } else {
                nAreaObj.html("");
            }
        }).fail(function () {
            //reject('Error');
        });
    } else {
        //area to zip
        if (value !== "") {
            nPostObj.val(value.split('/')[1]);

        } else {
            nPostObj.val("");
        }
        
    }
    

}


function privateCookie() {
    $("body").addClass("cookie_agree");
    $(".cookie.agree a.agree-btn").click(function (e) {
        e.preventDefault();
        $.get(rootUrl + "page/_uc/agree.aspx", function (data) {
            $(".cookie.agree").slideUp();
            $("body").removeClass("cookie_agree");
            $("body .footer .footer_content").css("padding-bottom", 10);
        });
    });

    pushAgreeBox($(".cookie.agree"));
    $(window).resize(function () { pushAgreeBox($(".cookie.agree")); });
}

function pushAgreeBox(t) {
    var winW = $(window).width(),
        pushH = t.outerHeight();
    $("body.cookie_agree .footer .footer_content").css("padding-bottom", (pushH + 10));
}

function setPageBodyClass(para, value) {
    (value) ? $("body").addClass(para + "_" + value) : "";
}

function bannerImgSetWH(obj) {
    $(obj + " img").each(function () {
        let banner_img_width = $(this).data("width1");
        let banner_img_width2 = $(this).data("width2");
        let banner_img_height = $(this).data("height1");
        let banner_img_height2 = $(this).data("height2");

        $(this).attr("width", ($(window).width() > 767) ? banner_img_width : banner_img_width2);
        $(this).attr("height", ($(window).width() <= 767) ? banner_img_height : banner_img_height2);

    });
}

