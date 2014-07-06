var FSP = FSP || {};

// Format the form based on the submission type (art vs. literature)
FSP.format_form = {
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
};

// Handle the modal display
FSP.show_submission_guidelines = function () {
	$('.submission-guidelines').show();
	$('.fade-background').show();

	// Disable scrolling in the background
	$('body').addClass('no-scroll');

	// Listen for exit
	$('.submission-guidelines').on('click', function (event) {
		event.stopPropagation(); // Don't exit if the click is within the modal
	});
	$(window).on('click', function (event) {
		FSP.hide_submission_guidelines(); // Anywhere else, exit
	});
	$(document).keydown(function (event) {
		if (event.which === 27) {
			FSP.hide_submission_guidelines(); // Also exit on esc press
		}
	});
};

FSP.hide_submission_guidelines = function () {
	$('.submission-guidelines').hide();
	$('.fade-background').hide();

	// Re-enable scrolling on the body
	$('body').removeClass('no-scroll');

	// Remove listener
	$(window).off('click');
};

$('document').ready(function () {
	$('input[name="submission_type"]').change(function (event) {
		if (event.currentTarget.value === 'literature') {
			FSP.format_form.toggle_literature();
		}
		else if (event.currentTarget.value === 'art') {
			FSP.format_form.toggle_art();
		}
	});

	$('input[name="can_edit"]').change(function (event) {
		if (event.currentTarget.value === 'true') {
			FSP.format_form.show_editing_options();
		}
		else if (event.currentTarget.value === 'false') {
			FSP.format_form.hide_editing_options();
		}
	});

	$('#show_submission_guidelines').on('click', function (event) {
		event.stopPropagation();
		FSP.show_submission_guidelines();
	});
});