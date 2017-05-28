let stateCheck = setInterval(() => {
	if (document.readyState === 'complete') {
		clearInterval(stateCheck);

		// ==================== //
		// SETTINGS //
		// ==================== //
		// write local storage
		document.getElementById("userName").addEventListener("change", userNameChange);
		var inputUserName = document.getElementById("userName").value;
		function userNameChange() {
			var inputUserName = document.getElementById("userName").value;
			chrome.storage.local.set({ "userName": inputUserName }, function(){
			});
			setUserName(inputUserName);
		}
		document.getElementById("imageResulutionX").addEventListener("change", imageResulutionXChange);
		var inputImageResulutionX = document.getElementById("imageResulutionX").value;
		function imageResulutionXChange() {
			var inputImageResulutionX = document.getElementById("imageResulutionX").value;
			chrome.storage.local.set({ "imageResulutionX": inputImageResulutionX }, function(){
			});
		}
		document.getElementById("imageResulutionY").addEventListener("change", imageResulutionYChange);
		var inputImageResulutionY = document.getElementById("imageResulutionY").value;
		function imageResulutionYChange() {
			var inputImageResulutionX = document.getElementById("imageResulutionX").value;
			chrome.storage.local.set({ "imageResulutionY": inputImageResulutionY }, function(){
			});
		}

		// read local storage
		chrome.storage.local.get(["userName"], function(settings){
			document.getElementById("userName").value=settings.userName;
			setUserName(settings.userName);
		});
		chrome.storage.local.get(["imageResulutionX"], function(settings){
			document.getElementById("imageResulutionX").value=settings.imageResulutionX;
			console.log(settings.imageResulutionX);
		});
		chrome.storage.local.get(["imageResulutionY"], function(settings){
			document.getElementById("imageResulutionY").value=settings.imageResulutionY;
			console.log(settings.imageResulutionY);
		});



		// ==================== //
		// USERNAME //
		// ==================== //
		function setUserName(userName) {
			if(userName) {
				document.getElementById('username').innerHTML = ", " + userName;
			} else {
				document.getElementById('username').innerHTML = "";
			}
		}



		// ==================== //
		// GLOBAL VARIABLES //
		// ==================== //
		var userName = inputUserName,
			imageResulution = '2560x1440',
			refreshImage = '[daily,weakly,empty]',
			searchParams = '?landscape,mountains,morning',
			customImagePath = '';



		// ==================== //
		// TIME //
		// ==================== //
		function startTime() {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			m = checkTime(m);
			s = checkTime(s);
			document.getElementById('time').innerHTML =
			h + ":" + m;
			// h + ":" + m + ":" + s;
			var t = setTimeout(startTime, 500);

			if (h < 12) {
				document.getElementById('hello').innerHTML = 'good morning';
				// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,morning')";
			} else if (h < 18) {
				document.getElementById('hello').innerHTML = 'good afternoon';
				// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,day')";
			} else {
				document.getElementById('hello').innerHTML = 'good evening';
				document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,night')";
			}
		}
		function checkTime(i) {
			if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		}
		startTime();

	}
}, 100);
