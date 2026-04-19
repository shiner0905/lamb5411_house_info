function runMultiSlick(obj, dotMode, autoplayMode, autoplaySpeedMode, arrowsMode,slideShow) {

    var slideShowStr = slideShow;
    if (slideShow == "" || typeof (slideShow) == "undefined") {
        slideShowStr = "4,3,3,2,1";
    }
    var sldCount = slideShowStr.split(',');

    $(obj + ' .slick.list').slick({
        dots: dotMode,
        infinite: true,
        arrows: arrowsMode,
        autoplay: autoplayMode,
        autoplaySpeed: autoplaySpeedMode,
        slidesToShow: sldCount[0],
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: sldCount[1],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: sldCount[2],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: sldCount[3],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: sldCount[4],
                    slidesToScroll: 1
                }
            }
        ]
    });
}




function multiSlickCusArrow(obj, dotMode, autoplayMode, autoplaySpeedMode, arrowsMode, slideShow) {

    var slideShowStr = slideShow;
    if (slideShow == "" || typeof (slideShow) == "undefined") {
        slideShowStr = "4,3,3,2,1";
    }
    var sldCount = slideShowStr.split(',');

    $(obj).slick({
        dots: dotMode,
        infinite: true,
        autoplay: autoplayMode,
        autoplaySpeed: autoplaySpeedMode,
        slidesToShow: sldCount[0],
        slidesToScroll: 1,
        prevArrow: ".btn-prev",
        nextArrow: ".btn-next",
        arrows: arrowsMode,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: sldCount[1],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: sldCount[2],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: sldCount[3],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: sldCount[4],
                    slidesToScroll: 1
                }
            }
        ]
    });

    $(obj).slick('slickGoTo', 1); //指到第1張
}

function initPic() {
    $(".picset").each(function () {
        var currImgUrl = $(this).attr("src");
        $(this).parents(".grid-item").find(".picget").attr("href", currImgUrl);
    });
}

function ValidateCheckBox7() {
    
    if ($(".form-group.contact_time.ct input[type='checkbox']:checked").length > 0) {
        isValid = true;
    }
    args.IsValid = isValid;
}

function chkRequired(sender, args) {
    var isValid = false;
    var objParent = $(this).parents(".contact-form-required").find;
    $(".required").each(function () {
        var input_check = $(this).parent("input").val();
        var cb_check = true;
        if ($(this).parent('input[type="checkbox"]').length > 0) {
            cb_check = ($(this).parent('input[type="checkbox"]:checked').length > 0)
        }
        var rd_check = "";
        if ($(this).prev().children("span").children('input[type="radio"]').length > 0) {
            rd_check = $(this).prev().children("span").children('input[type="radio"]:checked').val();
        }
        if (input_check === '' && rd_check === '' && !cb_check) {
            //event.preventDefault();
            //return true;
            isValid = false;
            return false;
        } 
    });

    args.IsValid = isValid;
    //if (!ret) {
    //    alert("One or more fields cannot be blank");
    //    //event.preventDefault();
    //    return false;
    //} else {
    //    return true;
    //}
}

var defaultAutime = 10;

