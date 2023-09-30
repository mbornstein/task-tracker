import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import { Tracker } from "./Tracker";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ApolloConfigProvider } from "./components/ApolloConfigProvider";


const body = document.getElementsByTagName("body")[0];
const rootDiv = document.createElement("div");
rootDiv.setAttribute("id", "root");
body.appendChild(rootDiv);
const root = ReactDOM.createRoot(rootDiv);
root.render(
    <React.StrictMode>
        <ApolloConfigProvider>
            <Tracker />
        </ApolloConfigProvider>
    </React.StrictMode>,
);

reportWebVitals();
