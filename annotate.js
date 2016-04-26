function enclose(range) {
	var r = range.getBoundingClientRect();
	var e = document.createElement('div');
	e.class = 'box';

	/*
	 * To compensate for getBoundingClientRect() coords being relative to
	 * viewport, not document.
	 */
	var doc = document.documentElement;
	var xoff = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var yoff = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

	var border = 2; // px

	e.style.position = 'absolute';
	e.style.top = (r.top+yoff-border)+'px';
	e.style.left = (r.left+xoff-border)+'px';
	e.style.height = r.height+'px';
	e.style.width = r.width+'px';

	e.style.borderWidth = border+'px';

	e.range = range.cloneRange();

	return e;
}

function RangeMaker(root) {
	this.root = root;
	this.text = "";
	var iter = document.createNodeIterator(root, NodeIterator.SHOW_TEXT, function(x) {
		return x.nodeType === Node.TEXT_NODE;
	});
	this.nodes = [];
	var n;
	while (n = iter.nextNode()) {
		if (n.textContent !== "") {
			this.text += n.textContent;
			this.nodes.push({text: n.textContent, node: n});
		}
	}
}
RangeMaker.prototype.consume = function(n) {
	if (n == 0)
		return;
	if (n < 0)
		throw "can't \"un-consume\"";
	if (this.nodes.length == 0)
		throw "nothing to consume";

	var l0 = this.nodes[0].text.length;
	if (n > l0) {
		this.text = this.text.substr(l0);
		this.nodes.shift();
		return this.consume(n-l0);
	} else {
		this.text = this.text.substr(n);
		this.nodes[0].offset |= 0;
		this.nodes[0].offset += n;
		this.nodes[0].text = this.nodes[0].text.substr(n);
		if (this.nodes[0].text === "")
			this.nodes.shift();
	}
};
RangeMaker.prototype.span = function(n) {
	var that = this;
	function recurse(i, m) {
		if (m < 0)
			throw "can't span backwards";
		if (that.nodes.length == 0)
			throw "nothing to consume";

		var li = that.nodes[i].text.length;
		if (m > li) {
			return recurse(i+1, m-li);
		}
		return {node: that.nodes[i].node, offset: m + (that.nodes[i].offset || 0)};
	}
	return recurse(0, n);
};
RangeMaker.prototype.next = function(re) {
	var match = re.exec(this.text);
	if (match === null)
		throw ('no match for '+re);
	this.consume(match.index);
	var end = this.span(match[0].length);
	var r = new Range();
	r.setStart(this.nodes[0].node, this.nodes[0].offset || 0);
	r.setEnd(end.node, end.offset);
	return r;
};

function addCSS(text) {
	var style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet)
		style.styleSheet.cssText = text;
	else
		style.appendChild(document.createTextNode(text));
	document.head.appendChild(style);
}

window.addEventListener('DOMContentLoaded', function() {
	addCSS('\
body { \
	padding-left: 30px; \
} \
.box { \
	position: absolute; \
	border-color: #fc0; \
	border-style: solid; \
	border-radius: 3px; \
} \
.box.front { \
	border-style: solid; \
	border-color: red; \
} \
.note { \
	display: none; \
	position: absolute; \
	left: 630px; \
	list-style-type: none; \
	padding: 1em; \
	background: #cef; \
	border-radius: 5px; \
	margin-right: 30px; \
	max-width: 400px; \
} \
.note.front { \
	display: block; \
} \
.note > p:first-child { \
	margin-top: 0px; \
} \
.note > p:last-child { \
	margin-bottom: 0px; \
} \
	');

	var x = window.x = {};
	window.doc = document.title.split(' ')[0];
	function GET(url, cb) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			cb(xhr.responseText);
		};
		xhr.open('GET', url, true);
		xhr.send();
	}

	function unbring() {
		var fronts = document.querySelectorAll('.front');
		Array.prototype.forEach.call(fronts, function(f) {
			f.classList.remove('front');
		});
		history.replaceState(null, document.title, location.pathname + location.search);
	}
	x.unbring = unbring;

	function bring(box) {
		var note = box.note;
		unbring();
		box.classList.add('front');
		note.classList.add('front');
		history.replaceState(null, document.title, location.pathname + location.search + '#'+note.id);
	}
	x.bring = bring;

	function dobring(evt) {
		x.evt = evt;
		bring(evt.currentTarget);
	}

	GET('/'+doc+'.json', function(resp) {
		x.adom_ul = document.createElement('ul');
		x.adom_div = document.createElement('div');

		try {
			var rm = new RangeMaker(document.body);
			(x.annotations = JSON.parse(x.json = resp)).forEach(function(a, n) {
				// create
				var box = enclose(rm.next(new RegExp(a.sel, 'm')));
				var note = document.createElement('li');

				// classes
				note.className = 'note';
				box.className = 'box';

				// local
				note.innerHTML = a.txt;
				note.style.top = box.style.top;

				// ids
				box.id = 'box-'+(n+1);
				note.id = 'note-'+(n+1);

				// dom xrefs
				box.note = note;
				note.box = box;

				// event
				box.addEventListener('mouseover', dobring);

				// add
				x.adom_div.appendChild(box);
				x.adom_ul.appendChild(note);
			});
		} catch (e) {
			alert(e);
			//throw e;
		}

		document.body.appendChild(x.adom_ul);
		document.body.appendChild(x.adom_div);

		var active = (location.hash || '#').substr(1);
		if (active.startsWith('note-')) {
			var note = document.getElementById(active);
			if (note) {
				bring(note.box);
			}
		}

		// navigation hint
		var hint = document.createElement('div');
		var hintp = document.createElement('p');
		hintp.textContent = 'Mouse over the highlighted sections or use the arrow keys to navigate annotations.';
		hint.className = 'note';
		hint.id = 'nav-hint';
		hint.style.top = '30px';
		hint.style.position = 'fixed';
		hint.appendChild(hintp);
		document.body.appendChild(hint);

		// show nav hint?
		if ((location.hash || '#').substr(1) === '')
			hint.classList.add('front');
	});

	function reljmp(rel) {
		var m = /^note-([0-9]+)$/.exec((location.hash || '#').substr(1));
		var n = (m ? parseInt(m[1]) : 0) + rel;
		var box = document.getElementById('box-'+n);
		if (box)
			bring(box);
		else if (rel < 0)
			unbring();
	}
	x.reljmp = reljmp;

	window.addEventListener('keydown', function(e) {
		// support arrow keys, vim keys, & emacs keys
		switch (e.code) {
		case 'ArrowLeft':
		case 'KeyK':
		case 'KeyP':
			reljmp(-1);
			break;
		case 'ArrowRight':
		case 'KeyJ':
		case 'KeyN':
			reljmp(1);
			break;
		case 'Escape':
			unbring();
			break;
		}
	});
});
