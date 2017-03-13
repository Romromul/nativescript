import { EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";
import { TabView } from "tns-core-modules/ui/tab-view";

let iconModes = ["automatic", "alwaysOriginal", "alwaysTemplate", undefined];

export function onChangeRenderingMode(args: EventData){
    let button = (<Button>args.object);
    let tabView = button.page.getViewById<TabView>("tab-view");
     
    tabView.iosIconRenderingMode = <"automatic" | "alwaysOriginal" | "alwaysTemplate">iconModes[(iconModes.indexOf(tabView.iosIconRenderingMode) + 1) % iconModes.length];

    for(let i = 0, length = tabView.items.length; i < length; i++){
        (<Button>tabView.items[i].view).text = "" + tabView.iosIconRenderingMode; 
    }
}
