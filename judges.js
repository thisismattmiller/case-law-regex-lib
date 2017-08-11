const ASCIIFolder = require("fold-to-ascii")
const fs = require('fs')

let removeWords = [
	new RegExp('Opinion by',"gi"), 
	new RegExp('delivered',"gi"),
	new RegExp('Not to be published in full',"gi"),
	new RegExp('dissenting',"gi"),
	new RegExp('concurring',"gi"),
	new RegExp('took no part',"gi"),
	new RegExp('dissents',"gi"),
	new RegExp('the opinion of the court',"gi"),
	new RegExp('specially',"gi"),
	new RegExp('concurs',"gi")




]

let replaceWords = [
	{r:['Jcjstice','Jcstioe','Jctstioe', 'Justtcb', 'Judge', 'JUBGE','JUDCE','JUDG-E','JUDGrE','JUS!\'ICE', 'Messrs. Justice', 'Mme Justice', 'Miss Justice','"Messrs. Justice','Me Justice', 'JUSTICES', 'PBESIDHSFG', 'PBESIDINC','PBESLDING','PEESIDINC','PKESIDING','PRESIDESIG','Pkesiding','Justtob', "'Justice", '-Justice', '- Justice', '.Justice', 'Justice.', 'J.usticb','Jctstjce','Jdsticb','Jdstice','Jdstiob','Jdstioe','Jdstxoe','Jhstic','Jhstice','Jhstige','Jhstioe','Jijstice','Jijstioe','Jitstice','Jitstioe','Jltstice','JnsTioB','JnsTioE','Jostice','Jostioe','Jtistice','Jtjstce','Jtjstice','JtjsTicr','Jtjstioe','Jttstice','Jttstioe','Jusitoe','Justce','JusTfcE','JusTibE','Justicb','JuSTicB','JusTiCB','JusTicb','JusticB','Justice','JUSTICE','Justices','Justicf','JUSTICIE','Justicie','Justicio','Justick','Justicl','Justicp','JuSTicp','JusTicp','Justicr','JusTicr','JusTicR','JusticR','JusTicS','JusticS','JusTicU','Justicu','JusTicy','Justiee','Justige','Justine','Justiob','Justioe','Justiqe','JusTiy','Justjce','Justoe','Justos','Justtce','Justtoe','Justtqe','JusxidE','Jutice','Juttice','Juustice','Jvstice','Jvstioe','J cfstice','J cjsticE','J cjstice','J dstice','J dstioe','J nsTioE','J ostice','J tjstice','J trsTioE','J usficE','J usticb','J ustice','J ustice','J usTice','J ustiob','J ustioe','J(jstioe','Jcstice.',"Jusi'icr","Justi'ce",'JUSTI0B','Justicb','Justicee','Justiob','Justioe','Jus~rcu','.Justice','Justice!'],w:'Justice'},
	{r:['Pbesedihg','Pbesidihg', 'Pebsidirg', 'PBESIDINGr', 'PEESIDINGr', 'Presidingr', 'Reesiding', 'PBESIDING','Bbesiding','Pbesiding','Pbesiding-','PBESIDINGr', 'Pee siding', 'PRE SIDING','Pbesidino','Pbesidisg','Pbesidistg','Pbesidixo','Pbesimiig','Peesidikg','Peesidimg-','Peesiding','PEESIDING','PEESIDING-','Peesiding-','PEESIDINGr','Peesidino','Peeslding','Prbsidieg','PRESDING','Presedirg','Presibing','President','Presidibg','Presidietg','Presidihg','Presidikg','Presiding','PRESIDING','PRESIDING!','Presiding!','PRESIDING',"Presiding'",'PRESIDING-','Presiding-','PRESIDING.','Presiding.','presiding.','Presiding1','Presiding;','Presiding?','Presidino','Presidins','Presidirg','Presidirtg','Presidiug','Presidixg','PRESIDNG','Presidtno','PRESUMING'],w:'Presiding'},
	{r:['Par Curiam','Peb Cubiah','Peb Cubiam', 'Per Cura am','PEB CURIAM','Peb Curiam','peb Oubiam','Pee Cdeiam','Pee Cijbiam','Pee Cijeiam','Pee Ctjbiam','Pee Ctteiam','pee Cubiam','Pee Cubiam','Pee Cublam','Pee Cueiam','pee Cueiam','PEE CUEIAM','pee Curiam','Pee Curiam','Pee curiam','Pee siding','Pek Curiam','Per Ccfriam','Per Cdriam','Per Chriam','Per Cruriam','Per Ctjbiam','Per Ctjriam','Per Cttbiam','Per Cubiam','Per Cueiam','Per Cueiasi','Per Curia','Per Curiaii','Per Curiam','per Curiam','PER CURIAM','Per CURIAM','Per curiam','per curiam','Per Curtail','Per Curtam','Per Cwnam','Per Cwriam','Per Cwricm','Per George','Per Gubiam','Per Guriam','Per Gviriam','Per Gwiam','Per Gwriam','Per Gxvriam','Per Onriam','Per Otcriam','Per Ottriam',"G'uriam",'Ov/riam','Per Oubiam','Per Ouria','Per Ouriam','Per Quriam','Per Quriami','PEu OrnlI', 'Per Curiam?n.','Per Curiamii','Per Curiamm', 'Per Curiam!', 'Per Curiam)', 'Per Curiam~r'],w:'Per Curiam'},
	{r:['<1.','<7.','<7','<J.','<T.','<T','<J','<1'],'w':'J.'},
	{r:["C'hiEP",'C1-11EE','C111EE', 'Chibe', "Chief'", 'Chiip', 'CmEE', 'Ch-iEE','Chibe','Chiip',' Chdw',' ChW','Ci-iiEE','Ci-iieb','Ci-iiee','Ci-iiep','Ci-nyp','Chie)R','Cheer','Cheif','Cheje','ChiBB','Chibb','Chibe','ChiBP','Chibp','Chibs','ChiEB','Chieb','Chiee','ChiEE','ChiEe','ChieE','CHIEF','Chief','ChiEF','ChieF','ChiEL','ChiEP','Chiep','ChiER','Chier','Chies','Chife','ChiFF','Chift','Chiip','Chile','Chill','Chilr','Chipf','ChiPP','ChiRF','Chirp','Chirr','Chxee','Cihef','Ciiiee','Ciiiep','Ciliep','CitiEE','Citiep','CniEE','Cniyy','CpiiEE','Cpiiee','CpiiER'],w:'Chief'},
	{r:["Chief '",'Chief , ','Chief -','Chief .','Chief 1','Chief, ','Chief-','Chief.','Chief1','Chief^', ' Ohiee ', ' Ohiep ', ' Outre '],'w':'Chief '},
	{r:['Justice\'','Justice.','Justice-','M-r. Justice','M-n. Presiding Justice','MV Presiding Justice','Justice Justice', 'Associate Justice '],'w':'Justice '},
	{r:['Mr.Chief'],'w':'Mr. Chief'},
	{r:['Mr.Justice','MrJustice','Mr. Justice','MA Justice', 'TVTi?. Justice', 'TVTMr. Justice','MA. Justice','IM-rJustice', "IM-rJustice","ING Justice","IVIk. Presiding Justice","Ivr-R. Justice","IVIr. Justice","IVIr. Justice","IVIt?. Justice","IVTi?. Presiding Justice","IVTr. Justice","IVTt?- Justice","IVTt?- Presiding Justice","IVr-R. Justice","IVr-R. Justice","IWr. Justice","Ib. Justice","In. Justice","Ivr-R. Justice,","Ivr-R.- Presiding Justice","Ivr-T? Justice","JMb. Justice","JNe. Justice",'; Mr. Justice','i?. Justice'],'w':'Mr. Justice '},
	{r:['Mr.Presiding','Hr. Presiding'],'w':'Mr. Presiding'},
	{r:['PresidingJustice','Miss Presiding Justice','Mil Presiding Justice','MA Presiding Justice',"TV!re. Justice","TVIr- Presiding Justice","TVPi?. PeesidimgJustice","TVT-r. Presiding Justice","TVTi?. Justice","TVTr. Justice","TVTr. Presiding Justice","TVTrJustice","TVTt?,Justice","TVTt?. Presiding Justice","TVTt?. Presiding Justice","TVTt?. Presiding Justice","TVTtc. Justice","TVTu. Justice"],'w':'Presiding Justice'},		
	{r:['Mr. Presiding Justice','PausminiG Justice','M. Justice', ', Mr. Justice '],'w':'Mr. Presiding Justice '},		
	{r:['ChiefJustice','ML Chief Justice','M. Chief Justice '],'w':'Chief Justice'},
	{r:[', 0. J',', O. J',"', C. J",', C., J',', Ch. J',',. C. J',', CP. J',', G. J',", C.' J",', G.J',",':C. J",'. 0. J',', J.C',',C.J'],w:', C. J'},
	{r:[', J.: -',',- J',",' J",' J.5',',_ J',', 3',', 0',', -I',', Jr',', RJ',', X'],w:', J'},
	{r:[',-P. J','. P. J',', P. -J',', ].',", P.'J",', J. P',', 7',",'J",', -J. P',', JP. J','; P. J',', P. 3',', P. .1',', J.P',', P J',', P. T','^P.J',', Pi J',', B. J'],w:', P. J'},
	{r:["0 'Connor"],w:"O'Connor"},
	


]
 

