<template>
  <view class="container">
    <view class="org-list">
      <view 
        v-for="org in organizations"
        :key="org.organizationId"
        class="org-card"
        :class="{expanded: org.isExpanded}"
        @click="toggleOrganization(org)"
      >
        <view class="org-header">
          <view class="org-icon">
            <u-icon name="home" color="#5B8FF9" size="36rpx"></u-icon>
          </view>
          <view class="org-meta">
            <text class="org-name">{{ org.organizationName }}</text>
			<br />
            <text class="org-desc">{{ org.organizationDescribe }}</text>
          </view>
          <u-icon
            :name="org.isExpanded ? 'arrow-up' : 'arrow-down'"
            color="#909399"
            size="28rpx"
          ></u-icon>
        </view>

        <!-- 成员列表 -->
        <view v-if="org.isExpanded" class="member-container">
          <view v-if="loadingMembers" class="loading-wrap">
            <u-loading-icon text="加载中" color="#5B8FF9"></u-loading-icon>
          </view>
          <template v-else>
            <view class="member-list">
              <view
                v-for="member in org.members"
                :key="member.userId"
                class="member-card"
              >
                <image
                  class="member-avatar"
                  :src="member.userPic || '/static/avatar-default.png'"
                  mode="aspectFill"
                />
                <view class="member-info">
                  <text class="member-name">{{ member.username }}</text>
                  <view class="member-details">
                    <view class="detail-item">
                      <u-icon name="account" size="28rpx" color="#7A7E89"></u-icon>
                      <text class="detail-text">{{ member.account }}</text>
                    </view>
                    <view class="detail-item">
                      <u-icon name="email" size="28rpx" color="#7A7E89"></u-icon>
                      <text class="detail-text">{{ member.email }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import {
  myOrganizationsService,
  organizationMemberService
} from '@/api/meeting.js'
import { findByIdService } from '@/api/user.js'

// 组织列表数据
const organizations = ref([])
// 加载状态
const loadingMembers = ref(false)

// 初始化加载组织列表
onMounted(async () => {
  try {
    const res = await myOrganizationsService()
    organizations.value = res.data.map(org => ({
      ...org,
      isExpanded: false,
      members: []
    }))
  } catch (error) {
    console.error('加载组织列表失败:', error)
  }
})

// 切换组织展开状态
const toggleOrganization = async org => {
  org.isExpanded = !org.isExpanded
  if (org.isExpanded && !org.members.length) {
    await loadOrganizationMembers(org)
  }
}

// 加载组织成员
const loadOrganizationMembers = async org => {
  try {
    loadingMembers.value = true
    // 获取成员ID列表
    const membersRes = await organizationMemberService(org.organizationId)
    const memberIds = membersRes.data.map(m => m.memberId)
    
    // 并发获取成员详细信息
    const membersPromises = memberIds.map(memberId => findByIdService(memberId))
    const membersResults = await Promise.all(membersPromises)
    
    // 更新成员数据
    org.members = membersResults.map(res => res.data)
  } catch (error) {
    console.error('加载成员失败:', error)
  } finally {
    loadingMembers.value = false
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 24rpx;
  background: #F7F9FC;
  min-height: 100vh;
}

.org-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  
  &.expanded {
    margin-bottom: 12rpx;
  }
}

.org-header {
  display: flex;
  align-items: center;
  padding-bottom: 24rpx;
}

.org-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(91, 143, 249, 0.1);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.org-meta {
  flex: 1;
  margin-left: 24rpx;
  margin-right: 24rpx;
}

.org-name {
  font-size: 32rpx;
  color: #1A1D26;
  font-weight: 600;
  line-height: 1.4;
}

.org-desc {
  font-size: 26rpx;
  color: #7A7E89;
  line-height: 1.5;
  margin-top: 8rpx;
}

.member-container {
  border-top: 1rpx solid #F0F2F5;
  padding-top: 24rpx;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.member-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #FBFCFE;
  border-radius: 16rpx;
  border: 1rpx solid #F0F2F5;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.member-name {
  font-size: 30rpx;
  color: #1A1D26;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 6rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #7A7E89;
}

.loading-wrap {
  padding: 40rpx 0;
  text-align: center;
}

/* 点击动效 */
.org-card:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>