import fetch from "node-fetch";
import qs from "node:querystring";
import dotenv from "dotenv";
import fs from "node:fs/promises";

import getID from "./getUserId.js";

dotenv.config();

const username = process.argv[2];

if (!username) {
	console.error("miss username");
	process.exit(1);
}

const userID = await getID(username);

if (process.argv.includes("--getIdOnly")) {
	console.log(userID);
	process.exit(0);
}

const option = {
	method: "GET",
	headers: {
		Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
	},
};

const url = `https://api.twitter.com/2/users/${userID}/tweets`;

function mergeObject(from, to) {
	for (let i in from) {
		if (i in to) {
			to[i] = to[i].concat(from[i]);
		} else {
			to[i] = from[i];
		}
	}
}

let posts = [];
let includes = {};
let errors = [];

// getPosts ${limit} times, each execution get about 100 tweets
// limit = -1 -> execute unlimited times
async function getPosts(limit, next_token) {
	if (limit == 0) {
		return;
	}
	limit--;
	let query = {
		max_results: 100, // max is 100
		expansions: [
			"referenced_tweets.id",
			"referenced_tweets.id.author_id",
			"in_reply_to_user_id",
			"attachments.media_keys",
			"geo.place_id",
			"attachments.poll_ids",
		].join(","),
		"media.fields": [
			"duration_ms",
			"height",
			"media_key",
			"preview_image_url",
			"type",
			"url",
			"width",
			"public_metrics",
			"organic_metrics",
			"promoted_metrics",
			"alt_text",
			"variants",
		].join(","),
		"poll.fields": [
			"contained_within",
			"country",
			"country_code",
			"full_name",
			"geo",
			"id",
			"name",
			"place_type",
		].join(","),
		"poll.fields": [
			"duration_minutes",
			"end_datetime",
			"id",
			"options",
			"voting_status",
		].join(","),
	};
	if (next_token) {
		query.pagination_token = next_token;
	}
	let querystring = qs.stringify(query);
	return fetch(`${url}?${querystring}`, option)
		.then(res => res.json())
		.then(data => {
			if (data.errors) {
				errors = errors.concat(data.errors);
			}
			posts = posts.concat(data.data);
			mergeObject(data.includes, includes);
			console.log(
				`get ${data.meta.result_count} ${data.meta.oldest_id}-${data.meta.newest_id}`
			);
			if (data.meta.next_token) return getPosts(limit, data.meta.next_token);
		})
		.catch(err => console.error("token:", next_token, "err:", err));
}

console.time("downloading tweets");
await getPosts(-1);
console.timeEnd("downloading tweets");

console.log(`get ${posts.length} tweets with ${errors.length} errors`);

// write to file

// (name, item, i, arr) =>
//     name
//         ? name
//         : item == "-o" || item == "--out"
//             ? arr[i + 1]
//             : ""
const file = process.argv.reduce(
	(name, item, i, arr) =>
		name ? name : item == "-o" || item == "--out" ? arr[i + 1] : "",
	""
);
if (process.argv.includes("--pretty")) {
	fs.writeFile(file, JSON.stringify({ posts, includes, errors }, null, 2))
		.then(() => console.log(`write to ${file}`))
		.catch(err =>
			console.error(`error occurs when writing data to ${file}`, err)
		);
} else {
	fs.writeFile(file, JSON.stringify({ posts, includes, errors }))
		.then(() => console.log(`write to ${file}`))
		.catch(err =>
			console.error(`error occurs when writing data to ${file}`, err)
		);
}
