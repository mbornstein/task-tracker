import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import { Tracker } from "./Tracker";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

function findGetParameter(parameterName: string): string {
    let result: string | undefined = undefined;
    window.location.search
        .substr(1)
        .split("&")
        .forEach((item: string) => {
            const tmp: string[] = item.split("=");
            if (tmp[0] === parameterName) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
}

const dbId = findGetParameter("dbid")

if (!dbId) {
    window.alert('Please add the "dbid" query paramenter to the URL.')
    throw new Error('dbid query paramenter not set in URL')
}

const baseUrl = findGetParameter("baseurl") || "http://localhost:4185"

const client = new ApolloClient({
    uri: `${baseUrl}/dbs/${dbId}/graphql`,
    cache: new InMemoryCache(),
});

const body = document.getElementsByTagName("body")[0];
const rootDiv = document.createElement("div");
rootDiv.setAttribute("id", "root");
body.appendChild(rootDiv);
const root = ReactDOM.createRoot(rootDiv);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Tracker />
        </ApolloProvider>
    </React.StrictMode>,
);

reportWebVitals();
