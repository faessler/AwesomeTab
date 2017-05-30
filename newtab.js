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
		// SETTINGS MENU =============== 1/X //
		document.getElementById("settings__link").addEventListener('click', function() {
			document.getElementsByClassName("settings__menu")[0].style.display = (document.getElementsByClassName("settings__menu")[0].style.display == "block") ? "none" : "block";
		});



		// GREETING ==================== 2/X //
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
			document.getElementById("showGreeting").checked = settings.greeting[0];
			document.getElementById("userName").value = settings.greeting[1];

			greetingChanged();
		});





		// DAY TIMES =================== 4/X //
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


		// CLOCK ==================== 3/X //
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
			dayTimeSlider(settings.daytime[0], settings.daytime[1]);

			document.querySelector('.noUi-handle[data-handle="1"] .noUi-tooltip').innerHTML = settings.daytime[0];
			document.querySelector('.noUi-handle[data-handle="2"] .noUi-tooltip').innerHTML = settings.daytime[1];
		});
		chrome.storage.local.get(["clock"], function(settings){
			document.getElementById("showClock").checked = settings.clock[0];
			document.getElementById("clockSeconds").checked = settings.clock[1];
			document.getElementById("clockFormat12").checked = settings.clock[2];
			document.getElementById("clockFormat24").checked = settings.clock[3];

			clockChanged();
		});



		// // ==================== //
		// // GREATINGS TEXT //
		// // ==================== //
		// document.getElementById("showHelloText").addEventListener("change", helloTextChange);
		// var inputHelloText = document.getElementById("showHelloText").checked;
		//
		// //write
		// function helloTextChange() {
		// 	var inputHelloText = document.getElementById("showHelloText").checked;
		// 	chrome.storage.local.set({ "helloText": inputHelloText }, function(){
		// 	});
		// 	setHelloText(inputHelloText);
		// }
		//
		// // read
		// chrome.storage.local.get(["helloText"], function(settings){
		// 	document.getElementById("showHelloText").checked=settings.helloText;
		// 	setHelloText(settings.helloText);
		// });
		//
		// function setHelloText(helloText) {
		// 	if(helloText) {
		// 		document.getElementsByClassName("greating")[0].style.display = "block";
		// 		document.getElementsByClassName("checklabel--sht--status")[0].innerHTML = "Active";
		// 		document.getElementsByClassName("usernamegroup")[0].style.display = "block";
		// 	} else {
		// 		document.getElementsByClassName("greating")[0].style.display = "none";
		// 		document.getElementsByClassName("checklabel--sht--status")[0].innerHTML = "Disabled";
		// 		document.getElementsByClassName("usernamegroup")[0].style.display = "none";
		// 	}
		// }
		//
		//
		//
		// // ==================== //
		// // USERNAME //
		// // ==================== //
		// document.getElementById("userName").addEventListener("change", userNameChange);
		// var inputUserName = document.getElementById("userName").value;
		//
		// //write
		// function userNameChange() {
		// 	var inputUserName = document.getElementById("userName").value;
		// 	chrome.storage.local.set({ "userName": inputUserName }, function(){
		// 	});
		// 	setUserName(inputUserName);
		// }
		//
		// // read
		// chrome.storage.local.get(["userName"], function(settings){
		// 	document.getElementById("userName").value=settings.userName;
		// 	setUserName(settings.userName);
		// });
		//
		// function setUserName(userName) {
		// 	if(userName) {
		// 		document.getElementById('username').innerHTML = ", " + userName;
		// 	} else {
		// 		document.getElementById('username').innerHTML = "";
		// 	}
		// }
		//
		//
		//
		// // ==================== //
		// // BACKGROUND IMAGE //
		// // ==================== //
		// document.getElementById("imageResolutionX").addEventListener("change", imageResolutionChange);
		// var inputImageResolutionX = document.getElementById("imageResolutionX").value;
		// document.getElementById("imageResolutionY").addEventListener("change", imageResolutionChange);
		// var inputImageResolutionY = document.getElementById("imageResolutionY").value;
		//
		// // write
		// function imageResolutionChange() {
		// 	var inputImageResolutionX = document.getElementById("imageResolutionX").value;
		// 	var inputImageResolutionY = document.getElementById("imageResolutionY").value;
		// 	chrome.storage.local.set({ "ImageResolution": [inputImageResolutionX, inputImageResolutionY] }, function(){
		// 	});
		// 	setImageResolution(inputImageResolutionX, inputImageResolutionY);
		// }
		//
		// // read
		// chrome.storage.local.get(["ImageResolution"], function(settings){
		// 	document.getElementById("imageResolutionX").value=settings.ImageResolution[0];
		// 	document.getElementById("imageResolutionY").value=settings.ImageResolution[1];
		// 	setImageResolution(settings.ImageResolution[0], settings.ImageResolution[1]);
		// });
		//
		// // function
		// function setImageResolution(imageResolutionX, imageResolutionY) {
		// 	if(imageResolutionX && imageResolutionY) {
		// 		document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x"+imageResolutionY+"/daily?peak')";
		// 	} else if(imageResolutionX && !imageResolutionY) {
		// 		document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x1440/daily?peak')";
		// 	} else if(!imageResolutionX && imageResolutionY) {
		// 		document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x"+imageResolutionY+"/daily?peak')";
		// 	} else {
		// 		document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?peak')";
		// 	}
		// }
		//
		//
		// // ======================================== //
		// // LISTENERS //
		// // ======================================== //
		// var listeners = ["imageResolutionX", "imageResolutionY", "refreshImage", "searchParams", "customImagePath"];
		// for (var i = 0; i < listeners.length; i++) {
		// 	document.getElementById(listeners[i]).addEventListener("change", defaultImageOptions);
		// 	var inputVar = document.getElementById(listeners[i]).value;
		// }
		// function defaultImageOptions() {
		// 	console.log(listeners[i]);
		// 	var inputVar = document.getElementById(listeners[i]).value;
		// 	chrome.storage.local.set({ "ImageResolution": [inputImageResolutionX, inputImageResolutionY] }, function(){
		// 	});
		// }
		//
		//
		//
		// // ==================== //
		// // GLOBAL VARIABLES //
		// // ==================== //
		// var userName = inputUserName,
		// 	imageResolution = '2560x1440',
		// 	refreshImage = '[daily,weakly,empty]',
		// 	searchParams = '?landscape,mountains,morning',
		// 	customImagePath = '';
		//
		//
		//
		// // ==================== //
		// // TIME //
		// // ==================== //
		// document.getElementById("clockFormat1").addEventListener("change", clockFormatChange);
		// var inputClockFormat1 = document.getElementById("clockFormat1").checked;
		// document.getElementById("clockFormat2").addEventListener("change", clockFormatChange);
		// var inputClockFormat2 = document.getElementById("clockFormat2").checked;
		// document.getElementById("showClockSeconds").addEventListener("change", clockFormatChange);
		// var inputshowClockSeconds = document.getElementById("showClockSeconds").checked;
		// document.getElementById("showClock").addEventListener("change", clockFormatChange);
		// var inputshowClock = document.getElementById("showClock").checked;
		//
		// // write
		// function clockFormatChange() {
		// 	var inputClockFormat1 = document.getElementById("clockFormat1").checked;
		// 	var inputClockFormat2 = document.getElementById("clockFormat2").checked;
		// 	var inputshowClockSeconds = document.getElementById("showClockSeconds").checked;
		// 	var inputshowClock = document.getElementById("showClock").checked;
		// 	chrome.storage.local.set({ "ClockFormat": [inputClockFormat1, inputClockFormat2, inputshowClockSeconds, inputshowClock] }, function(){
		// 	});
		// 	if (inputshowClock) {
		// 		document.getElementsByClassName("checklabel--sc--status")[0].innerHTML = "Active";
		// 		document.getElementsByClassName("clockgroup")[0].style.display = "block";
		// 		document.getElementsByClassName("clockgroup")[1].style.display = "block";
		// 		document.getElementById("time").style.display = "block";
		//
		// 		if (inputClockFormat1 == true) {
		// 			var clockHourFormat = 12;
		// 		} else {
		// 			var clockHourFormat = 24;
		// 		}
		// 		var showSeconds = inputshowClockSeconds;
		// 		setClockFormat(showSeconds, clockHourFormat, true);
		// 	} else {
		// 		document.getElementsByClassName("checklabel--sc--status")[0].innerHTML = "Disabled";
		// 		document.getElementsByClassName("clockgroup")[0].style.display = "none";
		// 		document.getElementsByClassName("clockgroup")[1].style.display = "none";
		// 		document.getElementById("time").style.display = "none";
		// 	}
		// }
		//
		// // read
		// chrome.storage.local.get(["ClockFormat"], function(settings){
		// 	document.getElementById("clockFormat1").checked=settings.ClockFormat[0];
		// 	document.getElementById("clockFormat2").checked=settings.ClockFormat[1];
		// 	document.getElementById("showClockSeconds").checked=settings.ClockFormat[2];
		// 	if (settings.ClockFormat[0] == true) {
		// 		var clockHourFormat = 12;
		// 	} else {
		// 		var clockHourFormat = 24;
		// 	}
		// 	var showSeconds = settings.ClockFormat[2];
		// 	setClockFormat(showSeconds, clockHourFormat);
		// });
		//
		// // function
		// // function setClockFormat(clockHourFormat, clearTimeout) {
		// // 	console.log(clockHourFormat);
		// // 		// if (clockHourFormat == 12) {
		// // 		// 	if (h == 24) {
		// // 		// 		var h12 = 0;
		// // 		// 		document.getElementById('time').innerHTML = h12 + ":" + m;
		// // 		// 	} else {
		// // 		// 		var h12 = h % 12 || 12;
		// // 		// 		document.getElementById('time').innerHTML = h12 + ":" + m;
		// // 		// 	}
		// // 		// } else {
		// // 		// 	var h24 = h;
		// // 		// 	document.getElementById('time').innerHTML = h24 + ":" + m;
		// // 		// }
		// //
		// // 		// if (h < 12) {
		// // 		// 	document.getElementById('hello').innerHTML = 'good morning';
		// // 		// 	// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,morning')";
		// // 		// } else if (h < 18) {
		// // 		// 	document.getElementById('hello').innerHTML = 'good afternoon';
		// // 		// 	// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,day')";
		// // 		// } else {
		// // 		// 	document.getElementById('hello').innerHTML = 'good evening';
		// // 		// 	document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,night')";
		// // 		// }
		// // 	}
		// function setClockFormat(showSeconds, clockHourFormat, clockActionTrigger) {
		// 	// show seconds
		// 	if(showSeconds) {
		// 		document.getElementsByClassName("checklabel--scs--status")[0].innerHTML = "Active";
		// 		console.log('its true');
		// 	} else {
		// 		document.getElementsByClassName("checklabel--scs--status")[0].innerHTML = "Disabled";
		// 		console.log('its false');
		// 	}
		//
		// 	// show clock
		// 	setTime();
		// 	function setTime() {
		// 		// console.log(clockHourFormat);
		// 		var today = new Date();
		// 		var h = today.getHours();
		// 		var m = today.getMinutes();
		// 		var s = today.getSeconds();
		// 		m = checkTime(m);
		// 		s = checkTime(s);
		// 		if (showSeconds) {
		// 			var s = ":" + s;
		// 		} else {
		// 			var s = "";
		// 		}
		// 		document.getElementById('time').innerHTML = h + ":" + m + s;
		//
		// 		if (clockHourFormat == 12) {
		// 			if (h == 24) {
		// 				var h12 = 0;
		// 				document.getElementById('time').innerHTML = h12 + ":" + m + s;
		// 			} else {
		// 				var h12 = h % 12 || 12;
		// 				document.getElementById('time').innerHTML = h12 + ":" + m + s;
		// 			}
		// 		} else {
		// 			var h24 = h;
		// 			document.getElementById('time').innerHTML = h24 + ":" + m + s;
		// 		}
		//
		// 		// greating
		// 		if (h < 12) {
		// 			document.getElementById('hello').innerHTML = 'good morning';
		// 			// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,morning')";
		// 		} else if (h < 18) {
		// 			document.getElementById('hello').innerHTML = 'good afternoon';
		// 			// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,day')";
		// 		} else {
		// 			document.getElementById('hello').innerHTML = 'good evening';
		// 			// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,night')";
		// 		}
		//
		// 		var t = setTimeout(setTime, 500);
		// 		if (setTime == true) {
		// 			clearTimeout(t);
		// 		}
		// 	}
		// }
		// function checkTime(i) {
		// 	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		// 	return i;
		// }
	}
}, 100);
