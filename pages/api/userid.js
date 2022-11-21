// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getUser from "../../util/getUser.js";

export default function handler(req, res) {
	if (req.method !== "GET") return;
	if (!req.query.username) {
		return res.status(400).json({
			error: "miss usrename",
		});
	}

	getUser(req.query.username, process.env.BEARER_TOKEN)
		.then(data => res.status(200).json(data))
		.catch(err => res.status(400).json(err));
}
