<template>
    <div id="my">
		<div class="hasHon">
			<div class="hastips">
				<p>已获得</p>
				<p>{{redB}}<span>元</span></p>
				<p>悄悄告诉你：</p>
				<p>发送给好友<br/>
				好友获得红包的同时<br/>
				你的红包也会裂变哦！
                </p>
			</div>
				<button class="share" @click="share">分享给好友</button>
				<p class="ttip">余额已存入您的账户</p>
		</div>
        <counttime />
        <div class="friend">
            <img src="../assets/help-txt.png">
            <ul v-if="opensH" >
                <li v-for="item in logs">用户{{item.username}}<span>{{item.money}}元</span><span>{{item.time}}</span></li>
            </ul>
            <p class="noneHon" v-else>
                还没有好友拆红包哦<br/>
                快去邀请更多吧
            </p>
        </div>
        <div class="mask" v-if="shareF">
			<img src="../assets/goShare.png">
		</div>
    </div>
</template>
<script>
   import axios from 'axios'
   import wexin from '../common/js/jweixin-1.0.0.js'
   import counttime from './counttime'
    export default{
        name:'my',
        data(){
            return{
                shareF:false,
                opensH:true,
                logs:[],
                redB:0
            }
        },
        methods:{
            isWeixinBrowser() {
                let agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                } else {
                    return false;
                }
            },
            share(){
                if(this.isWeixinBrowser()){
                    this.shareF=true;
                }else{
                    alert('请到微信中打开，分享好友领取红包')
                }
                
            }
        },
        components:{
            counttime:counttime
        },
        created(){
            axios.get('/jiekou/getredinfo.php',{
                params:{
                   uid:localStorage.getItem('userd'),
                   arid:localStorage.getItem('arid'),
                }
            }).then(response=>{
                let res=response.data
                if(res.status==200){
                    this.redB=res.data.price
                    localStorage.setItem('prid',res.data.id)
                    if(!res.data.log.length){
                        this.opensH=false
                    }else{
                        let arr=[]
                        res.data.log.map(r=>{
                            let obj={}
                            obj.username=r.mobile
                            obj.time=r.createtime
                            obj.money=r.price
                            arr.push(obj)
                        })
                        this.logs=arr
                    }
                }
            })
          
           //执行微信判断
           if(this.isWeixinBrowser()){
               axios.get('/jiekou/wxshare/share.php',{
                   params:{
                       url:document.URL.split('#')[0]
                   }
               }).then(res=>{
                   console.log(res)
                   let timestamp=res.data.timestamp
                   let nonceStr=res.data.nonceStr
                   let signature=res.data.signature
                   wx.config({
                       debug: false, 
                        appId: '公众号的appid', 
                        timestamp: timestamp, // 必填，生成签名的时间戳
                        nonceStr: nonceStr, // 必填，生成签名的随机串
                        signature: signature,// 必填，签名，见附录1
                        jsApiList: [  'onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                   })
               });
              wx.ready(function(){
                  wx.hideMenuItems({
                    menuList: ['menuItem:share:qq','menuItem:share:QZone'] // 要隐藏的菜单项
                });
                    wx.onMenuShareAppMessage({
                        title: '多美康商城',
                        desc: '拆红包，共幸运',
                        link: 'https://m.bonahe.com/dmk-mall/activity/share-middle.html',
                        //imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                        trigger: function (res) {
                        },
                        success: function (res) {
                            
                        },
                        cancel: function (res) {
                            
                        },
                        fail: function (res) {
                           
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: '多美康商城',
                        link: 'https://m.bonahe.com/dmk-mall/activity/share-middle.html',
                        //imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                        trigger: function (res) {
                        },
                        success: function (res) {
                            
                        },
                        cancel: function (res) {
                            
                        },
                        fail: function (res) {
                            
                        }
                    });
              });
           }
        }
    }
</script>
<style>
.jies{text-align: center;line-height: 1.5rem;color: #fff;font-size: 0.375rem;}
		.noneHon{text-align: center;padding: 1rem;color: #fff;font-size: 0.4rem;}
		.mask{background: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0;height: 100%;width: 100%;z-index: 14;}
		.mask img{width: 5rem;float: right;margin: 0.3rem;}
</style>
