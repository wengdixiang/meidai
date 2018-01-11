$(function(){
    $(".product-right img").lazyload({
        effect: "fadeIn",
        threshold : 200,
    });

    var carrousel = $( ".product-img-magnify" );
    // var carrousel = $( "#product-bounced" );
    $( ".product-right-img" ).click( function(e){
        var src = $(this).attr( "src" );
        // console.log(src);
        carrousel.find("img").attr( "src", src );
        carrousel.fadeIn( 200 );
    });

    carrousel.find( "img" ).click( function(e){
        carrousel.fadeOut( 200 );
    });
    carrousel.find( "#product-bounced span" ).click( function(e){
        carrousel.fadeOut( 200 );
    });
}); 

