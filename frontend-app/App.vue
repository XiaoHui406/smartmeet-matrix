<script>
	export default {
		onLaunch: function() {
			plus.screen.lockOrientation("portrait-primary")
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">

</style>