function skyNetController() {
	this._bayes = require('bayes');

	this._classifier = this._bayes();
}

var SkyNetController = new skyNetController();

SkyNetController.testSample = function(data) {
	var instance = this;

	// var categoryMap = new Object();
	var positiveResults = [];
	var negativeResults = [];

	var classifier = instance._classifier;

	for (var i = 0; i < data.length; i++) {
		var attributeList = [];

		var feature = data[i];

		var correctCategory;

		for (var attribute in feature) {
			var value = feature[attribute];

			if (attribute != instance._testCategory) {
				attributeList.push(value)
			}
			else {
				correctCategory = value;
			}
		}

		var chosenCategory = classifier.categorize(attributeList.join(' '));

		if (chosenCategory == correctCategory) {
			// console.log('positive')
			positiveResults.push(feature);
		}
		else {
			// console.log('negative')
			negativeResults.push(feature);
		}
	}

	var data = {
		positiveResults: positiveResults,
		negativeResults: negativeResults
	}

	return data;
}

SkyNetController.categorize = function (data) {
	var instance = this;

	for (var i = 0; i < data.length; i++) {
		var attributeList = [];

		var feature = data[i];

		for (var attribute in feature) {
			if (attribute != instance._testCategory) {
				attributeList.push(feature[currentAttribute])
			}
		}

		var attributes = Object.keys(feature);

		for (var j = 0; j < attributes.length; j++) {
			var currentAttribute = attributes[j];

			if (currentAttribute != instance._testCategory) {
				attributeList.push(feature[currentAttribute])
			}
		}

		var chosenCateogory = classifier.categorize(attributeList.join(' '));

		var category = categoryMaps[chosenCateogory];

		category.push(feature);
	}

	instance._categoryMap = categoryMap;

	instance.learn();

	return categoryMap;
}

SkyNetController.readData = function(data, config) {
	var instance = this;

	instance.data = data;

	// console.log(data);

	var categoryMap = instance.categoryMap || {};

	var testCategory = config.testCategory;

	for (var i = 0; i < data.length; i++) {
		var feature = data[i]

		for (var attribute in feature) {
			// console.log(attribute)
			var value = feature[attribute];

			if (attribute == testCategory) {

				if (!categoryMap[value]) {
					categoryMap[value] = [];
				}

				var category = categoryMap[value];

				category.push(feature)
			}
		}
	}

	instance._categoryMap = categoryMap;

	instance._testCategory = testCategory;

	// console.log(categoryMap);

	// console.log(instance._categoryMap);

	instance.learn();

	return instance.getResultsData();
};

SkyNetController.getResultsData = function() {
	var instance = this;

	var data = {}

	var categoryResults = {};

	var categoryMap = instance._categoryMap;

	for(var category in categoryMap) {
		categoryResults[category] = categoryMap[category].length;
	}

	data.categoryResults = categoryResults;

	data.total = instance._classifier.totalDocuments;

	return data;
}

SkyNetController.learn = function() {
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
			var feature = category[j];

			var attributes = Object.keys(feature);

			var attributeList = [];

			var testCategory = instance._testCategory;

			for (var k = 0; k < attributes.length; k++) {
				var currentAttribute = attributes[k];

				if (currentAttribute != testCategory) {
					attributeList.push(feature[currentAttribute])
				}
			}

			classifier.learn(attributeList.join(''), currentKey);
		}

		var totalDocuments = classifier.totalDocuments;
	}
};

SkyNetController.tokenProbabilities = function() {
	var tokenProbabilitiesMap = new Object();

	var categoryMap = instance._categoryMap;

	var categoryKeys = Object.keys(categoryMap);

	for (var i = 0; i < categoryKeys.length; i++) {
		var attributeTokenProbabilitiesMap = new Object();

		var attributes = Object.keys(feature);

		for (var j = 0; j < attributes.length; j++) {
			var currentAttribute = attributes[j]

			var value = feature[currentAttribute];

			var tokenProbability = classifier.tokenProbability(value, categoryKeys[i]);

			attributeTokenProbabilitiesMap[currentAttribute] = tokenProbability;
		}

		tokenProbabilitiesMap[categoryKeys[i]] = attributeTokenProbabilitiesMap;
	}

	return tokenProbabilitiesMap;
};

module.exports = {
	categorize: function(data) {
		SkyNetController.categorize(data, config);
	},
	readData: function(data, config) {
		return SkyNetController.readData(data, config);
	},
	testSample: function(data) {
		return SkyNetController.testSample(data);
	},
	tokenProbabilities: function() {
		SkyNetController.tokenProbabilities();
	}
};