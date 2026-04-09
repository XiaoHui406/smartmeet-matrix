<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { mockStats, recentMeetingsMock } from '../api/mockData'
import { Document, FolderChecked, Star } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'

const stats = ref(mockStats)
const recentMeetings = ref(recentMeetingsMock)
const meetingChart = ref(null)
const attendanceChart = ref(null)
const meetingTypeChart = ref(null)


//获取会议总数量   已经召开的数量
import { meetListService, getTopicsService, attendsListService, sortTopicHotService, sortTopicInterService, sortTopicScoreService } from '../api/meet'
const meetAllNum = ref(0)//会议总数量
const meetData = ref([])//会议信息
const meetStartNum = ref(0)//会议已经召开的数量
const getMeetAllNum = async () => {
  try {
    const response = await meetListService()
    console.log('meetListService response:', response) // 打印返回值以检查数据结构
    if (response && Array.isArray(response.data)) { // 确保 data 是数组
      meetData.value = response.data
      meetAllNum.value = meetData.value.length
      console.log('会议总数量：', meetAllNum.value)

      //会议已经召开的数量
      const startedMeetings = meetData.value.filter(meeting => meeting?.meetingStatus !== undefined && meeting.meetingStatus != 1)
      meetStartNum.value = startedMeetings.length
      console.log('已经召开的数量：', meetStartNum.value)

    } else {
      console.error('meetListService 返回的数据不符合预期:', response)
    }
  } catch (error) {
    console.error('获取会议列表失败:', error)
  }
}
getMeetAllNum();

const topicAllNum = ref(0);
const topicData = ref([]);
const topicClikNum = ref(0);
const getTopicAllNum = async () => {
  for (const meeting of meetData.value) {
    const meetingId = parseInt(meeting.meetingId);
    if (!isNaN(meetingId)) { 
      try {
        const response = await getTopicsService(meetingId);
        if (response && Array.isArray(response.data)) {
          topicData.value = [...topicData.value, ...response.data]; 
          topicAllNum.value += response.data.length;

          for (const topic of response.data) {
            const clickCount = parseInt(topic.clickCount, 10); 
            if (isFinite(clickCount)) { 
              topicClikNum.value += clickCount;
            } else {
              console.warn(`跳过无效的 clickCount 值：${topic.clickCount}`);
            }
          }
        } else {
          console.error('getTopicsService 返回的数据不符合预期:', response);
        }
      } catch (error) {
        console.error(`获取会议 ID ${meetingId} 的议程失败：`, error);
      }
    } else {
      console.warn(`跳过无效的会议 ID：${meeting.meetingId}`);
    }
  }

  console.log('所有议程数量：', topicAllNum.value);
  console.log('议程点击数：', topicClikNum.value);
}
getTopicAllNum();

import { organizationListService } from '../api/organization'
import { memberService } from '../api/member'


const organAllNum = ref(0);
const OrganData = ref([])
const membersAllNum = ref(0);

const getOrganAllNum = async () => {
  const res = await organizationListService();
  if (res && Array.isArray(res.data)) {
    OrganData.value = res.data;
    organAllNum.value = res.data.length;
    console.log('组织总数量：', organAllNum.value)
  }
  for (const item of OrganData.value) {
    const organId = parseInt(item.organizationId);
    if (!isNaN(organId)) {
      try {
        const res = await memberService(organId);
        if (res && Array.isArray(res.data)) {
          membersAllNum.value += res.data.length;
          console.log('成员数量：', membersAllNum.value);
        }
      } catch (error) {
        console.error('获取成员数量失败：', error);
      }
    }
  }

}
getOrganAllNum();

const meetStatusNoStart = ref(0);
const meetStatusStarting = ref(0);
const meetStatusStarted = ref(0);

const getMeetStatus = () => {
  for (const meeting of meetData.value) {
    if (meeting?.meetingStatus !== undefined) {
      if (meeting.meetingStatus === 1) {
        meetStatusNoStart.value++;
      } else if (meeting.meetingStatus === 2) {
        meetStatusStarting.value++;
      } else if (meeting.meetingStatus === 3) {
        meetStatusStarted.value++;
      }
    } else {
      console.warn(`跳过无效的 meetingStatus 值：`, meeting);
    }
  }
  console.log('未开始 进行中 已结束', meetStatusNoStart.value, meetStatusStarting.value, meetStatusStarted.value);
}
getMeetStatus();