function bannerSlick(obj, dotMode, autoplayMode, autoplaySpeedMode, arrowsMode, cusPager, cusPagerSt,transAni) {
    if (cusPager && dotMode && cusPagerSt != "othersec-progress-bar") dotMode = false;

    var fade_status = true;
    if (transAni == "slide") fade_status = false;

    var final_options = null;
    var options = {
        dots: dotMode,
        infinite: true,
        autoplaySpeed: autoplaySpeedMode,
        arrows: arrowsMode,
        fade: fade_status,
        //cssEase: 'linear',
        autoplay: autoplayMode
    };
    var cus_page_pbar_options = {
        infinite: true,
        arrows: arrowsMode,
        dots: dotMode,
        autoplay: autoplayMode,
        speed: 2000,
        fade: fade_status,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'ease-in-out',
    };

    defaultAutime = autoplaySpeedMode / 1000;

    if (cusPager) {
        if (cusPagerSt == "pager-progressbar") final_options = cus_page_pbar_options;
        if (cusPagerSt == "pager-circle-progressbar") final_options = cus_page_pbar_options;
        if (cusPagerSt == "othersec-progress-bar") final_options = cus_page_pbar_options;
    } else {
        final_options = options;
    }

    $(obj).slick(final_options);

    //console.log(final_options);


    $(obj).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var youtubePlayer = $(this).find('iframe').get(0);
        if (youtubePlayer) {
            youtubePlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }

    });


    if (cusPager) {
        //pager-progressbar
        if (cusPagerSt == "pager-progressbar") {
            var total_slicks = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length;
            $(".banner-wrapbox").append('<div class="banner-cus-pager"></div>');
            $(".banner-wrapbox .banner-cus-pager").append('<div class="current-pager pager-oth-item">1</div>');
            for (var i = 0; i < total_slicks; i++) {
                $(".banner-wrapbox .banner-cus-pager").append('<div class="pager-item"><div data-slick-index="' + i + '" class="progressBar span"><div class="inProgress inProgress' + i + '"></div></div></div>')
            }
            $(".banner-wrapbox .banner-cus-pager").append('<div class="total-pager pager-oth-item">' + total_slicks + '</div>');

            startProgressbar();

            $('.banner-wrapbox .banner-cus-pager .pager-item').click(function () {
                clearInterval(tick);
                var goToThisIndex = $(this).find(".span").data("slickIndex");
                $('.banner-wrapbox .slick').slick('slickGoTo', goToThisIndex, false);
                $(".banner-wrapbox .banner-cus-pager .current-pager").text((goToThisIndex + 1));
                startProgressbar();
            });
        } else if (cusPagerSt == "pager-circle-progressbar") { //pager 圓圈
            var total_slicks = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length;
            $(".banner-wrapbox").append('<div class="banner-cus-circle-pager"></div>');
            for (var i = 0; i < total_slicks; i++) {
                $(".banner-wrapbox .banner-cus-circle-pager").append('<div class="circle-pager-item"><div data-slick-index="' + i + '" class="progressBar span"><div class="inProgress inProgress' + i + '"><svg class="circle-path" version="1.1" viewBox="0 0 20 20"><circle class="circle_animation" cx="10" cy="10" r="9.5" fill="none"></circle></svg></div></div></div>')
            }

            startProgressbar2();

            $('.banner-wrapbox .banner-cus-circle-pager .circle-pager-item').click(function () {
                clearInterval(tick);
                var goToThisIndex = $(this).find(".span").data("slickIndex");
                $('.banner-wrapbox .slick').slick('slickGoTo', goToThisIndex);
                console.log(goToThisIndex);
                startProgressbar2();
            });
        } else if (cusPagerSt == "othersec-progress-bar") { //額外區域進度條
            var total_slicks = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length;
            $(".banner-wrapbox").append('<div class="banner-othersec-cus-pager"></div>');
            $(".banner-wrapbox .banner-othersec-cus-pager").append('<div class="current-pager pager-oth-item">1</div>');
            $(".banner-wrapbox .banner-othersec-cus-pager").append('<div class="pager-item"><div data-slick-index="0" class="progressBar span"><div class="inProgress inProgress' + i + '"></div></div></div>');
            $(".banner-wrapbox .banner-othersec-cus-pager").append('<div class="total-pager pager-oth-item">' + total_slicks + '</div>');

            startProgressbar3();

        }

    }


    //刪除aspect-ratio
    if ($(".banner .slick.slick-initialized").length > 0 && $(".banner-asp-ratio-box").length > 0) {
        $(".banner-asp-ratio-box").removeAttr("style");
        $(".banner-asp-ratio-box").removeClass("banner-asp-val");
    }

    //banner 圖片上寬高屬性
    bannerImgSetWH(obj);

    $(window).resize(function () {
        //banner 圖片上寬高屬性
        bannerImgSetWH(obj);
    })

}
//ticking machine
var percentTime;
var tick;
var time = 1;
var progressBarIndex = 0;
var totalLength = 0;

