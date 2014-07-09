var keystone = require('keystone'),
	LiteratureSubmission = keystone.list('LiteratureSubmission'),
	ArtSubmission = keystone.list('ArtSubmission');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Create a new submission on POST
	view.on('post', function (next) {
		var new_submission,
			model_fields;

		switch (req.body.submissionType) {
			case 'literature':
				new_submission = new LiteratureSubmission.model();
				// TODO: Cleaner way to to this? Have to trick Keystone into accepting a file with the right path
				req.files.originalPiece_upload = req.files.submission;
				model_fields = 'title, author, willingToEdit, willingToMeetInPerson, contactEmail, additionalNotes, originalPiece, artworkPairing';
				break;
			case 'art':
				new_submission = new ArtSubmission.model();
				req.files.originalImage_upload = req.files.submission;
				model_fields = 'title, author, willingToEdit, willingToMeetInPerson, contactEmail, additionalNotes, originalImage, technicalDetails';
				break;
			default:
				return false;
		}

		var updater = new_submission.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: model_fields,
			errorMessage: 'There was a problem processing your submission:'
		}, function (err) {
			if (err) {
				locals.submitted = false;
				locals.errors = err.errors;
			} else {
				locals.submitted = true;
				req.flash('success', {title: 'Thanks for your submission! We will review it and get in touch if necessary.'});
			}
			next();
		});
	});

	view.render('contribute');

};
