export const API_END_POINTS = {
    REGISTER: "/register",
    LOGIN: "/login",
    CHILD: "/child",
    ADD_CHILD: "/child/attach",
    REMOVE_CHILD: "/child/remove",
    USER_PROFILE: "/user/profile",
    PIN_CHECK: "/user/pin/status",
    FORGOT_PASSWORD: "/user/password/forgot",
    RESET_PASSWORD: "/user/password/reset",
    CHANGE_PASSWORD: "/user/password/change",
    STORY_DATA: "/story",
    UPLOAD_STORY: "/file/upload",
    CHECK_EMAIL: "/checkEmail",
    CHILD_UPDATE: "/child",
    STORY_RECORDING: "/story/recording",
    GET_STORY_RECORDING: "/userStory",
};

export const enum DEPLOYMENT_MODE {
    LOCAL = 0,
    DEVELOPMENT,
    STAGING,
    PRODUCTION,
}

export let SERVER = DEPLOYMENT_MODE.LOCAL;
export const API_AUTH_KEY = {
    LOCAL: "test",
    DEVELOPMENT: "test",
    STAGING: "7HLsBfaH6b2YR7nw",
    PRODUCTION: "7HLsBfaH6b2YR7nw",
};

export const REQUEST_TYPE = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "DELETE",
};

// https://9287-112-196-113-2.ngrok-free.app/documentation/
//https://61d3-112-196-113-2.ngrok-free.app./v1
export const BASE_ADDRESS = {
    LOCAL: "https://8953-112-196-113-2.ngrok-free.app/v1",
    DEVELOPMENT: "http://3.14.117.126:4000/v1",
    STAGING: "http://3.14.117.126:4000/v1",
    PRODUCTION: "http://3.14.117.126:4000/v1",
};

// export const SOKCET_URLS = {
//     LOCAL: "http://192.180.4.48:4001/",
//     DEVELOPMENT: "https://socket-dev.theluxelottery.com/",
//     STAGING: "https://socket-staging.theluxelottery.com/",
//     PRODUCTION: "https://socket.theluxelottery.com/",
// };

export const _EVENTS = {
    Connect: "connect",
    Reconnect: "reconnect",
    Reconnecting: "reconnecting",
    Disconnect: "disconnect",
    Error: "error",
    Message: "message",
    EventTest: "Test",
    SingleEvent: "SingleEvent",
};
