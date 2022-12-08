
import { log, doc, toTitleCase } from './utl.js'; // Utility

export class LocFvrClr { // ParentDomElementExistsForeverAndWeWantToClearCurrentContentsWhenResolving
	p;
	constructor(p) { this.p = p; }
	rlv() {
		this.p.innerHTML = '';
		return this.p; }
}

export class FltEnu { // FilterEnumeration
	
	constructor(o) {
		Object.assign(this, o);
	}
	
	flt(e) {
		return this.aes.size === 0 || this.aes.has(e);
	}
}

export class FltRge { // FilterRange
	
	constructor(o) {
		Object.assign(this, o);
	}
	
	flt(e) {		
		return (this.aMin === this.min || e >= this.aMin) && (this.aMax === this.max || e <= this.aMax);
	}
}

export class GalInp { // GalleryInspector

	static sMaiGal = 'MAI_GAL';
	static sMaiInp = 'MAI_INP';
	static sGalFilGen = 'GAL_FILGEN';
	static sGalFil = 'GAL_FIL';

	//loc;
	//sta;
	
	//fntScl;
	
	//fntCol;
	//fntFam;
	//bkgCol;
	//frgCol;
	//frgHvCol;	
	//spcCol;
	
	//ls = [];
	//fs = [];
		//nam
		//typ
	
	sta = { sMai:GalInp.sMaiGal, sGal:GalInp.sGalFilGen };	
	mjrFnt = { fontSize:'12pt' };	
	mnrFnt = { fontSize:'9pt' };
	extFnt = { fontSize:'7pt' }
	fnts = [ this.mjrFnt, this.mnrFnt, this.extFnt ];	
	txtMrgGen = '10px 15px';
		
	constructor(o) {
		Object.assign(this, o);
		for (const e of this.fnts) {
			e.fontFamily = this.fntFam;
			e.color = this.fntCol;
		}
		window.addEventListener("resize", () => {
			if (this.sta && this.sta.sMai === GalInp.sMaiGal) {
				this.rdr();
			}
		});
	}
	
	filLs() {		
		return this.ls.filter((e) => {			
			for (const f of this.fs) {
				if (!f.flt(f.get(e)))
					return false;
			}
			return true;			
		});
	}
	
	rdr() {
		const p = this.loc.rlv();
		if (this.sta.sMai === GalInp.sMaiGal) this.rdrGal(p);
		else this.rdrInp(p, this.sta.sInp);
	}
	
	rdrGal(p) {
		const fil = doc.mkDiv({ p:p, s:{ float:'left', width:'175px', marginLeft:'5px' } });
		if (this.sta.sGal === GalInp.sGalFilGen) this.rdrFilGen(fil); // This branching is not really needed, this is actually needed
		else this.rdrFil(fil, this.sta.sFil);
		this.rdrGrd(p);
	}
	
	rdrFilGen(p) {
		
		const filTyp = doc.mkDiv({ p:p });
		
		// also the padding and margins of the filter menus can probably be reused
		// also change letter spacing pragmatically			
		doc.mkDiv({ p:filTyp, h:'F i l t e r s', s:{
			...this.mjrFnt, textAlign:'center',
			padding:'10px 0 10px 0',
			backgroundColor:this.frgCol,
			borderBottomStyle:'solid', borderBottomWidth:'1px',  borderBottomColor:this.spcCol } });
		
		const filEs = doc.mkDiv({ p:filTyp });
		
		for (const e of this.fs) {
			doc.mkBut({ p:filEs, h:e.nam, s:{ ...this.mjrFnt, borderStyle:'none', backgroundColor:this.frgCol,
				display:'block', width:'100%', padding:'7px 0 7px 0', cursor:'pointer' },
				sH:{ backgroundColor:this.frgHvCol },
				oC:() => {
					this.sta.sGal = GalInp.sGalFil;
					this.sta.sFil = e;
					this.rdr();
				}
			});
		}
		
		const filAct = doc.mkDiv({ p:p, s:{ marginTop:'10px' } });
		
		doc.mkDiv({ p:filAct, h:'A c t i v e &nbsp; F i l t e r s', s:{ ...this.mjrFnt, textAlign:'center',
			padding:'10px 0 10px 0', marginBottom:'5px',
			backgroundColor:this.frgCol,
			borderBottomStyle:'solid', borderBottomWidth:'1px',  borderBottomColor:this.spcCol } });
		
		const filActEs = doc.mkDiv({ p:filAct });
		
		// pull out styling
		for (const f of this.fs) {
			if (f.typ === 'E') {
				for (const e of f.aes) {
					doc.mkBut({ p:filActEs, h:`${toTitleCase(e)}`, s:{ ...this.mnrFnt,
						backgroundColor:this.spcCol,
						borderWidth:'0px', borderRadius:'8px',
						padding:'3px 8px', margin:'3px 5px',
						cursor:'pointer' },
						oC:() => {
							f.aes.delete(e);
							this.rdr();
						} });
				}
			}
			else {				
				const rgeEs = [ { aNam:'aMin', rVal:f.min, nam:'Min' }, { aNam:'aMax', rVal:f.max, nam:'Max' } ];				
				for (const e of rgeEs) {
					if (f[e.aNam] !== e.rVal) {
						doc.mkBut({ p:filActEs, h:`${f.nam} ${e.nam}: ${f.fmt(f[e.aNam])}`, s:{ ...this.mnrFnt,
						backgroundColor:this.spcCol,
						borderWidth:'0px', borderRadius:'8px',
						padding:'3px 8px', margin:'3px 5px',
						cursor:'pointer' },
						oC:() => {
							f[e.aNam] = e.rVal;
							this.rdr();
						} });
					}
				}
			}
		}
	}
	