var circleDashoff = 100; //預設
var r = 9.5;
var defaultR = 9.5;
var rlen = 2 * Math.PI * r;
var default_ani_time = 9;

var totalAniTime = defaultAutime;

function startProgressbar() {
    if ($(".banner-wrapbox .slick .item:not(.slick-cloned)").length > 0) {
        totalLength = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length
    }
    resetProgressbar();
    percentTime = 0;
    $(".banner-wrapbox .banner-cus-pager .current-pager").text((progressBarIndex + 1));
    tick = setInterval(function () {
        if (($('.banner-wrapbox .slick .slick-track div[data-slick-index="' + progressBarIndex + '"]').attr("aria-hidden")) === "true") {
            progressBarIndex = $('.banner-wrapbox .slick .slick-track div[aria-hidden="false"]').data("slickIndex");
            startProgressbar();
        } else {
            percentTime += 1 / (time + 5);
            $('.inProgress' + progressBarIndex).css({
                width: percentTime + "%"
            });
            if (percentTime >= 100) {
                $('.banner-wrapbox .slick').slick('slickNext');
                progressBarIndex++;

                if (progressBarIndex > (totalLength - 1)) {
                    progressBarIndex = 0;
                }

                startProgressbar();
            }
        }

    }, (defaultAutime + default_ani_time));
}
function resetProgressbar() {
    $('.inProgress').css({
        width: 0 + '%'
    });
    clearInterval(tick);
}


function startProgressbar2() {
    if ($(".banner-wrapbox .slick .item:not(.slick-cloned)").length > 0) {
        totalLength = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length
    }
    resetProgressbar2();
    percentTime = 0;
    $(".banner-wrapbox .banner-cus-pager .current-pager").text((progressBarIndex + 1));
    $('.progressBar:not([data-slick-index=' + progressBarIndex + '])').removeClass("active");
    $('.progressBar[data-slick-index=' + progressBarIndex + ']').addClass("active");
    tick = setInterval(function () {
        if (($('.banner-wrapbox .slick .slick-track div[data-slick-index="' + progressBarIndex + '"]').attr("aria-hidden")) === "true") {
            progressBarIndex = $('.banner-wrapbox .slick .slick-track div[aria-hidden="false"]').data("slickIndex");
            startProgressbar2();
        } else {
            percentTime += 1 / (time + 5);
            $('.progressBar[data-slick-index=' + progressBarIndex + '] .inProgress svg circle').css({
                'stroke-dasharray': rlen,
                'stroke-dashoffset': rlen * (1 - percentTime / 100)
            });
            if (percentTime >= 100) {
                $('.banner-wrapbox .slick').slick('slickNext');
                progressBarIndex++;

                if (progressBarIndex > (totalLength - 1)) {
                    progressBarIndex = 0;
                }

                startProgressbar2();
            }
        }

    }, (defaultAutime + default_ani_time));
}
function resetProgressbar2() {

    $('.inProgress svg circle').css({
        'stroke-dashoffset': circleDashoff + 'px',
        'stroke-dasharray': circleDashoff + 'px',
    });
    clearInterval(tick);
}


