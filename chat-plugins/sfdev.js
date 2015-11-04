var fs = require('fs');

function loadVips() {
	try {
		Users.vips = JSON.parse(fs.readFileSync('config/vips.json', 'utf8'));
	} catch (e) {
		Users.vips = {};
	}
}
if (!Users.vips) loadVips();

function saveVips() {
	fs.writeFileSync('config/vips.json', JSON.stringify(Users.vips));
}

exports.commands = {
	givesfdev: function (target, room, user) {
		if (!this.can('givevip')) return false;
		if (!target) return this.sendReply("Usage: /givesfdev [user]");
		if (Users.vips[toId(target)]) return this.sendReply(target + " already has SF DEV.");
		var targetUser = Users(target);

		if (!targetUser) return this.sendReply("User \"" + target + "\" not found.");
		if (!targetUser.connected) return this.sendReply(targetUser.name + " is not online.");
		if (!targetUser.registered) return this.sendReply(targetUser.name + " is not registered.");

		Users.vips[targetUser.userid] = 1;
		targetUser.popup("You have received Shadowfire Developer status from " + user.name);
		this.privateModCommand("(" + user.name + " has given Shadowfire DEV status to " + targetUser.name + ")");
		saveVips();
	},

	takesfdev: function (target, room, user) {
		if (!this.can('givevip')) return false;
		if (!target) return this.sendReply("Usage: /takesfdev [user]");
		if (!Users.vips[toId(target)]) return this.sendReply("User \"" + target + "\" is not a Shadowfire DEV.");

		delete Users.vips[toId(target)];
		saveVips();
		this.privateModCommand("(" + user.name + " has removed Shadowfire DEV status from " + target + ")");
	},
};
