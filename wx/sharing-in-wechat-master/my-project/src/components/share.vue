<template>
    <div id="share">
    	<div class="hasno" v-if="open">
			<img src="../assets/wei.png" @click="openH">
		</div>
		<div class="bindCall" v-else>
			<img src="../assets/phone-txt.png">
			<input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone">
			<input type="text" placeholder="请输入验证码" v-model="code" maxlength="4"><button @click="getCode">{{getcode}}</button>
			<p class="text">输入手机号后，将会直接注册为多美康商城会员，可通过手
                机验证码直接登陆
            </p>
			<p class="getHon"><button @click="getH">领取红包</button></p>
		</div>
        <counttime />
    </div>
</template>
<script>
    import axios from 'axios'
	import counttime from './counttime'
    export default{
        name:'share',
		components:{
			counttime:counttime
		},
		data(){
			return{
				open:true,
				phone:'',
				code:'',
				getcode:'获取验证码',
				disab:false
			}
		},
		methods:{
             openH(event){
				 event.preventDefault()
				 this.open=false;
			 },
			 getH(){
				 if(!/\d{11}/.test(this.phone)){
					return ;
				 }
				 if(!/\d{4}/.test(this.code)){
					 return;
				 }
				 axios.get('/jiekou/redpacket/sharered.php',{
					 params:{
						 mobile: this.phone,
						varye: this.code,
						openid:sessionStorage.getItem('openid'),
						type: '2',
						puid: localStorage.getItem('ppuid'),
						prid: localStorage.getItem('pprid'),
						arid: localStorage.getItem('parid')
					 }
				 }).then(res=>{
					 if(res.data.status==200){
						 localStorage.setItem('userd',res.data.data.uid);
						 localStorage.setItem('arid',res.data.data.arid);
						 this.$router.push('my');
					 }else{
						 alert(res.data.message);
					 }
				 })
			 },
			 getCode(){
				 if(this.disab){
					 return
				 }
                 if(!/\d{11}/.test(this.phone)){
					 alert('请输入正确手机号码！')
				 }else{
					 axios.get('/jiekou/pingtai.php',{
						 params:{
                             mobile:this.phone
						 }
					 }).then(res=>{
                         if(res.data.status==200){
							 this.disab=true
							let con=300;
							let timer=setInterval(function(){
								    con--;
								   this.getcode=con+'s后获取';
								    if(con==0){
								    	clearInterval(timer);
								    	this.getcode="获取验证码"
										this.disab=false
								    }
							    },1000)
						 }
					 })
				 }
			 }
		}
    }
</script>
<style>
.jies{text-align: center;line-height: 1.5rem;color: #fff;font-size: 0.375rem;}
		.noneHon{text-align: center;padding: 1rem;color: #fff;font-size: 0.4rem;}
		.bindCall img{
			width: 50%;margin-left: 25%;
		}
		.bindCall{
			padding:0.3rem;color: #fff;font-size: 0.375rem;
			background: rgba(255,255,255,0.5);border-radius: 20px;width: 8.4rem;
			margin: 0.8rem auto;
		}
		.bindCall input{text-indent:1em;height: 1.2rem;line-height: 1.2rem;font-size: 0.375rem;border-radius:10px;border: none;margin-top: 0.3rem;}
		.bindCall input:nth-of-type(1){width: 8rem;}
		.bindCall input:nth-of-type(2){width: 3rem;}
		.bindCall button{
			background-color: #ffcd46;
	border-radius: 10px;
	color: #c22100;
	border: none;
		}
		.bindCall button:nth-of-type(1){
			height: 1.2rem;
			line-height: 1.2rem;
			padding: 0 20px;
			margin-left: 0.3rem;
		}
		.getHon button{
			height: 0.8rem;
			line-height:0.8rem;
			width: 5rem;
			text-align: center;
			font-size: 0.42rem;
		}
		.getHon{text-align: center;line-height: 2rem;}
		.text{color: #fff;font-size: 0.35rem;margin: 0.2rem 0;}
</style>