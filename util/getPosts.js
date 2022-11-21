import fetch from "node-fetch";
import qs from "node:querystring";
import mergeObject from "./mergeObject.js";

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

export default async function get(userID, times, bearerToken) {
	const url = `https://api.twitter.com/2/users/${userID}/tweets`;

	const option = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${bearerToken}`,
		},
	};

	let posts = [];
	let includes = {};
	let errors = [];
	let next_token = "";

	// getPosts ${times} times, each round get about 100 tweets
	// times = -1 -> execute unlimited times
	do {
		times--;
		if (next_token) {
			query.pagination_token = next_token;
		}
		let querystring = qs.stringify(query);
		await fetch(`${url}?${querystring}`, option)
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
			})
			.catch(err => console.error("token:", next_token, "err:", err));
	} while (next_token || times != 0);

	return { posts, includes, errors };
}
