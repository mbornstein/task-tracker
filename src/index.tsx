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

console.log(findGetParameter("test"));

const client = new ApolloClient({
    uri: `http://localhost:4185/dbs/${findGetParameter("db")}/graphql`,
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Tracker />
        </ApolloProvider>
    </React.StrictMode>,
);

reportWebVitals();
