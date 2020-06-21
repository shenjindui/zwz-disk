<template>
	<div style="height: 100%;background:white;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<span class="logo">
					<img src="../../assets/img/logo.png" />
				</span>
			</el-header>
			<el-main style="height: 100%;box-sizing: border-box;">
				<router-view></router-view>
    		</el-main>
		</el-container>
	</div>
</template>

<script>
	
</script>

<style scoped>
	.header{
		background: white;
		/*box-shadow: 0 6px 0 rgba(0,0,0,.05);
		z-index: 11111;*/
		border-bottom: 1px solid #f4f4f4;
		box-shadow: 0px 3px 3px rgba(0,0,0,.05);
		z-index: 1111;
	}
	.logo{
		display: inline-block;
		height: 60px;
		line-height: 60px;
	}
	.logo img{
		vertical-align: middle;
	}
</style>
