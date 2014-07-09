var keystone = require('keystone'),
	Types = keystone.Field.Types,
	_ = require('underscore'),
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
	}
});

var doc_mime_types = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
	'application/msword', // doc
	'text/plain', // txt
	'application/x-iwork-pages-sffpages' // pages
];

LiteratureSubmission.add(_.extend({
	originalPiece: {
		type: Types.LocalFile,
		dest: './submissions/literature/original',
		allowedTypes: doc_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split(('.'));
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		},
		noedit: true
	},
	editedPiece: {
		type: Types.Html,
		wysiwyg: true,
		height: 150
	},
	artworkPairing: {
		type: String
	}
}, SubmissionSchema));

LiteratureSubmission.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
LiteratureSubmission.register();