	rdrFil(p, f) {		
		doc.mkBut({ p:p, h:`< ${f.nam}`, s:{ ...this.mjrFnt, borderStyle:'none', backgroundColor:this.frgCol,
			width:'100%', padding:'7px 0 7px 0' }, sH:{ backgroundColor:this.frgHvCol, cursor:'pointer' },
			oC:() => {
				this.sta.sGal = GalInp.sGalFilGen;
				this.rdr();
			} });
		
		if (f.typ === 'E') this.rdrFilEnu(p, f);
		else this.rdrFilRge(p, f);
	}
	
	rdrFilEnu(p, f) {		
		const pEs = doc.mkDiv({ p:p });
		
		for (const e of f.es) {
			doc.mkBut({ p:pEs, h:`${toTitleCase(e)}`, s:{ ...this.mjrFnt, borderStyle:'none', backgroundColor:f.aes.has(e) ? this.frgHvCol : this.frgCol,
				display:'block', width:'100%', padding:'7px 0 7px 0', cursor:'pointer' },
				sH:{ backgroundColor:this.frgHvCol },
				oC:() => {
					if (f.aes.has(e)) f.aes.delete(e);
					else f.aes.add(e);
					this.rdr();
				} });
		}		
	}
	
	rdrFilRge(p, f) {	
		const pRge = doc.mkDiv({ p:p });		
		const rgeEs = [
			{ hdr:'From', act:'aMin' },
			{ hdr:'To', act:'aMax' },
		];
		
		for (const e of rgeEs) {			
			const pEs = doc.mkDiv({ p:pRge });
			const hdr = doc.mkDiv({ p:pEs, h:e.hdr, s:{ ...this.mjrFnt, backgroundColor:this.frgCol } });
			const sel = doc.mkSel({ p:pEs, s:{ ...this.mjrFnt, backgroundColor:this.frgCol, borderStyle:'none', width:'100%' },
				sH:{ backgroundColor:this.frgHvCol },
				oChg:() => {
					f[e.act] = f.prs(sel.options[sel.selectedIndex].value);
					this.rdr();
				} });
			
			for (let i = f.min; i <= f.max; i += f.inc) {
				doc.mkOpt({ p:sel, h:f.fmt(i), sel:f[e.act] === i, s:{ ...this.mjrFnt, backgroundColor:this.frgCol } });
			}
		}		
	}
	
