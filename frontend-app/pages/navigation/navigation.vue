<template>
	<view class="main">
		<web-view :src='meetingLocation'></web-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	let meetingLocation = ""

	onLoad((option) => {
		let getLocation = option.meetingLocation
		console.log(getLocation);
		let data = getLocationData(getLocation)
		console.log(data);
		meetingLocation = '../../static/daohang.html?meetingLocation=' + data.city + "_" + data.keyword
	})

	function getLocationData(location) {
		if (!location.includes('市')) {
			uni.showToast({
				icon: "fail",
				title: "会议地址无效"
			})
			return locationData("error", "error")
		} else {
			let startIndex = 0
			if (location.includes('省')) {
				startIndex = location.indexOf('省') + 1
			}
			console.log('startIndex=' + startIndex);
			let endIndex = location.indexOf('市')
			console.log('endIndex=' + endIndex);
			let city = location.substring(startIndex, endIndex)
			let keyword = location.substring(endIndex + 1)
			return locationData(keyword, city)
		}
	}

	function locationData(keyword, city) {
		return {
			keyword: keyword,
			city: city
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100%;
		height: 100%;
	}
</style>