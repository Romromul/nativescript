import { LayoutBase, View, Observable, HorizontalAlignment, VerticalAlignment, Visibility, PercentLength, Length } from "tns-core-modules/ui/layouts/layout-base";

export class ViewModel extends Observable {

    // View properties
    public onWidthHeight(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;
        if (!PercentLength.equals(view.marginLeft, { value: 0.5, unit: "%"})) {
            (<any>view).width = "50%";
            (<any>view).height = "50%";
        } else {
            (<any>view).width = "75%";
            (<any>view).height = "75%";
        }
    }

    public onMinWidthMinHeight(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;
        if (!PercentLength.equals(view.marginLeft, 105)) {
            view.minWidth = 105;
            view.minHeight = 55;
        } else {
            view.minWidth = 0;
            view.minHeight = 0;
        }
    }

    public onMargins(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;
        if (!PercentLength.equals(view.marginLeft, { value: 0.1, unit: "%"})) {
            (<any>view).marginLeft = "10%";
            (<any>view).marginTop = "10%";
            (<any>view).marginRight = "10%";
            (<any>view).marginBottom = "10%";
        } else {
            view.marginLeft = 0;
            view.marginTop = 0;
            view.marginRight = 0;
            view.marginBottom = 0;
        }
    }

    public onAlignments(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;

        if (view.horizontalAlignment === "stretch") {
            view.horizontalAlignment = "left";
            view.verticalAlignment = "top";
        } else if (view.horizontalAlignment === "left") {
            view.horizontalAlignment = "center";
            view.verticalAlignment = "middle";
        } else if (view.horizontalAlignment === "center") {
            view.horizontalAlignment = "right";
            view.verticalAlignment = "bottom";
        } else {
            view.horizontalAlignment = "stretch";
            view.verticalAlignment = "stretch";
        }
    }

    public onCollapse(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;
        view.visibility = "collapse";
    }

    public onVisibile(args: { eventName: string, object: any }): void {
        var view: View = <View>args.object;

        var layout = <LayoutBase>view.parent;

        var child = layout.getViewById<View>("collapse");
        child.visibility = "visible";
    }

    // Layout properties
    public onPaddings(args: { eventName: string, object: any }): void {
        var layout: LayoutBase = args.object.parent;
        if (!Length.equals(layout.paddingLeft, 5)) {
            layout.paddingLeft = 5;
            layout.paddingTop = 5;
            layout.paddingRight = 5;
            layout.paddingBottom = 5;
        } else {
            layout.paddingLeft = 0;
            layout.paddingTop = 0;
            layout.paddingRight = 0;
            layout.paddingBottom = 0;
        }
    }

    public onAllProperties(args: { eventName: string, object: any }): void {
        var child: View;
        var layout: LayoutBase = args.object.parent;

        // WidthHeight
        child = <View>layout.getViewById("widthHeight");
        if (!PercentLength.equals((<any>child).width, { value: 0.5, unit: "%"})) {
            (<any>child).width = "50%";
            (<any>child).height = "50%";
        } else {
            (<any>child).width = "75%";
            (<any>child).height = "75%";
        }

        // MinWidthMinHeight
        child = <View>layout.getViewById("minWidthMinHeight");
        if (!Length.equals(child.minWidth, 105)) {
            child.minWidth = 105;
            child.minHeight = 55;
        } else {
            child.minWidth = 0;
            child.minHeight = 0;
        }

        // Margins
        child = <View>layout.getViewById("margins");
        if (!PercentLength.equals((<any>child).marginLeft, { value: 0.1, unit: "%"})) {
            (<any>child).marginLeft = "10%";
            (<any>child).marginTop = "10%";
            (<any>child).marginRight = "10%";
            (<any>child).marginBottom = "10%";
        } else {
            child.marginLeft = 0;
            child.marginTop = 0;
            child.marginRight = 0;
            child.marginBottom = 0;
        }

        // Alignments
        child = <View>layout.getViewById("alignments");
        if (child.horizontalAlignment === HorizontalAlignment.STRETCH) {
            child.horizontalAlignment = HorizontalAlignment.LEFT;
            child.verticalAlignment = VerticalAlignment.TOP;
        } else if (child.horizontalAlignment === HorizontalAlignment.LEFT) {
            child.horizontalAlignment = HorizontalAlignment.CENTER;
            child.verticalAlignment = VerticalAlignment.MIDDLE;
        } else if (child.horizontalAlignment === HorizontalAlignment.CENTER) {
            child.horizontalAlignment = HorizontalAlignment.RIGHT;
            child.verticalAlignment = VerticalAlignment.BOTTOM;
        } else {
            child.horizontalAlignment = HorizontalAlignment.STRETCH;
            child.verticalAlignment = VerticalAlignment.STRETCH;
        }

        // Collapse
        child = <View>layout.getViewById("collapse");
        if (child.visibility === Visibility.VISIBLE) {
            child.visibility = Visibility.COLLAPSE;
        } else {
            child.visibility = Visibility.VISIBLE;
        }

        // Paddings
        if (!Length.equals(layout.paddingLeft, 5)) {
            layout.paddingLeft = 5;
            layout.paddingTop = 5;
            layout.paddingRight = 5;
            layout.paddingBottom = 5;
        } else {
            layout.paddingLeft = 0;
            layout.paddingTop = 0;
            layout.paddingRight = 0;
            layout.paddingBottom = 0;
        }
    }
}
