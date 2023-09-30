import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import css from "../Tracker.module.scss";
import cx from "classnames";
import * as React from "react";
import { Button, InputGroup } from "@blueprintjs/core";


interface IApolloConfigProvider { }
export const ApolloConfigProvider: React.FC<IApolloConfigProvider> = ({
    children
}) => {
    const [dbId, setDbId] = React.useState<string | undefined>(findGetParameter("dbid"));
    const [baseUrl, setBaseUrl] = React.useState<string | undefined>(findGetParameter("baseurl") || "https://www.airsequel.com/");
    const getMaybeClient = React.useCallback(() => {
        if (dbId == null || baseUrl == null) {
            return undefined;
        }
        return getClient(dbId, baseUrl);
    }, [dbId, baseUrl]);
    const maybeClient = getMaybeClient();
    const [client, setClient] = React.useState(maybeClient);

    return (
        <div className={cx(css.app, css.column, css.aligncenter)}>
            <div className={cx(css.row, css.gap, css.aligncenter)}>
                <span>{baseUrl || "Base URL"}</span>
                <span>{dbId || "DB ID"}</span>
                <Button minimal icon="cog" onClick={() => setClient(undefined)}/>
            </div>
            {client == null ? <div className={cx(css.row, css.gap, css.aligncenter)}>
                <InputGroup
                    placeholder="Base URL"
                    value={baseUrl}
                    onChange={event => setBaseUrl(event.target.value)}
                />
                <InputGroup
                    placeholder="DB ID"
                    value={dbId}
                    onChange={event => setDbId(event.target.value)}
                />
                <Button minimal icon="tick" onClick={() => setClient(getMaybeClient())} />
            </div> :
                <ApolloProvider client={client}>
                    {children}
                </ApolloProvider>
            }
        </div>
    )
}

function getClient(baseUrl: string, dbId: string) {
    return new ApolloClient({
        uri: `${baseUrl}/dbs/${dbId}/graphql`,
        cache: new InMemoryCache(),
    });
}

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
