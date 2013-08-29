
$(function(){

	$('#player_wrap').hover(function(){
		$('#seekbar, #bufferingbar, #progressbar, #slider').stop().animate({
			'height' : '10px'
		});
	},
	function(){
		$('#seekbar, #bufferingbar, #progressbar, #slider').stop().animate({
		 'height' : '5px'
		});
	});

	$('#good').on('click', function() {
  		$('#panel > img').effect( "bounce", { times: 2 }, "fast" );
	});

});
