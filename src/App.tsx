import { useEffect, useState } from "react";
import logo from "./logo.svg";
import Canvas from "./components/Canvas";
import { FaPlay, FaDice } from "react-icons/fa";

const App = () => {
	const [started, setStarted] = useState(false);

	return (
		<>
			{!started ? (
				<div className="flex items-center justify-center w-screen h-screen">
					<button
						className="p-6 transition-opacity duration-200 opacity-50 hover:opacity-100"
						onClick={() => setStarted(true)}>
						<FaPlay size={50} />
					</button>
				</div>
			) : (
				<>
					<Canvas />
					<header className="fixed flex items-center gap-4 text-2xl top-4 left-4">
						{/* <h1 className="tracking-wider text-white uppercase transition-opacity opacity-50 cursor-pointer hover:opacity-100">
							Solaris
						</h1>
						<p>0</p>
						<button className="opacity-50 hover:opacity-100">
							<FaDice />
						</button> */}
					</header>
				</>
			)}
		</>
	);
};

export default App;
