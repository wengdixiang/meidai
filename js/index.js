$(document).ready(function(){

    $(".index-img").lazyload({
        effect: "fadeIn",
        threshold : 200,
    });


    // 产品展示
    $('.mouseenter-show').mouseenter(function(){
        $(this).find(".overlay-block").fadeIn(200);
    })
    $('.mouseenter-show').mouseleave(function(){
        $(this).find(".overlay-block").fadeOut(200);
    })

    // bootstrap插件的轮播
    var interval = 3000;

    $('.carousel').carousel({
        interval: interval,
        wrap:false,
    })

    var imgLength = $('.carousel-inner img').length;        
    $('.carousel-next').fadeIn(500);


    $('#myCarousel').on('slid.bs.carousel', function (e) {
        $('.carousel-prev').fadeIn(500);
        $('.carousel-next').fadeIn(500);

        if(e.relatedTarget.id == 'img_last'){

            setTimeout(function() { 
                $('#myCarousel').carousel(0);
            },interval); 
            $('.carousel-next').fadeOut(500);

            // $('#carousel_inner_button').stop(true,true).fadeIn(500); 
            $('#carousel_inner_button').fadeIn(500); 

        }
        if(e.relatedTarget.id == 'img_first'){
            $('.carousel-prev').fadeOut(500);
            
        }

    })
    // 控制立即预约ban按钮的显示
    $('#myCarousel').on('slide.bs.carousel', function (e) {
        if(e.relatedTarget.id != 'img_last'){
            $('#carousel_inner_button').stop(true,true).fadeOut(300);
        }
    })
    $("img").lazyload({
        effect: "fadeIn",
        effectspeed : 0.5,
        threshold : 200,
    });
})  

