let stateCheck = setInterval(() => {
	if (document.readyState === 'complete') {
		clearInterval(stateCheck);



		// ================================ //
		// LOADING //
		// ================================ //
		document.getElementsByClassName("loading")[0].style.opacity = "0";
		setTimeout(
			function() {
				document.getElementsByClassName("loading")[0].style.display = "none";
			}, 300
		);



		// ================================ //
		// SETTINGS //
		// ================================ //
		// SETTINGS MENU =============== 1/5 //
		document.getElementById("settings__link").addEventListener('click', function() {
			document.getElementsByClassName("settings__menu")[0].style.display = (document.getElementsByClassName("settings__menu")[0].style.display == "block") ? "none" : "block";
		});



		// GREETING ==================== 2/5 //
		// listener
		var listenerIds = ["showGreeting", "userName"];
		for (var i = 0; i < listenerIds.length; i++) {
			document.getElementById(listenerIds[i]).addEventListener("change", greetingChanged);
		}

		// vars
		var showGreeting = document.getElementById("showGreeting").checked;
		var userName = document.getElementById("userName").value;

		// write
		function greetingChanged() {
			var showGreeting = document.getElementById("showGreeting").checked;
			var userName = document.getElementById("userName").value;

			chrome.storage.local.set({"greeting": [showGreeting, userName]}, function(){
			});

			if(!showGreeting) {
				document.getElementsByClassName("showGreeting--status")[0].innerHTML = "Disabled";
				document.getElementsByClassName("greetinggroup")[0].style.display = "none";
				document.getElementsByClassName("greeting")[0].style.display = "none";
			} else {
				document.getElementsByClassName("showGreeting--status")[0].innerHTML = "Active";
				document.getElementsByClassName("greetinggroup")[0].style.display = "block";
				document.getElementsByClassName("greeting")[0].style.display = "block";

				if(userName) {
					document.getElementById('greeting__username').innerHTML = ", " + userName;
				} else {
					document.getElementById('greeting__username').innerHTML = "";
				}
			}
		}

		// read
		chrome.storage.local.get(["greeting"], function(settings){
			if(typeof settings.greeting === "undefined") {
				var showGreeting = document.getElementById("showGreeting").checked = true;
				var userName = document.getElementById("userName").value = "";
				chrome.storage.local.set({"greeting": [showGreeting, userName]}, function(){
				});
				greetingChanged();
			} else {
				document.getElementById("showGreeting").checked = settings.greeting[0];
				document.getElementById("userName").value = settings.greeting[1];

				greetingChanged();
			}
		});



		// DAY TIMES =================== 3/5 //
		// slider
		function dayTimeSlider(morningEnd, afternoonEnd) {
			var slider = document.getElementById('dayTimesRange');
			noUiSlider.create(slider, {
				start: [0, morningEnd, afternoonEnd, 24],
				connect: true,
				step: 1,
				tooltips: true,
				behaviour: 'none',
				range: {
					'min': 0,
					'max': 24
				}
			});
			// listener
			var listenerIds = ['.noUi-handle[data-handle="1"]', '.noUi-handle[data-handle="2"]'];
			for (var i = 0; i < listenerIds.length; i++) {
				document.querySelector(listenerIds[i]).addEventListener("click", clockChanged);
			}
		}


		// CLOCK ==================== 4/5 //
		// listener
		var listenerIds = ["showClock", "clockFormat12", "clockFormat24", "clockSeconds"];
		for (var i = 0; i < listenerIds.length; i++) {
			document.getElementById(listenerIds[i]).addEventListener("change", clockChanged);
		}

		// vars
		var showClock = document.getElementById("showClock").checked;
		var clockFormat12 = document.getElementById("clockFormat12").checked;
		var clockFormat24 = document.getElementById("clockFormat24").checked;
		var clockSeconds = document.getElementById("clockSeconds").checked;

		// write
		function clockChanged() {
			var showClock = document.getElementById("showClock").checked;
			var clockSeconds = document.getElementById("clockSeconds").checked;
			var clockFormat12 = document.getElementById("clockFormat12").checked;
			var clockFormat24 = document.getElementById("clockFormat24").checked;
			var morningEnd = document.querySelector('.noUi-handle[data-handle="1"] .noUi-tooltip').innerHTML;
			var afternoonEnd = document.querySelector('.noUi-handle[data-handle="2"] .noUi-tooltip').innerHTML;

			chrome.storage.local.set({"clock": [showClock, clockSeconds, clockFormat12, clockFormat24]}, function(){
			});
			chrome.storage.local.set({"daytime": [morningEnd, afternoonEnd]}, function(){
			});

			if(!showClock) {
				document.getElementsByClassName("showClock--status")[0].innerHTML = "Disabled";
				document.getElementsByClassName("clockSeconds--status")[0].innerHTML = "Disabled";
				document.getElementsByClassName("clockgroup")[0].style.display = "none";
				document.getElementsByClassName("clockgroup")[1].style.display = "none";
				document.getElementById("time").style.display = "none";
			} else {
				document.getElementsByClassName("showClock--status")[0].innerHTML = "Active";
				document.getElementsByClassName("clockSeconds--status")[0].innerHTML = "Active";
				document.getElementsByClassName("clockgroup")[0].style.display = "block";
				document.getElementsByClassName("clockgroup")[1].style.display = "block";
				document.getElementById("time").style.display = "block";
			}

			function startTime() {
				// change listener
				var listenerIds = ["showClock", "clockFormat12", "clockFormat24", "clockSeconds"];
				for (var i = 0; i < listenerIds.length; i++) {
					document.getElementById(listenerIds[i]).addEventListener("change", activeClockHasChanged);
				}
				var listenerIds = ['.noUi-handle[data-handle="1"]', '.noUi-handle[data-handle="2"]'];
				for (var i = 0; i < listenerIds.length; i++) {
					document.querySelector(listenerIds[i]).addEventListener("click", activeClockHasChanged);
				}

				// get time
				var today = new Date();
				var h = today.getHours();
				var m = today.getMinutes();
				var s = today.getSeconds();
				m = checkTime(m);
				s = checkTime(s);

				// greating
				if (h < morningEnd) {
					document.getElementById('greeting__hello').innerHTML = 'good morning';
				} else if (h < afternoonEnd) {
					document.getElementById('greeting__hello').innerHTML = 'good afternoon';
				} else {
					document.getElementById('greeting__hello').innerHTML = 'good evening';
				}

				// am & pm
				if (h < 12) {
					var mediriem = 'AM';
				} else {
					var mediriem = 'PM';
				}
				var mediriemHtml = '<div class="time__meridiem">' + mediriem + '</div>'

				// seconds & hour format
				if (clockSeconds && clockFormat12) {
					if (h == 0) {
						var h12 = 0;
						document.getElementById('time').innerHTML = h12 + ":" + m + ":" + s + mediriemHtml;
					} else {
						var h12 = h % 12 || 12;
						document.getElementById('time').innerHTML = h12 + ":" + m + ":" + s + mediriemHtml;
					}
				} else if (!clockSeconds && clockFormat12) {
					if (h == 0) {
						var h12 = 0;
						document.getElementById('time').innerHTML = h12 + ":" + m + mediriemHtml;
					} else {
						var h12 = h % 12 || 12;
						document.getElementById('time').innerHTML = h12 + ":" + m + mediriemHtml;
					}
				} else if (clockSeconds && !clockFormat12) {
					document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
				} else {
					document.getElementById('time').innerHTML = h + ":" + m;
				}

				// timeout
				var x = setTimeout(startTime, 500);
				function activeClockHasChanged() {
					clearTimeout(x);
				}
			}
			function checkTime(i) {
				if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
				return i;
			}
			startTime();
		}

		// read
		chrome.storage.local.get(["daytime"], function(settings){
			if(typeof settings.daytime === "undefined") {
				dayTimeSlider(12, 18);
				chrome.storage.local.set({"daytime": [12, 18]}, function(){
				});
			} else {
				dayTimeSlider(settings.daytime[0], settings.daytime[1]);

				document.querySelector('.noUi-handle[data-handle="1"] .noUi-tooltip').innerHTML = settings.daytime[0];
				document.querySelector('.noUi-handle[data-handle="2"] .noUi-tooltip').innerHTML = settings.daytime[1];
			}
		});
		chrome.storage.local.get(["clock"], function(settings){
			if(typeof settings.clock === "undefined") {
				var showClock = document.getElementById("showClock").checked = true;
				var clockSeconds = document.getElementById("clockSeconds").checked = false;
				var clockFormat12 = document.getElementById("clockFormat12").checked = false;
				var clockFormat24 = document.getElementById("clockFormat24").checked = true;

				chrome.storage.local.set({"clock": [showClock, clockSeconds, clockFormat12, clockFormat24]}, function(){
				});
				clockChanged();
			} else {
				document.getElementById("showClock").checked = settings.clock[0];
				document.getElementById("clockSeconds").checked = settings.clock[1];
				document.getElementById("clockFormat12").checked = settings.clock[2];
				document.getElementById("clockFormat24").checked = settings.clock[3];

				clockChanged();
			}
		});



		// DEFAULT IMAGE ============ 5/5 //
		// listeners
		var listenerIds = ["imageResolutionX", "imageResolutionY", "imageRefresh", "imageSearchParams", "imageCustomUrl"];
		for (var i = 0; i < listenerIds.length; i++) {
			document.getElementById(listenerIds[i]).addEventListener("change", imageChanged);
		}

		// write
		function imageChanged() {
			var imageResolutionX = document.getElementById("imageResolutionX").value;
			var imageResolutionY = document.getElementById("imageResolutionY").value;
			var imageRefresh = document.getElementById("imageRefresh").value;
			var imageSearchParams = document.getElementById("imageSearchParams").value;
			var imageCustomUrl = document.getElementById("imageCustomUrl").value;
			chrome.storage.local.set({ "imageOptions": [imageResolutionX, imageResolutionY, imageRefresh, imageSearchParams, imageCustomUrl] }, function(){
			});
			setImageResolution(imageResolutionX, imageResolutionY, imageRefresh, imageSearchParams, imageCustomUrl);
		}

		// read
		chrome.storage.local.get(["imageOptions"], function(settings){
			if(typeof settings.imageOptions === "undefined") {
				var imageRefresh = document.getElementById("imageRefresh").value = "daily";

				setImageResolution(2560, 1440, imageRefresh);
			} else {
				document.getElementById("imageResolutionX").value = settings.imageOptions[0];
				document.getElementById("imageResolutionY").value = settings.imageOptions[1];
				document.getElementById("imageRefresh").value = settings.imageOptions[2];
				document.getElementById("imageSearchParams").value = settings.imageOptions[3];
				document.getElementById("imageCustomUrl").value = settings.imageOptions[4];
				setImageResolution(settings.imageOptions[0], settings.imageOptions[1], settings.imageOptions[2], settings.imageOptions[3], settings.imageOptions[4]);
			}
		});

		// function
		function setImageResolution(imageResolutionX, imageResolutionY, imageRefresh, imageSearchParams, imageCustomUrl) {
			if (imageSearchParams) {
				imageSearchParams = imageSearchParams.replace(/\s/g,'');
			} else {
				var imageSearchParams = "peak";
			}
			if (imageRefresh != "never") {
				if(imageResolutionX && imageResolutionY) {
					document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x"+imageResolutionY+"/" + imageRefresh + "?" + imageSearchParams + "')";
				} else if(imageResolutionX && !imageResolutionY) {
					document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x1440/" + imageRefresh + "?" + imageSearchParams + "')";
				} else if(!imageResolutionX && imageResolutionY) {
					document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x"+imageResolutionY+"/" + imageRefresh + "?" + imageSearchParams + "')";
				} else {
					document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/" + imageRefresh + "?" + imageSearchParams + "')";
				}
				document.getElementsByClassName("imagegeneralgroup")[0].style.display = "block";
				document.getElementsByClassName("imagecustomgroup")[0].style.display = "none";
				document.getElementsByClassName("imagecustomgroup")[1].style.display = "none";
			} else {
				document.getElementsByClassName("imagegeneralgroup")[0].style.display = "none";
				document.getElementsByClassName("imagecustomgroup")[0].style.display = "block";

				if (!imageCustomUrl) {
					document.getElementsByClassName("imagecustomgroup")[1].style.display = "block";
					document.getElementById("imageCustomUrl").style.border = "";
				} else {
					document.getElementsByClassName("imagecustomgroup")[1].style.display = "none";

					function checkImage (src, good, bad) {
					    var img = new Image();
					    img.onload = good;
					    img.onerror = bad;
					    img.src = src;
					}
					checkImage(imageCustomUrl, function(){
						document.body.style.backgroundImage = "url('" + imageCustomUrl + "')";
						document.getElementById("imageCustomUrl").style.border = "";
					}, function(){
						document.getElementById("imageCustomUrl").style.border = "1px solid red";
					});
				}
			}
		}
	}
}, 100);
