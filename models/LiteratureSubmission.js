var keystone = require('keystone'),
	Types = keystone.Field.Types,
	SubmissionSchema = require('./base/Submission.js');

/**
 * LiteratureSubmission < Submission
 * ==========
 */

var LiteratureSubmission = new keystone.List('LiteratureSubmission', {
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

var doc_mime_types = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
	'application/msword', // doc
	'text/plain', // txt
	'application/x-iwork-pages-sffpages' // pages
];

LiteratureSubmission.add({
	title: SubmissionSchema.title,
	status: SubmissionSchema.status,
	staffMeetingAssignment: SubmissionSchema.staffMeetingAssignment,
	submissionDate: SubmissionSchema.submissionDate,
	originalTitle: SubmissionSchema.originalTitle,
	originalPiece: {
		type: Types.LocalFile,
		dest: './private/submissions/literature/original',
		allowedTypes: doc_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split('.');
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		},
		format: function (model, file) {
			return '<a href="/private/submissions/literature/original/' + file.filename + '">' + file.filename + '</a>';
		},
		noedit: true
	},
	editedPiece: {
		type: Types.Html,
		wysiwyg: true,
		height: 150
	},
	willingToEdit: SubmissionSchema.willingToEdit,
	willingToMeetInPerson: SubmissionSchema.willingToMeetInPerson,
	artworkPairing: {
		type: String,
		noedit: true
	},
	additionalNotes: SubmissionSchema.additionalNotes,
	publishOnline: SubmissionSchema.publishOnline,
	author: SubmissionSchema.author,
	contactEmail: SubmissionSchema.contactEmail
});

LiteratureSubmission.defaultColumns = 'title, status, submissionDate';
LiteratureSubmission.register();
