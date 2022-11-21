// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getUser from "../../util/getUser.js";

export default function handler(req, res) {
	if (req.method !== "GET") return;
	if (!req.query.username) {
		console.log(`GET /api/userid 400 miss username`);
		return res.status(400).json({
			error: "miss usrename",
		});
	}

	getUser(req.query.username, process.env.BEARER_TOKEN)
		.then(data => {
			console.log(`GET /api/userid 200 ${username}`);
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(`GET /api/userid 400 error when do fetch ${username}`)
			res.status(400).json(err);
		});
}
