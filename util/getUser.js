import fetch from "node-fetch";
import qs from "node:querystring";
import dotenv from "dotenv";
dotenv.config();

let query = {
	"user.fields": [
		"created_at",
		"description",
		"entities",
		"id",
		"location",
		"name",
		"pinned_tweet_id",
		"profile_image_url",
		"protected",
		"public_metrics",
		// 'url',
		"username",
		"verified",
		"withheld",
	].join(","),
};

let querystring = qs.stringify(query);
export default function getUserId(username, bearerToken) {
	const url = `https://api.twitter.com/2/users/by/username/${username}`;
	const option = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
		},
	};

	return fetch(`${url}?${querystring}`, option)
		.then(res => res.json())
		.then(res => res.data)
		// .then(res => console.log(JSON.stringify(res, null, 2)))
		.catch(console.error);
}
