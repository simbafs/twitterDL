import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
// import styles from "../styles/Home.module.css";

function DownloadLink({ username }){
	// const { data, error }
}

export default function Home() {
	const [username, setUsername] = useState("");
	const changeHandler = setValue => e => setValue(e.target.value);

	return (
		<main>
			<input
				type="text"
				placeholder="username"
				value={username}
				onChange={changeHandler(setUsername)}
			/>
			<button type="button">Download</button>
			
		</main>
	);
}
