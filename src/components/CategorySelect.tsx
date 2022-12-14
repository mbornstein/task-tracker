import * as React from "react";
import { identity } from "lodash-es";
import { Suggest2, ItemRendererProps } from "@blueprintjs/select";
import { Icon, MenuItem } from "@blueprintjs/core";
import { stringToColor } from "../utils/color";

interface ICategorySelectProps {
    value?: string;
    items: string[];
    onChangeValue: (value: string) => void;
}
export const CategorySelect: React.FC<ICategorySelectProps> = ({ value, onChangeValue, items }) => {
    return (
        <Suggest2<string>
            selectedItem={value}
            createNewItemFromQuery={identity}
            createNewItemRenderer={handleRenderCreateNewItem}
            fill={true}
            inputValueRenderer={identity}
            itemPredicate={handleItemPredicate}
            itemRenderer={handleRenderItems}
            items={items}
            noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={onChangeValue}
        />
    );
};

function handleRenderItems(item: string, itemProps: ItemRendererProps): JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={itemProps.modifiers.active}
            disabled={itemProps.modifiers.disabled}
            key={item}
            label={item}
            icon={<Icon icon="tag" color={stringToColor(item)} />}
            onClick={itemProps.handleClick}
            onFocus={itemProps.handleFocus}
            roleStructure="listoption"
        />
    );
}

function handleRenderCreateNewItem(query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) {
    return (
        <MenuItem
            icon="add"
            text={query}
            active={active}
            shouldDismissPopover={false}
            onClick={handleClick}
            roleStructure="listoption"
        />
    );
}

function handleItemPredicate(query: string, item: string, index?: number, exactMatch?: boolean): boolean {
    return item.includes(query);
}
