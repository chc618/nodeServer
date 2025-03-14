<template>
    <el-row class="container-product">
        <!-- 顶部 -->
        <el-row class="title">
<!--            <el-col class="titleTip titleLeft" :span="8">{{ time[0] }}<span>|</span> {{ time[1] }} {{ weather }} </el-col>-->
            <el-col class="titleCenter">
<!--                <div>生产看板</div>-->
                <div>Produce Board</div>
            </el-col>
        </el-row>

        <!-- 未开工 -->
        <el-row class="section">
            <el-col :span="24" class="section-box">
                <div class="section-header">
                    <div class="section-title">Planned</div>
                </div>
                <div class="small-containers">
                    <div v-for="item in notStartedList" :key="item.orderId" class="small-container" :class="`status-${item.backStatus}`">
                        <div class="section-content">
                            <div>Sales Order Number: {{ item.order_no || '--' }}</div>
                            <div>Request Finish Date: {{ item.planEndDate || '--' }}</div>
                            <div>Completion Ratio: 0%</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 已开工 -->
        <el-row class="section">
            <el-col :span="24" class="section-box">
                <div class="section-header">
                    <div class="section-title">Producing</div>
                </div>
                <div class="small-containers">
                    <div v-for="item in inProgressList" :key="item.orderId" class="small-container" :class="`status-${item.backStatus}`">
                        <div class="section-content">
                            <div>Sales Order Number: {{ item.order_no || '--' }}</div>
                            <div>Request Finish Date: {{ item.planEndDate || '--' }}</div>
                            <div>Completion Ratio: {{ item.productionProgress || '--' }}%</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 已完成 -->
        <el-row class="section">
            <el-col :span="24" class="section-box">
                <div class="section-header">
                    <div class="section-title">Finished</div>
                </div>
                <div class="small-containers">
                    <div v-for="item in completedList" :key="item.orderId" class="small-container" :class="`status-${item.backStatus}`">
                        <div class="section-content">
                            <div>Sales Order Number: {{ item.order_no || '--' }}</div>
                            <div>Request Finish Date: {{ item.planEndDate || '--' }}</div>
                            <div>Completion Ratio: {{ item.productionProgress || '--' }}%</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-row>
</template>

<script>

import {getTask} from "@/api/user";

