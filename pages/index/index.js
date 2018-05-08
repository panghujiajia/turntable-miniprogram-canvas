Page({

    /**
     * 页面的初始数据
     */
    data: {
        i: 0,
        animationData: {},
        lock: true
    },

    rotateAnimate: function (i,num) {
        var that = this;
        var animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 3000,
            timingFunction: "ease-in-out",
            delay: 0
        })
        this.animation = animation;

        animation.rotate(1800 * i).step();  //首次点击获取i为0,转盘保持不动,同时启动定时器,让i+1转动

        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.rotate(1800 * (i + 1) ).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 0);

        setTimeout(function () {            //同时设置一个跟动画同时间的定时器把锁打开,防止用户重复点击
            that.setData({
                lock: true
            })
        }, 3000)
    },

    drawTurntable: function (ctx, x, y, r, colorArr, num) {
        var ctx = wx.createCanvasContext(ctx);
        var numDeg = 360 / num;   //根据奖品数量求出绘制扇形角度
        var piNum = numDeg / 360;   //每一份所占比例
        var color = null,       //绘制颜色
            startAngle = 0,     //开始度数
            endAngle = 0;       //结束度数
        for (var i = 1; i <= num; i++) {
            startAngle = endAngle;
            endAngle = piNum * i * Math.PI * 2;
            for (var j = 0; j < colorArr.length; j++) {

            }
            if (i % 2) {
                color = colorArr[1];
            } else {
                color = colorArr[0];
            }
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, r, startAngle, endAngle);
            ctx.setFillStyle(color);
            ctx.fill();
        }
        // Draw arc
        ctx.beginPath();
        ctx.arc(187.5, 187.5, 20, 0, 2 * Math.PI);
        ctx.setFillStyle('yellowgreen');
        ctx.fill();

        ctx.draw();
    },

    start: function () {
        var i = this.data.i;            //获取i
        var num = Math.round(Math.random() * 10);
        var lock = this.data.lock;      //获取锁的状态
        if (lock) {                     //如果开启状态
            this.rotateAnimate(i, num);      //调用转盘旋转,传入i
            i += 1;                     //让i++,并赋值
            this.setData({
                i: i,
                lock: false             //同时上锁
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.drawTurntable(
            'myCanvas',             //画布ID
            187.5,                  //圆心起点横坐标
            187.5,                  //圆心起点纵坐标
            180,                    //半径
            ['#FFF4D6', '#FFFFFF', '#f6f6f6'], //绘制颜色数组
            12                      //扇形数量，同奖品数量
        )
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})