(function() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4)
			location.reload();
	};
	xhr.open('GET', '/wait.cgi');
	xhr.send();
})();