module.exports = {

	debug: false,


	normalizeNameField: function(string){

		var ogString = string



		//fold
		string = ASCIIFolder.fold(string)

		//remove any footnotes
		string = string.replace(/{footnotemarkstart}.*?{footnotemarkend}/g,'')

		//whitespace
		string = string.replace(/\s+/g,' ')

		//leading pnct
		string = string.replace(/^["|'|\-\s|,\s|\.\s]/,'')

		//no quotes
		string = string.replace(/"/g,'')

		//dunle punct
		string = string.replace(/,{2,}/g,',')
		string = string.replace(/\.{2,}/g,'.')
		string = string.replace(/'{2,}/g,'\'')		

		string = string.replace(/\.and\s/gi,' and ')
		string = string.replace(/\sAND\s/g,' and ')
		


		string = string.replace(/(Opinion of |Opinion filed by |Opinion on Rehearing,)/i,'')

		//all the weird mr.
		string = string.replace(/^Mr.\s/i,'Mr. ')
		string = string.replace(/^Mf.\s/i,'Mr. ')		
		string = string.replace(/^Ur.\s/i,'Mr. ')		
		string = string.replace(/^Ar.\s/i,'Mr. ')		
		string = string.replace(/^Mr.\.\s/i,'Mr. ')
		string = string.replace(/^Me\.\s/i,'Mr. ')
		string = string.replace(/^Mr\.\s+\W+/i,'Mr. ')
		string = string.replace(/^Mi[\W|1]+\s/i,'Mr. ')
		string = string.replace(/^Mb[\W|1]+\s/i,'Mr. ')
		string = string.replace(/^Me[\W|1]+\s/i,'Mr. ')
		string = string.replace(/^He[\W|1]+\s/i,'Mr. ')
		string = string.replace(/^Hr[\W|1]+\s/i,'Mr. ')		
		string = string.replace(/^(Mr\.'|Mr\.\*|Vb\s|Mr\,\s|VIr\.\s|DJr\.\s|Honorable\s|IEr\.\s|Hr\.\s|Mo\s|NIr\.\s|Wp\.\s|Wv\s|Wb\.\s|We\.\s|Wi\?\s|]VIr\.\s|Mp\.\s|^Mr\.\s|_\sMr\.\s|i\sMr\.\s|i?\.\s|iVr-R,\.\s|j^Mr\.\s|jyir\.\s|lyr-R\.\s|n\s|r\.\s|yVIr\.\s|Mj:\.|Mj\\\s|Mb\s|Mbr\.\s|Mc\.\s|Mjb.\s|Mk\s|Mk\.\s|Ml-,\s|Mn\s|Mn\.\s|Mr\.,|Mv\.\s|Mr\.\-|Mr\.\:\.|Mr\.s\s|Mt\?\s|Mr;\-|Mr\?\.|Mt\?\.|Mr\.;|Mt\-\s|Mu\s|Mu,\.|Mu\-|Mu\.|Mr\.\s\-\s|Mr\.\s\.\s|Hon\.\s|Hr\s|Hr\.\s|M-n\.\s|M-r\.\s|M>\.\s|M\?\.\s|MISS\s|M-n\.\s|M-r\.\s|11b\.\s|31b\.\s|3Ir\.\s|Fir\.\s|Sir\.\s|W-r\.\s|i\?\.\s|j\^Mr\.\s|r\.\s|\^Mr\.\s|\/Mx\.\s)/i,'Mr. ')
		string = string.replace(/^(b\.\s|b\s|r\.\s|r\s|by\s)/,'')				
		string = string.replace(/Mir\.\s/i,'Mr. ')
		string = string.replace(/Air\.\s/i,'Mr. ')
		string = string.replace(/Mr\. \. /i,'Mr. ')
		string = string.replace(/Mr\. \- /i,'Mr. ')
		string = string.replace(/TVTMr\.\s/i,'Mr. ')

		
		string = string.replace(/Ms\.\s/i,'Mr. ')

		

		// if (string.search(/Curiam/i)==-1){
			// string = string.replace(/(by\s|per\s)/i,'')
		// }

		// string = string.replace(/^Per\s[A-Z]{1}[a-z]{3,}/,'')
		

		//multiple punctuation
		string = string.replace(/\.\./i,'.')

		string = string.replace(/Judge\s/i,'Justice ')

		// bad justices
		string = string.replace(/\sJustice\W+/i,' Justice ')


		//no trailing punct
		// string = string.replace(/[,|:|"|\-|;|\\]+$/,'')
		// string = string.replace(/[,|:|"|\-|;|\\]+\.$/,'')
		string = string.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+$/,'')
		string = string.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+$/,'')
		string = string.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+$/,'')

		removeWords.forEach((rm)=>{
			string = string.replace(rm,'')
		})

		replaceWords.forEach((rw)=>{
			rw.r.forEach((r)=>{
				string=string.replace(r,rw.w)
			})
		})

		// string = string.replace(/(\s|\,\s)P(\.\s|\s)J/,' Presiding Justice')

		// string = string.replace(/, JJ$/,' Justice')

		string = string.replace(/;\sJ$/,', J')

		//trailing puncuation
		string = string.replace(/([,.\-\/]+$)/,'').replace(/([,.\-\/]+$)/,'').replace(/([,.\-\/]+$)/,'').replace(/([,.\-\/]+$)/,'')
		//whitespace
		string = string.replace(/\s+/g,' ')

		string = string.trim()


		if (string=='' && this.debug) console.log(`empty string for ${ogString}`)

		return string
	},

	extractJudgeNames: function(string){

		var self = this

		var patterns = [
			{
				name: 'mr Justice last and (x3)',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE)\s+(\w+)(.*?)Mr(\.\s|\s)(Chief Justice|JUSTICE)\s+(\w+)(.*?)Mr(\.\s|\s)(Chief Justice|JUSTICE)\s+(\w+)(.*?)/i,
				data: [
					{first: null,
					middle: null,
					last: 3,
					pos: 2},
					{first: null,
					middle: null,
					last: 7,
					pos: 6},
					{first: null,
					middle: null,
					last: 11,
					pos: 10}										
				]
			},		
			{
				name: 'mr Justice last and (x2)',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+(\w+)(.*?)Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+(\w+)/i,
				data: [
					{first: null,
					middle: null,
					last: 3,
					pos: 2},
					{first: null,
					middle: null,
					last: 7,
					pos: 6}									
				]
			},				
			{
				name: 'mr Justice first middle last',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+(\w+)\s+([A-Z]\.|[A-Z]{2}\.)\s(\w+$)/i,
				data: [{first: 2,
					middle: 3,
					last: 4,
					pos: 1}
				]
			},			
			{
				name: 'mr Justice first inital last',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+([A-Z]\.|[A-Z]\,)\s(\w{3,}$)/i,
				data: [{first: 2,
					middle: null,
					last: 3,
					pos: 1}
				]
			},			
			{
				name: 'mr Justice first inital middle inital last',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+([A-Z]\.)\s+([A-Z]\.)\s+(\w{3,}$)/i,
				data: [{first: 2,
					middle: null,
					last: 3,
					pos: 1}
				]
			},	
			{
				name: 'mr Justice last',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+(\w+$)/i,
				data: [{first: null,
					middle: null,
					last: 3,
					pos: 1}
				]
			},
			{
				name: 'mr Justice last garbage',
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+(.*$)/i,
				data: [{first: null,
					middle: null,
					last: 3,
					pos: 1}
				]
			},
			{
				name: 'Presiding Justice first middle inital last',
				regex: /^Presiding Justice\s+(\w+)\s+([A-Z]\.|[A-Z]\,)\s(\w{3,}$)/i,
				data: [{first: 1,
					middle: 2,
					last: 3,
					pos: null}
				]
			},
			{
				name: 'Presiding Justice first inital last',
				regex: /^Presiding Justice\s+([A-Z]\.|[A-Z]\,)\s(\w{3,}$)/i,
				data: [{first: 1,
					middle: null,
					last: 2,
					pos: null}
				]
			},	

			{
				name: 'Presiding Justice first last',
				regex: /^Presiding Justice\s+(\w{4,})\s(\w{4,}$)/i,
				data: [{first: 1,
					middle: null,
					last: 2,
					pos: null}
				]
			},

			{
				name: 'Presiding Justice last (x2)',
				regex: /^Presiding Justice\s+(\w{3,})\s+and\s+Justice\s+(\w{3,}$)/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: null},
					{first: null,
					middle: null,
					last: 2,
					pos: null}

				]
			},
			{
				name: 'Presiding Justice last, pos',
				regex: /^Presiding Justice\s+(\w{3,})(\s+|,\s+)(J\.\sJ|C\.\sJ|P\.\sJ|JJ|CJ|J\.J|C\.J|P\.J|Presiding Justice)/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: null}
				]
			},						
			{
				name: 'Presiding Justice last',
				regex: /^Presiding Justice\s+(\w{3,}$)/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: null}
				]
			},						
			{
				name: 'Presiding Justice garbage',
				regex: /^Presiding Justice\s+(.*$)/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: null}
				]
			},						
			{
				name: '(Chief) Justice lastname (x2)',
				regex: /^(Chief Justice|Justice)\s+(\w{4,})\s+and\s+(\w{4,}$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1}
				]
			},				
			{
				name: '(Chief) Justice First middle inital lastname',
				regex: /^(Chief Justice|Justice)\s+(\w+)\s+([A-Z]\.|[A-Z]\,)\s(\w{3,}$)/i,
				data: [{first: 1,
					middle: 2,
					last: 3,
					pos: null}
				]
			},						
			{
				name: '(Chief) Justice First  lastname',
				regex: /^(Chief Justice|Justice)\s+(\w{4,})\s(\w{4,}$)/i,
				data: [{first: 1,
					middle: null,
					last: 3,
					pos: null}
				]
			},
			{
				name: '(Chief) Justice lastname',
				regex: /^(Chief Justice|Justice)\s+([A-Z\-']{4,}$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1}
				]
			},
			{
				name: '(Chief) Justice first inital last',
				regex: /^(Chief Justice|Justice)\s+([A-Z]\.|[A-Z]\,)\s(\w{3,}$)/i,
				data: [{first: 1,
					middle: null,
					last: 2,
					pos: null}
				]
			},	


			{
				name: '(Chief) Justice lastname and justice lastname',
				regex: /^(Chief Justice|Justice)\s+(\w{4,})\sand\s(Chief Justice|Justice)\s+(\w{4,}$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1},
					{first: null,
					middle: null,
					last: 4,
					pos: 3}					
				]
			},
			{
				name: '(Chief) Justice lastname and lastname',
				regex: /^(Chief Justice|Justice)\s+(\w{4,})\sand\s+(\w{4,}$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1},
					{first: null,
					middle: null,
					last: 3,
					pos: null}					
				]
			},
			{
				name: '(Chief) Justice lastname, lastname and lastname',
				regex: /^(Chief Justice|Justice)\s+(\w{4,})(,\s+)(\w{4,})(\s+|,\s+)and\s+(.*$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1},
					{first: null,
					middle: null,
					last: 4,
					pos: null},
					{first: null,
					middle: null,
					last: 6,
					pos: null}										
				]
			},
			{
				name: '(Chief) Justice lastname',
				regex: /^(Chief Justice|Justice)\s+([A-Z]\.)\s+([A-Z]\.)\s+(\w{3,}$)/i,
				data: [{first: 2,
					middle: null,
					last: 3,
					pos: 1}
				]
			},
			{
				name: '(Chief) Justice garbage',
				regex: /^(Chief Justice|Justice)\s+(.*$)/i,
				data: [{first: null,
					middle: null,
					last: 2,
					pos: 1}
				]
			},								
			{
				name: 'lastname, pos',
				regex: /^(\w{4,}),\s(J\.\sJ|C\.\sJ|P\.\sJ|JJ|CJ|J\.J|C\.J|P\.J|Presiding Justice|J|J\.|J,|Justice)$/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},	
			{
				name: 'Lastname, C J',
				regex: /^([A-z'*\-.\/~]{3,})(,\sC\.\sJ\.|,\sC\.J|Ch\.\sJ|, Chief Justice|,\sC\.\sJ)[.\-:,\sa-z]*$/,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},
			{
				name: 'Lastname, P J',
				regex: /^([A-Za-z'*\-.\/~]{3,})(,\sP\.\sJ\.|,\sP\.J|,\sPJ|,\sP, J|,\sF.\sJ|,\sP\.\sJ|,\sP\.\sJ)[.\-:,\sa-z]*$/,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},
			{
				name: 'Lastname, JJ',
				regex: /^([A-z'*\-.\/]{3,})(\.\sJJ|,+\sJJ|\sJJ|,JJ)[.\-:,\s]*$/,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},

			{
				name: 'Lastname, J',
				regex: /^([A-z'*\-.\/~]{3,})(\.\sJ|,+\sJ|\sJ|,J)[.\-:,\s]*$/,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},		
			{
				name: 'Lastname, J Garbage',
				regex: /^([A-z'*\-.\/\s~]{3,})(\.\sJ|,+\sJ|\sJ|,J)[.\-:,\s]*$/,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},				
			{
				name: 'Curiam',
				regex: /(Curiam|court|CoUET)/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: 2}
				]
			},	
			{
				name: 'First Lastname',
				regex: /^(\w{3,})\s(\w{3,})$/i,
				data: [{first: 1,
					middle: null,
					last: 2,
					pos: null}
				]
			},
			{
				name: 'Lastname',
				regex: /^(\w{3,})$/i,
				data: [{first: null,
					middle: null,
					last: 1,
					pos: null}
				]
			},	
			

			
		]

		var result = null
		var names = []

		patterns.forEach((pattern) => {

			if (result) return false

			result = string.match(pattern.regex)

			if (result){

				

				pattern.data.forEach((p)=>{

					names.push({
						first: (!p.first) ? null : result[p.first],
						middle: (!p.middle) ? null : result[p.middle],
						last: (!p.last) ? null : result[p.last],
						pattern: pattern.regex
					})



				})

			}


			if (self.debug && result){
				fs.appendFileSync('tests/regex_'+pattern.name, string + ' | ' + result +'\n' )
			}

		})

		if (!result && string.search(' and ') >-1){

			string.split(' and ').forEach((substring)=>{


				patterns.forEach((pattern) => {

					var r = substring.match(pattern.regex)

					if (r) {
						

						pattern.data.forEach((p)=>{

							names.push({
								first: (!p.first) ? null : result[p.first],
								middle: (!p.middle) ? null : result[p.middle],
								last: (!p.last) ? null : result[p.last]
							})



						})

					}

					if (self.debug && r){
						console.log(r)
						fs.appendFileSync('tests/regex_'+pattern.name, substring + ' | ' + r +'\n' )
					}		

				})	

			})


		}

		// if (resultAry && resultAry.length >0) result = resultAry
		// console.log(names)
		return names

	},

  test: function(courtName) {

  	console.log('teahhhhh')
  	return courtName
  }
}