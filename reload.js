/*
window.addEventListener('load', function() {
	window.setTimeout(function() {
		// ...
	}, 500);
});
*/

(function(){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				console.log('reload triggered for '+xhr.responseText);
				location.reload();
			}
		};
		xhr.open('GET', '/wait.cgi', true);
		xhr.send();
})();
