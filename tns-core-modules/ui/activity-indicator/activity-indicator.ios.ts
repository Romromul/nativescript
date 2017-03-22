import { ActivityIndicatorBase, busyProperty, colorProperty, Color } from "./activity-indicator-common";

export * from "./activity-indicator-common";

export class ActivityIndicator extends ActivityIndicatorBase {
    nativeView: UIActivityIndicatorView;

    constructor() {
        super();
        this.nativeView = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(UIActivityIndicatorViewStyle.Gray);
        this.nativeView.hidesWhenStopped = true;
    }

    get ios(): UIActivityIndicatorView {
        return this.nativeView;
    }

    [busyProperty.getDefault](): boolean {
        if ((<any>this.nativeView).isAnimating) {
            return (<any>this.nativeView).isAnimating();
        }
        else {
            return this.nativeView.animating;
        }
    }
    [busyProperty.setNative](value: boolean) {
        let nativeView = this.nativeView;
        if (value) {
            nativeView.startAnimating();
        } else {
            nativeView.stopAnimating();
        }

        if (nativeView.hidesWhenStopped) {
            this.requestLayout();
        }
    }

    [colorProperty.getDefault](): UIColor {
        return this.nativeView.color;
    }
    [colorProperty.setNative](value: UIColor | Color) {
        this.nativeView.color = value instanceof Color ? value.ios : value;
    }
}