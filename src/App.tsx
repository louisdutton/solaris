import { useEffect, useState } from "react";
import logo from "./logo.svg";
import Canvas from "./components/Canvas";
import { FaPlay } from "react-icons/fa";

const App = () => {
	const [started, setStarted] = useState(false);

	return (
		<>
			{!started ? (
				<div className="w-screen h-screen flex items-center justify-center">
					<button
						className="p-6 opacity-50 hover:opacity-100 transition-opacity duration-200"
						onClick={() => setStarted(true)}>
						<FaPlay size={50} />
					</button>
				</div>
			) : (
				<Canvas />
			)}
		</>
	);
};

export default App;
