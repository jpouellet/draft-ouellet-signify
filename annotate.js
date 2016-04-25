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

	e.style.border = border+'px solid orange';

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
			console.log('recursing: '+li+' > '+m);
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
	console.log({n: this.nodes[0].node, o:this.nodes[0].offset});
	r.setStart(this.nodes[0].node, this.nodes[0].offset || 0);
	r.setEnd(end.node, end.offset);
	console.log(this.nodes[0].node);
	console.log(this.nodes[0].offset || 0);
	console.log(end.node);
	console.log(end.offset);
	return r;
};

window.addEventListener('DOMContentLoaded', function() {
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
	GET('/'+doc+'.json', function(resp) {
		x.adom_ul = document.createElement('ul');
		x.adom_div = document.createElement('div');

		try {
			var rm = new RangeMaker(document.body);
			(x.annotations = JSON.parse(x.json = resp)).forEach(function(a, n) {
				var descrno = n+1;

				var box = enclose(rm.next(new RegExp(a.sel)));
				x.adom_div.appendChild(box);

				var e = document.createElement('li');
				e.innerHTML = a.txt;
				e.style.position = 'absolute';
				e.style.top = box.style.top;
				e.style.listStyleType = 'none';
				e.style.left = '600px';
				e.style.border = box.style.border;
				e.style.display = 'none';
				x.adom_ul.appendChild(e);

				box.id = 'descr'+(n+1)+'-box';
				e.id = 'descr'+(n+1)+'-info';
			});
		} catch (e) {
			alert(e);
		}

		document.body.appendChild(x.adom_ul);
		document.body.appendChild(x.adom_div);
	});
});
