
import { startTypes } from "../../constants";

window.debugPastMulti = 1; // 调试时时钟倍率

/**
 * 用户存储的配置 || 默认配置
 */
const defaultConfig = {
    workTime: 25, // 工作时间
    shortRestTime: 5, // 短暂休息时间
    longRestTime: 15, // 长暂休息时间
    longRestGap: 3, // 长休息时间的间隔(3个短 1 长)
    autoToNext: 0, // 是否自动进入下一个阶段, 默认: 否 TODO: 
};

function getLocalConfig(itemKey) {
    if (itemKey) {
        return localStorage.getItem(itemKey);
    }
    //JSON.parse(localStorage.getItem("config") || "{}")
    let obj = {};
    for (let k in defaultConfig) {
        let val = localStorage.getItem(k);
        val && (obj[k] = val);
    }
    return obj;
}

function setLocalConfig(itemKey, val) {
    if (typeof val !== "string") {
        val = JSON.stringify(val);
    }
    return localStorage.setItem(itemKey, val);
}


let config = getLocalConfig();
config = Object.assign({}, defaultConfig, config);

const STATUS = {
    toWork: "toWork", // 要进入工作状态, 默认
    toRest: "toRest",
    working: "working",
    resting: "resting",
    pause: "pause",
};

const startPercent = 0; // 倒: 100, 正序 0;

const state = {
    count: 10,

    config,
    setTime: config.workTime, // 用户可以临时设置的时间
    pastTime: 0, // 已经过去的时间
    totalTime: 0, // 总时间
    pastPercent: startPercent, // 过去的比例
    intervalGap: 1, // 定时器间隔 1s
    displayTime: "", // 倒计时显示的时钟

    lastStatus: "", // 上一步的状态
    status: "toWork",
    isOver: false,
    showBgImg: false, // 是否显示背景图
};

const mutations = {
    // test
    increment(state) {
        state.count++;
    },
    showBgImg(state) {
        state.showBgImg = true;
    },
    hideBgImg(state) {
        state.showBgImg = false;
    },
    [startTypes.start_work](state) {
        state.isOver = false;
        state.status = STATUS.working;
        state.totalTime = state.setTime * 60; // 设置的时间为分钟,转换为秒
    },
    [startTypes.start_rest](state) {
        state.isOver = false;
        state.status = STATUS.resting;
        state.totalTime = state.setTime * 60;
    },
    [startTypes.over](state) {
        if (state.status === STATUS.working) {
            console.log("工作时间结束,准备进入短暂休息");
            state.status = STATUS.toRest;
            state.setTime = config.shortRestTime;
            // state.showBgImg = true;
        } else {
            console.log("短暂休息结束,准备进入工作,退出全屏");
            state.status = STATUS.toWork;
            state.setTime = config.workTime;
            // 避免強制模式不能退出全屏
            // state.showBgImg = false;
            // setTimeout(() => {
            //     webIpc.cancelFullScreen();
            // }, 500);
        }

        state.pastTime = 0;
        state.pastPercent = startPercent;
        state.displayTime = "";
        state.isOver = true;
    },
    // 强制停止怎么处理?
    [startTypes.stop](state) {
        state.isOver = false;
        if (state.status === STATUS.working) {
            console.log("工作时间强制停止, 进入 准备工作状态");
            state.status = STATUS.toWork;
            state.setTime = config.workTime;
        } else {
            console.log("休息时间强制停止, 进入 准备休息状态");
            state.status = STATUS.toRest;
            state.setTime = config.shortRestTime;
        }
    },
    resetTime(state) {
        state.pastTime = 0;
        state.pastPercent = startPercent;
        state.displayTime = "";
    },
    [startTypes.pause](state) {
        console.log("暂停, 设置暂停状态,记录原来的状态");
        state.lastStatus = state.status;
        state.status = STATUS.pause;
    },
    [startTypes.toContinue](state) {
        state.status = state.lastStatus;
        state.lastStatus = "";
    },
    [startTypes.updateSetTime](state, value) {
        if (value === "forceWork") {
            state.setTime = config.workTime;
        } else if (value === "forceRest") {
            state.setTime = config.shortRestTime;
        } else if (value === "forceLongRest") {
            state.setTime = config.longRestTime;
        } else {
            state.setTime = value;
        }
    },
    [startTypes.incrPastTime](state, fixVal) {
        state.pastTime += fixVal || state.intervalGap * window.debugPastMulti;
        let tmpPercent = parseFloat((state.pastTime / state.totalTime * 100).toFixed(2));

        state.pastPercent = Math.min(Math.abs(startPercent - tmpPercent), 100);

        state.displayTime = _toTimeString(state.totalTime - state.pastTime);
    },
    // 修改并保存配置
    updateConfig(state, { field, value }) {
        value = value | 0;
        console.log("updateConfig: ", { field, value });
        state.config[field] = value;
        setLocalConfig(field, value);
        if (state.status === STATUS.toRest
            && field === "shortRestTime") {
            state.setTime = value;
        } else if (
            state.status === STATUS.toWork
            && field === "workTime") {
            state.setTime = value;
        }
    }
};

