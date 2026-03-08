import { createBrowserRouter } from "react-router-dom";
import { Step00Basic } from "../features/step00-basic/Step00Basic";
import { Step01AccessorVsCell } from "../features/step01-accessor-vs-cell/Step01AccessorVsCell";
import { Step02Sorting } from "../features/step02-sorting/Step02Sorting";
import { Step03Filtering } from "../features/step03-filtering/Step03Filtering";
import { Step04Pagination } from "../features/step04-pagination/Step04Pagination";
import { Step05ColumnVisibility } from "../features/step05-column-visibility/Step05ColumnVisibility";
import { Step06RowSelection } from "../features/step06-row-selection/Step06RowSelection";
import { Step07Editing } from "../features/step07-editing/Step07Editing";
import { Step08Virtual } from "../features/step08-virtual/Step08Virtual";
import { Step09Grouping } from "../features/step09-grouping/Step09Grouping";
import { Step10Fullscreen } from "../features/step10-fullscreen/Step10Fullscreen";
import { Shell } from "./Shell";
import { TopPage } from "./TopPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Shell />,
		children: [
			{ index: true, element: <TopPage /> },
			{ path: "step/00", element: <Step00Basic /> },
			{ path: "step/01", element: <Step01AccessorVsCell /> },
			{ path: "step/02", element: <Step02Sorting /> },
			{ path: "step/03", element: <Step03Filtering /> },
			{ path: "step/04", element: <Step04Pagination /> },
			{ path: "step/05", element: <Step05ColumnVisibility /> },
			{ path: "step/06", element: <Step06RowSelection /> },
			{ path: "step/07", element: <Step07Editing /> },
			{ path: "step/08", element: <Step08Virtual /> },
			{ path: "step/09", element: <Step09Grouping /> },
			{ path: "step/10", element: <Step10Fullscreen /> },
		],
	},
]);
