import {
    FlexDirection, FlexWrap, JustifyContent, AlignItems, AlignContent,
    FlexboxLayoutBase, View, layout,
    orderProperty, Order,
    flexGrowProperty, FlexGrow, 
    flexShrinkProperty, FlexShrink, 
    flexWrapBeforeProperty, FlexWrapBefore,
    alignSelfProperty, AlignSelf,
    flexDirectionProperty, flexWrapProperty, justifyContentProperty, alignItemsProperty, alignContentProperty
} from "./flexbox-layout-common";

export * from "./flexbox-layout-common";

const orderDescriptor: TypedPropertyDescriptor<Order> = {
    enumerable: true,
    configurable: true,
    writable: true,
    get: () => orderProperty.defaultValue,
    set: function (this: View, value: Order) {
        setLayoutParamsProperty(this, (lp) => lp.order = value);
    }
}

const flexGrowDescriptor: TypedPropertyDescriptor<FlexGrow> = {
    enumerable: true,
    configurable: true,
    writable: true,
    get: () => flexGrowProperty.defaultValue,
    set: function (this: View, value: FlexGrow) {
        setLayoutParamsProperty(this, (lp) => lp.flexGrow = value);
    }
}

const flexShrinkDescriptor: TypedPropertyDescriptor<FlexShrink> = {
    enumerable: true,
    configurable: true,
    writable: true,
    get: () => flexShrinkProperty.defaultValue,
    set: function (this: View, value: FlexShrink) {
        setLayoutParamsProperty(this, (lp) => lp.flexShrink = value);
    }
}

const flexWrapBeforeDescriptor: TypedPropertyDescriptor<FlexWrapBefore> = {
    enumerable: true,
    configurable: true,
    writable: true,
    get: () => false,
    set: function (this: View, value: FlexWrapBefore) {
        setLayoutParamsProperty(this, (lp) => lp.wrapBefore = value);
    }
}

const alignSelfDescriptor: TypedPropertyDescriptor<AlignSelf> = {
    enumerable: true,
    configurable: true,
    writable: true,
    get: () => AlignSelf.AUTO,
    set: function (this: View, value: AlignSelf) {
        setLayoutParamsProperty(this, (lp) => lp.alignSelf = alignSelfMap[value]);
    }
}

// register native properties on View type.
Object.defineProperties(View, {
    [orderProperty.native]: orderDescriptor,
    [flexGrowProperty.native]: flexGrowDescriptor,
    [flexShrinkProperty.native]: flexShrinkDescriptor,
    [flexWrapBeforeProperty.native]: flexWrapBeforeDescriptor,
    [alignSelfProperty.native]: alignSelfDescriptor
});

function setLayoutParamsProperty(view: View, setter: (lp: org.nativescript.widgets.FlexboxLayout.LayoutParams) => void) {
    const nativeView: android.view.View = view._nativeView;
    if (nativeView) {
        let lp = nativeView.getLayoutParams() || new org.nativescript.widgets.FlexboxLayout.LayoutParams();
        if (lp instanceof org.nativescript.widgets.FlexboxLayout.LayoutParams) {
            setter(lp);
            nativeView.setLayoutParams(lp);
        }
    }
}

import FlexboxLayoutWidget = org.nativescript.widgets.FlexboxLayout;

const flexDirectionMap = {
    [FlexDirection.ROW]: FlexboxLayoutWidget.FLEX_DIRECTION_ROW,
    [FlexDirection.ROW_REVERSE]: FlexboxLayoutWidget.FLEX_DIRECTION_ROW_REVERSE,
    [FlexDirection.COLUMN]: FlexboxLayoutWidget.FLEX_DIRECTION_COLUMN,
    [FlexDirection.COLUMN_REVERSE]: FlexboxLayoutWidget.FLEX_DIRECTION_COLUMN_REVERSE
}

const flexWrapMap = {
    [FlexWrap.NOWRAP]: FlexboxLayoutWidget.FLEX_WRAP_NOWRAP,
    [FlexWrap.WRAP]: FlexboxLayoutWidget.FLEX_WRAP_WRAP,
    [FlexWrap.WRAP_REVERSE]: FlexboxLayoutWidget.FLEX_WRAP_WRAP_REVERSE
}