const meetTypeUp = ref(0);
const meetTypeDown = ref(0);
const meetTypeMax = ref(0);

const getMeetType = () => {
  for (const meeting of meetData.value) {
    if (meeting?.meetingType !== undefined) {
      if (meeting.meetingType === 1) {
        meetTypeUp.value++;
      } else if (meeting.meetingType === 2) {
        meetTypeDown.value++;
      } else if (meeting.meetingType === 3) {
        meetTypeMax.value++;
      }
    } else {
      console.warn(`跳过无效的 meetingType 值：`, meeting);
    }
  }
  console.log(`线上: ${meetTypeUp.value}, 线下: ${meetTypeDown.value}, 混合: ${meetTypeMax.value}`);
}
getMeetType();


const attendStatsNoSign = ref(0)
const attendStatsNo = ref(0)
const attendStatsYes = ref(0)

const getAttendStats = async () => {
  for (const meeting of meetData.value) {
    const meetingId = parseInt(meeting.meetingId);
    if (!isNaN(meetingId)) {
      try {
        const res = await attendsListService(meetingId)
        if (res && Array.isArray(res.data)) {
          for (const item of res.data) {
            if (item.attendanceStatus != undefined) {
              if (item.attendanceStatus == 1) {
                attendStatsNoSign.value++;
              } else if (item.attendanceStatus == 2) {
                attendStatsNo.value++;
              } else if (item.attendanceStatus == 3) {
                attendStatsYes.value++;
              }
            }
          }
        }
      } catch (error) {
        ElMessage.error('获取参会状态失败', error)
      }
    }
  }
  console.log('未设置签到  未签到  已签到:', attendStatsNoSign.value, attendStatsNo.value, attendStatsYes.value)
}
getAttendStats();

const topicHotNum = ref(0);
const topicInterestNum = ref(0);
const topicScoreNum = ref(0);

const topicHotData = ref([])
const topicInterestData = ref([])
const topicScoreData = ref([])

const getTopicSort = async () => {
  for (const meeting of meetData.value) {
    const meetingId = parseInt(meeting.meetingId);
    if (!isNaN(meetingId)) {
      try {
        // 热度信息
        const topicHotRes = await sortTopicHotService(meetingId);
        if (topicHotRes && Array.isArray(topicHotRes.data)) {
          topicHotData.value = [...topicHotData.value, ...topicHotRes.data];
        } else {
          console.warn(`会议 ID ${meetingId} 的热度信息为空或不符合预期：`, topicHotRes);
        }

        // 兴趣信息
        const topicInterRes = await sortTopicInterService(meetingId);
        if (topicInterRes && Array.isArray(topicInterRes.data)) {
          topicInterestData.value = [...topicInterestData.value, ...topicInterRes.data];
        } else {
          console.warn(`会议 ID ${meetingId} 的兴趣信息为空或不符合预期：`, topicInterRes);
        }

        // 评分信息
        const topicScoreRes = await sortTopicScoreService(meetingId);
        if (topicScoreRes && Array.isArray(topicScoreRes.data)) {
          topicScoreData.value = [...topicScoreData.value, ...topicScoreRes.data];
        } else {
          console.warn(`会议 ID ${meetingId} 的评分信息为空或不符合预期：`, topicScoreRes);
        }
      } catch (error) {
        console.error(`获取会议 ID ${meetingId} 的议程排序失败：`, error);
      }
    } else {
      console.warn(`跳过无效的会议 ID：${meeting.meetingId}`);
    }
  }

  console.log('热度信息：', topicHotData.value);
  console.log('兴趣信息：', topicInterestData.value);
  console.log('评分信息：', topicScoreData.value);

};
getTopicSort();

// 定时更新数据（模拟实时）
setInterval(() => {
  // 这里可以替换为真实的接口调用
  stats.value.meetingStats.totalMeetings += Math.floor(Math.random() * 5)
}, 5000)


// 格式化时间
const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleDateString()
}

