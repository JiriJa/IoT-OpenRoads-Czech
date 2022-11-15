export class SmartDeviceAPI {

    public static async getData() {
        
        // const response = await fetch("https://smarthomedata.z22.web.core.windows.net/");
        const response = await fetch("https://raw.githubusercontent.com/JiriJa/IoT_Repository/main/soubor.json");
        const deviceData = response.json();

        return deviceData;
    }

}