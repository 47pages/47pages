var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Submission = require('./base/Submission.js');

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
	title: Submission.schema.title,
	status: Submission.schema.status,
	staffMeetingAssignment: Submission.schema.staffMeetingAssignment,
	volumeAssignment: Submission.schema.volumeAssignment,
	submissionDate: Submission.schema.submissionDate,
	originalTitle: Submission.schema.originalTitle,
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
		height: 150,
		default: ''
	},
	willingToEdit: Submission.schema.willingToEdit,
	willingToMeetInPerson: Submission.schema.willingToMeetInPerson,
	artworkPairing: {
		type: String,
		noedit: true
	},
	additionalNotes: Submission.schema.additionalNotes,
	publishOnline: Submission.schema.publishOnline,
	author: Submission.schema.author,
	contactEmail: Submission.schema.contactEmail
});

// Virtual methods
LiteratureSubmission.schema.virtual('teaser').get(function () {
	return this.editedPiece === '' ? '' : this.editedPiece.replace(/<(?:.|\n)*?>/gm, '').substr(0, 140) + '&hellip;';
});

LiteratureSubmission.schema.pre('save', Submission.hooks.pre_save);

LiteratureSubmission.schema.pre('validate', function (next, done) {
	if (this.publishOnline && this.editedPiece === '') {
		var error_message = 'Please enter the edited piece text before publishing this submission online!';
		done(new Error(error_message));
		next(new Error(error_message));
	}
	else {
		done();
		next();
	}
});

LiteratureSubmission.defaultColumns = 'title, status, submissionDate';
LiteratureSubmission.register();
