var keystone = require('47pages-keystone'),
	LiteratureSubmission = keystone.list('LiteratureSubmission'),
	ArtSubmission = keystone.list('ArtSubmission');

exports = module.exports = function (req, res) {

	var locals = res.locals;

	// Create a new submission on POST
	if (req.method === 'POST') {
		var new_submission,
			model_fields;

		// Manually set some properties to satisfy the updateHandler
		req.body.originalTitle = req.body.title;
		req.body['author.full'] = req.body.author;

		switch (req.body.submissionType) {
			case 'literature':
				new_submission = new LiteratureSubmission.model();

				// TODO: Cleaner way to to this? Have to trick Keystone into accepting a file with the right path
				req.files.originalPiece_upload = req.files.submission;

				model_fields = [
					'author',
					'contactEmail',
					'title',
					'willingToEdit',
					'willingToMeetInPerson',
					'artworkPairing',
					'additionalNotes',
					'originalTitle',
					'originalPiece'
				].join(', ');
				break;
			case 'art':
				new_submission = new ArtSubmission.model();

				req.files.originalImage_upload = req.files.submission;

				model_fields = [
					'author',
					'contactEmail',
					'title',
					'technicalDetails',
					'willingToEdit',
					'willingToMeetInPerson',
					'additionalNotes',
					'originalTitle',
					'originalImage',
					'originalLink'
				].join(', ');

				break;
			default:
				req.flash('error', {title: 'SubmissionType error.'});
				view.render('contribute');
				return;
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

				new keystone.Email('submission-notification').send({
					to: model_fields.contactEmail,
					from: {
						name: '47 Pages',
						email: 'noreply@47pages.org'
					},
					subject: 'Submission Received'
				});
			}

			res.redirect('/contribute');
		});
	}
};
