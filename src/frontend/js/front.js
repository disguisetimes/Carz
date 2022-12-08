
import { log, doc, toTitleCase, fmtDlr, prsDlr, fmtMil, prsMil } from './utl.js'; // Utility
import { LocFvrClr, FltEnu, FltRge, GalInp } from './com.js'; // Reuseable Ui Logic Components

const cfg = {
	web: {
		pro: 'http',
		//pro: 'https',
		//dmn: 'localhost',
		dmn: 'carz.austingreen.top',
		//prt: '8080'
		//prt: '8443'
		prt: ''
	},
	googleMapsEmbed: {
		url: 'https://www.google.com/maps/embed/v1/place',
		apiKey: 'AIzaSyCR6H4AbReRgYs4MFYcEsQcw_41qR-mFmk'
	},
	thm: {
		fntCol:'white',
		fntFam:"'Lato'",
		bkgCol:'rgb(21, 21, 23)',
		frgCol:'rgb(33, 32, 35)',
		frgHvCol:'rgb(60, 60, 60)',
		spcCol:'rgb(247, 69, 57)'
	}
};
cfg.web.root = `${cfg.web.pro}://${cfg.web.dmn}:${cfg.web.prt}`;

const dom = new class {	
	root = doc.getEleId('root');
	top = doc.mkDiv({ p:this.root, s:{ margin:'20px' } });
	bnr = doc.mkSpa({ p:this.top, h:'C A R Z', s:{ margin:'0 20px 0 50px', fontSize:'80pt', fontFamily:cfg.thm.fntFam, color:cfg.thm.fntCol,
		borderBottomStyle:'double', borderBottomColor:cfg.thm.spcCol, borderBottomWidth:'7px' } });
	bnrWhl = doc.mkCan({ p:this.top, wid:50, hei:50, s:{ margin:'0 0 12px 5px' } });
	mai = doc.mkDiv({ p:this.root });
};

const gld = {};

