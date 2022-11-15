import { XAndY, XYAndZ } from "@itwin/core-geometry";
import { BeButtonEvent, IModelApp, Marker, NotifyMessageDetails, OutputMessagePriority, StandardViewId } from "@itwin/core-frontend";

export class SmartDeviceMarker extends Marker {
    private _smartDeviceId: string;
    private _smartDeviceType: string;
    private _elementId: string;

    // static htmlElement: HTMLDivElement;

    constructor(location: XYAndZ, size: XAndY, smartDeviceId: string, smartDeviceType: string, cloudData: any, elementId: string) {
        super(location, size);
    
        this._smartDeviceId = smartDeviceId;
        this._smartDeviceType = smartDeviceType;
        this._elementId = elementId;
        
        this.setImageUrl(`/${this._smartDeviceType}.png`);
        this.title = this.populateTitle(cloudData);
    }

    private populateTitle(cloudData: any) {

        // "speaker001": { 
        //     "Notifications": 2, 
        //     "song Playing": true,
        //     "Song Name": "All I Want for Christmas Is You",
        //     "Song Artist": "Mariah Carey"
        //   },
        let smartTable = "";
        for (const [key, value] of Object.entries(cloudData)) {
            smartTable += `
            <tr>
             <th>${key}</th>
             <th>${value}</th>
            </tr>
            `            
        };

        const smartTableDiv = document.createElement("div");
        smartTableDiv.className = "smart-table";
        smartTableDiv.innerHTML = `
        <h3>${this._smartDeviceId}</h3>
        <table>
         ${smartTable}
        </table>
        `;

        return smartTableDiv;
    }

    public onMouseButton(_ev: BeButtonEvent): boolean {
        if (!_ev.isDown) return true;

        IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, "Proběhlo získání aktuálních informací ze zařízení " + this._smartDeviceId + " Vaším klinutím"));
        IModelApp.viewManager.selectedView!.zoomToElements(this._elementId, { animateFrustumChange: true, standardViewId: StandardViewId.RightIso });
        return true;

    }

}