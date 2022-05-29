import { DecorateContext, Decorator, IModelConnection, Marker, ScreenViewport } from "@bentley/imodeljs-frontend";
// import { Value } from "@bentley/presentation-common";
import { SmartDeviceMarker } from "../markers/SmartDeviceMarker";
import { SmartDeviceAPI } from "../../SmartDeviceAPI";
import { UiFramework } from "@bentley/ui-framework";


export class SmartDeviceDecorator implements Decorator {
    private _iModel: IModelConnection;
    private _markerSet: Marker[];

    constructor(vp: ScreenViewport) {
        this._iModel = vp.iModel;
        this._markerSet = [];

        this.addMarkers();
    }

    // private async getSmartDeviceData() {
    public static async getSmartDeviceData() {
            const query = `
        SELECT SmartDeviceId,
                        SmartDeviceType,
                        ECInstanceId,
                        Origin
                        FROM DgnCustomItemTypes_HouseSchema.SmartDevice
                        WHERE Origin IS NOT NULL
        `
        // const results = this._iModel.query(query);
        const results = UiFramework.getIModelConnection()!.query(query);
        const values = [];

        for await (const row of results)
            values.push(row);

        return values;
    }

    private async addMarkers() { 
        // const values = await this.getSmartDeviceData();
        const values = await SmartDeviceDecorator.getSmartDeviceData();
        const cloudData = await SmartDeviceAPI.getData();
        
        values.forEach(value => {
            const smartDeviceMarker = new SmartDeviceMarker(
                { x: value.origin.x, y: value.origin.y, z: value.origin.z },
                { x: 35, y: 35 },
                value.smartDeviceId,
                value.smartDeviceType,
                cloudData[value.smartDeviceId],
                value.id
            );
            
            this._markerSet.push(smartDeviceMarker);

        })
    }

    public decorate(context: DecorateContext): void {
        this._markerSet.forEach(marker => {
            marker.addDecoration(context);
        })
    }
}