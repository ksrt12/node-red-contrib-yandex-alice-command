//

type RedNode = import("node-red").Node;
type RED = import("node-red").NodeAPI;
type NodeConfig = import("node-red").NodeDef;
type NodeStatusFill = import("node-red").NodeStatusFill;
type NodeStatusShape = import("node-red").NodeStatusShape;

type Body = import("node-fetch").Body;
type Response_ = import("node-fetch").Response;
interface Response extends Response_ { }

type NodeContextData = import("node-red").NodeContextData;

type FuncLog = (msg_text: string) => void;
type FuncSetStatus = (color: NodeStatusFill, shape: NodeStatusShape, topic: string, status: string) => void;
type FuncSetError = (topic: string, status: string) => void;
type FuncClean = () => NodeClean;

interface defFuncs {
    SetStatus: FuncSetStatus;
    SetError: FuncSetError;
    Debug_Log: FuncLog;
}

type arrowPromise<I, O> = (Params: I) => Promise<O> | undefined;
type arrowFunc<I, O> = (Params: I) => O;

interface aliceCredsBase {
    username: string;
    password: string;
}
interface aliceCredsAdd {
    cookies?: string;
    scenario_id?: string;
    speaker_id?: string;
}
interface getCreds {
    RED?: RED;
    id?: string;
}

interface aliceCreds extends aliceCredsBase, aliceCredsAdd { }
type getCredentials = arrowFunc<getCreds, aliceCreds>;

interface updateCreds extends getCreds { newCreds: aliceCreds; }
type updateCredentials = arrowFunc<updateCreds, void>;

interface getCookiesParams extends defFuncs { forceCreds?: aliceCreds | undefined; }
type getCookies = arrowPromise<getCookiesParams, string>;

interface defFetchGet extends defFuncs { headers: { Cookie: string; }; }
interface defFetchPost extends defFuncs {
    headers: {
        Cookie: string;
        'x-csrf-token': string;
    };
}
type getCSRF = arrowPromise<defFetchGet, string>;

interface baseAns {
    status: string;
    request_id: string;
}

interface quasar_info {
    device_id: string;
    platform: string;
    multiroom_available: boolean;
    multistep_scenarios_available: boolean;
    device_discovery_methods: any[];
}

interface device {
    id: string;
    name: string;
    type: string;
    icon_url: string;
    capabilities: {
        reportable: boolean;
        retrievable: boolean;
        type: string;
        parameters: {
            split: boolean;
        };
        state: {
            instance: string;
            value: boolean;
        };
        last_updated: number;
    }[] | [];
    properties: {
        type: string;
        retrievable: boolean;
        reportable: boolean;
        parameters: {
            instance: string;
            name: string;
            unit: string;
        };
        state: {
            percent?: number;
            status: string;
            value: number;
        };
    }[] | [];
    skill_id: string;
    quasar_info?: quasar_info;
    item_type: string;
    groups: string[];
}

interface ansDevices extends baseAns {
    rooms: {
        id: string;
        name: string;
        devices: device[];
    }[];
    groups: any[];
    unconfigured_devices: any[];
    speakers: any[];
}

interface capability {
    retrievable: boolean;
    type: string;
    state: {
        instance: string;
        value: string | {
            text: string;
        };
    };
    parameters: { instance: string; };
}
interface step {
    type: string;
    parameters: {
        launch_devices: {
            id: string;
            name: string;
            type: string;
            quasar_info: quasar_info;
            capabilities: capability[];
            item_type: string;
        }[];
        requested_speaker_capabilities: any[];
    };
};
interface scenario {
    id?: string;
    name: string;
    icon: string;
    icon_url: string;
    executable: boolean;
    devices: string[];
    triggers: {
        type: string;
        value: string;
    }[];
    steps?: step[];
    is_active: boolean;
}
interface ansScenarios extends baseAns {
    scenarios: scenario[];
}
interface ansScenarioEdit extends baseAns {
    scenario: scenario;
}


interface fetchGetParams extends defFetchGet {
    topic: string;
    url: string;
}
interface fetchPutPostParams extends fetchGetParams, defFetchPost {
    body?: Body;

}
type getAns = ansDevices | ansScenarios | ansScenarioEdit;
type fetchGet = arrowPromise<fetchGetParams, getAns>;
type fetchPut = arrowPromise<fetchPutPostParams, baseAns>;
type fetchPost = arrowPromise<fetchPutPostParams, baseAns>;

interface myFetchParams extends fetchPutPostParams {
    color: NodeStatusFill;
    method: "GET" | "PUT" | "POST";
}
type myFetch = arrowPromise<myFetchParams, {}>;