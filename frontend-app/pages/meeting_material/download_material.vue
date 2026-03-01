<template>
	<view class="main">
		<view class="file">
			<view class="file_icon">
				<image :src="iconPath" mode="widthFix"></image>
			</view>
			<view class="file_name">
				<text>{{material.materialName + '.' + material.materialType}}</text>
			</view>
		</view>

		<view class="blank"></view>

		<view class="button_view">
			<button class="download_button" @click="downloadMaterial()" type="primary">下载资料</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"

	let material = ref(null)
	let iconPath = ref("")
	let localMaterialsInfo = ref([])
	const materialIcon = [{
			format: "doc",
			url: "/static/material_icon/doc.png"
		},
		{
			format: "docx",
			url: "/static/material_icon/docx.png"
		},
		{
			format: "java",
			url: "/static/material_icon/java.png"
		},
		{
			format: "jpeg",
			url: "/static/material_icon/jpeg.png"
		},
		{
			format: "jpg",
			url: "/static/material_icon/jpg.png"
		},
		{
			format: "mp3",
			url: "/static/material_icon/mp3.png"
		},
		{
			format: "mp4",
			url: "/static/material_icon/mp4.png"
		},
		{
			format: "pdf",
			url: "/static/material_icon/pdf.png"
		},
		{
			format: "png",
			url: "/static/material_icon/png.png"
		},
		{
			format: "ppt",
			url: "/static/material_icon/ppt.png"
		},
		{
			format: "psd",
			url: "/static/material_icon/psd.png"
		},
		{
			format: "txt",
			url: "/static/material_icon/txt.png"
		},
		{
			format: "xlsx",
			url: "/static/material_icon/xlsx.png"
		},
		{
			format: "zip",
			url: "/static/material_icon/rar.png"
		},
		{
			format: "rar",
			url: "/static/material_icon/rar.png"
		},
		{
			format: "7z",
			url: "/static/material_icon/rar.png"
		},
	]

	onLoad((option) => {
		material.value = JSON.parse(option.material)
		// console.log(material);
		getMaterialIcon()

		let localMaterials = uni.getStorageSync('local_materials')
		console.log(localMaterials);
		if (localMaterials != null && localMaterials.length > 0) {
			localMaterialsInfo.value = localMaterials
		} else {
			uni.setStorageSync("local_materials", "")
		}
	})

	function downloadMaterial() {
		for (let i = 0; i < localMaterialsInfo.value.length; i++) {
			if (localMaterialsInfo.value[i].materialId == material.materialId) {
				uni.showToast({
					icon: "fail",
					title: "已下载该文件"
				})
				return
			}
		}

		uni.showLoading({
			title: "正在下载资料"
		})

		uni.downloadFile({
			url: material.value.materialPath,
			success: (res) => {
				console.log(res.tempFilePath);
				uni.hideLoading()
				uni.saveFile({
					tempFilePath: res.tempFilePath,
					success: (result) => {
						console.log("保存成功", result.savedFilePath);
						uni.showToast({
							icon: "success",
							title: "下载成功"
						})
						console.log(localMaterialsInfo);
						localMaterialsInfo.value.push({
							materialId: material.value.materialId,
							materialLocalPath: result.savedFilePath
						})
						uni.setStorageSync('local_materials', localMaterialsInfo.value)
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					},
					fail: () => {
						console.log("保存失败");
					}
				})
			},
			fail: () => {
				console.log("下载失败");
			}
		})
	}

	function getMaterialIcon() {
		for (let i = 0; i < materialIcon.length; i++) {
			if (material.value.materialType == materialIcon[i].format) {
				iconPath.value = materialIcon[i].url
				break
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100%;
		height: 100%;

		.file {
			width: 90%;
			margin-left: 5%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 25%;

			.file_icon image {
				width: 160rpx;
			}

			.file_name text {
				font-size: 40rpx;
				text-align: center;
				margin-top: 10px;
			}
		}

		.blank {
			height: 45%;
		}

		.button_view {
			width: 100%;

			.download_button {
				width: 90%;
			}
		}
	}
</style>