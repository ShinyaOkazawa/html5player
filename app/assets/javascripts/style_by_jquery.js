$(function(){

	// make height of seekbar 5px to 10px when mouse hover seekbar
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

});