const justifyContentMap = {
    [JustifyContent.CENTER]: FlexboxLayoutWidget.JUSTIFY_CONTENT_CENTER,
    [JustifyContent.FLEX_END]: FlexboxLayoutWidget.JUSTIFY_CONTENT_FLEX_END,
    [JustifyContent.FLEX_START]: FlexboxLayoutWidget.JUSTIFY_CONTENT_FLEX_START,
    [JustifyContent.SPACE_AROUND]: FlexboxLayoutWidget.JUSTIFY_CONTENT_SPACE_AROUND,
    [JustifyContent.SPACE_BETWEEN]: FlexboxLayoutWidget.JUSTIFY_CONTENT_SPACE_BETWEEN
}

const alignItemsMap = {
    [AlignItems.BASELINE]: FlexboxLayoutWidget.ALIGN_ITEMS_BASELINE,
    [AlignItems.CENTER]: FlexboxLayoutWidget.ALIGN_ITEMS_CENTER,
    [AlignItems.FLEX_END]: FlexboxLayoutWidget.ALIGN_ITEMS_FLEX_END,
    [AlignItems.FLEX_START]: FlexboxLayoutWidget.ALIGN_ITEMS_FLEX_START,
    [AlignItems.STRETCH]: FlexboxLayoutWidget.ALIGN_ITEMS_STRETCH
}

const alignContentMap = {
    [AlignContent.CENTER]: FlexboxLayoutWidget.ALIGN_CONTENT_CENTER,
    [AlignContent.FLEX_END]: FlexboxLayoutWidget.ALIGN_CONTENT_FLEX_END,
    [AlignContent.FLEX_START]: FlexboxLayoutWidget.ALIGN_CONTENT_FLEX_START,
    [AlignContent.SPACE_AROUND]: FlexboxLayoutWidget.ALIGN_CONTENT_SPACE_AROUND,
    [AlignContent.SPACE_BETWEEN]: FlexboxLayoutWidget.ALIGN_CONTENT_SPACE_BETWEEN,
    [AlignContent.STRETCH]: FlexboxLayoutWidget.ALIGN_CONTENT_STRETCH
}

const alignSelfMap = {
    [AlignSelf.AUTO]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_AUTO,
    [AlignSelf.FLEX_START]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_FLEX_START,
    [AlignSelf.FLEX_END]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_FLEX_END,
    [AlignSelf.CENTER]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_CENTER,
    [AlignSelf.BASELINE]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_BASELINE,
    [AlignSelf.STRETCH]: FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_STRETCH
}

export class FlexboxLayout extends FlexboxLayoutBase {
    private _layout: FlexboxLayoutWidget;

    constructor() {
        super();
    }

    get android(): FlexboxLayoutWidget { return this._layout; }
    get _nativeView(): FlexboxLayoutWidget { return this._layout; }

    public _createUI() {
        this._layout = new org.nativescript.widgets.FlexboxLayout(this._context);
    }

    get [flexDirectionProperty.native](): FlexDirection {
        return flexDirectionProperty.defaultValue;
    }
    set [flexDirectionProperty.native](flexDirection: FlexDirection) {
        this.android.setFlexDirection(flexDirectionMap[flexDirection]);
    }

    get [flexWrapProperty.native](): FlexWrap {
        return flexWrapProperty.defaultValue;
    }
    set [flexWrapProperty.native](flexWrap: FlexWrap) {
        this.android.setFlexWrap(flexWrapMap[flexWrap]);
    }

    get [justifyContentProperty.native](): JustifyContent {
        return justifyContentProperty.defaultValue;
    }
    set [justifyContentProperty.native](justifyContent: JustifyContent) {
        this.android.setJustifyContent(justifyContentMap[justifyContent]);
    }

    get [alignItemsProperty.native](): AlignItems{
        return alignItemsProperty.defaultValue;
    }
    set [alignItemsProperty.native](alignItems: AlignItems) {
        this.android.setAlignItems(alignItemsMap[alignItems]);
    }

    get [alignContentProperty.native](): AlignContent {
        return alignContentProperty.defaultValue;
    }
    set [alignContentProperty.native](alignContent: AlignContent) {
        this.android.setAlignContent(alignContentMap[alignContent]);
    }
}

export function _setAndroidLayoutParams(lp: org.nativescript.widgets.FlexboxLayout.LayoutParams, view: View) {
    lp.order = FlexboxLayout.getOrder(view);
    lp.flexGrow = FlexboxLayout.getFlexGrow(view);
    lp.flexShrink = FlexboxLayout.getFlexShrink(view);
    lp.alignSelf = alignSelfMap[FlexboxLayout.getAlignSelf(view)];
    lp.wrapBefore = FlexboxLayout.getFlexWrapBefore(view);
    const style = view.style;

    lp.minWidth = layout.toDevicePixels(style.effectiveMinWidth);
    lp.minHeight = layout.toDevicePixels(style.effectiveMinHeight);
}