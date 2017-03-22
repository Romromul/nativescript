﻿import {
    DatePickerBase, yearProperty, monthProperty, dayProperty,
    dateProperty, maxDateProperty, minDateProperty, colorProperty, Color
} from "./date-picker-common";

import { ios } from "../../utils/utils";

export * from "./date-picker-common";

export class DatePicker extends DatePickerBase {
    private _changeHandler: NSObject;
    public nativeView: UIDatePicker;

    constructor() {
        super();

        this.nativeView = UIDatePicker.new();
        this.nativeView.datePickerMode = UIDatePickerMode.Date;

        this._changeHandler = UIDatePickerChangeHandlerImpl.initWithOwner(new WeakRef(this));
        this.nativeView.addTargetActionForControlEvents(this._changeHandler, "valueChanged", UIControlEvents.ValueChanged);
    }

    get ios(): UIDatePicker {
        return this.nativeView;
    }

    [yearProperty.getDefault](): number {
        return this.nativeView.date.getFullYear();
    }
    [yearProperty.setNative](value: number) {
        let picker = this.nativeView;
        let comps = ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(NSCalendarUnit.CalendarUnitYear | NSCalendarUnit.CalendarUnitMonth | NSCalendarUnit.CalendarUnitDay, picker.date);
        comps.year = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    }

    [monthProperty.getDefault](): number {
        return this.nativeView.date.getMonth();
    }
    [monthProperty.setNative](value: number) {
        let picker = this.nativeView;
        let comps = ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(NSCalendarUnit.CalendarUnitYear | NSCalendarUnit.CalendarUnitMonth | NSCalendarUnit.CalendarUnitDay, picker.date);
        comps.month = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    }

    [dayProperty.getDefault](): number {
        return this.nativeView.date.getDay();
    }
    [dayProperty.setNative](value: number) {
        let picker = this.nativeView;
        let comps = ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(NSCalendarUnit.CalendarUnitYear | NSCalendarUnit.CalendarUnitMonth | NSCalendarUnit.CalendarUnitDay, picker.date);
        comps.day = value;
        this.date = new Date(comps.year, comps.month - 1, comps.day);
    }

    [dateProperty.getDefault](): Date {
        return this.nativeView.date;
    }
    [dateProperty.setNative](value: Date) {
        let picker = this.nativeView;
        let comps = ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(NSCalendarUnit.CalendarUnitYear | NSCalendarUnit.CalendarUnitMonth | NSCalendarUnit.CalendarUnitDay, picker.date);
        comps.year = value.getFullYear();
        comps.month = value.getMonth() + 1;
        comps.day = value.getDate();
        picker.setDateAnimated(ios.getter(NSCalendar, NSCalendar.currentCalendar).dateFromComponents(comps), false);
    }

    [maxDateProperty.getDefault](): Date {
        return this.nativeView.maximumDate;
    }
    [maxDateProperty.setNative](value: Date) {
        let picker = this.nativeView;
        let nsDate = NSDate.dateWithTimeIntervalSince1970(value.getTime() / 1000);
        picker.maximumDate = <any>nsDate;
    }

    [minDateProperty.getDefault](): Date {
        return this.nativeView.minimumDate;
    }
    [minDateProperty.setNative](value: Date) {
        let picker = this.nativeView;
        let nsDate = NSDate.dateWithTimeIntervalSince1970(value.getTime() / 1000);
        picker.minimumDate = <any>nsDate;
    }

    [colorProperty.getDefault](): UIColor {
        return this.nativeView.valueForKey("textColor");
    }
    [colorProperty.setNative](value: Color | UIColor) {
        let picker = this.nativeView;
        picker.setValueForKey(value instanceof Color ? value.ios : value, "textColor");
    }
}

class UIDatePickerChangeHandlerImpl extends NSObject {
    private _owner: WeakRef<DatePicker>;

    public static initWithOwner(owner: WeakRef<DatePicker>): UIDatePickerChangeHandlerImpl {
        let impl = <UIDatePickerChangeHandlerImpl>UIDatePickerChangeHandlerImpl.new();
        impl._owner = owner;
        return impl;
    }

    public valueChanged(sender: UIDatePicker) {
        let comps = ios.getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(NSCalendarUnit.CalendarUnitYear | NSCalendarUnit.CalendarUnitMonth | NSCalendarUnit.CalendarUnitDay, sender.date);

        let owner = this._owner.get();
        if (!owner) {
            return;
        }

        let dateChanged = false;
        if (comps.year !== owner.year) {
            yearProperty.nativeValueChange(owner, comps.year);
            dateChanged = true;
        }

        if (comps.month !== owner.month) {
            monthProperty.nativeValueChange(owner, comps.month);
            dateChanged = true;
        }

        if (comps.day !== owner.day) {
            dayProperty.nativeValueChange(owner, comps.day);
            dateChanged = true;
        }

        if (dateChanged) {
            dateProperty.nativeValueChange(owner, new Date(comps.year, comps.month - 1, comps.day));
        }
    }

    public static ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UIDatePicker] }
    };
}
