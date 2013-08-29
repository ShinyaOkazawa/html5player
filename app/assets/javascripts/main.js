window.onload = function(){

	var player = document.getElementById('player'); 
	var player_wrap = document.getElementById('player_wrap');
	var play_btn = document.getElementById('play_btn'); 
	var play_btn_image = document.getElementById('play_btn_image');
	var seekbar = document.getElementById('seekbar'); 
	var progressbar = document.getElementById('progressbar');
	var bufferingbar = document.getElementById('bufferingbar');
	var slider = document.getElementById('slider');
	var fullscreen_btn = document.getElementById('fullscreen_btn');
	var mute_btn = document.getElementById('mute_btn');
	var mute_btn_image = document.getElementById('mute_btn_image');
	var volumebar = document.getElementById('volumebar');
	var v_progressbar = document.getElementById('v_progressbar');
	var v_slider = document.getElementById('v_slider');
	var default_v_slider_pos = v_slider.style.right = 0;
	var duration_disp = document.getElementById('duration_disp');
	var current_disp = document.getElementById('current_disp');
	var f;

	// play and pause
	function playOrPause(){
		if(player.paused){
			if(player.ended){
				progressbar.style.width = '0px';
			}
			player.play();
			play_btn_image.style.background = 'url(assets/pause.png)';
		} else {
			player.pause();
			play_btn_image.style.background = 'url(assets/play.png)';
		}
	};

	// buffer
	function updateBuffer(){
		var buffer = player.buffered;
		var lastIdx = buffer.length -1;
		var bufferedRange = player.buffered.end(lastIdx);
		var bufferWidth = bufferedRange / player.duration * seekbar.offsetWidth;
		bufferingbar.style.width = bufferWidth + 'px';
	};

	// progressbar
	function updateProgress(){
		if(!player.ended){
			var size = player.currentTime * (seekbar.offsetWidth - slider.offsetWidth) / player.duration;
			progressbar.style.width = size + slider.offsetWidth + 'px';
		} else {
			play_btn_image.style.background = 'url(assets/play.png)';
		}
		updateSlider();
	};

	// seeking
	function clickedBar(e) {
		var isFullScreen = document.fullScreen ||
			document.mozFullScreen || document.webkitIsFullScreen;
		if(isFullScreen){ // here needs to be fixed for other browser
			var mouseX = e.clientX - player.offsetLeft;
		} else {
			var mouseX = e.clientX - player_wrap.offsetLeft;
		}
		var newtime = mouseX * player.duration / seekbar.offsetWidth;
		player.currentTime = newtime;
		var size = player.currentTime * (seekbar.offsetWidth - slider.offsetWidth) / player.duration;
		progressbar.style.width = size + slider.offsetWidth + 'px';
		dragSlider();
	};
	// slider
	function updateSlider(){
			var range = seekbar.offsetWidth - slider.offsetWidth;
			var transfer = player.currentTime / player.duration * range;
			slider.style.left = transfer + 'px';			
	};
	
	// make slider draggable
	function dragSlider(){
		var dragging = true;
		var range = seekbar.offsetWidth - slider.offsetWidth;

		document.onmouseup = function(e){	
				dragging = false;
		};

		document.onmousemove = function(e){			
			if(dragging){
				if(e.clientX < seekbar.offsetLeft){
					slider.style.left = 0;
				} else if(e.clientX > seekbar.offsetWidth + player_wrap.offsetLeft){
					slider.style.left = range + 'px'; 
				} else {
					clickedBar(e);
				};
			};		
		};
	};

	// mute_btn
	function mute(){
		if(player.muted == false){
			player.muted = true;
			mute_btn_image.style.background = 'url(assets/speaker_off.png)';
		} else {
			player.muted = false;
			mute_btn_image.style.background = 'url(assets/speaker_on.png)';
		};
	};

	// volume control
	function changeVol(){
		var dragging = true;
		document.onmouseup = function(e){
			dragging = false;
		};
		document.onmousemove = function(e){
			if(dragging){
				clickableVol(e);	
				updateVProgress();			
			};
		};	
	};

	// v_progress
	function updateVProgress(){

		var size = v_slider.offsetLeft - volumebar.offsetLeft / volumebar.offsetWidth;
		v_progressbar.style.width = size + v_slider.offsetWidth + 'px';
			
		
	};
	updateVProgress(); // for default setting of v_progressbar

	// make volumebar clickable
	function clickableVol(e){
		var isFullScreen = document.fullScreen ||
			document.mozFullScreen || document.webkitIsFullScreen;
		if(isFullScreen){ // here needs to be fixed for other browser
			var s = player.offsetLeft + volumebar.offsetLeft;
			var mouseX = e.clientX - player.offsetLeft - volumebar.offsetLeft;				
		} else {
			var s = player_wrap.offsetLeft + volumebar.offsetLeft;
			var mouseX = e.clientX - player_wrap.offsetLeft - volumebar.offsetLeft;				
		}
			var x = e.clientX;
			var w = volumebar.offsetWidth - v_slider.offsetWidth;
			var vol = (x - s) / w;

		changeVol();
		if(vol < 0){
			player.volume = vol = 0;
			v_slider.style.left = 0;
			mute_btn_image.style.background = 'url(assets/speaker_off.png)';
		} else if (vol > 1){
			player.volume = vol = 1;
			v_slider.style.left = w + 'px';
		} else {
			// complementary control of volume value when the value can't reflect completely 0 and 1
			mute_btn_image.style.background = 'url(assets/speaker_on.png)';
			if(vol < 0.02){
				player.volume = vol = 0;
			} else if (vol > 0.98){
				player.volume = vol = 1;
			};

			v_slider.style.left = mouseX + 'px';
			player.volume = vol;
		};
		updateVProgress();
	};

	function durationDisplay(){
  		if (player.duration) duration_disp.innerHTML = formatTime(player.duration);
	}
 	function currentTimeDisplay(){
 		current_disp.innerHTML = formatTime(player.currentTime);
 	}
	function formatTime(seconds) {
		seconds = Math.round(seconds);
		minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	}

	// enter fullscreen mode and exit fullscreen mode
	function fullscreen() {
		var isFullScreen = document.fullScreen ||
			document.mozFullScreen || document.webkitIsFullScreen;
		if(isFullScreen){ // here needs to be fixed for other browser
			if (document.exitFullscreen) {
    			document.exitFullscreen();
    			fullscreen_btn.style.background = 'url(assets/fullscreen.png)';
  			} else if (document.mozExitFullScreen) {
    			document.mozExitFullScreen(); // Firefox
    			fullscreen_btn.style.background = 'url(assets/fullscreen.png)';
  			} else if (document.webkitExitFullscreen) {
    			document.webkitExitFullscreen(); // Chrome and Safari
    			fullscreen_btn.style.background = 'url(assets/fullscreen.png)';
    			bufferingbar.style.width =  0+ 'px';
  			}
		} else {
  			if (player_wrap.requestFullscreen) {
    			player_wrap.requestFullscreen();
    			fullscreen_btn.style.background = 'url(assets/exitfullscreen.png)';
  			} else if (player_wrap.mozRequestFullScreen) {
    			player_wrap.mozRequestFullScreen(); // Firefox
    			fullscreen_btn.style.background = 'url(assets/exitfullscreen.png)';
  			} else if (player_wrap.webkitRequestFullscreen) {
    			player_wrap.webkitRequestFullscreen(); // Chrome and Safari
    			fullscreen_btn.style.background = 'url(assets/exitfullscreen.png)';
  			}
  		}
	};

	function changeFullscreenIcon(){
		var isFullScreen = document.fullScreen ||
			document.mozFullScreen || document.webkitIsFullScreen;
		if(isFullScreen){ // here needs to be fixed for other browser
			fullscreen_btn.style.background = 'url(assets/exitfullscreen.png)';
		} else {
			fullscreen_btn.style.background = 'url(assets/fullscreen.png)';
		}
	}
	player.addEventListener('click', playOrPause, false);
	play_btn.addEventListener('click', playOrPause, false);
	player.addEventListener('timeupdate', updateProgress, false);
	seekbar.addEventListener('mousedown', clickedBar, false);
	mute_btn.addEventListener('click', mute, false);
	volumebar.addEventListener('mousedown', clickableVol, false);
	player.addEventListener('timeupdate', currentTimeDisplay, false);
	fullscreen_btn.addEventListener('click', fullscreen, false);
	document.addEventListener('webkitfullscreenchange', changeFullscreenIcon, false);
	document.addEventListener('mozfullscreenchange', changeFullscreenIcon, false);
	document.addEventListener('fullscreenchange', changeFullscreenIcon, false);
	document.addEventListener('webkitfullscreenchange', updateProgress, false);
	document.addEventListener('mozfullscreenchange', updateProgress, false);
	document.addEventListener('fullscreenchange', updateProgress, false);
	player.addEventListener('timeupdate', updateBuffer, false);

	// update chart
	function afterLoaded(){
		durationDisplay();
	}

	setTimeout(afterLoaded, 1000);

	// render chart
	var good = document.getElementById('good');

    $.ajax({
    	type: "GET",
    	url: "/votes.json",
    	dataType: "json",
    	data:{
 
   		},
   		success: function(data){

   			var sum = 0;
   			for(var i=0; i < data.length; i++){
   				sum += data[i].cnt;
   			}
   			var xlabel = [];
			var nmc = 20; // number of columns
			var lec = player.duration.toFixed() / nmc // label each column

			for(var i=1; i <= nmc; i++){
				xlabel[i-1] = Math.floor(lec * i - lec) + '-' + Math.floor(lec * i);
			}
		
			var dps = [];
			for(var i=0; i<nmc; i++){
				dps[i] = {label: xlabel[i], y: data[i].cnt};
			};

			var totalnum = "total vote: " + sum;

			var chart = new CanvasJS.Chart("chartContainer",{
		
				theme: "theme2",
				title:{ 
					text: "scene voting"
				},
				axisX: {
					interval:1,
					labelAngle: 90,
					labelFontSize: 11
				},
				axisY: {				
					minimum: 0
				},			
				legend:{
					verticalAlign: "top",
					horizontalAlign: "center",
					fontSize: 18
				},
				data: [{
					type: "column",
					showInLegend: true,
					legendMarkerType: "none",				
					legendText: totalnum,
					//indexLabel: "{y}",
					dataPoints: dps
				}]
			});

			// renders initial chart
			chart.render();

			// update chart per click
  			$("#good").on("click", function(event) {

				var ct = player.currentTime.toFixed();
				var dataPointIndex;
				var x;

				for(var i=1; i<=nmc; i++){
					if(ct <= lec*i){
						dataPointIndex = i-1;
						break;
					}
				}

				// updating legend text. 
				totalnum = "total vote: " + ++sum;			
				chart.options.data[0].legendText = totalnum;

    			var vote_id;
    			vote_id = dataPointIndex + 1;

    			$.ajax({
     				type: "POST",
     				url: "/votes/" + vote_id + "/like.json",
     				data: {
        				_method: "PATCH"
     				}
    			}).done(function(msg) {
    				dps[dataPointIndex].y++;
    				chart.render();
    			});
  			});
   		},
   		error:function(){
   			console.log('ajax is not working');
   		}
   	});
	
}
