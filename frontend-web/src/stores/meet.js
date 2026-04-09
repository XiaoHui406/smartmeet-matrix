import { defineStore } from 'pinia'
import { ref ,computed} from 'vue'
import { meetDetailService } from '@/api/meet'
import dayjs from 'dayjs'

export const useMeetStore = defineStore('meet', () => {
  
  const currentMeeting = ref(null)
  
  const setCurrentMeeting = (meetingData) => {
    currentMeeting.value = {
      ...meetingData,
      enableSign:meetingData.enableSign ,
      signStartTime: dayjs(meetingData.signStartTime).format('YYYY-MM-DD HH:mm:ss'),
      signEndTime: dayjs(meetingData.signEndTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  const fetchMeeting = async (id) => {
    try {
      const res = await meetDetailService(id)
      setCurrentMeeting(res.data)
    } catch (error) {
      console.error('获取会议详情失败:', error)
      throw error
    }
  }

 
  const getSignTimes = computed(() => ({
    enableSign: currentMeeting.value?.enableSign,
    signStart: currentMeeting.value?.signStartTime,
    signEnd: currentMeeting.value?.signEndTime
  }))

  return {
    currentMeeting,
    setCurrentMeeting,
    fetchMeeting,
    getSignTimes
  }
},   { persist: true })