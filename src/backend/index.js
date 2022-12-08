
const fs = require('fs');
const http = require('http');
//const https = require('https');
const url = require('url');
const { URL } = require('url');

function endResOkJson(rs, s) {
	rs.writeHead(200, {'Content-Type': 'application/json'});
	rs.end(JSON.stringify(s));
}

const gld = { test:{} }; //#GlobalData#

async function mai() { //#Main#
	const prjPath = 'C:/files/Code/pjs/job/car/';	
	gld.test.json = JSON.parse(fs.readFileSync('test/db/testData.json').toString());	
	console.log('Setup Finished');
	http.createServer(srv).listen(8080);
	//https.createServer(srv).listen(8443);
}

function isPathOnly(p, v) { return p.length === 1 && p[0] === v; }

async function srv(rq, rs) { // Server
	
	const fullUrl = `http://${rq.headers.host}${rq.url}`;		
	//const fullUrl = `https://${rq.headers.host}${rq.url}`;		
	const parsedUrl = new URL(fullUrl);				
	const urlPath = parsedUrl.pathname.split('/').filter(e => e);
	
	console.log(`Processing: Method:${rq.method} URL:${fullUrl}`);
	
	if (rq.method === 'GET') {
			
		if (urlPath.length === 0 || isPathOnly(urlPath, 'front') || isPathOnly(urlPath, 'inspect')) {
			rs.writeHead(200, {'Content-Type': 'text/html'});
			rs.end(fs.readFileSync('src/frontend/html/front.html').toString());
		}
		
		else if (urlPath.length === 1 && urlPath[0].endsWith('.js')) {
			rs.writeHead(200, {'Content-Type': 'text/javascript'});
			rs.end(fs.readFileSync(`src/frontend/js/${urlPath[0]}`).toString());
		}		
		
		else if (isPathOnly(urlPath, 'all.css')) {
			rs.writeHead(200, {'Content-Type': 'text/css'});
			rs.end(fs.readFileSync('src/frontend/css/all.css').toString());
		}
		
		else if (isPathOnly(urlPath, 'font')) {
			const name = parsedUrl.searchParams.get('name');			
			if (name) {
				rs.writeHead(200, {'Content-Type': 'font/woff2'});
				rs.end(fs.readFileSync(`res/font/${name}`));
			}
		}
		
		else if (isPathOnly(urlPath, 'favicon.ico')) {
			rs.writeHead(200, {'Content-Type': 'image/x-icon'});
			rs.end(fs.readFileSync('res/img/favicon/favicon.ico'));
		}		
		
		else if (isPathOnly(urlPath, 'img')) {
			
			const id = parsedUrl.searchParams.get('id');
			
			if (id) {
				rs.writeHead(200, {'Content-Type': 'image/jpeg'});
				rs.end(fs.readFileSync(`test/listings/img/${id}.jpg`));
			}
		}		
		
		else if (isPathOnly(urlPath, 'tbl')) {
			
			const tblName = parsedUrl.searchParams.get('tblName');	
			
			if (tblName === 'make') {
				const id = parsedUrl.searchParams.get('id');
				const name = parsedUrl.searchParams.get('name');
				
				if (id) endResOkJson(rs, gld.test.json.make.find(e => e.id === id));
				else if (name) endResOkJson(rs, gld.test.json.make.find(e => e.name === name));
				else endResOkJson(rs, gld.test.json.make);
			}
			
			else if (tblName === 'type') {				
				const id = parsedUrl.searchParams.get('id');
				const name = parsedUrl.searchParams.get('name');
				
				if (id) endResOkJson(rs, gld.test.json.type.find(e => e.id === id));
				else if (name) endResOkJson(rs, gld.test.json.type.find(e => e.name === name));
				else endResOkJson(rs, gld.test.json.type);
			}
			
			else if (tblName === 'model') {
		
				const id = parsedUrl.searchParams.get('id');
				const name = parsedUrl.searchParams.get('name');

				if (id) endResOkJson(rs, gld.test.json.model.find(e => e.id === id));
				else if (name) endResOkJson(rs, gld.test.json.model.find(e => e.name === name));
				else endResOkJson(rs, gld.test.json.model);
			}
			
			else if (tblName === 'car') {
				
				const id = parsedUrl.searchParams.get('id');
				const modelName = parsedUrl.searchParams.get('modelName');
				const year = parsedUrl.searchParams.get('year');
				
				if (id) endResOkJson(rs, gld.test.json.car.find(e => e.id === id));
				else if (modelName && year) endResOkJson(rs, gld.test.json.car.find(e => e.model === modelName && e.year === year));
				else endResOkJson(rs, gld.test.json.car);
			}
			
			else if (tblName === 'listing') {
				
				const id = parsedUrl.searchParams.get('id');

				if (id) endResOkJson(rs, gld.test.json.listing.find(e => e.id === id));
				else endResOkJson(rs, gld.test.json.listing);
			}
		}
	}
}

mai();