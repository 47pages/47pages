var keystone = require('47pages-keystone'),
	LiteratureSubmission = keystone.list('LiteratureSubmission'),
	ArtSubmission = keystone.list('ArtSubmission'),
	fs = require('fs'),
	Buffer = require('buffer').Buffer;

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
		}, function (err, self) {
			if (err) {
				locals.submitted = false;
				locals.errors = err.errors;
			} else {
				locals.submitted = true;
				req.flash('success', {title: 'Thanks for your submission! We will review it and get in touch if necessary.'});

				// Let the user know that his submission was received
				new keystone.Email('submission-receipt-notification').send({
					to: process.env.ENVIRONMENT == 'dev' ? 'admin@47pages.org' : req.body.contactEmail,
					from: {
						name: '47 Pages',
						email: 'noreply@47pages.org'
					},
					subject: '47 Pages Received Your Submission',
					submission_data: {
						author: req.body.author,
						title: req.body.title
					}
				});

				var staff_emails = [],
					upload_path = '',
					filename_elements = req.files.submission.name.split('.');

				switch (req.body.submissionType) {
				case 'literature':
					if (process.env.ENVIRONMENT !== 'dev') {
						staff_emails = [{email: 'literature@47pages.org'}];
					}
					else { // Testing purposes only
						staff_emails = [{email: 'admin@47pages.org'}];
					}

					upload_path = keystone.get('root_dirname') + '/private/submissions/literature/original';
					break;
				case 'art':
					if (process.env.ENVIRONMENT !== 'dev') {
						staff_emails = [{email: 'art@47pages.org'}];
					}
					else { // Testing purposes only
						staff_emails = [{email: 'admin@47pages.org'}];
					}

					upload_path = keystone.get('root_dirname') + '/private/submissions/art/original';
					break;
				default:
					break;
				}

				var file_path = upload_path + '/' + filename_elements[0] + '_' + self.item.id + '.' + filename_elements[1],
					admin_emails = ['admin@47pages.org'];

				if (process.env.ENVIRONMENT !== 'dev') {
					admin_emails.push({email: 'editor@47pages.org'});
				}

				// Send a copy of the submission to the senior editors
				// Have to do this asynchronously since the file must be read in from its new saved location
				fs.readFile(
					file_path,
					function (err, data) {
						new keystone.Email('new-submission-notification').send({
							to: staff_emails,
							from: {
								name: '47 Pages',
								email: 'noreply@47pages.org'
							},
							subject: 'New Submission Received: ' + req.body.title,
							attachments: [{
								type: req.files.submission.type,
								name: req.files.submission.name,
								content: new Buffer(data).toString('base64')
							}],
							submission_data: {
								title: req.body.title,
								willingToMeetInPerson: req.body.willingToMeetInPerson,
								willingToEdit: req.body.willingToEdit,
								additionalNotes: req.body.additionalNotes,
								artworkPairing: req.body.artworkPairing
							}
						});
					}
				);

				// Send a copy of the submission with the author details to the admin and the editor-in-chief
				// Have to do this asynchronously since the file must be read in from its new saved location
				fs.readFile(
					file_path,
					function (err, data) {
						new keystone.Email('admin-new-submission-notification').send({
							to: admin_emails,
							from: {
								name: '47 Pages',
								email: 'noreply@47pages.org'
							},
							subject: 'New Submission Received: ' + req.body.title,
							attachments: [{
								type: req.files.submission.type,
								name: req.files.submission.name,
								content: new Buffer(data).toString('base64')
							}],
							submission_data: {
								title: req.body.title,
								author: req.body.author,
								contactEmail: req.body.contactEmail,
								willingToMeetInPerson: req.body.willingToMeetInPerson,
								willingToEdit: req.body.willingToEdit,
								additionalNotes: req.body.additionalNotes,
								artworkPairing: req.body.artworkPairing
							}
						});
					}
				);

			}

			res.redirect('/contribute');
		});
	}
};
