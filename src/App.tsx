import { useEffect, useState } from "react";
import logo from "./logo.svg";
import Canvas from "./components/Canvas";

const App = () => {
	const [started, setStarted] = useState(false);

	return (
		<>
			<div className="w-screen h-screen"></div>
			{!started ? (
				<div className="w-full h-full flex items-center justify-center">
					{" "}
					<button onClick={() => setStarted(true)}>Start</button>
				</div>
			) : (
				<Canvas />
			)}
		</>
	);
};

export default App;
