#!/usr/bin/env node
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

dotenv.config();

export default function getUserId(username) {
	const client = new TwitterApi(process.env.BEARER_TOKEN);
	return client.v2
		.userByUsername(username)
		.then(data => data.data.id)
		.catch(err => {
			console.error("error: ", err);
			process.exit(1);
		});
}
