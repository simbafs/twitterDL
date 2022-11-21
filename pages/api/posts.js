import getPosts from "../../util/getPosts.js";
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
		if (flag) return res.status(200).json(data);
	}

	getPosts(userid, times || -1, process.env.BEARER_TOKEN)
		.then(data => {
			tweetCache.set(`${userid}${times}`, data);
			return data;
		})
		.then(data => res.status(200).json(data))
		.catch(err => res.status(400).json(err));
}
