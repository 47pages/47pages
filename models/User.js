var keystone = require('keystone'),
	Types = keystone.Field.Types,
	auth = require('../node_modules/keystone/routes/api/auth')

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

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
	isJuniorLiterature: {
		type: Boolean,
		label: 'Junior Literature'
	},
	isJuniorArt: {
		type: Boolean,
		label: 'Junior Art'
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
		this.permissionLevel = auth.permissionLevels.admin;
	}
	else if (this.isEditor) {
		this.permissionLevel = auth.permissionLevels.editor;
	}
	else if (this.isSeniorDesign || this.isSeniorLiterature || this.isSeniorArt) {
		this.permissionLevel = auth.permissionLevels.senior;
	}
	else if (this.isJuniorLiterature || this.isJuniorArt) {
		this.permissionLevel = auth.permissionLevels.junior;
	}
	else if (this.isCopy) {
		this.permissionLevel = auth.permissionLevels.copy;
	}
	else if (this.isDesign) {
		this.permissionLevel = auth.permissionLevels.design;
	}
	else if (this.isStaff) {
		this.permissionLevel = auth.permissionLevels.staff;
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
 * See keystone-47pages/routes/api/auth for more information.
 *
 */

// Virtual methods
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isStaff;
});

User.defaultColumns = 'name, email, isAdmin';
User.register();
