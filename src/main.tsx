import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { localStorageColorSchemeManager, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

const colorSchemeManager = localStorageColorSchemeManager({
	key: "tanstack-table-lab-color-scheme",
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<MantineProvider
			colorSchemeManager={colorSchemeManager}
			defaultColorScheme="dark"
		>
			<Notifications />
			<App />
		</MantineProvider>
	</StrictMode>,
);
