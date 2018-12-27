<template>
    <div class="cont"><p>活动时间剩余：<span>{{hour}}</span>:<span>{{minu}}</span>:<span>{{sec}}</span>结束</p></div>
</template>
<script>
import format from '../common/js/util.js'
import axios from 'axios'
export default{
    data(){
        return{
            hour:'--',
            minu:'--',
            sec:'--',
        }
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
                    let count=res.data.red.faildtime
                        let timer=setInterval(()=>{
                            count=Number(count)
                            this.hour=format.formattime(Math.floor(count/3600));
                            this.minu=format.formattime(Math.floor(count%3600/60));
                            this.sec=format.formattime(Math.floor(count%60));
                            count-=1
                            if(count<=0){
                                clearInterval(timer)
                            }
                        },1000)
                }
            })
    }
}
</script>