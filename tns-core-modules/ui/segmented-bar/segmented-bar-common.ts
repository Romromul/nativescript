﻿import { SegmentedBar as SegmentedBarDefinition, SegmentedBarItem as SegmentedBarItemDefinition, SelectedIndexChangedEventData } from "ui/segmented-bar";
import {
    ViewBase, View, AddChildFromBuilder, AddArrayFromBuilder,
    Property, CoercibleProperty, CssProperty, EventData, Color, Style
} from "ui/core/view";

export * from "ui/core/view";

export module knownCollections {
    export var items = "items";
}

export abstract class SegmentedBarItemBase extends ViewBase implements SegmentedBarItemDefinition {
    private _title: string = "";
    public _parent: SegmentedBarBase;

    get title(): string {
        return this._title;
    }
    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this._update();
        }
    }

    public abstract _update();
}

export abstract class SegmentedBarBase extends View implements SegmentedBarDefinition, AddChildFromBuilder, AddArrayFromBuilder {
    public static selectedIndexChangedEvent = "selectedIndexChanged";

    public selectedIndex: number;
    public selectedBackgroundColor: Color;
    public items: Array<SegmentedBarItemDefinition>;

    public _addArrayFromBuilder(name: string, value: Array<any>): void {
        if (name === "items") {
            this.items = value;
        }
    }

    public _addChildFromBuilder(name: string, value: any): void {
        if (name === "SegmentedBarItem") {
            if (!this.items) {
                this.items = new Array<SegmentedBarItemBase>();
            }
            this.items.push(<SegmentedBarItemBase>value);
        }
    }

    public onItemsChanged(oldItems: SegmentedBarItemDefinition[], newItems: SegmentedBarItemDefinition[]): void {
        if (oldItems) {
            for (let i = 0, count = oldItems.length; i < count; i++) {
                this._removeView(oldItems[i]);
            }
        }

        if (newItems) {
            for (let i = 0, count = newItems.length; i < count; i++) {
                this._addView(newItems[i]);
            }
        }
    }

    // TODO: Make _addView to keep its children so this method is not needed!
    public _eachChildView(callback: (child: ViewBase) => boolean): void {
        let items = this.items;
        if (items) {
            items.forEach((item, i) => {
            callback(item);
        });
    }
}

/**
 * Gets or sets the selected index dependency property of the SegmentedBar.
 */
export const selectedIndexProperty = new CoercibleProperty<SegmentedBarBase, number>({
    name: "selectedIndex", defaultValue: -1, valueConverter: (v) => parseInt(v), valueChanged: (target, oldValue, newValue) => {
        target.notify(<SelectedIndexChangedEventData>{ eventName: SegmentedBarBase.selectedIndexChangedEvent, object: target, oldIndex: oldValue, newIndex: newValue });
    },
    coerceValue: (target, value) => {
        let items = target.items;
        if (items) {
            let max = items.length - 1;
            if (value > max) {
                value = max;
            }
        } else {
            value = -1;
        }

        return value;
    }
});
selectedIndexProperty.register(SegmentedBarBase);

/**
 * Gets or sets the selected background color property of the SegmentedBar.
 */
export const selectedBackgroundColorProperty = new CssProperty<Style, Color>({ name: "selectedBackgroundColor", cssName: "selected-background-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) })
selectedBackgroundColorProperty.register(Style);

/**
 * Gets or sets the items dependency property of the SegmentedBar.
 */
export const itemsProperty = new Property<SegmentedBarBase, SegmentedBarItemDefinition[]>({
    name: "items", valueChanged: (target, oldValue, newValue) => {
        target.onItemsChanged(oldValue, newValue);
        selectedIndexProperty.coerce(target);
    }
});
itemsProperty.register(SegmentedBarBase);
