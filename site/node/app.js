var NaiveBayesController = require('./naiveBayesController.js');
var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);

var trainingData = fs.readFileSync('../trainingData.json');

var trainingDataJson = JSON.parse(trainingData);

var config = {
	testCategory: 'IsWon'
}

// NaiveBayesController.readData(trainingDataJson, config)


app.get('/', function(req, res){
	res.sendFile(__dirname + '/../html/index.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
// app.listen(80);

// function handler (req, res) {
// 	fs.readFile(
// 		'../html/index.html',
// 		function (err, data) {
// 			if (err) {
// 				res.writeHead(500);

// 				return res.end('Error loading index.html');
// 			}

// 			res.writeHead(200);

// 			res.end(data);
// 		}
// 	);
// }

// io.on(
// 	'connection',
// 	function (socket) {
// 		socket.emit(
// 			'news',
// 			{
// 				hello: 'world'
// 			}
// 		);

// 		socket.on(
// 			'my other event',
// 			function (data) {
// 				NaiveBayesController.readData(trainingDataJson, config);
// 			}
// 		);
// 	}
// );

// function bayesController() {
// }

// var bayesController = new bayesController();

// bayesController.readData = function(data) {
// 	this.data = data;

// 	var positiveData = [];
// 	var negativeData = [];

// 	for (var i = 0; i < data.length; i++) {
// 		var company = data[i]

// 		var attributes = Object.keys(company);

// 		for (var j = 0; j < attributes.length; j++) {
// 			var currentAttribute = attributes[j]

// 			var value = company[currentAttribute];

// 			if (currentAttribute === 'IsWon') {
// 				if (value == 'true') {
// 					positiveData.push(company)
// 				}

// 				else {
// 					negativeData.push(company)
// 				}
// 			}
// 		}

// 		this._positiveData = positiveData;
// 		this._negativeData = negativeData;
// 	}
// }
// bayesController.readData(trainingDataJson);
// console.log(bayesController.data, bayesController._positiveData.length, bayesController._negativeData.length);
// 	// console.log(data, positiveData.length, negativeData.length)

	// Object.keys(trainingDataJson).forEach(function (attribute, index))
	// // for (attribute of trainingDataJson) {

	// // }


	// for (var i = 0; i < positiveData.length; i++) {
	// 	var positiveCompany = positiveData[i];

	// 	classifier.learn(positiveCompany.LeadId + ' '
	// 		+ positiveCompany.CompanyName + ' '
	// 		+ positiveCompany.Country + ' '
	// 		+ positiveCompany.Department + ' '
	// 		+ positiveCompany.Industry + ' '
	// 		+ positiveCompany.JobTitle + ' '
	// 		+ positiveCompany.IsTraining,
	// 		'positive'
	// 	);
	// }

	// for (var i = 0; i < negativeData.length; i++) {
	// 	var negativeCompany = negativeData[i];

	// 	classifier.learn(negativeCompany.LeadId + ' '
	// 		+ negativeCompany.CompanyName + ' '
	// 		+ negativeCompany.Country + ' '
	// 		+ negativeCompany.Department + ' '
	// 		+ negativeCompany.Industry + ' '
	// 		+ negativeCompany.JobTitle + ' '
	// 		+ negativeCompany.IsTraining,
	// 		'negative'
	// 	);
	// }


	// console.log(classifier.totalDocuments);

	// var testData =  {
	//     "IsWon": "true",
	//     "IsClosed": "true",
	//     "LeadId": "00Q7000000rnnnUEAQ",
	//     "LeadCreateDate": "2013-09-26 13:23:48",
	//     "CompanyName": "Hewlett Packard Enterprise",
	//     "Country": null,
	//     "Department": null,
	//     "EmailDomain": "@hp.com",
	//     "Industry": "Technology",
	//     "JobTitle": null,
	//     "IsTraining": "false"
	//   }

	//  console.log(
	//  	classifier.tokenProbability(
	// 		testData.Industry, 'positive'
	// 	)
	// );
// teach it positive phrases

// classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive')
// classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive')

// // teach it a negative phrase

// classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative')

// // now ask it to categorize a document it has never seen before

// console.log(classifier.categorize('awesome, cool, amazing!! Yay.'));
// => 'positive'

// serialize the classifier's state as a JSON string.
// var stateJson = classifier.toJson()

// load the classifier back from its JSON representation.
// var revivedClassifier = bayes.fromJson(stateJson)