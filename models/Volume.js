var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Volume
 * ==========
 */

var Volume = new keystone.List('Volume', {
	map: {
		name: 'number'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	nodelete: true
});

Volume.add({
	number: {
		type: Types.Number,
		initial: true,
		required: true
	}
});

Volume.relationship({
	path: 'literature submissions',
	ref: 'LiteratureSubmission',
	refPath: 'volumeAssignment'
});

Volume.relationship({
	path: 'art submissions',
	ref: 'ArtSubmission',
	refPath: 'volumeAssignment'
});

Volume.defaultColumns = 'number';
Volume.register();
