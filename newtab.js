// Stuff

console.log("test");


// INFOS FROM SETTINGS (TODO)
var userName = 'Jan',
    imageResulution = '2560x1440',
	refreshImage = '[daily,weakly,empty]',
	searchParams = '?landscape,mountains,morning',
	customImagePath = '';



// TIME
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
		document.getElementById('hello').innerHTML = 'good morning, ' + userName;
		// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,morning')";
	} else if (h < 18) {
		document.getElementById('hello').innerHTML = 'good afternoon, ' + userName;
		// document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,day')";
	} else {
		document.getElementById('hello').innerHTML = 'good evening, ' + userName;
		document.body.style.backgroundImage = "url('https://source.unsplash.com/2560x1440/daily?landscape,night')";
	}
}
function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}
document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
		startTime()
	}
};


// document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1483976503408-d7e149fbf0d3?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=&bg=')";
