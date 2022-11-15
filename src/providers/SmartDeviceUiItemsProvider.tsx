import { IModelApp } from "@itwin/core-frontend";
import { UiItemsProvider, ToolbarUsage, ToolbarOrientation, CommonToolbarItem, StageUsage, ToolbarItemUtilities, StagePanelLocation, StagePanelSection, AbstractWidgetProps } from "@itwin/appui-abstract";
import { Visualization } from "../Visualization";
import { SmartDeviceListWidgetComponent } from "../components/widgets/SmartDeviceListWidgetComponent";
import * as React from "react";


export class SmartDeviceUiItemsProvider implements UiItemsProvider {
    public readonly id = "SmartDeviceUiProvider";
    private _toogleWalls: boolean = false;

    public provideToolbarButtonItems(stageId: string, stageUsage: string, toolbarUsage: ToolbarUsage, toolbarOrientation: ToolbarOrientation) : CommonToolbarItem[] {
        const toolbarButtonItems: CommonToolbarItem[] = [];

        if (stageUsage === StageUsage.General && toolbarUsage === ToolbarUsage.ContentManipulation && toolbarOrientation === ToolbarOrientation.Vertical) {

            const toggleWallsButton = ToolbarItemUtilities.createActionButton(
                "ToogleWalls",
                1000,
                // "icon-element",
                "icon-ec-schema",
                "PŘEDNASTAVENÉ zobrazení SÚSPK",
                () => {
                    
                    this._toogleWalls = !this._toogleWalls;
                    Visualization.hideHouseExterior(IModelApp.viewManager.selectedView!, this._toogleWalls);

                }
            );

            toolbarButtonItems.push(toggleWallsButton);
        

        }

        return toolbarButtonItems;
    }

    public provideWidgets(stageId: string, stageUsage: string, location: StagePanelLocation, section?: StagePanelSection): ReadonlyArray<AbstractWidgetProps> {
        const widgets: AbstractWidgetProps[] = [];
    
        if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right) {

            const widget: AbstractWidgetProps = {          
                id: "smartDeviceListWidget",
                label: "SÚSPK Pardubice",
                getWidgetContent: () => {
                    // return "Hello"
                    return <SmartDeviceListWidgetComponent></SmartDeviceListWidgetComponent>

                }             
            }

            widgets.push(widget);

        }

        return widgets;

    }

}