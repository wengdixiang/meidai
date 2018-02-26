$.fn.extend({
	'nav': function () {
		this.append(
			"<div class='top-left'>美戴科技商家管理系统</div>"
			+ "<div class='top-right'>"
			+ "<div id='remind'>"
			+ " <p>距离证书过期还有:"

			+ "<span class='credential_date'></span>"
			+ "<a href='credential.html'>点击去续期</a>"
			+ "</p>"
			+ "</div>"
			+ "<div class='top-seek'>"
			+ "<input id='top_input' type='text' name=''>"
			+ "<img src='images/sosuo.png'>"
			+ "</div> "
			+ "</div>"
		)
	}
})