// 注册自定义图形（需在全局注册一次）
const registerCustomShapes = () => {
  // 左侧图形
  const leftRect = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
      width: 30,
      zWidth: 8,
      zHeight: 4
    },
    buildPath: function (ctx, shape) {
      const api = shape.api;
      const xAxisPoint = api.coord([shape.xValue, 0]);
      const p0 = [shape.x - shape.width / 2, shape.y - shape.zHeight];
      const p2 = [xAxisPoint[0] - shape.width / 2, xAxisPoint[1]];
      const p3 = [xAxisPoint[0] + shape.width / 2, xAxisPoint[1]];
      const p4 = [shape.x + shape.width / 2, shape.y];

      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p4[0], p4[1]);
      ctx.closePath();
    }
  });

  // 右侧图形
  const rightRect = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
      width: 30,
      zWidth: 20,
      zHeight: 8
    },
    buildPath: function (ctx, shape) {
      const api = shape.api;
      const xAxisPoint = api.coord([shape.xValue, 0]);
      // 关键点坐标
      const p3 = [xAxisPoint[0] + shape.width / 2, xAxisPoint[1]];
      const p4 = [shape.x + shape.width / 2, shape.y];
      const p5 = [xAxisPoint[0] + shape.width / 2 + shape.zWidth, xAxisPoint[1]];
      const p6 = [shape.x + shape.width / 2 + shape.zWidth, shape.y - shape.zHeight / 2];
      const p7 = [shape.x - shape.width / 2 + shape.zWidth, shape.y - shape.zHeight];
      const p8 = [shape.x - shape.width / 2, shape.y - shape.zHeight + 3.5]; // 新增连接点

      // 绘制右侧面
      ctx.moveTo(p4[0], p4[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p5[0], p5[1]);
      ctx.lineTo(p6[0], p6[1]);
      ctx.closePath();

      // 绘制顶部封闭区域
      ctx.moveTo(p4[0], p4[1]);
      ctx.lineTo(p6[0], p6[1]);
      ctx.lineTo(p7[0], p7[1]);
      ctx.lineTo(p8[0], p8[1]); // 连接到左侧顶部
      ctx.closePath();

    }
  });

  echarts.graphic.registerShape('leftRect', leftRect);
  echarts.graphic.registerShape('rightRect', rightRect);
};

// 执行注册
registerCustomShapes();


// 颜色配置
const statusColors = [
  [
    { offset: 0, color: 'rgba(70, 130, 180, 0.9)' },
    { offset: 1, color: 'rgba(135, 206, 250, 0.3)' } // 透明度从0.3→0.6
  ],
  [
    { offset: 0, color: 'rgba(255, 165, 0, 0.9)' },
    { offset: 1, color: 'rgba(255, 215, 0, 0.3)' }
  ],
  [
    { offset: 0, color: 'rgba(60, 179, 113, 0.9)' },
    { offset: 1, color: 'rgba(144, 238, 144, 0.3)' }
  ]
];



