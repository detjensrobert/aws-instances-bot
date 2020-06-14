module.exports = {

	prefix: "!aws ",

	loglevel: 4,

	colors: {
		success: "#4CAF50",
		error: "#f44336",
		info: "#2196F3",
		warn: "#FFC107",
	},
};

module.exports.instances = require('../instance_ids.json');
