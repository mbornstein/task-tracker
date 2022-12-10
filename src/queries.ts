import { gql } from "@apollo/client";

export const getActivities = gql`
    query {
        activity {
            title
            comment
            start
            project
            type
            link
        }
        types {
            type
        }
        projects {
            project
        }
    }
`;

export const insertActivities = gql`
    mutation InsertActivity($objects: [activity_insert_input!]!) {
        insert_activity(objects: $objects) {
            affected_rows
        }
    }
`;
