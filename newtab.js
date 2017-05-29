let stateCheck = setInterval(() => {
	if (document.readyState === 'complete') {
		clearInterval(stateCheck);



		// ==================== //
		// LOADING //
		// ==================== //
		document.getElementsByClassName("loading")[0].style.opacity = "0";
		setTimeout(
			function() {
				document.getElementsByClassName("loading")[0].style.display = "none";
			}, 300
		);



		// ==================== //
		// GREATINGS TEXT //
		// ==================== //
		document.getElementById("showHelloText").addEventListener("change", helloTextChange);
		var inputHelloText = document.getElementById("showHelloText").checked;

		//write
		function helloTextChange() {
			var inputHelloText = document.getElementById("showHelloText").checked;
			chrome.storage.local.set({ "helloText": inputHelloText }, function(){
			});
			setHelloText(inputHelloText);
		}

		// read
		chrome.storage.local.get(["helloText"], function(settings){
			document.getElementById("showHelloText").checked=settings.helloText;
			setHelloText(settings.helloText);
		});

		function setHelloText(helloText) {
			if(helloText) {
				document.getElementsByClassName("greating")[0].style.display = "block";
				document.getElementsByClassName("checklabel--status")[0].innerHTML = "Active";
				document.getElementsByClassName("usernamegroup")[0].style.display = "block";
			} else {
				document.getElementsByClassName("greating")[0].style.display = "none";
				document.getElementsByClassName("checklabel--status")[0].innerHTML = "Disabled";
				document.getElementsByClassName("usernamegroup")[0].style.display = "none";
			}
		}



		// ==================== //
		// USERNAME //
		// ==================== //
		document.getElementById("userName").addEventListener("change", userNameChange);
		var inputUserName = document.getElementById("userName").value;

		//write
		function userNameChange() {
			var inputUserName = document.getElementById("userName").value;
			chrome.storage.local.set({ "userName": inputUserName }, function(){
			});
			setUserName(inputUserName);
		}

		// read
		chrome.storage.local.get(["userName"], function(settings){
			document.getElementById("userName").value=settings.userName;
			setUserName(settings.userName);
		});

		function setUserName(userName) {
			if(userName) {
				document.getElementById('username').innerHTML = ", " + userName;
			} else {
				document.getElementById('username').innerHTML = "";
			}
		}



		// ==================== //
		// BACKGROUND IMAGE //
		// ==================== //
		document.getElementById("imageResolutionX").addEventListener("change", imageResolutionChange);
		var inputImageResolutionX = document.getElementById("imageResolutionX").value;
		document.getElementById("imageResolutionY").addEventListener("change", imageResolutionChange);
		var inputImageResolutionY = document.getElementById("imageResolutionY").value;

		// write
		function imageResolutionChange() {
			var inputImageResolutionX = document.getElementById("imageResolutionX").value;
			var inputImageResolutionY = document.getElementById("imageResolutionY").value;
			chrome.storage.local.set({ "ImageResolution": [inputImageResolutionX, inputImageResolutionY] }, function(){
			});
			setImageResolution(inputImageResolutionX, inputImageResolutionY);
		}

		// read
		chrome.storage.local.get(["ImageResolution"], function(settings){
			document.getElementById("imageResolutionX").value=settings.ImageResolution[0];
			document.getElementById("imageResolutionY").value=settings.ImageResolution[1];
			setImageResolution(settings.ImageResolution[0], settings.ImageResolution[1]);
		});

		// function
		function setImageResolution(imageResolutionX, imageResolutionY) {
			if(imageResolutionX && imageResolutionY) {
				document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x"+imageResolutionY+"/daily?peak')";
			} else if(imageResolutionX && !imageResolutionY) {
				document.body.style.backgroundImage = "url('https://source.unsplash.com/"+imageResolutionX+"x1440/daily?peak')";
			} else if(!imageResolutionX && imageResolutionY) {
				document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x"+imageResolutionY+"/daily?peak')";
			} else {
				document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?peak')";
			}
		}



		// ==================== //
		// GLOBAL VARIABLES //
		// ==================== //
		var userName = inputUserName,
			imageResolution = '2560x1440',
			refreshImage = '[daily,weakly,empty]',
			searchParams = '?landscape,mountains,morning',
			customImagePath = '';



		// ==================== //
		// TIME //
		// ==================== //
		document.getElementById("clockFormat1").addEventListener("change", clockFormatChange);
		var inputClockFormat1 = document.getElementById("clockFormat1").checked;
		document.getElementById("clockFormat2").addEventListener("change", clockFormatChange);
		var inputClockFormat2 = document.getElementById("clockFormat2").checked;

		// write
		function clockFormatChange() {
			var inputClockFormat1 = document.getElementById("clockFormat1").checked;
			var inputClockFormat2 = document.getElementById("clockFormat2").checked;
			chrome.storage.local.set({ "ClockFormat": [inputClockFormat1, inputClockFormat2] }, function(){
			});
			if (inputClockFormat1 == true) {
				var clockHourFormat = 12;
			} else {
				var clockHourFormat = 24;
			}
			setClockFormat(clockHourFormat, true);
		}

		// read
		chrome.storage.local.get(["ClockFormat"], function(settings){
			document.getElementById("clockFormat1").checked=settings.ClockFormat[0];
			document.getElementById("clockFormat2").checked=settings.ClockFormat[1];
			if (settings.ClockFormat[0] == true) {
				var clockHourFormat = 12;
			} else {
				var clockHourFormat = 24;
			}
			setClockFormat(clockHourFormat);
		});

		// function
		// function setClockFormat(clockHourFormat, clearTimeout) {
		// 	console.log(clockHourFormat);
		// 		// if (clockHourFormat == 12) {
		// 		// 	if (h == 24) {
		// 		// 		var h12 = 0;
		// 		// 		document.getElementById('time').innerHTML = h12 + ":" + m;
		// 		// 	} else {
		// 		// 		var h12 = h % 12 || 12;
		// 		// 		document.getElementById('time').innerHTML = h12 + ":" + m;
		// 		// 	}
		// 		// } else {
		// 		// 	var h24 = h;
		// 		// 	document.getElementById('time').innerHTML = h24 + ":" + m;
		// 		// }
		//
		// 		// if (h < 12) {
		// 		// 	document.getElementById('hello').innerHTML = 'good morning';
		// 		// 	// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,morning')";
		// 		// } else if (h < 18) {
		// 		// 	document.getElementById('hello').innerHTML = 'good afternoon';
		// 		// 	// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,day')";
		// 		// } else {
		// 		// 	document.getElementById('hello').innerHTML = 'good evening';
		// 		// 	document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,night')";
		// 		// }
		// 	}
		function setClockFormat(clockHourFormat, clockActionTrigger) {
			console.log(clockHourFormat);
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			m = checkTime(m);
			s = checkTime(s);
			document.getElementById('time').innerHTML = h + ":" + m;

			if (clockHourFormat == 12) {
				if (h == 24) {
					var h12 = 0;
					document.getElementById('time').innerHTML = h12 + ":" + m;
				} else {
					var h12 = h % 12 || 12;
					document.getElementById('time').innerHTML = h12 + ":" + m;
				}
			} else {
				var h24 = h;
				document.getElementById('time').innerHTML = h24 + ":" + m;
			}

			var t = setTimeout(setClockFormat, 500);
			if (clockActionTrigger == true) {
				clearTimeout(t);
			}
		}
		function checkTime(i) {
			if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		}
	}
}, 100);
