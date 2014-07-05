var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Submission Base Schema
 * ==========
 */

var SubmissionSchema = {
	title: {
		type: String,
		required: true
	},
	author: {
		type: Types.Name,
		index: true
	},
	submissionDate: {
		type: Types.Date,
		index: true
	},
	willingToEdit: {
		type: Types.Boolean
	},
	willingToMeetInPerson: {
		type: Types.Boolean,
		dependsOn: {
			willingToEdit: true
		}
	},
	contactEmail: {
		type: Types.Email
	},
	additionalNotes: {
		type: String
	},
	status: {
		type: Types.Select,
		options: 'new, staff review, editorial review, copy, design, published',
		default: 'new',
		index: true
	}
};

module.exports = SubmissionSchema;