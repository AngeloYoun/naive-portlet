$(document).ready(
	function() {
		var socket = io();

		var TEMPLATE_SELECT_OPTION = '<option value="{1}">{2}</option>';

		var TEMPLATE_DROPDOWN_OPTION = '<div class="dropdown-option"><span value="{1}">{2}</span></div>';

		var TEMPLATE_CATEGORY_VALUE_RESULT = '<span>{1}: {2}</span>';

		function skyNetInterface(socket) {
			var instance = this;

			instance.socket = socket;

			instance._testOverallPercentage = $('#testOverallPercentage');

			instance._testIndividualResults = $('#testIndividualResults');

			instance._testTotalNumbers = $('#testTotalNumbers');

			instance._testButton = $('#testButton');

			instance._categoryResultsLabel = $('#categoryResults');

			instance._learnedEntryCount = $('#learnedEntryCount')

			instance._categoryName = $('#categoryName');

			instance._entryCountLabel = $('#entryCount');

			instance._fileNameLabel = $('#fileName');

			instance._fileInfo = $('#fileInfo');

			instance._testFileInfo = $('#testFileInfo');

			instance._testInput = $('#testInput');

			instance._categoryInput = $('#categoryInput');

			instance._categoryDropdown = $('#categoryDropdown');

			instance._educateButton = $('#educateButton');

			instance._uploadInput = $('#uploadInput');

			instance._testCategory;

			instance._validCategoryValues;

			instance._data;

			instance._testData;
		}

		var SkyNetInterface = new skyNetInterface(socket);

		SkyNetInterface.initialize = function() {
			var instance = this;

			instance.bindUI();
		}

		SkyNetInterface.bindUI = function() {
			var instance = this;

			instance._uploadInput.on('change', instance.handleFileUpload);

			instance._categoryInput.closest('div').on('click', instance.handleCategoryDropdrownClick);

			instance._categoryDropdown.delegate('.dropdown-option', 'click', instance.handleCategoryDropdownOptionClick)

			instance._educateButton.on('click', instance.handleEducateButtonClick)

			instance._testInput.on('change', instance.handleTestFileUpload);

			instance._testButton.on('click', instance.handleTestButtonClick);

			var socket = instance.socket;

			socket.on('dataLearned', instance.handleDataLearned);

			socket.on('dataTested', instance.handleDataTested);

			$(instance).on('dataUpdated', instance.handleDataUpdate);
		}

		SkyNetInterface.handleDataLearned = function(data) {
			var categoryResults = data.categoryResults;

			categoryResultsContainer = SkyNetInterface._categoryResultsLabel;

			for(var value in categoryResults) {
				var categoryValueResult = TEMPLATE_CATEGORY_VALUE_RESULT.replace('{1}', value);

				categoryValueResult = categoryValueResult.replace('{2}', categoryResults[value]);

				var categoryValueResultNode = $(categoryValueResult);

				categoryResultsContainer.append(categoryValueResultNode);
			}

			SkyNetInterface._learnedEntryCount.text(data.total + ' out of ' + SkyNetInterface._data.length + ' learned.')

			SkyNetInterface._testInput.closest('div').removeClass('hidden');
		}

		SkyNetInterface.handleDataTested = function(data) {
			var positiveCount = data.positiveResults.length;
			var negativeCount = data.negativeResults.length;

			console.log(data)

			var ratio = positiveCount / (positiveCount + negativeCount)

			var percentage = (Math.round(ratio * 100)/100) * 10;

			// console.log('fired')

			SkyNetInterface._testOverallPercentage.text(percentage + '% of predictions were correct.')

			SkyNetInterface._testTotalNumbers.text(positiveCount + ' correct, ' + negativeCount + ' incorrect.');

			// testIndividualResults = SkyNetInterface._testIndividualResults
		}

		SkyNetInterface.handleCategoryDropdrownClick = function(event) {
			event.stopPropagation();
			event.preventDefault();

			SkyNetInterface._categoryDropdown.removeClass('collapsed');
		}

		SkyNetInterface.handleCategoryDropdownOptionClick = function(event) {
			event.stopPropagation();
			event.preventDefault();

			var optionNode = $(event.target);

			var value = optionNode.text().toLowerCase();

			var categoryDropdown = SkyNetInterface._categoryDropdown;

			SkyNetInterface._categoryName.text('In relation to ' + optionNode.text().toLowerCase() + '.');

			SkyNetInterface._categoryInput.attr('value', value);

			SkyNetInterface._testCategory = value;

			categoryDropdown.addClass('collapsed');

			SkyNetInterface._educateButton.removeClass('hidden');
		}

		SkyNetInterface.handleDataUpdate = function(event, data) {
			var instance = this;

			instance._data = data;

			instance.updateCategorySelectInput();
		}

		SkyNetInterface.updateCategorySelectInput = function() {
			var instance = this;

			var categoryDropdown = instance._categoryDropdown;
			var categoryInput = instance._categoryInput;

			var data = instance._data;

			sampleObject = data[0];

			categoryDropdown.empty();
			categoryInput.empty();

			for (var categories in sampleObject) {
				var template = TEMPLATE_SELECT_OPTION.replace('{1}', categories);

				var templateDropdown = TEMPLATE_DROPDOWN_OPTION.replace('{1}', categories);

				template = template.replace('{2}', categories.toUpperCase());

				templateDropdown = templateDropdown.replace('{2}', categories.toUpperCase());

				var optionNode = $(template);

				categoryInput.append(optionNode);

				var dropdownOptionNode = $(templateDropdown);

				categoryDropdown.append(dropdownOptionNode)
			}

			categoryInput.closest('div').removeClass('hidden');
		}

		SkyNetInterface.handleFileUpload = function(event) {
			var file = event.target.files[0];

			SkyNetInterface._fileNameLabel.text(file.name)

			var fileReader = new FileReader();

			fileReader.onload = function(event) {
				var data = JSON.parse(event.target.result);

				SkyNetInterface._entryCountLabel.text('Data file has ' + data.length + ' entries.')

				$(SkyNetInterface).trigger('dataUpdated', [data]);
			}

			fileReader.readAsText(file)
		}

		SkyNetInterface.handleEducateButtonClick = function(event) {
			var socket = SkyNetInterface.socket;

			console.log(SkyNetInterface._testCategory, SkyNetInterface._data)

			socket.emit(
				'learnData',
				{
					content: SkyNetInterface._data,
					config: {
						testCategory: SkyNetInterface._testCategory
					}
				}
			);
		}

		SkyNetInterface.handleTestButtonClick = function() {
			var socket = SkyNetInterface.socket;
			console.log(SkyNetInterface._testData)

			socket.emit(
				'testData',
				{
					content: SkyNetInterface._testData,
				}
			);
		}

		SkyNetInterface.handleTestFileUpload = function(event) {
			var file = event.target.files[0];

			// SkyNetInterface._fileNameLabel.text(file.name)

			var fileReader = new FileReader();

			fileReader.onload = function(event) {
				var data = JSON.parse(event.target.result);

				SkyNetInterface._testData = data;

				SkyNetInterface._testButton.removeClass('hidden');

				// SkyNetInterface._entryCountLabel.text('Data file has ' + data.length + ' entries.')

				// $(SkyNetInterface).trigger('dataUpdated', [data]);
			}

			fileReader.readAsText(file)
		}

		SkyNetInterface.initialize();
		// learnButton.bind(
		// 	'click',
		// 	function() {


		// 		var fileReader = new FileReader();

		// 		fileReader.onload = handleFileUpload();
		// 			var resultString = event.target.result;
		// 			dataJson = JSON.parse(resultString);

		// 			socket.emit(
		// 				'learnData',
		// 				{
		// 					content: dataJson,
		// 					config: {
		// 						testCategory: 'IsWon'
		// 					}
		// 				}
		// 			);
		// 		};

		// 		fileReader.readAsText(file);
		// 	}
		// )

	}
);
