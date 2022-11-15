import { IModelApp, StandardViewId } from "@itwin/core-frontend";
import { Value } from "@itwin/presentation-common";
import * as React from "react";
import { SmartDeviceDecorator } from "../decoraters/SmartDeviceDecorator";

export function SmartDeviceListWidgetComponent() {
    const [smartTableList, setSmartTableList] = React.useState<JSX.Element[]>([]);
    
    React.useEffect(() => {
        (async() => {
            const values = await SmartDeviceDecorator.getSmartDeviceData();
            const tableList: JSX.Element[] = [];

            values.forEach(value => {
                tableList.push(
                    <tr onClick={() => { IModelApp.viewManager.selectedView!.zoomToElements(value.id, { animateFrustumChange: true, standardViewId: StandardViewId.RightIso }); }}>
                        <th>{value.smartDeviceType}</th>
                        <th>{value.smartDeviceId}</th>
                    </tr>
                )                
            })

            setSmartTableList(tableList);
        })();

    }, [])

    return (
        <table className="smart-table">
            <tbody>
                <tr>
                    {/* <th>SmartDeviceType</th>
                    <th>SmartDeviceId</th> */}
                    <th>Typ zařízení SÚSPK</th>
                    <th>Číslo zařízení SÚSPK</th>
                </tr>
            {smartTableList}
            </tbody>
        </table>
    )
}