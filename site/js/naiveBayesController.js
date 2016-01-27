function naiveBayesController() {
	this._bayes = require('bayes');

	this._classifier = this._bayes();
}

var NaiveBayesController = new naiveBayesController();

NaiveBayesController.readData = function(data, config) {
	this.data = data;

	var categoryMap = this.categoryMap || {};

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

	this._categoryMap = categoryMap;

	this.learn();
};

NaiveBayesController.learn = function() {
	var instance = this;

	var classifier = instance._classifier;

	var categoryMap = instance._categoryMap;

	var categoryKeys = Object.keys(categoryMap);

	for (var i = 0; i < categoryKeys.length; i++) {
		var currentKey =  categoryKeys[i];

		var company = categoryMap[currentKey];

		var attributes = Object.keys(company);

		for (var i = 0; i < attributes.length; i++) {

		}

		classifier.learn(company)
	}
};

// NaiveBayesController.addData = function() {
// }

module.exports = {
	readData: function(data, config) {
		NaiveBayesController.readData(data, config);
	}
};