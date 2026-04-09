// mockData.js
export const mockStats = {
    userStats: {
      totalUsers: 156,
      activeUsers: 120,
    },
    meetingStats: {
      totalMeetings: 45,
      upcomingMeetings: 8,
      ongoingMeetings: 12,
      completedMeetings: 25,
    },
    organizationStats: {
      totalOrganizations: 23,
      avgMembersPerOrg: 6,
    },
    attendanceStats: {
      totalAttendance: 680,
      attendanceStatus: {
        attended: 420,
        absent: 120,
        pending: 140,
      },
    },
    meetingTypeStats: {
      meetingTypeStats: { // 新增会议类型统计字段
        online: 60,
        offline: 30,
        hybrid: 10
      }
    },
  }
  
  export const recentMeetingsMock = [
    {
      meetingId: 1,
      meetingName: "季度总结会议",
      startTime: "2024-03-15T14:00:00"
    },
    {
      meetingId: 2,
      meetingName: "产品需求评审",
      startTime: "2024-03-16T10:00:00"
    }
  ]


  //议程创建
  // src/mock/mockData.js
export const sampleQuestions = [
  "帮我生成技术研讨会议程",
  "创建产品发布会模板",
  "生成部门周会结构",
  "制作培训会议大纲",
  "设计线上会议流程"
];

export const sampleReplies = {
  default: `好的，已为您生成一个专业会议模板：
1. 开场致辞（14:00-14:10） - 主持人致辞，介绍会议主题
2. 主题演讲（14:10-14:40） - 主讲人分享核心内容
3. 互动讨论（14:40-15:20） - 分组进行专题讨论
4. 茶歇交流（15:20-15:40） - 自由交流与茶歇时间
5. 总结汇报（15:40-16:20） - 各组代表汇报讨论成果
6. 闭幕致辞（16:20-16:30） - 主持人总结会议成果`
};