function mai() { // Main

	window.onpopstate = function (e) {
		window.location.reload();
	}
	
	doc.body.style.backgroundColor = cfg.thm.bkgCol;
	doc.body.style.margin = '0';
		
	Promise.all([
		fetch(`${cfg.web.root}/tbl?tblName=listing`).then(e => e.json()),
		fetch(`${cfg.web.root}/tbl?tblName=make`).then(e => e.json()),
		fetch(`${cfg.web.root}/tbl?tblName=model`).then(e => e.json()),
		fetch(`${cfg.web.root}/tbl?tblName=type`).then(e => e.json()),
		fetch(`${cfg.web.root}/tbl?tblName=car`).then(e => e.json())
		])
		.then(js => {
			
			gld.listings = js[0];
			gld.makes = js[1];
			gld.models = js[2];
			gld.types = js[3];
			gld.car = js[4];
			
			const giLs = [];
			for (const e of gld.listings) {
				const ady = `${e.buildingNumber} ${e.roadDirectionShortName} ${toTitleCase(e.roadName)} ${toTitleCase(e.roadTypeShortName)}, ${toTitleCase(e.cityName)}, ${e.stateCode} ${e.zip}`;
				const el = {
					imgSrc:`${cfg.web.root}/img?id=${e.listingId}`,
					mapSrc:`${cfg.googleMapsEmbed.url}?key=${cfg.googleMapsEmbed.apiKey}&q=${ady}`,
					aGrd:`${e.year} ${toTitleCase(e.makeName)}`,
					bGrd:`${toTitleCase(e.modelName)}`,
					cGrd:`${fmtDlr(e.price)}`,
					dGrd:`${fmtMil(e.miles)}`,
					eGrd:'Available Now',
					aInp:`${e.year} ${toTitleCase(e.modelName)}`,
					bInp:`${toTitleCase(e.makeName)}`,
					cInp:`${fmtDlr(e.price)}`,
					dInp:`Before Taxes`,
					eInp:`${fmtMil(e.miles)}`,
					fInp:`Odometer Verified`,
					gInp:`Stock#: ${e.stockNum}`,
					hInp:`VIN #: ${e.vin}`,
					e:{ ...e }
				};
				giLs.push(el);
			}
			
			const yrMin = 2000;
			const yrMax = 2022;
			const priMin = 3000;
			const priMax = 50000;
			const milMin = 10000;
			const milMax = 300000;
			
			const gi = new GalInp({
		
				loc:new LocFvrClr(dom.mai),
				
				fntCol:cfg.thm.fntCol,
				fntFam:cfg.thm.fntFam,
				bkgCol:cfg.thm.bkgCol,
				frgCol:cfg.thm.frgCol,
				frgHvCol:cfg.thm.frgHvCol,
				spcCol:cfg.thm.spcCol,
				
				ls:giLs,
				fs:[
					new FltEnu({ nam:'Make', typ:'E', es:gld.makes.map(e => e.name), aes:new Set, get:(e) => e.e.makeName }), 
					new FltEnu({ nam:'Body Type', typ:'E', es:gld.types.map(e => e.name), aes:new Set, get:(e) => e.e.typeName }),
					new FltEnu({ nam:'Model', typ:'E', es:gld.models.map(e => e.name), aes:new Set, get:(e) => e.e.modelName }),
					new FltRge({ nam:'Year', typ:'R', min:yrMin, max:yrMax, inc:1, aMin:yrMin, aMax:yrMax, fmt:(e) => e, prs:(e) => Number(e), get:(e) => e.e.year }),
					new FltRge({ nam:'Price', typ:'R', min:priMin, max:priMax, inc:1000, aMin:priMin, aMax:priMax, fmt:fmtDlr, prs:prsDlr, get:(e) => e.e.price }),
					new FltRge({ nam:'Mileage', typ:'R', min:milMin, max:milMax, inc:10000, aMin:milMin, aMax:milMax, fmt:fmtMil, prs:prsMil, get:(e) => e.e.miles }),
				]
		
				});
			gi.rdr();			
			
			window.requestAnimationFrame(drw);			
		});
}

const startTime = new Date;

function drw() {
	
	const tim = (new Date - startTime) / 1000;
	const ctx = dom.bnrWhl.getContext('2d');
	ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, dom.bnrWhl.width, dom.bnrWhl.height);
		
	drwBnrWhlPly(ctx, tim);
		
	window.requestAnimationFrame(drw);
}

function drwBnrWhlPly(ctx, tim) { // DrawBannerWheelPolygonVersion
	
	const turAngVel = Math.PI * .3; // Turn Angular Velocity
	const turAngDis = turAngVel * tim; // Turn Angular Displacement
	
	const nSpk = 5; // Number Of Spokes
	const lipThi = 5; // Wheel Lip Thickness
	const rDsc = 7; // Wheel Center Disc Radius
	const spkThi = 5; // Wheel Spoke Thickness
	const rLipMdl = dom.bnrWhl.width * .5 - (lipThi * .5); // Wheel Lip Middle Radius
		
	ctx.fillStyle = cfg.thm.fntCol;
	ctx.strokeStyle = cfg.thm.fntCol;

	ctx.save();
	ctx.translate(dom.bnrWhl.width * .5, dom.bnrWhl.width * .5);
	ctx.rotate(turAngDis);
	
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = lipThi;
	ctx.arc(0, 0, rLipMdl, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
	
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = lipThi;
	ctx.arc(0, 0, rDsc, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	
	for (let i = 0; i < nSpk; ++i) {
		
		const ang = i * 2 * Math.PI / 5;
		
		ctx.save();
		ctx.lineWidth = spkThi;
		ctx.rotate(ang);
		ctx.moveTo(0, 0);
		ctx.lineTo(rLipMdl, 0);
		ctx.stroke();			
		ctx.restore();
	}
	
	ctx.restore();
}

mai();