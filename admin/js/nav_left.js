$.fn.extend({
    'left': function () {
        this.append(
            "<ul>"
            + "<li id='scan'>"
            + "<img src='images/guanli.png'>"
            + "<a href='scan.html'>扫描管理</a>"
            + "</li>"
            + "<li id='order_form'>"
            + "<img src='images/dingdan.png'>"
            + "<a href='index.html'>订单管理</a>"
            + "</li>"
            + "<li id='credential'>"
            + "<img src='images/certificate.png'>"
            + "<a href='credential.html'>证书管理</a>"
            // +"<a href='javascript:window.open('','_parent','');window.close();'>退 &nbsp;&nbsp;&nbsp;&nbsp; 出</a>"
            + "</li>"
            + "<li id='contacts'>"
            + "<img src='images/contacts.png'>"
            + "<a href='contacts.html'>联系列表</a>"
            + "</li>"
            + "<li id='order-page'>"
            + "<img src='images/yuyue.png'>"
            + "<a href='order.html'>预约列表</a>"
            + "</li>"
            + "</ul>"
        );
    }
})