// 初始化图表
onMounted(async () => {

  await getMeetAllNum() // 等待数据加载完成
  await getTopicAllNum();
  await getOrganAllNum();
  getMeetStatus();
  getMeetType();
  getAttendStats();
  await getTopicSort();




  // 会议状态图表
  // 会议状态图表配置
  const meetingChartInstance = echarts.init(meetingChart.value);
  meetingChartInstance.setOption({
    title: {
      text: '会议状态分布',
      textStyle: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['30%', '55%'], // 内外半径控制立体感
      center: ['50%', '55%'],  // 下移中心点
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4, // 扇形圆角
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b|{b}}\n{d|{d}%}',
        rich: {
          b: {
            fontSize: 12,
            color: '#666',
            padding: [0, 0, 5, 0]
          },
          d: {
            fontSize: 14,
            color: '#333',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
        lineStyle: {
          width: 1.5,
          curveness: 0.3
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: [
        {
          value: meetStatusNoStart.value,
          name: '未开始',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0.5, y2: 1,
              colorStops: [{
                offset: 0, color: '#36D1DC' // 青色
              }, {
                offset: 1, color: '#5B86E5' // 蓝色
              }]
            }
          }
        },
        {
          value: meetStatusStarting.value,
          name: '进行中',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0.5, y2: 1,
              colorStops: [{
                offset: 0, color: '#FFAFBD' // 粉红
              }, {
                offset: 1, color: '#FFC3A0' // 橙色
              }]
            }
          }
        },
        {
          value: meetStatusStarted.value,
          name: '已结束',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0.5, y2: 1,
              colorStops: [{
                offset: 0, color: '#7F7FD5' // 紫色
              }, {
                offset: 1, color: '#86A8E7' // 浅蓝
              }]
            }
          }
        }
      ]
    }]
  });
  // 参会状态图表
  const attendanceChartInstance = echarts.init(attendanceChart.value);
  attendanceChartInstance.setOption({
    title: {
      text: '参会状态分布',
      textStyle: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 14 }
    },
    xAxis: {
      type: 'category',
      data: ['未设置签到', '未签到', '已签到'],
      axisLine: {
        lineStyle: { color: '#666' }
      },
      axisLabel: {
        color: '#444',
        fontWeight: '500',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      },
      // axisLine: { show: false },
      // axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12
      }
    },
    // series: [{
    //   type: 'bar',
    //   data: [
    //     { value: attendStatsNoSign.value, name: '未设置签到' },
    //     { value: attendStatsNo.value, name: '未签到' },
    //     { value: attendStatsYes.value, name: '已签到' }
    //   ],
    //   itemStyle: {
    //     color: {
    //       type: 'linear',
    //       x: 0, y: 0, x2: 1, y2: 0,
    //       colorStops: [{
    //         offset: 0, color: 'rgba(70, 130, 180, 0.8)' // 左侧深色
    //       }, {
    //         offset: 1, color: 'rgba(135, 206, 250, 0.8)' // 右侧浅色
    //       }]
    //     },
    //     borderRadius: [4, 4, 0, 0], // 顶部圆角
    //     shadowColor: 'rgba(0, 0, 0, 0.2)', // 立体阴影
    //     shadowBlur: 6,
    //     shadowOffsetY: 3
    //   },
    //   barWidth: '40%', // 调整柱宽
    //   emphasis: { // 悬停效果
    //     itemStyle: {
    //       shadowOffsetY: 6,
    //       shadowBlur: 10
    //     }
    //   }
    // }],
    series: [{
      type: 'custom',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#666'
      },
      renderItem: function (params, api) {
        // 新增数据校验
        if (!api.value(1)) return;

        const index = api.value(0); // 获取x轴索引
        const value = api.value(1); // 获取实际值

        // 确保颜色索引有效
        const colorIndex = Math.min(index, statusColors.length - 1);

        return {
          type: 'group',
          children: [
            {
              type: 'leftRect',
              shape: {
                api,
                xValue: index,
                yValue: value,
                x: api.coord([index, value])[0],
                y: api.coord([index, value])[1]
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, statusColors[index])
              }
            },
            {
              type: 'rightRect',
              shape: {
                api,
                xValue: index,
                yValue: value,
                x: api.coord([index, value])[0],
                y: api.coord([index, value])[1]
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: statusColors[index][0].color },
                  { offset: 1, color: statusColors[index][1].color.replace(/0\.\d+\)$/, '0.4)') }
                ])
              }
            }
          ]
        };
      },
      data: [
        [0, attendStatsNoSign.value],
        [1, attendStatsNo.value],
        [2, attendStatsYes.value]
      ]
    }],

    grid: { // 图表边距
      top: '20%',
      right: '5%',
      bottom: '15%',
      left: '10%'
      // containLabel: true
    }
  });

  // 会议类别图表
  // 会议类别雷达图配置
  const meetingTypeChartInstance = echarts.init(meetingTypeChart.value);
  meetingTypeChartInstance.setOption({
    title: {
      text: '会议类别分布',
      textStyle: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    radar: {
      indicator: [
        { name: '线上会议', max: Math.max(meetTypeUp.value, 10) },
        { name: '线下会议', max: Math.max(meetTypeDown.value, 10) },
        { name: '混合会议', max: Math.max(meetTypeMax.value, 10) }
      ],
      shape: 'polygon',
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.2)', 'rgba(200,200,200,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(100, 100, 100, 0.5)'
        }
      }
    },
    series: [{
      type: 'radar',
      itemStyle: {
        borderRadius: 3
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        opacity: 0.6
      },
      label: {
        show: true,
        formatter: function (params) {
          return params.value + '%';
        },
        color: '#666',
        fontSize: 12, fontWeight: 'bold'
      },
      data: [
        {
          name: '线上',
          value: [meetTypeUp.value, meetTypeDown.value, meetTypeMax.value],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#36D1DC' }, // 青色
              { offset: 1, color: '#5B86E5' }  // 蓝色
            ])
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#36D1DC88' },
              { offset: 1, color: '#5B86E588' }
            ])
          },
          lineStyle: {
            color: '#36D1DC'
          }
        },
        {
          name: '线下',
          value: [0, meetTypeDown.value, 0],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#FFAFBD' }, // 粉红
              { offset: 1, color: '#FFC3A0' }  // 橙色
            ])
          },
          lineStyle: {
            color: '#FFAFBD'
          }
        },
        {
          name: '混合',
          value: [0, 0, meetTypeMax.value],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#7F7FD5' }, // 紫色
              { offset: 1, color: '#86A8E7' }  // 浅蓝
            ])
          },
          lineStyle: {
            color: '#7F7FD5'
          }
        }
      ]
    }]
  });

})
</script>

