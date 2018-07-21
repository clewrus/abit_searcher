
let abitTable;
let specTable;

let abitsIdMap;
let specIdMap;

let input;
let inputButton;
let resultDiv;
let emptyResponseDiv;

let resultTable;


function preload(){
	abitTable = loadTable('csv_data/abits.csv', 'csv', 'header')
	specTable = loadTable('csv_data/spec_extended.csv', 'csv', 'header')
}

function setup(){
	noCanvas()
	calcAbitIdMap()
	calcSpecIdMap()
	// console.log('done')

	selectCoreElements()
	inputButton.mouseClicked(handleSearchRequest)
	// input.changed(handleSearchRequest)
}

function selectCoreElements(){
	input = select('#request');
	inputButton = select('#search_button');
	resultDiv = select('#result');
	emptyResponseDiv = select('#empty_response_message');
}

function handleSearchRequest(){
	let reqName = input.value().split().map((s) => s.toLowerCase());
	if(!reqName){ return; }

	records = getRecords(reqName[0]);
	cleanResultDiv();
	if(records){
		hideEmptyResponse();
		resultTable = createResultTable(records);
		resultDiv.child(resultTable)
		enableTooltips();
	} else {
		showEmptyResponse();
	}
}

function enableTooltips(){
	$('[data-toggle="tooltip"]').tooltip()
}

function getRecords(surname){
	abitIdArray = abitsIdMap[surname];
	if(!abitIdArray){ return undefined; }

	res = []
	for(let i = 0; i < abitIdArray.length; i++){
		res.push(abitTable.getRow(abitIdArray[i]).arr)
	}
	return res
}

function createResultTable(rec){
	table = createElement('table').id('response_table').addClass('table').addClass('table-bordered');
	tHead = createElement('thead')
	tRow = createElement('tr').child(createElement('td', 'Имя'))
	for(let i = 1; i <= 7; i++){
		tRow.child(createElement('td', i).addClass('prior_column'))
	}
	tRow.child(createElement('td', 'Зношенька'))
	table.child(tHead.child(tRow))

	tBody = createElement('tbody')
	for(let i = 0; i < rec.length; i++){
		tBody.child(createUserRow(rec[i]))
	}

	return table.child(tBody)
}

function createUserRow(userRow){
	tRow = createElement('tr')
	tRow.child(createElement('td', userRow[0].split('_')[1]).addClass('user_name').attribute('style', 'vertical-align: middle;'))
	for(let i = 2; i <= 14; i += 2){
		if(int(userRow[i])){
			tRow.child(createElement('td').child(getLink(userRow[i])).attribute('style', 'vertical-align: middle;'));
		} else {
			tRow.child(createElement('td').child(createElement('i').addClass('far').addClass('fa-question-circle')).attribute('style', 'vertical-align: middle;'));
		}
	}
	tRow.child(createElement('td', userRow[18].split('_').join(' ')).attribute('style', 'vertical-align: middle;'))
	return tRow
}

function getLink(specId){
	url = 'https://vstup.edbo.gov.ua/offer/' + specId + '/'
	// data-toggle="tooltip" data-placement="top" title="Tooltip on top"
	aTag = createElement('a').attribute('href', url).attribute('target', '_blank').child(createElement('i').addClass('fas').addClass('fa-university'))
	aTag.attribute('data-toggle', 'tooltip').attribute('data-placement', 'top').attribute('title', getSpecInfo(specId))
	return aTag
}

function getSpecInfo(id){
	row = specTable.getRow(specIdMap[id]).arr
	return [row[2]+'('+row[1]+')', row[3], row[5], row[4], row[6]].join(' ')
}

function showEmptyResponse(){
	resultDiv.addClass('empty_response');
	emptyResponseDiv.show();
}

function hideEmptyResponse(){
	resultDiv.removeClass('empty_response');
	emptyResponseDiv.hide();
}

function cleanResultDiv(){
	if(resultTable){
		resultTable.remove();
	}
}

function calcAbitIdMap(){
	abitsIdMap = {};
	let idColumn = abitTable.getColumn('abit_id_abit_name');
	for(let i = 0; i < idColumn.length; i++){
		let curSurname = idColumn[i].split('_')[1].split(' ')[0].toLowerCase();

		if(curSurname in abitsIdMap){
			abitsIdMap[curSurname].push(i);
		}else{
			abitsIdMap[curSurname] = [i];
		}
	}
}

function calcSpecIdMap(){
	specIdMap = {};
	let idColumn = specTable.getColumn('spec_id');
	for(let i = 0; i < idColumn.length; i++){
		specIdMap[idColumn[i]] = i;
	}
}