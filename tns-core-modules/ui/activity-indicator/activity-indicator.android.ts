﻿import { ActivityIndicatorBase, busyProperty, colorProperty, visibilityProperty, Visibility, Color } from "./activity-indicator-common";

export * from "./activity-indicator-common";

export class ActivityIndicator extends ActivityIndicatorBase {
    _progressBar: android.widget.ProgressBar;

    public _createNativeView() {
        const progressBar = this._progressBar = new android.widget.ProgressBar(this._context);
        this._progressBar.setVisibility(android.view.View.INVISIBLE);
        this._progressBar.setIndeterminate(true);
        return progressBar;
    }

    get android(): android.widget.ProgressBar {
        return this._progressBar;
    }

    [busyProperty.getDefault](): boolean {
        return false;
    }
    [busyProperty.setNative](value: boolean) {
        if (this.visibility === Visibility.VISIBLE) {
            this._progressBar.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    }

    [visibilityProperty.getDefault](): Visibility {
        return Visibility.HIDDEN;       
    }
    [visibilityProperty.setNative](value: Visibility) {
        switch (value) {
            case Visibility.VISIBLE:
                this._progressBar.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                break;
            case Visibility.HIDDEN:
                this._progressBar.setVisibility(android.view.View.INVISIBLE);
                break;
            case Visibility.COLLAPSE:
                this._progressBar.setVisibility(android.view.View.GONE);
                break;
            default: 
                throw new Error(`Invalid visibility value: ${value}. Valid values are: "${Visibility.VISIBLE}", "${Visibility.HIDDEN}", "${Visibility.COLLAPSE}".`);
        }
    }

    [colorProperty.getDefault](): number {
        return -1;
    }
    [colorProperty.setNative](value: number | Color) {
        if (value instanceof Color) {
            this._progressBar.getIndeterminateDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        } else {
            this._progressBar.getIndeterminateDrawable().clearColorFilter();
        }
    }
}