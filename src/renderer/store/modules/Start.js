
import { startTypes } from "../../constants";

/**
 * 用户存储的配置 || 默认配置
 */
const config = JSON.parse(localStorage.getItem("config") || "{}");
Object.assign(config, {
    workTime: 25, // 工作时间
    shotRestTime: 5, // 短暂休息时间
    longRestTime: 15, // 长暂休息时间
    longRestGap: 3, // 长休息时间的间隔(3个短 1 长)
});

const STATUS = {
    work: "work",
    rest: "rest",
    pause: "pause",
    none: "none",
};

const state = {
    count: 10,

    setTime: config.workTime, // 用户可以临时设置的时间
    pastTime: 0, // 已经过去的时间
    totalTime: 0, // 总时间
    pastPercent: 0, // 过去的比例
    intervalGap: 1, // 定时器间隔 1s
    displayTime: "", // 倒计时显示的时钟

    lastStatus: "", // 上一步的状态
    curStatus: "none", // 当前状态
};

const mutations = {
    // test
    increment(state) {
        state.count++;
    },
    [startTypes.start_work](state) {
        state.totalTime = state.setTime * 60; // 设置的时间为分钟,转换为秒
        state.lastStatus = state.curStatus;
        state.curStatus = STATUS.work;
    },
    [startTypes.start_rest](state) {
        state.totalTime = state.setTime * 60;
        state.lastStatus = state.curStatus;
        state.curStatus = STATUS.rest;
    },
    [startTypes.stop](state) {
        state.pastTime = 0;
        state.pastPercent = 0;
        state.displayTime = "";
        state.lastStatus = state.curStatus;
        state.curStatus = STATUS.stop;
    },
    [startTypes.pause](state) {
        state.lastStatus = state.curStatus;
        state.curStatus = STATUS.pause;
    },
    [startTypes.updateSetTime](state, vaule) {
        state.setTime = vaule;
    },
    [startTypes.incrPastTime](state) {
        state.pastTime += state.intervalGap;
        state.pastPercent = parseFloat((state.pastTime / state.totalTime * 100).toFixed(2));
        state.displayTime = _toTimeString(state.totalTime - state.pastTime);
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


const actions = {
    increment: ({ commit }) => commit("increment"),
    [startTypes.start]: ({ commit, state }) => {
        console.log("start-, state.lastStatus: ", state.lastStatus);
        commit(startTypes.start_work);
    },
    [startTypes.start_work]: ({ commit, state }) => {
        // 开始
        if (state.lastStatus === STATUS.work) {

        }

        commit(startTypes.start_work);
    },
    [startTypes.start_rest]: ({ commit }) => commit(startTypes.start_rest),
    [startTypes.over]: ({ commit }) => {
        // 正常结束

        commit(startTypes.stop);
    },
    [startTypes.incrPastTime]: ({ commit }) => commit(startTypes.incrPastTime),
    [startTypes.pause]: ({ commit }) => {
        commit(startTypes.pause);
    },
    [startTypes.stop]: ({ commit }) => {
        commit(startTypes.stop);
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
    isWorking: state => state.curStatus === STATUS.work,
    isResting: state => state.curStatus === STATUS.rest,
    isPauseing: state => state.curStatus === STATUS.pause,
    isStoped: state => state.curStatus === STATUS.stop,
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations
};
