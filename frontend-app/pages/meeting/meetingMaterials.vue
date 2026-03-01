<template>
  <view class="container">
    <!-- 搜索区域 -->
    <view class="search-section">
      <u-search
        v-model="keyword"
        placeholder="搜索会议/主讲人/文件..."
        shape="square"
        bgColor="#ffffff"
        searchIconColor="#2979ff"
        class="custom-search"
      />
    </view>

    <!-- 资料列表 -->
    <scroll-view scroll-y class="list-container">
      <view class="material-card" v-for="item in filteredMaterials" :key="item.materialId">
        <view class="file-header">
          <image 
            :src="getFileIcon(item.materialType)" 
            class="file-icon"
            mode="aspectFit"
          />
          <text class="file-name">{{ item.materialName }}.{{ item.materialType }}</text>
        </view>
        
        <view class="meeting-info">
          <u-icon name="calendar" size="16" color="#909399"></u-icon>
          <text class="meeting-name">{{meetingDetails[item.meetingId]?.meetingName || '未知会议' }}</text>
        </view>

        <view class="action-buttons">
          <u-button
            text="下载"
            icon="download"
            size="mini"
            color="#2979ff"
            plain
            class="action-btn"
          />
          <u-button
            text="去问AI"
            icon="chat"
            size="mini"
            color="#19be6b"
            plain
            class="action-btn"
          />
        </view>
      </view>

      <u-empty
        v-if="!loading && filteredMaterials.length === 0"
        mode="data"
        icon="/static/logo.png"
        text="暂无会议资料"
      />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  myMeetingMaterialsListService,
  meetingDetailService
} from '@/api/meeting.js'

// 响应式数据
const materials = ref([])
const meetingDetails = ref({})
const keyword = ref('')
const selectedMeetingId = ref('')
const loading = ref(false)

// 获取会议选项
const meetingOptions = computed(() => {
  return [...new Set(materials.value.map(item => item.meetingId))]
    .map(id => ({
      label: meetingDetails.value[id]?.meetingName || `会议${id}`,
      value: id
    }))
})

// 获取资料列表
const loadData = async () => {
  try {
    loading.value = true
    const res = await myMeetingMaterialsListService({})
    materials.value = res.data
    
    // 并行获取所有会议详情
    await Promise.all(res.data.map(async item => {
      if (!meetingDetails.value[item.meetingId]) {
        const detailRes = await meetingDetailService(item.meetingId)
        meetingDetails.value[item.meetingId] = detailRes.data
      }
    }))
  } finally {
    loading.value = false
  }
}

// 文件类型图标映射
const getFileIcon = (type) => {
  const iconMap = {
    pdf: '/static/pdf_icon.png',
    doc: '/static/docx_icon.png',
    docx: '/static/docx_icon.png',
	png:'/static/photo_icon.png',
    jpg: '/static/photo_icon.png',
    jpeg: '/static/photo_icon.png',
    txt: '/static/txt_icon.png',
    ppt: '/static/ppt_icon.png',
    pptx: '/static/ppt_icon.png'
  }
  return iconMap[type.toLowerCase()] || '/static/file_icon.png'
}



// 处理下载
const handleDownload = (item) => {
  uni.showLoading({ title: '功能未实现' })
}

// 搜索逻辑
const filteredMaterials = computed(() => {
  return materials.value.filter(item => {
    const meeting = meetingDetails.value[item.meetingId] || {}
    
    // 会议筛选
    if (selectedMeetingId.value && item.meetingId !== selectedMeetingId.value) {
      return false
    }

    // 关键词搜索
    if (keyword.value) {
      const searchText = [
        item.materialName,
        meeting.meetingName,
        meeting.theme,
        meeting.keyAttendees,
        meeting.generalContent
      ].join(' ').toLowerCase()
      
      return searchText.includes(keyword.value.toLowerCase())
    }
    
    return true
  })
})

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 24rpx;
  background: #f8f9fa;
  min-height: 100vh;
}

.search-section {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);

  .custom-search {
    flex: 1;
  }

  .filter-btn {
    width: 160rpx;
  }
}

.list-container {
  margin-top: 24rpx;
}

.material-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);

  .file-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .file-icon {
      width: 64rpx;
      height: 64rpx;
      margin-right: 20rpx;
    }

    .file-name {
      font-size: 32rpx;
      color: #303133;
      font-weight: 500;
      flex: 1;
    }
  }

  .meeting-info {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
    
    .meeting-name {
      font-size: 26rpx;
      color: #606266;
      margin-left: 12rpx;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .action-btn {
      width: 180rpx;
      border-radius: 8rpx;
    }
  }
}
</style>