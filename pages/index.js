// import Head from "next/head";
// import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
// import styles from "../styles/Home.module.css";

import Error from "../components/error";
import Loading from "../components/loading";
import DownloadFile from "../components/downloadFile";

function Download({ user, userError, tweets, tweetError }) {
	if (userError) return <Error err={userError} />;
	if (!user) return <Loading />;

	if (tweetError) return <Error err={tweetError} />;
	if (!tweets) return <Loading />;

	return <DownloadFile data={tweets} filename="tweets.json" />;
}

export default function Home() {
	const [username, setUsername] = useState("");
	const [times, setTimes] = useState(-1);
	const [isClick, setClick] = useState(false);

	const { data: user, error: userError } = useSWR(
		isClick ? `/api/userid?username=${username}` : null,
		url => fetch(url).then(res => res.json())
	);
	const { data: tweets, error: tweetError } = useSWR(
		isClick && user ? `/api/tweets?userid=${user.id}&times=${times}` : null,
		url => fetch(url).then(res => res.json())
	);

	const changeHandler = setValue => e => setValue(e.target.value);

	return (
		<main>
			<input
				type="text"
				placeholder="username"
				value={username}
				onChange={changeHandler(setUsername)}
			/>
			<input type="number" placeholder="-1 for unlimited" value={times} onChange={changeHandler(setTimes)} />

			{isClick ? (
				<Download
					user={user}
					userError={userError}
					tweets={tweets}
					tweetError={tweetError}
				/>
			) : (
				<button type="button" onClick={() => setClick(true)}>
					{" "}
					Download{" "}
				</button>
			)}

			<button type="button" onClick={() => setClick(false)}>
				Clear
			</button>
		</main>
	);
}
