const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function start(id) {
	const { stdout, stderr } = await exec(`aws ec2 start-instances --instance-ids ${id}`);
	return JSON.parse(stdout);
}

async function stop(id) {
	const { stdout, stderr } = await exec(`aws ec2 stop-instances --instance-ids ${id}`);
	return JSON.parse(stdout);
}

async function status(id) {
	const { stdout, stderr } = await exec(`aws ec2 describe-instance-status --include-all-instances --instance-ids ${id}`);
	return JSON.parse(stdout);
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.status = status;
