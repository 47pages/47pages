var keystone = require('keystone'),
	Types = keystone.Field.Types,
	SubmissionSchema = require('./base/Submission.js');

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
	title: SubmissionSchema.title,
	status: SubmissionSchema.status,
	staffMeetingAssignment: SubmissionSchema.staffMeetingAssignment,
	volumeAssignment: SubmissionSchema.volumeAssignment,
	submissionDate: SubmissionSchema.submissionDate,
	originalTitle: SubmissionSchema.originalTitle,
	originalImage: {
		type: Types.LocalFile,
		dest: './private/submissions/art/original',
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
	willingToEdit: SubmissionSchema.willingToEdit,
	willingToMeetInPerson: SubmissionSchema.willingToMeetInPerson,
	technicalDetails: {
		type: String,
		noedit: true
	},
	additionalNotes: SubmissionSchema.additionalNotes,
	publishOnline: SubmissionSchema.publishOnline,
	author: SubmissionSchema.author,
	contactEmail: SubmissionSchema.contactEmail
});

// Virtual methods
ArtSubmission.schema.virtual('thumbnailSrc').get(function () {
	return '/private/submissions/art/edited/' + this.editedImage.filename;
});

ArtSubmission.defaultColumns = 'title, status, submissionDate';
ArtSubmission.register();
