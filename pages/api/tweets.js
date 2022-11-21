import getPosts from "../../util/getTweets.js";
import NodeCache from "node-cache";

const tweetCache = new NodeCache({
	stdTTL: 5 * 60,
	useClones: 2 * 60,
	useClones: false,
});

export default function handler(req, res) {
	if (req.method !== "GET") {
		return;
	}

	let missed = ["userid"].filter(i => !req.query[i]);
	if (missed.length > 0) {
		console.log(`GET /api/tweets 400 miss ${missed.join(",")}`);
		return res.status(400).json({
			error: `miss ${missed.join(",")}`,
		});
	}

	const { userid, times } = req.query;

	if (times !== -1 && tweetCache.has(`${userid}${times}`)) {
		let flag = true;
		let data;
		try {
			data = tweetCache.take(`${userid}${times}`);
		} catch (err) {
			flag = false;
			console.error("error", { userid, times }, err);
		}
		if (flag) {
			console.log(`GET /api/tweets 200 from cache ${userid} ${tiems}`);
			return res.status(200).json(data);
		}
	}

	getPosts(userid, times || -1, process.env.BEARER_TOKEN)
		.then(data => {
			tweetCache.set(`${userid}${times}`, data);
			return data;
		})
		.then(data => {
			console.log(`GET /api/tweets 200 from twitter api ${userid} ${tiems}`);
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(`GET /api/tweets 400 error when do fetch ${userid} ${times}`);
			res.status(400).json(err);
		});
}