export default {
    name: 'Home',
    data() {
        return {
            time: '2025-05-23',
            weather: '',
            search: {
                current: 1,
                deptCode: '',
                size: 12
            },
            total: 0,
            countDown: 20,
            timeInterval: () => {},
            tableInterval: () => {},

            // 每个状态的数据数组
            notStartedList: [

            ],
            inProgressList: [

            ],
            completedList: [

            ]
        }
    },
    created() {
        // this.startInterval()
        this.getTableInfo()
    },
    mounted() {
        // this.startInterval()
        // this.getTableInfo()
    },
    beforeDestroy() {
        // clearInterval(this.timeInterval)
        clearInterval(this.tableInterval)
    },
    methods: {
        async getTableInfo() {
            try {
                const res = await getTask();
                console.log(res,'res')
                if (res && res.data && res.data.data) {
                    const tasks = res.data.data;
                    const statusMap = {
                        'Planned': this.notStartedList,
                        'Producing': this.inProgressList,
                        'Finished': this.completedList
                    };

                    for (const task of tasks) {
                        const list = statusMap[task.taskStatus];
                        if (list) {
                            list.push(task);
                        }
                    }

                    // for (const task of tasks) {
                    //     const { taskStatus } = task;
                    //
                    //     if (taskStatus === 'Planned') {
                    //         this.notStartedList.push(task);
                    //     } else if (taskStatus === 'Producing') {
                    //         this.inProgressList.push(task);
                    //     } else if (taskStatus === 'Finished') {
                    //         this.completedList.push(task);
                    //     }
                    // }
                    console.log('notStartedList:', this.notStartedList);
                    console.log('inProgressList:', this.inProgressList);
                    console.log('completedList:', this.completedList);
                } else {
                    alert('No data available');
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.msg) {
                    alert(err.response.data.msg);
                } else {
                    alert('An error occurred');
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container-product {

    width: 98.5vw; /* 视口宽度 */
    height: 98vh; /* 视口高度 */
    margin: auto; /* 居中显示 */
    //background: url(bigBg.jpg) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;

    .title {
        width: 100vw;
        margin-top: 0.5vh;
        background: rgb(132, 148, 164) url(titleBg.png) no-repeat;
        background-size: 100% 100%;
        height: 6vh;

        .titleTip {
            font-size: 0.5vw;
            line-height: 4vh;
            background-image: -webkit-linear-gradient(#ffffff, #8dd3ff);
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }

        .titleLeft {
            padding-left: 1.5vw;
            text-align: left;
            span {
                font-weight: normal;
                padding: 0 0.5vw 0 1vw;
            }
        }

        .titleCenter {
            text-align: center;
            font-size: 1.8em; /* 相对于父容器的字体大小 */
            background-image: -webkit-linear-gradient(#80f2ff, #779fda);
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
            letter-spacing: 0.1em;
        }
    }

    .section {
        height: 31.1%;
        //margin-top: 1vh;
        //display: flex;
        flex-direction: column; /* 大容器垂直排列 */
        .section-box {
            height: 100%;
            background-color: rgb(132, 148, 164);
            border: 1px solid #072e91;
            border-radius: 5px;
            //padding: 1vh;
            //overflow: auto; /* 启用滚动功能 */
            position: relative; /* 用于滚动条的定位 */
            .section-header {
                height: 10%;
                text-align: center; /* 标题居中 */
                margin-bottom: 0.5vh;
                .section-title {
                    font-size: 1.2em; /* 相对于父容器的字体大小 */
                    font-weight: bold;
                    background-image: -webkit-linear-gradient(#80f2ff, #5197ff);
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }

            .small-containers {
                height: 82%; /* 确保有明确的高度限制 */
                //flex: 1; /* 占据剩余空间 */
                overflow-y: auto; /* 启用垂直滚动 */
                display: flex;
                flex-wrap: wrap; /* 如果需要换行，保留这个属性 */
                gap: 0.2vw; /* 子元素之间的间距 */
                padding: 0 1vh; /* 内边距 */
                //position: relative; /* 用于滚动条的定位 */

                /* 隐藏滚动条 */
                &::-webkit-scrollbar {
                    width: 8px; /* 滚动条宽度 */
                }
                &::-webkit-scrollbar-thumb {
                    background-color: #888; /* 滚动条颜色 */
                    border-radius: 4px; /* 滚动条圆角 */
                }
                .small-container {
                    background-color: rgb(132, 148, 164);
                    border-radius: 5px;
                    padding: 1vh;
                    height: 36%; /* 或者设置一个固定高度，例如 300px */
                    width: 23.5%;
                    margin-left: 0.4vh; /* 添加底部间距 */
                    margin-top: 0.5vh; /* 添加底部间距 */
                    .section-content {
                        font-size: 0.9em; /* 相对于父容器的字体大小 */
                        text-align: left;
                        div {
                            margin-bottom: 0.5vh;
                        }
                    }

                    // 动态背景颜色
                    &.status-1 {
                        background-color: rgba(0, 255, 0, 0.2); /* 绿色背景 */
                    }
                    &.status-2 {
                        background-color: rgba(255, 255, 0, 0.2); /* 黄色背景 */
                    }
                    &.status-3 {
                        background-color: rgba(255, 0, 0, 0.2); /* 红色背景 */
                    }
                }
            }
        }
        ///* 隐藏滚动条 */
        //.section-box::-webkit-scrollbar {
        //    display: none; /* 隐藏滚动条 */
        //}
        //
        ///* 兼容 IE 和 Firefox */
        //.section-box {
        //    -ms-overflow-style: none; /* IE */
        //    scrollbar-width: none; /* Firefox */
        //}
    }
}
</style>