<template>
  <div class="dashboard">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <h3>会议</h3>
        <div class="dual-data">
          <div class="data-item">
            <div class="value">{{ meetAllNum }}</div>
            <h4><el-icon>
                <Document />
              </el-icon>总数量</h4>
          </div>
          <div class="data-item">
            <div class="value">{{ meetStartNum }}</div>
            <h4><el-icon>
                <FolderChecked />
              </el-icon>已召开</h4>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <h3>阅读</h3>
        <div class="dual-data">
          <div class="data-item">
            <div class="value">{{ topicAllNum }}</div>
            <h4><el-icon>
                <Document />
              </el-icon>总数量</h4>
          </div>
          <div class="data-item">
            <div class="value">{{ topicClikNum }}</div>
            <h4><el-icon>
                <FolderChecked />
              </el-icon>阅读数</h4>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <h3>组织</h3>
        <div class="single-data">
          <div class="value">{{ organAllNum }}</div>
          <h4><el-icon>
              <Document />
            </el-icon>总数量</h4>
        </div>
      </div>

      <div class="stat-card">
        <h3>用户</h3>
        <div class="single-data">
          <div class="value">{{ membersAllNum }}</div>
          <h4><el-icon>
              <Star />
            </el-icon>活跃数</h4>
        </div>
      </div>

    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 会议状态分布 -->
      <div class="chart-box">
        <div ref="attendanceChart" style="width: 100%; height: 300px;">
        </div>
      </div>

      <!-- 参会状态分布 -->
      <div class="chart-box">
        <div ref="meetingChart" style="width: 100%; height: 300px;"></div>
      </div>

      <div class="chart-box">
        <div ref="meetingTypeChart" style="width: 100%; height: 300px;"></div>
      </div>
    </div>
  </div>



  <!-- 实时数据 -->
  <!--     <div class="realtime-data">
      <h3>实时动态</h3>
      <ul>
        <li v-for="meeting in recentMeetings" :key="meeting.meetingId">
          {{ meeting.meetingName }} - {{ formatTime(meeting.startTime) }}
        </li>
      </ul>
    </div> -->


  <!--   <div class="lists-container">
    <div class="realtime-data">
      <h3>议题热度排行</h3>
      <el-table :data="topicHotData" style="width: 86.5%" stripe highlight-current-row class="data-table">
        <el-table-column label="话题名称" width="200" prop="topicName"></el-table-column>
        <el-table-column label="话题热度" width="120" prop="clickCount"></el-table-column>
        <template #empty>
          <el-empty description="没有数据" />
        </template>
</el-table>
</div>
<div class="realtime-data">
  <h3>议题推荐排行</h3>
  <el-table :data="topicInterestData" style="width: 86.5%" stripe highlight-current-row class="data-table">
    <el-table-column label="话题名称" width="200" prop="topicName"></el-table-column>
    <el-table-column label="推荐指数" width="120" prop="totalScore"></el-table-column>
    <template #empty>
          <el-empty description="没有数据" />
        </template>
  </el-table>
</div>
<div class="realtime-data">
  <h3>议题推荐排行</h3>
  <el-table :data="topicScoreData" style="width: 86.5%" stripe highlight-current-row class="data-table">
    <el-table-column label="话题名称" width="200" prop="topicName"></el-table-column>
    <el-table-column label="话题评分" width="120" prop="totalScore"></el-table-column>
    <template #empty>
          <el-empty description="没有数据" />
        </template>
  </el-table>
