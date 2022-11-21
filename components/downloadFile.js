export default function DownloadFile({ data, filename }) {
	return (
		<a
			href={`data:application/json;charset=utf-8,${encodeURIComponent(
				JSON.stringify(data)
			)}`}
			download={filename}
		>
			Download
		</a>
	);
}
