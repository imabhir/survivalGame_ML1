import { DEPLOYMENT_MODE, BASE_ADDRESS, API_AUTH_KEY } from "./NetworkConfig";

export class NetworkManager {
    private static _instance: NetworkManager;
    private baseUrl: string = "";
    private apiAuthKey: string = "";
    timeout = 6500;
    static getInstance(): NetworkManager {
        if (!NetworkManager._instance) {
            NetworkManager._instance = new NetworkManager();
        }
        return NetworkManager._instance;
    }

    init(deplaymentMode: DEPLOYMENT_MODE) {
        switch (deplaymentMode) {
            case DEPLOYMENT_MODE.LOCAL:
                this.baseUrl = BASE_ADDRESS.LOCAL;
                this.apiAuthKey = API_AUTH_KEY.LOCAL;
                break;
            case DEPLOYMENT_MODE.DEVELOPMENT:
                this.baseUrl = BASE_ADDRESS.DEVELOPMENT;
                this.apiAuthKey = API_AUTH_KEY.DEVELOPMENT;
                break;
            case DEPLOYMENT_MODE.PRODUCTION:
                this.baseUrl = BASE_ADDRESS.PRODUCTION;
                this.apiAuthKey = API_AUTH_KEY.PRODUCTION;
                break;
            case DEPLOYMENT_MODE.STAGING:
                this.baseUrl = BASE_ADDRESS.STAGING;
                this.apiAuthKey = API_AUTH_KEY.STAGING;

                break;
        }
    }

    sendRequest(
        api: string,
        reuqestType: string,
        param: any,
        successCb: Function,
        errorCb: Function,
        requireToken: boolean = false
    ) {
        let xhr = new XMLHttpRequest();

        let fullurl = this.baseUrl + api;
        //console.log("fullURL", fullurl);
        xhr.timeout = this.timeout;
        let readyStateChanged = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                let response: string = xhr.responseText;
                successCb(response);
            } else if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status < 500) {
                let respone: string = xhr.responseText;
                //console.log("********* NOT FOUND ******");
                errorCb(respone);
            }
        };
        xhr.open(reuqestType, fullurl);
        xhr.ontimeout = function () {
            //console.log("API request timed out. Please try again later.");
            // DataHandler.Instance.MainNode.getComponent(Main).activeErrorLayer(ERROR_MSG.API_RESPONSE);
            // errorCb();
        };
        xhr.setRequestHeader("accept", "application/json");
        xhr.setRequestHeader("X-API-KEY", "apitestkey");
        xhr.setRequestHeader("Content-Type", "application/json");

        if (requireToken) xhr.setRequestHeader("authorization", localStorage.getItem("token"));

        xhr.onreadystatechange = readyStateChanged;
        //console.log("NETWORK MANAGER", JSON.stringify(param));

        // let stringed_data = JSON.stringify(param);
        xhr.send(JSON.stringify(param));
        // xhr.send(param);
    }

    sendRequestFormData(
        api: string,
        reuqestType: string,
        param: any,
        successCb: Function,
        errorCb: Function,
        requireToken: boolean = false
    ) {
        let xhr = new XMLHttpRequest();
        // let timeout = 5000;
        let fullurl = this.baseUrl + api;
        //console.log("fullURL", fullurl);
        xhr.timeout = this.timeout;
        xhr.ontimeout = function () {
            // Display an error popup
            //console.log("API request timed out. Please try again later.");
            // DataHandler.Instance.MainNode.getComponent(Main).activeErrorLayer(ERROR_MSG.API_RESPONSE);
        };
        let readyStateChanged = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                let response: string = xhr.responseText;
                successCb(response);
            } else if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status < 500) {
                let respone: string = xhr.responseText;
                errorCb(respone);
            }
        };
        xhr.open(reuqestType, fullurl);
        // xhr.setRequestHeader("accept", "application/json");
        // xhr.setRequestHeader("X-API-KEY", "apitestkey");
        // xhr.setRequestHeader("Content-Type", "application/json");

        if (requireToken) xhr.setRequestHeader("authorization", localStorage.getItem("token"));

        xhr.onreadystatechange = readyStateChanged;

        xhr.send(param);
    }
    sendGetWithQueryString(
        api: string,
        reuqestType: string,
        param: any,
        successCb: Function,
        errorCb: Function,
        requireToken: boolean = false
    ) {
        // let timeout = 5000;
        let xhr = new XMLHttpRequest();
        let fullurl = this.getInitialBaseURL() + api;
        xhr.timeout = this.timeout;
        xhr.ontimeout = function () {
            // Display an error popup
            //console.log("API request timed out. Please try again later.");
            // DataHandler.Instance.MainNode.getComponent(Main).activeErrorLayer(ERROR_MSG.API_RESPONSE);
        };
        let readyStateChanged = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                let response: string = xhr.responseText;
                successCb(response);
            } else if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status < 500) {
                let respone: string = xhr.responseText;
                errorCb(respone);
            }
        };
        var queryString = this.objectToQueryString(param);
        xhr.open(reuqestType, fullurl + "?" + queryString, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (requireToken) xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
        xhr.setRequestHeader("X-API-KEY", this.apiAuthKey);
        xhr.onreadystatechange = readyStateChanged;
        xhr.send(null);
    }

    objectToQueryString(obj: any) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    getInitialBaseURL(): string {
        return this.baseUrl;
    }
}
