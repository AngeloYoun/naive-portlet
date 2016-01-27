function naiveBayesController() {
	this._bayes = require('bayes');

	this._classifier = this._bayes();
}

var NaiveBayesController = new naiveBayesController();

NaiveBayesController.readData = function(data, config) {
	var instance = this;

	instance.data = data;

	var categoryMap = instance.categoryMap || {};

	var testCategory = config.testCategory;
	var positiveCategory = config.positiveCategory;

	for (var i = 0; i < data.length; i++) {
		var company = data[i]

		var attributes = Object.keys(company);

		for (var j = 0; j < attributes.length; j++) {
			var currentAttribute = attributes[j]

			var value = company[currentAttribute];

			if (currentAttribute === testCategory) {
				if (!categoryMap[value]) {
					categoryMap[value] = [];
				}

				var category = categoryMap[value];

				category.push(company)
			}
		}
	}

	instance._categoryMap = categoryMap;

	instance._testCategory = testCategory;

	instance.learn();
};

NaiveBayesController.learn = function() {
	var instance = this;

	var classifier = instance._classifier;

	var categoryMap = instance._categoryMap;

	var categoryKeys = Object.keys(categoryMap);

	//this is just for keeping track of documents read for display purposes
	var documentsRead = 0;

	for (var i = 0; i < categoryKeys.length; i++) {
		var currentKey =  categoryKeys[i];

		var category = categoryMap[currentKey];

		for (var j = 0; j < category.length; j++) {
			var company = category[j];

			var attributes = Object.keys(company);

			var attributeList = [];

			var testCategory = instance._testCategory;

			for (var k = 0; k < attributes.length; k++) {
				var currentAttribute = attributes[k];

				if (currentAttribute != testCategory) {
					attributeList.push(company[currentAttribute])
				}
			}

			classifier.learn(attributeList.join(''), currentKey);
		}

		var totalDocuments = classifier.totalDocuments;

		console.log('Learned ' + (totalDocuments - documentsRead) + ' for category ' + currentKey);

		documentsRead += totalDocuments;
	}
};

// NaiveBayesController.addData = function() {
// }

module.exports = {
	readData: function(data, config) {
		NaiveBayesController.readData(data, config);
	}
};