</div>
</div> -->
  <div class="lists-container">
    <!-- 热度排行 -->
    <div class="realtime-data">
      <h3>🔥 热点议题排行</h3>
      <div class="ranking-list">
        <div v-for="(item, index) in topicHotData" :key="index" class="ranking-item">
          <div class="rank-marker" :class="['gold', 'silver', 'bronze'][index]">{{ index + 1 }}</div>
          <div class="rank-content">
            <div class="topic-name">{{ item.topicName }}</div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${(item.clickCount / (Math.max(...topicHotData.map(t => t.clickCount)) || 1)) * 100}%` }"></div>
              <span class="count">{{ item.clickCount }} 次阅读</span>
            </div>
          </div>
        </div>
        <el-empty v-if="!topicHotData.length" description="暂无数据" />
      </div>
    </div>

    <!-- 推荐排行 -->
    <div class="realtime-data">
      <h3>🌟 兴趣推荐排行</h3>
      <div class="ranking-list">
        <div v-for="(item, index) in topicInterestData" :key="index" class="ranking-item">
          <div class="rank-marker">{{ index + 1 }}</div>
          <div class="rank-content">
            <div class="topic-name">{{ item.topicName }}</div>
            <div class="star-rating">
              <el-rate v-model="item.totalScore" disabled :max="8" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                disabled-void-color="#C0C4CC" />
              <span class="score">{{ item.totalScore.toFixed(1) }}</span>
            </div>
          </div>
        </div>
        <el-empty v-if="!topicInterestData.length" description="暂无数据" />
      </div>
    </div>

    <!-- 评分排行 -->
    <div class="realtime-data">
      <h3>⭐ 质量评分排行</h3>
      <div class="ranking-list">
        <div v-for="(item, index) in topicScoreData" :key="index" class="ranking-item">
          <div class="rank-marker">{{ index + 1 }}</div>
          <div class="rank-content">
            <div class="topic-name">{{ item.topicName }}</div>
            <div class="score-bar">
              <div class="bar-container">
                <div class="score-fill" :style="{ width: `${(item.totalScore / 5) * 100}%` }"></div>
              </div>
              <span class="score-value">{{ item.totalScore.toFixed(1) }}</span>
            </div>
          </div>
        </div>
        <el-empty v-if="!topicScoreData.length" description="暂无数据" />
      </div>
    </div>
  </div>

</template>



<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 24px;
  border-radius: 16px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  position: relative;
}

/* 悬停动效 */
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-card h3 {
  color: #666;
  margin-bottom: 10px;
}

.stat-card .value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}



.realtime-data {
  margin-top: 5px;




  background: rgba(173, 216, 230, 0.1);
  /* 浅蓝色背景 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.realtime-data ul {
  list-style: none;
  padding: 0;
}

.realtime-data li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* 卡片样式 */
.dashboard {
  padding: 20px;
  background: #f5f7fa;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 0 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

h3 {
  margin-bottom: 4px;
  /* 缩小标题间距 */
  font-size: 16px;

  &::after {
    bottom: -2px;
    /* 上移装饰线 */
    height: 1.0px;
    /* 减细线条 */
  }
}

/* 渐变背景设置 */
/* 会议卡片 */
.stat-card:nth-child(1) {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.15), rgba(64, 158, 255, 0.1));
}

.stat-card:nth-child(1) .value {
  color: #409EFF;
}

.stat-card:nth-child(1) h3 {
  color: #409EFF;
}

.stat-card:nth-child(1) .el-icon {
  color: #409EFF;
}


/* 阅读卡片 */
.stat-card:nth-child(2) {
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.15), rgba(103, 194, 58, 0.1));
}

.stat-card:nth-child(2) .value {
  color: #67C23A;
}

.stat-card:nth-child(2) h3 {
  color: #67C23A;
}

.stat-card:nth-child(2) .el-icon {
  color: #67C23A;
}

/* 组织卡片 */
.stat-card:nth-child(3) {
  background: linear-gradient(135deg, rgba(153, 50, 204, 0.15), rgba(153, 50, 204, 0.1));
}

.stat-card:nth-child(3) .value {
  color: #9932CC;
}

.stat-card:nth-child(3) h3 {
  color: #9932CC;
}

.stat-card:nth-child(3) .el-icon {
  color: #9932CC;
}

/* 用户卡片 */
.stat-card:nth-child(4) {
  background: linear-gradient(135deg, rgba(255, 159, 64, 0.15), rgba(255, 159, 64, 0.1));
}

.stat-card:nth-child(4) .value {
  color: #FFA040;
}

.stat-card:nth-child(4) h3 {
  color: #FFA040;
}

.stat-card:nth-child(4) .el-icon {
  color: #FFA040;
}

/* 前两个卡片双列布局 */
.stat-card:nth-child(1),
.stat-card:nth-child(2) {
  display: flex;
  flex-direction: column;
}

/* 标题样式 */
.stat-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  position: relative;
  padding-left: 10px;
}


/* 双数据容器样式 */
.stat-card>div {
  flex: 2;
  display: flex;
  gap: 10px;
}

/* 单数据居中样式 */
.stat-card:nth-child(3)>div,
.stat-card:nth-child(4)>div {
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* 双数据容器 */
.dual-data {
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 0 0;
}

/* 单数据容器 */
.single-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 0;
}

/* 数据项通用样式 */
.data-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
  /* 压缩内容区块内边距 */
}

/* 前两个卡片数据项 */
.stat-card:nth-child(-n+2) .data-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(4px);
}

.data-item {
  padding: 12px;
}

/* 数值样式 */
.value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4px;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card>div>div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card .value {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 0px;
}

.h4 {
  margin-top: 0;
  gap: 6px;
  /* 缩小图标与文字间距 */
  font-size: 14px;
  line-height: 1.0;
}

/* 数值颜色 */
.stat-card:nth-child(1) .value {
  color: #409EFF;
}

.stat-card:nth-child(2) .value {
  color: #67C23A;
}

.stat-card:nth-child(3) .value {
  color: #9932CC;
}

.stat-card:nth-child(4) .value {
  color: #FFA040;
}

.stat-card:nth-child(1) h4 {
  color: #409EFF;
}

.stat-card:nth-child(2) h4 {
  color: #67C23A;
}

.stat-card:nth-child(3) h4 {
  color: #9932CC;
}

.stat-card:nth-child(4) h4 {
  color: #FFA040;
}

.stat-card:nth-child(1) h3 {
  color: #409EFF;
}

.stat-card:nth-child(2) h3 {
  color: #67C23A;
}

.stat-card:nth-child(3) h3 {
  color: #9932CC;
}

.stat-card:nth-child(4) h3 {
  color: #FFA040;
}

/* 标签样式 */
.stat-card h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

/* 图标样式 */
.stat-card .el-icon {
  font-size: 20px;
  padding: 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
}


/* 图表容器调整 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 5px;
}

.chart-box {
  background: rgba(173, 216, 230, 0.1);
  /* 浅蓝色背景 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 实时数据区域 */
.lists-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  background: rgba(173, 216, 230, 0.1);
  /* 浅蓝色背景 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.realtime-data {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.realtime-data h3 {
  margin-bottom: 15px;
  color: #333;
}

/* 排行列表通用样式 */
.ranking-list {
  padding: 12px 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.ranking-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 排名标识 */
.rank-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 16px;
  color: #909399;
}

.gold {
  background: linear-gradient(45deg, #FFD700, #FFC125);
  color: #fff !important;
}

.silver {
  background: linear-gradient(45deg, #C0C0C0, #D3D3D3);
  color: #fff !important;
}

.bronze {
  background: linear-gradient(45deg, #CD7F32, #B87333);
  color: #fff !important;
}

/* 内容区域 */
.rank-content {
  flex: 1;
  min-width: 0;
}

.topic-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 进度条样式 */
.progress-bar {
  position: relative;
  height: 24px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  transition: width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.count {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 星级评分 */
.star-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star-rating :deep(.el-rate__icon) {
  font-size: 16px;
}

.score {
  font-weight: 600;
  color: #F7BA2A;
}

/* 评分条 */
.score-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFAFBD 0%, #FFC3A0 100%);
  transition: width 0.8s ease;
}

.score-value {
  font-weight: 600;
  color: #FF7F50;
}
</style>