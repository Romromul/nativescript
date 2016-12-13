﻿import { LayoutBase as LayoutBaseDefinition } from "ui/layouts/layout-base";
import { View, CustomLayoutView, Property, AddChildFromBuilder, getViewById } from "ui/core/view";

export * from "ui/core/view";

export class LayoutBaseCommon extends CustomLayoutView implements LayoutBaseDefinition, AddChildFromBuilder {

    private _subViews = new Array<View>();

    public _addChildFromBuilder(name: string, value: any) {
        if (value instanceof View) {
            this.addChild(value);
        }
    }

    getChildrenCount(): number {
        return this._subViews.length;
    }

    // overrides the base property.
    get _childrenCount(): number {
        return this._subViews.length;
    }

    getChildAt(index: number): View {
        return this._subViews[index];
    }

    getChildIndex(child: View): number {
        return this._subViews.indexOf(child);
    }

    public getChildById(id: string) {
        return getViewById(this, id);
    }

    public _registerLayoutChild(child: View) {
        //Overridden
    }

    public _unregisterLayoutChild(child: View) {
        //Overridden
    }

    public addChild(child: View): void {
        // TODO: Do we need this method since we have the core logic in the View implementation?
        this._subViews.push(child);
        this._addView(child);
        this._registerLayoutChild(child);
    }

    public insertChild(child: View, atIndex: number): void {
        this._subViews.splice(atIndex, 0, child);
        this._addView(child, atIndex);
        this._registerLayoutChild(child);
    }

    public removeChild(child: View): void {
        this._removeView(child);

        // TODO: consider caching the index on the child.
        var index = this._subViews.indexOf(child);
        this._subViews.splice(index, 1);
        this._unregisterLayoutChild(child);
    }

    public removeChildren(): void {
        while (this.getChildrenCount() !== 0) {
            this.removeChild(this._subViews[this.getChildrenCount() - 1]);
        }
    }

    get padding(): string {
        return this.style.padding;
    }
    set padding(value: string) {
        this.style.padding = value;
    }

    public clipToBounds: boolean;

    public _childIndexToNativeChildIndex(index?: number): number {
        if (index === undefined) {
            return undefined;
        }
        let result = 0;
        for (let i = 0; i < index && i < this._subViews.length; i++) {
            result += this._subViews[i]._getNativeViewsCount();
        }
        return result;
    }

    public _eachChildView(callback: (child: View) => boolean): void {
        for (let i = 0, length = this._subViews.length; i < length; i++) {
            const retVal = callback(this._subViews[i]);
            if (retVal === false) {
                break;
            }
        }
    }

    public eachLayoutChild(callback: (child: View, isLast: boolean) => void): void {
        var lastChild: View = null;
        
        this._eachChildView((cv) => {
            cv._eachLayoutView((lv) => {
                if (lastChild && !lastChild.isCollapsed) {
                    callback(lastChild, false);
                }

                lastChild = lv;
            });

            return true;
        });
        
        if (lastChild && !lastChild.isCollapsed) {
            callback(lastChild, true);
        }

    }
}

export const clipToBoundsProperty = new Property<LayoutBaseCommon, boolean>({name: "clipToBounds", defaultValue: true});
clipToBoundsProperty.register(LayoutBaseCommon);