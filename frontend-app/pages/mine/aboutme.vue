<template>
  <view class="cyber-container">
    <!-- 主视觉区 -->
    <view class="cyber-header">
      <view class="hologram-effect"></view>
      <text class="cyber-title">西湖论剑·2025</text>
      <text class="cyber-subtitle">数字安全峰会</text>
    </view>
 
    <!-- 动态卡片系统 -->
    <view class="card-system">
      <view 
        v-for="(card, index) in cards" 
        :key="index" 
        class="cyber-card"
        :style="{ '--delay': index * 0.1 + 's' }"
        @touchstart="handleHover"
        @touchend="handleLeave"
      >
        <view class="card-border"></view>
        <view class="card-content">
          <view class="icon-wrapper">
            <u-icon 
              :name="card.icon"  
              size="48" 
              :color="getIconColor(card.type)" 
              class="neon-icon"
            />
          </view>
          <view class="text-container">
            <text class="card-title">{{ card.title  }}</text>
            <text class="card-desc">{{ card.desc  }}</text>
          </view>
        </view>
      </view>
    </view>
 
    <!-- 动态粒子背景 -->
    <view class="particle-canvas"></view>
  </view>
</template>
 
<style lang="scss" scoped>
.cyber-container {
  padding: 40rpx;
  background: radial-gradient(circle at 50% 10%, #0a0c27 0%, #020617 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
 
.cyber-header {
  position: relative;
  padding: 80rpx 0;
  text-align: center;
  .hologram-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600rpx;
    height: 600rpx;
    background: radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 60%);
    transform: translate(-50%, -50%);
    animation: hologram 8s infinite linear;
  }
  .cyber-title {
    display: block;
    font-size: 64rpx;
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: 8rpx;
  }
  .cyber-subtitle {
    font-size: 36rpx;
    color: rgba(255,255,255,0.8);
    text-shadow: 0 0 20rpx rgba(76, 175, 255, 0.5);
  }
}
 
.card-system {
  position: relative;
  z-index: 2;
}
 
.cyber-card {
  position: relative;
  margin-bottom: 40rpx;
  border-radius: 24rpx;
  background: rgba(16, 18, 37, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 255, 0.15);
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: cardEntrance 0.6s ease-out forwards;
  animation-delay: var(--delay);
  
  .card-border {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2rpx;
    background: linear-gradient(135deg, rgba(76, 175, 255, 0.3) 0%, transparent 50%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  }
 
  .card-content {
    padding: 40rpx;
    display: flex;
    gap: 32rpx;
    align-items: center;
 
    .icon-wrapper {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        width: 80rpx;
        height: 80rpx;
        background: rgba(76, 175, 255, 0.1);
        border-radius: 50%;
        filter: blur(20rpx);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
 
    .neon-icon {
      filter: drop-shadow(0 0 12rpx currentColor);
    }
 
    .text-container {
      flex: 1;
      .card-title {
        font-size: 36rpx;
        color: #fff;
        font-weight: 600;
        margin-bottom: 16rpx;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          bottom: -8rpx;
          left: 0;
          width: 60rpx;
          height: 2rpx;
          background: linear-gradient(90deg, #4facfe 0%, transparent 100%);
        }
      }
      .card-desc {
        font-size: 28rpx;
        color: rgba(255,255,255,0.7);
        line-height: 1.6;
      }
    }
  }
 
  &:active {
    transform: translateY(4rpx);
    background: rgba(16, 18, 37, 0.8);
  }
}
 
@keyframes hologram {
  0% { opacity: 0.8; transform: translate(-50%, -50%) rotate(0deg); }
  50% { opacity: 0.3; }
  100% { opacity: 0.8; transform: translate(-50%, -50%) rotate(360deg); }
}
 
@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(40rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
 
<script>
export default {
  data() {
    return {
      cards: [
        {
          icon: 'scan',
          type: 'info',
          title: '数字安全峰会',
          desc: '中国数字安全领域年度盛会，汇聚全球顶尖专家，探讨AI安全、数据隐私、物联网防护等前沿议题'
        },
        {
          icon: 'bookmark',
          type: 'highlight',
          title: '技术风向标',
          desc: '深度解析量子加密、区块链防御、AI对抗攻击等创新技术，展示最新安全解决方案'
        },
        {
          icon: 'clock',
          type: 'history',
          title: '十年征程',
          desc: '自2012年创办以来，累计吸引超过5万名专业人士，发布行业白皮书12部，制定标准23项'
        }
      ]
    }
  },
  methods: {
    getIconColor(type) {
      const colors = {
        info: '#4facfe',
        highlight: '#ff6b6b',
        history: '#a66cff'
      }
      return colors[type] || '#4facfe'
    },
    handleHover(e) {
      const query = uni.createSelectorQuery().in(this) 
      query.select('.cyber-card').boundingClientRect(data  => {
        // 实现悬停放大效果 
      }).exec()
    }
  }
}
</script>