	rdrGrd(p) {		
		const outBdr = {
			borderStyle:'solid',
			borderWidth:'0px',
			borderColor:this.fntCol,
			borderRadius:'8px'
		};
		const inBotBdr = {
			borderStyle:'solid',
			borderWidth:'1px',
			borderColor:this.spcCol
		};
		const inBotBdrMrg = '10px';		
		const txtMrgGen = this.txtMrgGen;
		const mjrFnt = this.mjrFnt;
		const mnrFnt = this.mnrFnt;
		const extFnt = this.extFnt;
		const celWid = 250;
		
		const grd = doc.mkDiv({ p:p,
			s:{ display:'flex', flexWrap:'wrap', /*width:wid,*/ backgroundColor:this.bkgCol } });	
		const colWid = 100 / Math.floor(window.innerWidth / celWid);
		
		for (const e of this.filLs()) {
			const el = doc.mkDiv({ p:grd,
				s:{ flexBasis:`calc(${colWid}% - 2em)`, margin: '1em',
					backgroundColor:this.frgCol, ...outBdr },
				sH:{ backgroundColor:this.frgHvCol } });
			
			doc.mkImg({ p:el, src:e.imgSrc, alt:'Img N/A',
				oC:() => {
					this.sta = { sMai:GalInp.sMaiInp, sInp:e };
					this.rdr();
				},
				s:{ maxWidth:'100%', borderTopLeftRadius:outBdr.borderRadius,
					borderTopRightRadius:outBdr.borderRadius, cursor:'pointer' } });
			
			doc.mkDiv({ p:el, h:e.aGrd, s:{ ...mnrFnt, margin:txtMrgGen } });
			doc.mkDiv({ p:el, h:e.bGrd, s:{ ...mnrFnt, margin:txtMrgGen } });
			const cdCnt = doc.mkDiv({ p:el, s:{ margin:txtMrgGen } });
			doc.mkSpa({ p:cdCnt, h:e.cGrd, s:{ ...mjrFnt, margin:'0 10px 0 0' } });
			doc.mkSpa({ p:cdCnt, h:"•", s:{ ...mjrFnt, } });
			doc.mkSpa({ p:cdCnt, h:e.dGrd, s:{ ...mjrFnt, margin:'0 0 0 10px' } });
			doc.mkEle('hr', { p:el, s:{ margin:inBotBdrMrg, borderColor:inBotBdr.borderColor } });
			doc.mkDiv({ p:el, h:e.eGrd, s:{ ...extFnt, margin:txtMrgGen } });		
		}		
	}
	
	rdrInp(p, l) {
		
		history.pushState({}, '', 'inspect');		
		const mjrFnt = this.mjrFnt;
		const mnrFnt = this.mnrFnt;
		
		const dpl = doc.mkDiv({ p:p, s:{ width:'40%', float:'left' } });		
		doc.mkImg({ p:dpl, src:l.imgSrc, alt:'Img N/A', s:{ width:'100%', marginBottom:'30px' }});
		doc.mkEle('iframe', { p:dpl, src:l.mapSrc, s:{ height:'500px', width:'100%', borderStyle:'none' } });
		
		const cnt = doc.mkDiv({ p:p, s:{ width:'38%', float:'left', margin:'0px 0 0 25px' } });
		
		doc.mkBut({ p:cnt, h:'< Back', oC:() => {
			this.sta = { sMai:GalInp.sMaiGal, sGal:GalInp.sGalFilGen };
			this.rdr();
			history.back();
		}, s:{ ...mnrFnt, backgroundColor:this.frgCol, borderStyle:'none', padding:'5px 8px', cursor:'pointer' }, sH:{ backgroundColor:this.frgHvCol } });		
		
		const abCnt = doc.mkDiv({ p:cnt, s:{ marginBottom:'20px' } });
		doc.mkDiv({ p:abCnt, h:l.aInp, s:{ ...mjrFnt, margin:'15px 0px 5px 0px'  } });
		doc.mkEle('hr', { p:abCnt, s:{ borderColor:this.spcCol } });
		doc.mkDiv({ p:abCnt, h:l.bInp, s:{ ...mnrFnt, margin:'5px' } });		
		
		const cdefCnt = doc.mkDiv({ p:cnt, s:{ display:'flex', marginBottom:'40px' } });
			
		const cdCnt = doc.mkSpa({ p:cdefCnt });
		doc.mkDiv({ p:cdCnt, h:l.cInp, s:{ ...mjrFnt, margin:'15px 0px 5px 0px' } });
		doc.mkDiv({ p:cdCnt, h:l.dInp, s:{ ...this.extFnt, margin:'5px' } });
		
		const efCnt = doc.mkSpa({ p:cdefCnt });
		doc.mkDiv({ p:efCnt, h:l.eInp, s:{ ...mjrFnt, margin:'15px 0px 5px 20px' } });
		doc.mkDiv({ p:efCnt, h:l.fInp, s:{ ...this.extFnt, margin:'5px 5px 5px 25px' } });
		
		const ghCnt = doc.mkDiv({ p:cnt, s:{ margin:'15px 0px 5px 0px' } });
		doc.mkSpa({ p:ghCnt, h:l.gInp, s:{ ...mnrFnt, margin:'0px 10px 5px 0px' } });
		doc.mkSpa({ p:ghCnt, h:"•", s:{ ...mnrFnt, } });
		doc.mkSpa({ p:ghCnt, h:l.hInp, s:{ ...mnrFnt, margin:'15px 10px 5px 10px' } });
	}
}