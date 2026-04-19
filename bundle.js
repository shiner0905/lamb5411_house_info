
function aniAos() {
        AOS.init({
            duration: 500,
            once: true,
           
             });
 }


$(document).ready(function () {

    //footer 版宣
    if ($(".footer .footer-info .footer_left .copyrights").length > 0) {
        $(".footer .footer-info .footer_left .copyrights").clone().appendTo(".footer.thcol-st .footer-info .footer_right");
    }
    

	$(window).resize(function () {
		aniAos();
	});

    aniAos();

});



$(".scro_sol").click(function () {
    $("html,body").animate({ scrollTop: $(".home_vrca").offset().top }, 600);
});



if($("body.news.p02").length > 0 && $("body.news.p02 .article-horizontal-grid").length > 0){
	let n_obj = $("body.news .article-horizontal-grid .item .pic.w-25");
	n_obj.attr("class","pic w-50");
	let n_info_obj = $("body.news .article-horizontal-grid .item .info.w-75");
	n_info_obj.attr("class","info w-50 ps-3");
	}



$(document).ready(function(){
	$('.responsive02').slick({
	  dots: true,
	  infinite: false,
	  speed: 300,
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  responsive: [
		{
		  breakpoint: 1024,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: true,
			dots: true
		  }
		},
		{
		  breakpoint: 767,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		},
		{
		  breakpoint: 480,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		}
		// You can unslick at a given breakpoint now by adding:
		// settings: "unslick"
		// instead of a settings object
	  ]
	});
});

window.onload = function () {
    let scrollRef = 0;

    $(window).on("resize scroll", function () {
        scrollRef <= 10 ? scrollRef++ : AOS.refresh();
    })
}  
  
