// 47 Pages namespace
var FSP = FSP || {};

/**
 * @module
 * @description Methods to format and validate contribution form
 */
FSP.contribute = function () {
	/**
	 * @private
	 */
	var my = {
		self: this,
		format_form: { // Format the form based on the submission type (art vs. literature)
			toggle_literature: function () {
				$('.submission-form__form--art-specific').each(function (index, element) {
					$(element).hide();
				});
				$('.submission-form__form--literature-specific').each(function (index, element) {
					$(element).show();
				});
			},
			toggle_art: function () {
				$('.submission-form__form--art-specific').each(function (index, element) {
					$(element).show();
				});
				$('.submission-form__form--literature-specific').each(function (index, element) {
					$(element).hide();
				});
			},
			show_editing_options: function () {
				$('.submission-form__form--editing-options').each(function (index, element) {
					$(element).show();
				});
			},
			hide_editing_options: function () {
				$('.submission-form__form--editing-options').each(function (index, element) {
					$(element).hide();
				});
			}
		},
		validate_form: function () {
			if ($('input[name=author]').val() === '') {
				alert('You must enter your name. It will remain confidential until publication.');
				return false;
			}
			else if ($('input[name=contactEmail').val() === '') {
				// Thorough regex validation happens at the Mongoose level
				alert('You must enter your email address. It will remain confidential unless you opt-in to receiving edits.');
				return false;
			}
			else if (
				$($('input[name=submissionType]'))[0].checked && // Literature submission
				$('input[name=submission').val() === ''
			) {
				alert('You must upload your submission.');
				return false;
			}
			else if (
				$($('input[name=submissionType]'))[1].checked && // Art submission
				$('input[name=submission').val() === '' &&
				$('input[name=originalLink').val() === ''
			) {
				// TODO: Link validation (doesn't happen with Mongoose)
				alert('You must upload your submission or submit a link to it.');
				return false;
			}
			else if ($('input[name=title').val() === '') {
				alert('You must enter the title of your piece.');
				return false;
			}
			else if ($($('input[name=submissionType]'))[1].checked && $('textarea[name=technicalDetails]').val() === '') {
				alert('You must enter your art piece\'s technical details.');
				return false;
			}
			else {
				return true;
			}
		}
	};

	/**
	 * @public
	 * @description Binds listeners to handle literature/art type selection
	 */
	this.init = function () {
		$('input[name="submissionType"]').change(function (event) {
			if (event.currentTarget.value === 'literature') {
				my.format_form.toggle_literature();
			}
			else if (event.currentTarget.value === 'art') {
				my.format_form.toggle_art();
			}
		});

		$('input[name="willingToEdit"]').change(function (event) {
			if (event.currentTarget.value === 'true') {
				my.format_form.show_editing_options();
			}
			else if (event.currentTarget.value === 'false') {
				my.format_form.hide_editing_options();
			}
		});
	};

	/**
	 * @public
	 * @description Shows the submission guidelines modal
	 */
	this.show_submission_guidelines = function () {
		$('.submission-guidelines').show();
		$('.fade-background').show();

		// Disable scrolling in the background
		$('body').addClass('no-scroll');

		// Listen for exit
		$('.submission-guidelines').on('click', function (event) {
			event.stopPropagation(); // Don't exit if the click is within the modal
		});
		$(window).on('click', function (event) {
			my.self.hide_submission_guidelines(); // Anywhere else, exit
		});
		$(document).keydown(function (event) {
			if (event.which === 27) {
				my.self.hide_submission_guidelines(); // Also exit on esc press
			}
		});
		event.stopPropagation(); // Don't trigger the exit listener we just bound!
	};

	/**
	 * @public
	 * @description Hides the submission guidelines modal
	 */
	this.hide_submission_guidelines = function () {
		$('.submission-guidelines').hide();
		$('.fade-background').hide();

		// Re-enable scrolling on the body
		$('body').removeClass('no-scroll');

		// Remove listener
		$(window).off('click');
	};

	/**
	 * @public
	 * @description Submits the submission form after performing appropriate validation
	 */
	this.submit_submission = function () {
		if (my.validate_form()) {
			$('.submission-form__form').submit();
		}
	};

	return this;
};

FSP.Contribute = new FSP.contribute();

$('document').ready(FSP.Contribute.init);