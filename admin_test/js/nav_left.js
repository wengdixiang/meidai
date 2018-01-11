$.fn.extend({
	'left':function(){
		this.append(
			"<ul>"
                +"<li id='scan'>"
                    +"<img src='images/guanli.png'>"
                    +"<a href='scan.html'>扫描管理</a>"
                +"</li>"
                +"<li id='order_form'>"
                    +"<img src='images/dingdan.png'>"
                    +"<a href='index.html'>订单管理</a>"
                +"</li>"                
                /*+"<li id='exit'>"
                    +"<img src='images/tuichu.png'>"
                    +"<a href='javascript:custom_close();'>退 &nbsp;&nbsp;&nbsp;&nbsp; 出</a>"
                    // +"<a href='javascript:window.open('','_parent','');window.close();'>退 &nbsp;&nbsp;&nbsp;&nbsp; 出</a>"

                +"</li>"*/
            +"</ul>"
		)
	}
})
