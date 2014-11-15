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
		toggle_submission_type: function () {
			$('.submission-form__form--art-specific').toggleClass('invisible');
			$('.submission-form__form--literature-specific').toggleClass('invisible');
		},
		toggle_editing_options: function () {
			$('.submission-form__form--editing-options').toggleClass('invisible');
		},
		validate_form: function () {
			if ($('input[name="author"]').val() === '') {
				alert('You must enter your name. It will remain confidential until publication.');
				return false;
			}
			else if ($('input[name="contactEmail"]').val() === '') {
				// Thorough regex validation happens at the Mongoose level
				alert('You must enter your email address. It will remain confidential unless you opt-in to receiving edits.');
				return false;
			}
			else if (
				$($('input[name="submissionType"]'))[0].checked && // Literature submission
				$('input[name="submission"]').val() === ''
			) {
				alert('You must upload your submission.');
				return false;
			}
			else if (
				$($('input[name="submissionType"]'))[1].checked && // Art submission
				$('input[name="submission"]').val() === '' &&
				$('input[name="originalLink"]').val() === ''
			) {
				// TODO: Link validation (doesn't happen with Mongoose)
				alert('You must upload your submission or submit a link to it.');
				return false;
			}
			else if ($('input[name="title"]').val() === '') {
				alert('You must enter the title of your piece.');
				return false;
			}
			else if ($($('input[name="submissionType"]'))[1].checked && $('textarea[name="technicalDetails"]').val() === '') {
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
	 * @description Binds listeners to handle submission type and editing options selections
	 */
	my.self.init = function () {
		$('input[name="submissionType"]').change(function (event) {
			my.toggle_submission_type();
		});

		$('input[name="willingToEdit"]').change(function (event) {
			my.toggle_editing_options();
		});
	};

	/**
	 * @public
	 * @description Shows the submission guidelines modal
	 */
	my.self.show_submission_guidelines = function () {
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
	my.self.hide_submission_guidelines = function () {
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
	my.self.submit_submission = function () {
		if (my.validate_form()) {
			$('.submission-form__form').submit();
		}
	};

	return my.self;
};

FSP.Contribute = new FSP.contribute();

$('document').ready(FSP.Contribute.init);