const _toTimeString = (second) => {
    let remainSecond = second;
    let hour = (remainSecond / 60 / 60) | 0;
    remainSecond -= hour ? hour * 3600 : 0;
    let minute = (remainSecond / 60) | 0;
    remainSecond -= minute ? minute * 60 : 0;
    let str = "";
    str += hour ? `${_padZero(hour)}:` : "";
    str += minute ? `${_padZero(minute)}:` : "00:";
    str += _padZero(remainSecond);
    return str;
};

const _padZero = (num) => {
    return num < 10 ? `0${num}` : num;
};


let _timer_1 = null;

const actions = {
    increment: ({ commit }) => commit("increment"),
    setConfig: ({ commit }, { field, value }) => {
        // 
        console.log("setConfig: ", { field, value });
        commit("updateConfig", { field, value });
    },

    [startTypes.start_work_force]: ({ commit, dispatch, state }) => {
        console.log("强制重新开始工作", state, state.status);
        if (window.SYS_FORCE_RESET_MODE && state.status == STATUS.resting) {
            alert(`强制休息中,不能操作!!!`);
            return;
        }
        commit(startTypes.updateSetTime, "forceWork");
        dispatch(startTypes.start_work);
    },
    [startTypes.start_rest_force]: ({ commit, dispatch }) => {
        console.log("强制重新开始休息");
        if (window.SYS_FORCE_RESET_MODE && state.status == STATUS.resting) {
            alert(`强制休息中,不能操作!!!`);
            return;
        }
        commit(startTypes.updateSetTime, "forceRest");
        dispatch(startTypes.start_rest);
    },
    [startTypes.start_long_rest_force]: ({ commit, dispatch }) => {
        console.log("开始长时间休息");
        if (window.SYS_FORCE_RESET_MODE && state.status == STATUS.resting) {
            alert(`强制休息中,不能操作!!!`);
            return;
        }
        commit(startTypes.updateSetTime, "forceLongRest");
        dispatch(startTypes.start_rest);
    },
    [startTypes.start_work]: ({ commit, dispatch }) => {
        dispatch("_stopTimer");
        commit("resetTime");

        commit(startTypes.start_work);
        dispatch("_startInterval");
        webIpc.cancelFullScreen();
    },
    [startTypes.start_rest]: ({ commit, dispatch }) => {
        dispatch("_stopTimer");
        commit("resetTime");

        commit(startTypes.start_rest);
        dispatch("_startInterval");
        // 強制休息模式不退出全屏
        if (!window.SYS_FORCE_RESET_MODE) {
            webIpc.cancelFullScreen();
        }
    },
    [startTypes.incrPastTime]: ({ commit }, fixVal) => commit(startTypes.incrPastTime, fixVal),
    [startTypes.pause]: ({ commit }) => {
        clearInterval(_timer_1);
        _timer_1 = null;
        commit(startTypes.pause);
    },
    [startTypes.toContinue]: ({ commit, dispatch }) => {
        commit(startTypes.toContinue);
        dispatch("_startInterval");
    },
    [startTypes.stop]: ({ commit, dispatch }) => {
        dispatch("_stopTimer");
        commit(startTypes.stop);
        commit("resetTime");
    },
    _startInterval({ commit, state, dispatch }) {
        commit(startTypes.incrPastTime, 0);
        _timer_1 = setInterval(() => {
            if (state.pastTime >= state.totalTime) {
                dispatch("_curOver");
                return;
            }
            commit(startTypes.incrPastTime);
        }, state.intervalGap * 1000);
    },
    _stopTimer() {
        clearInterval(_timer_1);
        _timer_1 = null;
    },
    _curOver({ commit, state, dispatch }) {
        commit(startTypes.over);
        clearInterval(_timer_1);
        _timer_1 = null;
    },
    // incrementAsync({ commit }) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             commit("increment");
    //             resolve();
    //         }, 1000);
    //     });
    // }
};

// getters are functions
const getters = {
    // test
    cartTotal: state => state.count * 2,
    isOver: state => state.isOver,

    isWorking: state => state.status === STATUS.working,
    isResting: state => state.status === STATUS.resting,
    isPauseing: state => state.status === STATUS.pause,
    isToRest: state => { // 要进入到休息
        return state.status === STATUS.toRest;
    },
    isToWork: state => { // 要进入到休息
        return state.status === STATUS.toWork || state.lastStatus === STATUS.working;
    },
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations
};
