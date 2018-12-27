<template>
  <div id="app">
    <back />
    <div class="contain">
			<p class="op-text">
				<img src="./assets/txt.png">
			</p>
			<div class="marquee">
        <ul class="content">
          <li>用户135****5531已拆28.4元</li>
          <li>用户176****1131已拆20.0元</li>
          <li>用户166****0431已拆27.3元</li>
          <li>用户136****5531已拆21.8元</li>
          <li>用户136****0031已拆23.8元</li>
          <li>用户155****5565已拆29.5元</li>
          <li>用户138****3434已拆25.1元</li>
          <li>用户188****1637已拆24.3元</li>
          <li>用户157****0301已拆25.5元</li>
          <li>用户135****5631已拆26.7元</li>
        </ul>
			</div>
			<router-view />
			<div class="rule">
				<img src="./assets/activ-txt.png">
				<p>1. 每个用户首次参加活动即可领取随机金额红包；</p>
        <p>2. 分享至微信和朋友圈，朋友帮拆双方均可获得随机金额红包；</p>
        <p>3. 必须是新用户帮拆才能获得红包，每个用户只能帮拆一次；</p>
        <p>4. 红包可一次累计使用，购物一次清零一次，48小时内使用，过时清零。</p>
        <p>5. 红包使用后可再次参与活动积累红包；</p>
        <p>6. 红包不能与场内其他优惠券同时使用；</p>
        <p>7. 红包使用范围仅限肌芙皙品牌；</p>
        <p>8. 红包满1元即可使用；</p>
        <p>9. 其他事宜，请咨询客服。</p>
			</div>
			<p class="jies">活动最终解释权归多美康所有</p>
		</div>
  </div>
</template>

<script>
import back from './components/back'
export default {
  name: 'App',
  components:{
    back:back
  }
}
</script>


