var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

var permission_levels = {
	admin: 10,
	editor: 9,
	senior: 8,
	copy: 5,
	design: 5,
	staff: 1
};

User.add({
	name: {
		type: Types.Name,
		required: true,
		index: true
	},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		index: true
	},
	password: {
		type: Types.Password,
		initial: true,
		required: true
	}
}, 'Permissions', {
	isAdmin: {
		type: Boolean,
		label: 'Admin'
	},
	isEditor: {
		type: Boolean,
		label: 'Editor-in-Chief'
	},
	isSeniorDesign: {
		type: Boolean,
		label: 'Senior Design'
	},
	isSeniorLiterature: {
		type: Boolean,
		label: 'Senior Literature'
	},
	isSeniorArt: {
		type: Boolean,
		label: 'Senior Art'
	},
	isCopy: {
		type: Boolean,
		label: 'Copy'
	},
	isDesign: {
		type: Boolean,
		label: 'Design'
	},
	isStaff: {
		type: Boolean,
		label: 'Staff'
	},
	permissionLevel: {
		type: Types.Number
	}
});

// Set the permissionLevel accordingly on save
User.schema.pre('save', function (next) {
	if (this.isAdmin) {
		this.permissionLevel = permission_levels.admin;
	}
	else if (this.isEditor) {
		this.permissionLevel = permission_levels.editor;
	}
	else if (this.isSeniorDesign) {
		this.permissionLevel = permission_levels.senior;
	}
	else if (this.isSeniorLiterature) {
		this.permissionLevel = permission_levels.senior;
	}
	else if (this.isSeniorArt) {
		this.permissionLevel = permission_levels.senior;
	}
	else if (this.isCopy) {
		this.permissionLevel = permission_levels.copy;
	}
	else if (this.isDesign) {
		this.permissionLevel = permission_levels.design;
	}
	else if (this.isStaff) {
		this.permissionLevel = permission_levels.staff;
	}
	else {
		this.permissionLevel = 0;
	}

    next();
});

/**
 * The permissionLevel can be configured independently of role assignments.
 * This allows granting of permissions without changing a user's role-specific duties.
 *
 * For instance, the senior editors should probably have access to the the copyediting interface.
 * Because their permissionLevel is higher than that required to access copy information (8 > 5),
 * they can indeed access that information, but meanwhile still retain any permission associated with the
 * senior role.
 *
 * In general, when performing authentication (template rendering, request middleware), two conditions are
 * checked:
 * - Is the user of the role that this tool is specific for?
 * - Does the user have a permissionLevel higher than that of the role that this tool is specific for?
 *
 * If either of those conditionals are true, grant access to the interface.
 *
 */

// Virtual methods
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isStaff;
});

User.schema.virtual('canSeeAuthor').get(function () {
	return this.isEditor || this.permissionLevel > permission_levels.editor;
});

User.schema.virtual('canSeeEmail').get(function () {
	return this.isSeniorDesign || this.isSeniorLiterature || this.isSeniorArt || this.permissionLevel > permission_levels.senior;
});


User.defaultColumns = 'name, email, isAdmin';
User.register();
