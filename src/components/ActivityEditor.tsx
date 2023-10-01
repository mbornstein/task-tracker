import { Button, InputGroup } from "@blueprintjs/core"
import { CategorySelect } from "./CategorySelect"
import * as React from "react"
import { Activity } from "../types"
import cx from "classnames"
import css from "../Tracker.module.scss"

interface IActivityEditorProps {
    activity: Activity
    types: string[]
    projects: string[]
    onChangeActivity: (activity: Activity) => void
}
export const ActivityEditor: React.FC<IActivityEditorProps> = ({
    activity,
    onChangeActivity,
    projects,
    types,
}) => {
    const onChangeValueFor = React.useCallback(
        <T, Field extends keyof Activity>(
                field: Field,
                extract: (value: T) => Activity[Field],
            ) =>
            (event: T) =>
                onChangeActivity({ ...activity, [field]: extract(event) }),
        [activity, onChangeActivity],
    )
    return (
        <div className={cx(css.margin, css.gap, css.row, css.wrap)}>
            <InputGroup
                className={css.grow}
                placeholder="Title"
                value={activity.title}
                onChange={onChangeValueFor(
                    "title",
                    event => event.target.value,
                )}
            />
            <InputGroup
                className={css.grow}
                placeholder="Comment"
                value={activity.comment || ""}
                onChange={onChangeValueFor(
                    "comment",
                    event => event.target.value,
                )}
            />
            <div className={css.grow}>
                <CategorySelect
                    onChangeValue={onChangeValueFor("project", x => x)}
                    value={activity.project}
                    items={projects}
                />
            </div>
            <div className={css.grow}>
                <CategorySelect
                    onChangeValue={onChangeValueFor("type", x => x)}
                    value={activity.type}
                    items={types}
                />
            </div>
            <InputGroup
                className={css.grow}
                placeholder="Link"
                value={activity.link || ""}
                onChange={onChangeValueFor("link", event => event.target.value)}
            />
        </div>
    )
}
