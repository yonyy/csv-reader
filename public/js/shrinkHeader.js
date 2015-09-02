// Shrink navbar when user has scrolled past 300 
$(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 300){
            $('.navbar-default').addClass('navbar-shrink');
        }
        else{
            $('.navbar-default').removeClass('navbar-shrink');
        }
    });
});