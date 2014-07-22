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
	originalTitle: {
		type: String,
		required: true,
		noedit: true
	},
	author: {
		type: Types.Name,
		index: true,
		//required: true,
		noedit: true
	},
	submissionDate: {
		type: Types.Date,
		index: true,
		required: true,
		default: Date.now,
		noedit: true
	},
	willingToEdit: {
		type: Types.Boolean,
		noedit: true
	},
	willingToMeetInPerson: {
		type: Types.Boolean,
		dependsOn: {
			willingToEdit: true
		},
		noedit: true
	},
	contactEmail: {
		type: Types.Email,
		required: true,
		noedit: true
	},
	additionalNotes: {
		type: String,
		noedit: true
	},
	status: {
		type: Types.Select,
		options: 'new, staff review, editorial review, copy, design, published',
		default: 'new',
		index: true
	},
	staffMeetingAssignment: {
		type: Types.Relationship,
		ref: 'Meeting',
		dependsOn: {
			status: 'staff review'
		}
	},
	volumeAssignment: {
		type: Types.Relationship,
		ref: 'Volume',
		dependsOn: {
			status: 'design'
		}
	},
	publishOnline: {
		type: Types.Boolean,
		default: false
	}
};

module.exports = SubmissionSchema;