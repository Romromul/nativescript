﻿declare module "ui/layouts/absolute-layout" {
    import { LayoutBase, View, Property } from "ui/layouts/layout-base";

    /**
     *  A layout that lets you specify exact locations (left/top coordinates) of its children.
     */
    class AbsoluteLayout extends LayoutBase {
        /**
         * Gets the value of the Left property from a given View.
         */
        static getLeft(view: View): number;

        /**
         * Sets the value of the Left property from a given View.
         */
        static setLeft(view: View, value: number): void;

        /**
         * Gets the value of the Top property from a given View.
         */
        static getTop(view: View): number;

        /**
         * Sets the value of the Top property from a given View.
         */
        static setTop(view: View, value: number): void;
    }

    /**
     * Represents the observable property backing the left property.
     */
    export const leftProperty: Property<View, number>;

    /**
     * Represents the observable property backing the top property.
     */
    export const topProperty: Property<View, number>;
}