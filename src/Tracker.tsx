import css from "./Tracker.module.scss";
import * as React from "react";
import { ActivityEditor } from "./components/ActivityEditor";
import { Calendar } from "./components/Calendar";
import { Activity } from "./types";
import { getActivities, insertActivities } from "./queries";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import cx from "classnames";
import { Button, NumericInput, Spinner } from "@blueprintjs/core";
import { addSecondsToDate, getOffsetSeconds, truncateToCell } from "./utils/datetime";

interface ITracker {}
export const Tracker: React.FC<ITracker> = ({}) => {
    const defaultActivity: Activity = {
        title: "",
        start: new Date(),
        project: "Taurus",
        type: "dev",
    };
    const [day, setDay] = React.useState(new Date());
    const setDayToday = React.useCallback(() => setDay(new Date()), [setDay]);
    const addDay = React.useCallback(
        (days: number) => () => setDay(addSecondsToDate(day, getOffsetSeconds(days, 0, 0))),
        [day, setDay],
    );

    const [numDays, setNumDays] = React.useState(3);
    const { loading, activities, types, projects } = useLoadedActivities();
    const [insertActivity] = useMutation(insertActivities, {
        refetchQueries: [getActivities],
    });
    const [activity, setActivity] = React.useState(defaultActivity);
    const addActivity = React.useCallback(
        (activity: Activity) => insertActivity({ variables: { objects: [activity] } }),
        [insertActivity],
    );
    const addActivityAtDate = React.useCallback(
        (date: Date) => addActivity({ ...activity, start: truncateToCell(date) }),
        [activity, addActivity],
    );
    const addActivityNow = React.useCallback(
        () => addActivity({ ...activity, start: truncateToCell(new Date()) }),
        [activity, addActivity],
    );
    const addPauseNow = React.useCallback(
        () => addActivity({ title: "Pause", start: truncateToCell(new Date()) }),
        [addActivity],
    );

    if (loading) {
        return <Spinner />;
    }
    return (
        <div className={cx(css.tracker, css.column)}>
            <ActivityEditor activity={activity} onChangeActivity={setActivity} projects={projects} types={types} />
            <div className={cx(css.row, css.actions, css.margin, css.wrap)}>
                <div className={css.shrink}>Specify the activity and select the start below</div>
                <div className={cx(css.row, css.gap)}>
                    <Button minimal={true} outlined={true} intent="primary" onClick={addActivityNow}>
                        Start
                    </Button>
                    <Button minimal={true} outlined={true} intent="none" onClick={addPauseNow}>
                        Pause
                    </Button>
                </div>
                <div className={cx(css.row, css.gap, css.aligncenter, css.shrink)}>
                    <NumericInput style={{ width: "4em" }} value={numDays} onValueChange={setNumDays} min={1} />
                    <div className={css.shrink}>days up to</div>
                    <Button icon="chevron-left" minimal={true} onClick={addDay(-1)} />
                    <Button minimal={true} onClick={setDayToday}>
                        <div className={css.shrink}>{day.toDateString()}</div>
                    </Button>
                    <Button icon="chevron-right" minimal={true} onClick={addDay(1)} />
                </div>
            </div>
            <Calendar
                numDays={numDays}
                firstDay={day}
                activities={activities}
                onSelectActivity={setActivity}
                onSelectDate={addActivityAtDate}
            />
        </div>
    );
};

function useLoadedActivities(): {
    loading: boolean;
    error: ApolloError | undefined;
    activities: Activity[];
    types: string[];
    projects: string[];
} {
    const { loading, error, data } = useQuery(getActivities);
    if (!loading && !error) {
        return {
            loading,
            error,
            activities: data.activity.map(
                (a: {
                    __typename: string;
                    title: string;
                    start: string;
                    comment?: string;
                    project?: string;
                    type?: string;
                    link?: string;
                }) => ({
                    title: a.title,
                    comment: a.comment,
                    start: new Date(a.start),
                    project: a.project,
                    type: a.type,
                    link: a.link,
                }),
            ),
            types: data.types.map((t: { type: string }) => t.type),
            projects: data.projects.map((p: { project: string }) => p.project),
        };
    }
    return {
        loading,
        error,
        activities: [],
        types: [],
        projects: [],
    };
}
