var keystone = require('47pages-keystone'),
	Types = keystone.Field.Types,
	Submission = require('./base/Submission.js');

/**
 * ArtSubmission < Submission
 * ==========
 */

var ArtSubmission = new keystone.List('ArtSubmission', {
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	nocreate: true,
	nodelete: true
});

var image_mime_types = [
	'image/png',
	'image/jpeg',
	'image/tiff',
	'image/gif',
	'image/svg+xml'
];

ArtSubmission.add({
	title: Submission.schema.title,
	status: Submission.schema.status,
	staffMeetingAssignment: Submission.schema.staffMeetingAssignment,
	volumeAssignment: Submission.schema.volumeAssignment,
	submissionDate: Submission.schema.submissionDate,
	originalTitle: Submission.schema.originalTitle,
	originalImage: {
		type: Types.LocalFile,
		dest: keystone.get('root_dirname') + '/private/submissions/art/original',
		allowedTypes: image_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split('.');
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		},
		format: function (model, file) {
			return	'<a href="/private/submissions/art/original/' + file.filename + '">' +
						'<img src="/private/submissions/art/original/' + file.filename + '" style="max-width: 400px">' +
					'</a>';
		},
		noedit: true
	},
	originalLink: {
		type: Types.Url,
		noedit: true
	},
	editedImage: {
		type: Types.LocalFile,
		dest: './private/submissions/art/edited',
		allowedTypes: image_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split('.');
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		},
		format: function (model, file) {
			return	'<a href="/private/submissions/art/edited/' + file.filename + '">' +
						'<img src="/private/submissions/art/edited/' + file.filename + '" style="max-width: 400px">' +
					'</a>';
		}
	},
	willingToEdit: Submission.schema.willingToEdit,
	willingToMeetInPerson: Submission.schema.willingToMeetInPerson,
	technicalDetails: {
		type: String,
		noedit: true
	},
	additionalNotes: Submission.schema.additionalNotes,
	publishOnline: Submission.schema.publishOnline,
	author: Submission.schema.author,
	contactEmail: Submission.schema.contactEmail
});

// Virtual methods
ArtSubmission.schema.virtual('thumbnailSrc').get(function () {
	return '/private/submissions/art/edited/' + this.editedImage.filename;
});

ArtSubmission.schema.pre('save', Submission.hooks.pre_save);

ArtSubmission.schema.pre('validate', function (next, done) {
	if (this.publishOnline && this._doc.editedImage !== {}) { // Seems like a Keystone bug; should just be able to check !this.editedImage
		var error_message = 'Please upload an edited image before publishing this submission online!';
		done(new Error(error_message));
		next(new Error(error_message));
	}
	else {
		done();
		next();
	}
});

ArtSubmission.defaultColumns = 'title, status, submissionDate';
ArtSubmission.register();
