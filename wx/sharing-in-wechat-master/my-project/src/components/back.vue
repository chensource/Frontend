<template>
    <div class="header">
		<span class="g-back" @click="backShop"></span>我的红包
	</div>
</template>
<script>
export default{
    name:'back',
    methods:{
        backShop(){
            location.href="https://m.bonahe.com/dmk-mall/index/index.html"
        }
    }
}
</script>