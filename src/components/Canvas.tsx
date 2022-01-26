import { useEffect } from "react";
import {
	handleStart,
	handleBlur,
	handleFocus,
	handleResize,
} from "../lib/solaris";

interface Props {
	celestialBodyCount: number;
	fundamentalFrequency: number;
}

const Canvas = () => {
	useEffect(() => {
		handleStart();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return <div id="solaris" onBlur={handleBlur} onFocus={handleFocus} />;
};

export default Canvas;
