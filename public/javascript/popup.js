$('.pop-up').hide(0);

$('.pop-up-button').click(function(){
  $('.pop-up').fadeIn(300);
  $('.pop-up-button').hide(0);
});
$('.pop-up .ex').click(function() {
  $('.pop-up').hide(0);
  $('.pop-up-button').show(0);
});