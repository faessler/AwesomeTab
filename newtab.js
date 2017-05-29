let stateCheck = setInterval(() => {
	if (document.readyState === 'complete') {
		clearInterval(stateCheck);

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