function startProgressbar3() {
    if ($(".banner-wrapbox .slick .item:not(.slick-cloned)").length > 0) {
        totalLength = $(".banner-wrapbox .slick .item:not(.slick-cloned)").length
    }
    resetProgressbar3();
    percentTime = 0;
    $(".banner-wrapbox .banner-othersec-cus-pager .current-pager").text((progressBarIndex + 1));
    tick = setInterval(function () {
        if (($('.banner-wrapbox .slick .slick-track div[data-slick-index="' + progressBarIndex + '"]').attr("aria-hidden")) === "true") {
            progressBarIndex = $('.banner-wrapbox .slick .slick-track div[aria-hidden="false"]').data("slickIndex");
            startProgressbar3();
        } else {
            percentTime += 1 / (time + 5);
            $('.inProgress').css({
                width: percentTime + "%"
            });
            if (percentTime >= 100) {
                $('.banner-wrapbox .slick').slick('slickNext');
                progressBarIndex++;

                if (progressBarIndex > (totalLength - 1)) {
                    progressBarIndex = 0;
                }

                startProgressbar3();
            }
        }

    }, (defaultAutime + default_ani_time));
}
function resetProgressbar3() {
    $('.inProgress').css({
        width: 0 + '%'
    });
    clearInterval(tick);
}


/* ///////////// */
function bannerMultiSlick(obj, dotMode, autoplayMode, autoplaySpeedMode, arrowsMode, slideShow) {

    var slideShowStr = slideShow;
    if (slideShow == "" || typeof (slideShow) == "undefined") {
        slideShowStr = "4,3,3,2,1";
    }
    var sldCount = slideShowStr.split(',');

    $(obj).slick({
        dots: dotMode,
        infinite: true,
        arrows: arrowsMode,
        autoplay: autoplayMode,
        autoplaySpeed: autoplaySpeedMode,
        slidesToShow: sldCount[0],
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: sldCount[1],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: sldCount[2],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: sldCount[3],
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: sldCount[4],
                    slidesToScroll: 1
                }
            }
        ]
    });


    $(obj).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var youtubePlayer = $(this).find('iframe').get(0);
        if (youtubePlayer) {
            youtubePlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}


//標題動畫
function titleAni(obj,val) {
    if ($(obj).length > 0) {
        var ranMax = $(obj).text().trim().length;
        var html = $(obj).html();
        var chars = $.trim(html).split("");
        $(obj).empty();
        
        if (val == "ani-fade-grad") {
            $.each(chars, function (i) {
                $(obj).append('<span style="transition-delay: ' + makeUniqueRandom(ranMax) / 10 + 's;" data-aos="ani-fade-grad">' + chars[i] + '</span>');
            });
        } else if (val == "ani-fade-up") {
            $.each(chars, function (i) {
                $(obj).append('<span style="transition-delay: ' + i / 10 + 's;" data-aos="ani-fade-up">' + chars[i] + '</span>');
            });
            $(obj + " > span").wrapAll("<div class='overflow-hidden'></div>");
        } else if (val == "ani-blur-up") {
            $.each(chars, function (i) {
                $(obj).append('<span style="transition-delay: ' + i / 5 + 's;" data-aos="ani-blur-up">' + chars[i] + '</span>');
            });
        }
    }
}

//網頁平滑捲動
function scrollSmoothe() {
    $("html").easeScroll({
        animationTime: 1500
    });
}

function searchPro(obj) {
    var kw = $(obj).parents(".search-box").find(".keywords").val();
    if ($(obj).parents(".small-btn-box").find(".keywords").length > 0) {
        kw = $(obj).parents(".small-btn-box").find(".keywords").val();
    }
    window.location.replace(rootUrl + "page/search/index.aspx?kw=" + kw);
}



function initCountdown(limitDateTime) {
    if ($('#limited-time').length > 0) {
        $('#limited-time').countdown(limitDateTime, function (event) {
            $(this).html(event.strftime('%D 天 %H:%M:%S'));
        });
    }
}

