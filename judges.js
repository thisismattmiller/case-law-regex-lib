const ASCIIFolder = require("fold-to-ascii");


let removeWords = [
	new RegExp('Opinion by',"gi"), 
	new RegExp('delivered',"gi"),
	new RegExp('Not to be published in full',"gi"),
	new RegExp('dissenting',"gi"),
	new RegExp('concurring',"gi"),
	new RegExp('took no part',"gi"),
	new RegExp('dissents',"gi"),
	new RegExp('the opinion of the court',"gi"),
	new RegExp('specially',"gi")


]

let replaceWords = [
	{r:['Jcjstice','Jcstioe','Jctstioe','Jctstjce','Jdsticb','Jdstice','Jdstiob','Jdstioe','Jdstxoe','Jhstic','Jhstice','Jhstige','Jhstioe','Jijstice','Jijstioe','Jitstice','Jitstioe','Jltstice','JnsTioB','JnsTioE','Jostice','Jostioe','Jtistice','Jtjstce','Jtjstice','JtjsTicr','Jtjstioe','Jttstice','Jttstioe','Jusitoe','Justce','JusTfcE','JusTibE','Justicb','JuSTicB','JusTiCB','JusTicb','JusticB','Justice','JUSTICE','Justices','Justicf','JUSTICIE','Justicie','Justicio','Justick','Justicl','Justicp','JuSTicp','JusTicp','Justicr','JusTicr','JusTicR','JusticR','JusTicS','JusticS','JusTicU','Justicu','JusTicy','Justiee','Justige','Justine','Justiob','Justioe','Justiqe','JusTiy','Justjce','Justoe','Justos','Justtce','Justtoe','Justtqe','JusxidE','Jutice','Juttice','Juustice','Jvstice','Jvstioe','J cfstice','J cjsticE','J cjstice','J dstice','J dstioe','J nsTioE','J ostice','J tjstice','J trsTioE','J usficE','J usticb','J ustice','J ustice','J usTice','J ustiob','J ustioe','J(jstioe','Jcstice.',"Jusi'icr","Justi'ce",'JUSTI0B','Justicb','Justicee','Justiob','Justioe','Jus~rcu'],w:'Justice'},
	{r:['Pbesedihg','Pbesidihg','PBESIDING','Pbesiding','Pbesiding-','PBESIDINGr', 'Pee siding', 'PRE SIDING','Pbesidino','Pbesidisg','Pbesidistg','Pbesidixo','Pbesimiig','Peesidikg','Peesidimg-','Peesiding','PEESIDING','PEESIDING-','Peesiding-','PEESIDINGr','Peesidino','Peeslding','Prbsidieg','PRESDING','Presedirg','Presibing','President','Presidibg','Presidietg','Presidihg','Presidikg','Presiding','PRESIDING','PRESIDING!','Presiding!','PRESIDING',"Presiding'",'PRESIDING-','Presiding-','PRESIDING.','Presiding.','presiding.','Presiding1','Presiding;','Presiding?','Presidino','Presidins','Presidirg','Presidirtg','Presidiug','Presidixg','PRESIDNG','Presidtno','PRESUMING'],w:'Presiding'},
	{r:['Par Curiam','Peb Cubiah','Peb Cubiam','PEB CURIAM','Peb Curiam','peb Oubiam','Pee Cdeiam','Pee Cijbiam','Pee Cijeiam','Pee Ctjbiam','Pee Ctteiam','pee Cubiam','Pee Cubiam','Pee Cublam','Pee Cueiam','pee Cueiam','PEE CUEIAM','pee Curiam','Pee Curiam','Pee curiam','Pee siding','Pek Curiam','Per Ccfriam','Per Cdriam','Per Chriam','Per Cruriam','Per Ctjbiam','Per Ctjriam','Per Cttbiam','Per Cubiam','Per Cueiam','Per Cueiasi','Per Curia','Per Curiaii','Per Curiam','per Curiam','PER CURIAM','Per CURIAM','Per curiam','per curiam','Per Curtail','Per Curtam','Per Cwnam','Per Cwriam','Per Cwricm','Per George','Per Gubiam','Per Guriam','Per Gviriam','Per Gwiam','Per Gwriam','Per Gxvriam','Per Onriam','Per Otcriam','Per Ottriam',"G'uriam",'Ov/riam','Per Oubiam','Per Ouria','Per Ouriam','Per Quriam','Per Quriami','PEu OrnlI'],w:'Per Curiam'},
	{r:['<1.'],'w':'J.'}
]
 

module.exports = {


	normalizeNameField: function(string){


		removeWords.forEach((rm)=>{
			string = string.replace(rm,'')
		})

		replaceWords.forEach((rw)=>{
			rw.r.forEach((r)=>{
				string=string.replace(r,rw.w)
			})
		})

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
		string = string.replace(/Mir\.\s/i,'Mr. ')
		string = string.replace(/Air\.\s/i,'Mr. ')


		// bad justices
		string = string.replace(/\sJustice\W+/i,' Justice ')


		//no trailing punct
		string = string.replace(/[,|:|"|\-|;|\\]+$/,'')
		string = string.replace(/[,|:|"|\-|;|\\]+\.$/,'')






		string = string.trim()


		return string
	},

  test: function(courtName) {

  	console.log('teahhhhh')
  	return courtName
  }
}