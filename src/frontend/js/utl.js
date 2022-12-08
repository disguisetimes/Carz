
export function log(...as) { console.log(...as); }

export function toTitleCase(str) { return str.split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' '); }

const fmtDlrObj = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export function fmtDlr(v) { return fmtDlrObj.format(v); }
export function prsDlr(s) { return parseFloat(s.replace('$','').replace(',','')); }

export function fmtMil(v) { return `${Math.floor(v / 1000)}K mi` }
export function prsMil(s) { return Number(s.substring(0, s.length - 4)) * 1000; }

HTMLElement.prototype.a = function(c) { this.appendChild(c); return this; };
HTMLElement.prototype.s = function(s) { Object.assign(this.style, s); return this; }
HTMLElement.prototype.i = function(id) { this.id = id; return this; }
HTMLElement.prototype.h = function(h) { this.innerHTML = h; return this; }
HTMLElement.prototype.cN = function(cN) { this.className = cN; return this; }
HTMLElement.prototype.p = function(p) { p.a(this); return this; }

export const doc = document;
doc.getEleId = function(id) { return this.getElementById(id); }
doc.getElesTag = function(t) { return this.getElementsByTagName(t); }
doc.getEleTag = function(t) { return this.getElesTag(t)[0]; }
doc.mkEle = function(t, o) {
	const e = this.createElement(t);
	if (o.p) o.p.a(e);
	if (o.i) e.id = o.i;
	if (o.cN) e.className = o.cN;
	if (o.h || o.h === '') e.innerHTML = o.h;
	if (o.oC) e.onclick = o.oC;
	if (o.oChg) e.onchange = o.oChg;
	if (o.s) Object.assign(e.style, o.s);
	if (o.a) e.a(o.a);
	if (o.y) e.type = o.y;
	if (o.ck) e.checked = o.ck;
	if (o.sH) {
		const oS = { ...e.style }; // Not needed: const oS = JSON.parse(JSON.stringify(e.style));
		for (let n = 0; oS[n]; ++n)
			delete oS[n];
		e.onmouseover = () => Object.assign(e.style, o.sH);
		e.onmouseout = () => Object.assign(e.style, oS);
	}
	if (o.src) e.src = o.src
	if (o.alt) e.alt = o.alt;
	if (o.sel) e.selected = o.sel;
	if (o.wid) e.width = o.wid;
	if (o.hei) e.height = o.hei;
	return e;
};
doc.mkDiv = function(o) { return this.mkEle('div', o); }
doc.mkSpa = function(o) { return this.mkEle('span', o); }
doc.mkBut = function(o) { return this.mkEle('button', o); }
doc.mkInp = function(o) { return this.mkEle('input', o); }
doc.mkImg = function(o) { return this.mkEle('img', o); }
doc.mkSel = function(o) { return this.mkEle('select', o); }
doc.mkOpt = function(o) { return this.mkEle('option', o); }
doc.mkCan = function(o) { return this.mkEle('canvas', o); }