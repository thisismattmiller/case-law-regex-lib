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
	{r:['Jcjstice','Jcstioe','Jctstioe', "'Justice", '-Justice', 'Justice.', 'J.usticb','Jctstjce','Jdsticb','Jdstice','Jdstiob','Jdstioe','Jdstxoe','Jhstic','Jhstice','Jhstige','Jhstioe','Jijstice','Jijstioe','Jitstice','Jitstioe','Jltstice','JnsTioB','JnsTioE','Jostice','Jostioe','Jtistice','Jtjstce','Jtjstice','JtjsTicr','Jtjstioe','Jttstice','Jttstioe','Jusitoe','Justce','JusTfcE','JusTibE','Justicb','JuSTicB','JusTiCB','JusTicb','JusticB','Justice','JUSTICE','Justices','Justicf','JUSTICIE','Justicie','Justicio','Justick','Justicl','Justicp','JuSTicp','JusTicp','Justicr','JusTicr','JusTicR','JusticR','JusTicS','JusticS','JusTicU','Justicu','JusTicy','Justiee','Justige','Justine','Justiob','Justioe','Justiqe','JusTiy','Justjce','Justoe','Justos','Justtce','Justtoe','Justtqe','JusxidE','Jutice','Juttice','Juustice','Jvstice','Jvstioe','J cfstice','J cjsticE','J cjstice','J dstice','J dstioe','J nsTioE','J ostice','J tjstice','J trsTioE','J usficE','J usticb','J ustice','J ustice','J usTice','J ustiob','J ustioe','J(jstioe','Jcstice.',"Jusi'icr","Justi'ce",'JUSTI0B','Justicb','Justicee','Justiob','Justioe','Jus~rcu'],w:'Justice'},
	{r:['Pbesedihg','Pbesidihg', 'Pebsidirg', 'PBESIDINGr', 'PEESIDINGr', 'Presidingr', 'Reesiding', 'PBESIDING','Bbesiding','Pbesiding','Pbesiding-','PBESIDINGr', 'Pee siding', 'PRE SIDING','Pbesidino','Pbesidisg','Pbesidistg','Pbesidixo','Pbesimiig','Peesidikg','Peesidimg-','Peesiding','PEESIDING','PEESIDING-','Peesiding-','PEESIDINGr','Peesidino','Peeslding','Prbsidieg','PRESDING','Presedirg','Presibing','President','Presidibg','Presidietg','Presidihg','Presidikg','Presiding','PRESIDING','PRESIDING!','Presiding!','PRESIDING',"Presiding'",'PRESIDING-','Presiding-','PRESIDING.','Presiding.','presiding.','Presiding1','Presiding;','Presiding?','Presidino','Presidins','Presidirg','Presidirtg','Presidiug','Presidixg','PRESIDNG','Presidtno','PRESUMING'],w:'Presiding'},
	{r:['Par Curiam','Peb Cubiah','Peb Cubiam','PEB CURIAM','Peb Curiam','peb Oubiam','Pee Cdeiam','Pee Cijbiam','Pee Cijeiam','Pee Ctjbiam','Pee Ctteiam','pee Cubiam','Pee Cubiam','Pee Cublam','Pee Cueiam','pee Cueiam','PEE CUEIAM','pee Curiam','Pee Curiam','Pee curiam','Pee siding','Pek Curiam','Per Ccfriam','Per Cdriam','Per Chriam','Per Cruriam','Per Ctjbiam','Per Ctjriam','Per Cttbiam','Per Cubiam','Per Cueiam','Per Cueiasi','Per Curia','Per Curiaii','Per Curiam','per Curiam','PER CURIAM','Per CURIAM','Per curiam','per curiam','Per Curtail','Per Curtam','Per Cwnam','Per Cwriam','Per Cwricm','Per George','Per Gubiam','Per Guriam','Per Gviriam','Per Gwiam','Per Gwriam','Per Gxvriam','Per Onriam','Per Otcriam','Per Ottriam',"G'uriam",'Ov/riam','Per Oubiam','Per Ouria','Per Ouriam','Per Quriam','Per Quriami','PEu OrnlI', 'Per Curiam?n.','Per Curiamii','Per Curiamm', 'Per Curiam!', 'Per Curiam)', 'Per Curiam~r'],w:'Per Curiam'},
	{r:['<1.','<7.','<J.','<T.'],'w':'J.'},
	{r:["C'hiEP",'C1-11EE','C111EE', 'Chibe', "Chief'", 'Chiip', 'CmEE', 'Ch-iEE','Chibe','Chiip',' Chdw',' ChW','Ci-iiEE','Ci-iieb','Ci-iiee','Ci-iiep','Ci-nyp','Chie)R','Cheer','Cheif','Cheje','ChiBB','Chibb','Chibe','ChiBP','Chibp','Chibs','ChiEB','Chieb','Chiee','ChiEE','ChiEe','ChieE','CHIEF','Chief','ChiEF','ChieF','ChiEL','ChiEP','Chiep','ChiER','Chier','Chies','Chife','ChiFF','Chift','Chiip','Chile','Chill','Chilr','Chipf','ChiPP','ChiRF','Chirp','Chirr','Chxee','Cihef','Ciiiee','Ciiiep','Ciliep','CitiEE','Citiep','CniEE','Cniyy','CpiiEE','Cpiiee','CpiiER'],w:'Chief'},
	{r:["Chief '",'Chief , ','Chief -','Chief .','Chief 1','Chief, ','Chief-','Chief.','Chief1','Chief^', ' Ohiee ', ' Ohiep ', ' Outre '],'w':'Chief '},
	{r:['Justice\'','Justice.'],'w':'Justice '},
	{r:['Mr.Chief'],'w':'Mr. Chief'},
	{r:['Mr.Justice'],'w':'Mr. Justice'},
	{r:['Mr.Presiding'],'w':'Mr. Presiding'},
	{r:['PresidingJustice'],'w':'Presiding Justice'},		
	{r:['ChiefJustice'],'w':'Chief Justice'}		



]
 

module.exports = {

	debug: false,


	normalizeNameField: function(string){




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
		string = string.replace(/^(Mr\.'|Mr\.\*|NIr\.\s|Mr\.,|Mr\.\-|Mr\.\:\.|Mr\.s\s|Mt\?\s|Mr;\-|Mr\?\.|Mt\?\.|Mr\.;|Mt\-\s|Mu\s|Mu,\.|Mu\-|Mu\.|Mr\.\s\-\s|Mr\.\s\.\s)/i,'Mr. ')
		string = string.replace(/^(b\.\s|b\s|r\.\s|r\s|by\s)/,'')				
		string = string.replace(/Mir\.\s/i,'Mr. ')
		string = string.replace(/Air\.\s/i,'Mr. ')
		string = string.replace(/Mr\. \. /i,'Mr. ')
		string = string.replace(/Mr\. \- /i,'Mr. ')
		string = string.replace(/Ms\.\s/i,'Mr. ')

		

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

		//whitespace
		string = string.replace(/\s+/g,' ')

		string = string.trim()
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
				regex: /^Mr(\.\s|\s)(Chief Justice|JUSTICE|Presiding Justice)\s+([A-Z]\.)\s(\w{3,}$)/i,
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
					last: 2,
					pos: 1}
				]
			}

			
		]

		var result = null

		patterns.forEach((pattern) => {

			if (result) return false

			result = string.match(pattern.regex)

			if (self.debug && result){
				fs.appendFileSync('tests/regex_'+pattern.name, string + ' | ' + result +'\n' )
			}

		})

		return result

	},

  test: function(courtName) {

  	console.log('teahhhhh')
  	return courtName
  }
}