function switchCol(col, obj) {

    event.preventDefault();
    console.log(event.target.name);

    $(".product-filter a").removeClass("active");
    $(obj).addClass("active");

    if (col == 0) { //1欄

        $(".product-row .product-wrap").attr("class", "product-wrap col-12");

        switch (col) {
            case 0:
                $(".product-row").attr("class", "product-row row single-list");
                break;
            case 1:
                $(".product-row").attr("class", "product-row row single-row colum");
                break;
        }
    } else {
        $(".product-row").attr("class", "product-row row column");
        $(".product-row .product-wrap").attr("class", "product-wrap col-" + (12 / col));
    }


}

//checkout
function checkout(a) {

    event.preventDefault();

    var nextStep = a + 1,
        prevStep = a - 1,
        currStep = a;

    $(".step-box .cart-step:not([data-step=" + currStep + "])").removeClass("active");
    $(".step-box .cart-step[data-step=" + currStep + "]").addClass("active");


    $(".checkoutModal .main-info .det-box:not([data-step=" + currStep + "])").hide();
    $(".checkoutModal .main-info .det-box[data-step=" + currStep + "]").show();

    if (nextStep <= 3) {
        $(".checkout-btn-box .btn-next").text("下一步");
        //$(".checkout-btn-box .btn-next").attr("onclick", "checkout(" + nextStep + ",this)");
    }
    if (nextStep == 4) {
        $(".checkout-btn-box .btn-next").text("送出");
        //$(".checkout-btn-box .btn-next").attr("onclick", "submitForm()");
        //$(".checkout-btn-box .btn-next").attr("onclick", "");
    }

}

function openFancyboxIframe(url) {
    $.fancybox.open({
        src: url,
        type: 'iframe',
        opts: {
            afterLoad: function (instance, current) {

                current.$iframe.get(0).contentWindow.removeAllContents();

                parent.jQuery.fancybox.getInstance().update();
            },
            afterShow: function (instance, current) {
                
            }
        }
    });
}

function homeTabActive(obj) {

    //$(obj + " .tab-area .tab-title").each(function () {
    //    $(this).children("li:first-child").children("a").addClass("active");
    //});

    //$(obj + " .tab-area .tab-content").each(function () {
    //    $(this).children(".tab-pane:first-child").addClass("active");
    //});

    $(obj + " .tab-area .tab-title li:first-child a").addClass("active");
    $(obj + " .tab-area .tab-content .tab-pane:first-child").addClass("active show");
}


/** banner 2 段 **/
function scroll_Fade_Logo() {
    var currentScroll = $(window).scrollTop(),
        logoFadestart = 200,
        logoFadeEnd = logoFadestart + 300,
        jQuerylogo = $('.banner-expend-eff .sec1');

    if (logoFadeEnd <= currentScroll) {
        jQuerylogo.css({
            'opacity': '0'
        });
    } else if (logoFadestart <= currentScroll) {
        var logoopacity = 1 - ((currentScroll - logoFadestart) / (logoFadeEnd - logoFadestart));
        jQuerylogo.css({
            'opacity': logoopacity
        });
    } else {
        jQuerylogo.css({
            'opacity': '1'
        });
    }
}


function scroll_Fade_body(bobj) {
    var currentScroll = $(window).scrollTop(),
        bodyFadestart = 500,
        bodyFadeEnd = bodyFadestart + 300,
        jQuerybody = $(bobj);
    jQueryMask = $('.banner-expend-eff-mask');



    if (bodyFadeEnd <= currentScroll) {
        jQuerybody.css({
            'opacity': '1',
            'pointer-events': 'auto'
        });
        jQueryMask.css({
            'opacity': '0.5'
        });
    } else if (bodyFadestart <= currentScroll) {
        var bodyopacity = (currentScroll - bodyFadestart) / (bodyFadeEnd - bodyFadestart);
        jQuerybody.css({
            'opacity': bodyopacity,
            'pointer-events': 'auto'
        });
        jQueryMask.css({
            'opacity': '0.2'
        });
    } else {
        jQuerybody.css({
            'opacity': '0',
            'pointer-events': 'none'
        });
    }
}

