export default function Error({ err }) {
	<button type="button" onClick={() => window.alert(JSON.stringify(err))}>
		error
	</button>;
}
