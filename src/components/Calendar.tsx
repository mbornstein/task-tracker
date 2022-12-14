import css from "../Tracker.module.scss";
import cx from "classnames";
import * as React from "react";
import { addSecondsToDate, getOffsetSeconds, truncateToCell, truncDay } from "../utils/datetime";
import { Activity } from "../types";
import { stringToColor } from "../utils/color";
import { Icon } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";

interface ICalendarProps {
    numDays: number;
    firstDay: Date;
    activities: Activity[];
    onSelectActivity: (activity: Activity) => void;
    onSelectDate: (date: Date) => void;
}
export const Calendar: React.FC<ICalendarProps> = ({
    numDays,
    activities,
    firstDay,
    onSelectActivity,
    onSelectDate,
}) => {
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    const halves = ["00", "30"];
    const tens = ["00", "10", "20"];
    const timeToActivityMap: Map<string, Activity> = new Map(
        activities.map(e => [truncateToCell(e.start).toISOString(), e]),
    );
    const handleSelectActivity = React.useCallback(
        (activity: Activity) => () => onSelectActivity(activity),
        [onSelectActivity],
    );
    const handleSelectDate = React.useCallback((date: Date) => () => onSelectDate(date), [onSelectDate]);
    return (
        <div className={cx(css.column, css.grow, css.scroll, css.margin)}>
            <table className={css.table}>
                <tbody>
                    {hours.map(hour =>
                        halves.map((half, iHalf) =>
                            tens.map((ten, iTen) => (
                                <tr className={css.grow} key={`${hour}-${half}-${ten}`}>
                                    <td className={css.fixedwidth}>{iHalf === 0 && iTen === 0 ? hour : undefined}</td>
                                    <td className={css.fixedwidth}>{iTen === 0 ? half : undefined}</td>
                                    {[...Array(numDays).keys()].map(d => {
                                        const truncatedCellDateTime = addSecondsToDate(
                                            truncDay(firstDay),
                                            getOffsetSeconds(
                                                d - numDays + 1,
                                                parseInt(hour),
                                                parseInt(ten) + parseInt(half),
                                            ),
                                        );
                                        const activity = timeToActivityMap.get(truncatedCellDateTime.toISOString());
                                        const className = cx(
                                            css.cell,
                                            truncatedCellDateTime.getTime() === truncateToCell(new Date()).getTime()
                                                ? css.today
                                                : undefined,
                                            parseInt(hour) < 9 || parseInt(hour) > 18 ? css.outofbusiness : undefined,
                                        );
                                        return (
                                            <td
                                                key={truncatedCellDateTime.toISOString()}
                                                className={className}
                                                onClick={
                                                    activity
                                                        ? handleSelectActivity(activity)
                                                        : handleSelectDate(truncatedCellDateTime)
                                                }
                                            >
                                                {activity && (
                                                    <div className={css.cellContent}>
                                                        <div className={css.cellText}>{activity.title}</div>
                                                        <div className={css.row}>
                                                            {renderTag(activity.project)}
                                                            {renderTag(activity.type)}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )),
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
};

const renderTag = (tag?: string) => (
    <Tooltip2 content={tag}>
        <Icon icon="tag" color={tag ? stringToColor(tag) : "#00000000"} />
    </Tooltip2>
);
