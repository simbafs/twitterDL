import dotenv from "dotenv";
import fs from "node:fs/promises";
import getopt from "node-getopt";

import getUser from "./util/getUser.js";
import getPosts from "./util/getPosts.js";

dotenv.config();

const opt = getopt
	.create([
		["o", "output=arg", "output file", "output.json"],
		["", "pretty", "prettify output file", false],
		["u", "user", "return user information and exit", false],
		["t", "times=arg", "execute how many times, -1 for unlimited", -1],
		["v", "version", "not yet decided"],
	])
	.bindHelp()
	.parseSystem();

const username = opt.argv[0];


if (opt.options.version) {
	console.log(opt.long_options.version.comment);
	process.exit(0);
}

if (!username) {
	console.error("error: miss username");
	opt.showHelp();
	process.exit(1);
}

console.log("geting user id......");
const user = await getUser(username);

if (opt.options.user) {
	console.log(JSON.stringify(user, null, opt.options.pretty ? 2 : null));
	process.exit(0);
}

// main
console.log("start to download data from twitter......");
console.time("downloading times");
const result = await getPosts(
	user.id,
	opt.options.times,
	process.env.BEARER_TOKEN
);
console.timeEnd("downloading times");
console.log(
	`get ${result.posts.length} tweets with ${result.errors.length} errors`
);

// write to file
const file = opt.options.output;

fs.writeFile(
	file,
	JSON.stringify({ ...result, user }, null, opt.options.pretty ? 2 : null)
)
	.then(() => console.log(`write to ${file}`))
	.catch(err =>
		console.error(`error occurs when writing data to ${file}`, err)
	);
