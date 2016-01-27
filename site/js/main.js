$(document).ready(
	function() {
		var socket = io();

		var TEMPLATE_SELECT_OPTION = '<option value="{1}">{2}</option>';

		var TEMPLATE_DROPDOWN_OPTION = '<div class="dropdown-option"><span value="{1}">{2}</span></div>';

		function skyNetInterface(socket) {
			var instance = this;

			instance.socket = socket;

			instance._categoryInput = $('#categoryInput');

			instance._categoryDropdown = $('#categoryDropdown');

			instance._educateButton = $('#educateButton');

			instance._uploadInput = $('#uploadInput');

			instance._testCategory;

			instance._data;
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

			$(instance).on('dataUpdated', instance.handleDataUpdate);
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

			var value = optionNode.attr('value');

			var categoryDropdown = SkyNetInterface._categoryDropdown;

			categoryDropdown.siblings('.label').text(optionNode.text());

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
			var instance = this;

			var uploadBtnNode = event.target;

			var file = uploadBtnNode.files[0];

			$(uploadBtnNode).siblings('div').children('.label').text(file.name);

			var fileReader = new FileReader();

			fileReader.onload = function(event) {
				var data = JSON.parse(event.target.result);

				$(SkyNetInterface).trigger('dataUpdated', [data]);
			}

			fileReader.readAsText(file)
		}

		SkyNetInterface.handleEducateButtonClick = function(event) {
			var socket = SkyNetInterface.socket;

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
