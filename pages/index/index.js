Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultData: {
            canvasId: 'myCanvas',          //画布ID
            circleX: 150,                  //圆心起点横坐标
            circleY: 150,                  //圆心起点纵坐标
            circleR: 150,                  //半径
            colorArr: ['red', 'yellow'],   //绘制颜色数组
            awardsLen: 2                 //扇形数量，同奖品数量，默认或者最少2个
        },
        animationData: {},
        verifyDeg: null,                //转盘校验角度
        centerPoint: null,              //指针指向奖品中间刻度需要调整的度数
        lock: true,                     //防止用户多次点击
        times: true,                     //抽奖次数,true为有次数
        awards: [
            {
                'index': 0,
                'name': '再接再厉'
            },
            {
                'index': 1,
                'name': '1元话费'
            },
            {
                'index': 2,
                'name': '2元红包'
            },
            {
                'index': 3,
                'name': '3元红包'
            },
            {
                'index': 4,
                'name': '4元话费'
            },
            {
                'index': 5,
                'name': '5元话费'
            },
            {
                'index': 6,
                'name': '6元话费'
            },
            {
                'index': 7,
                'name': '7元话费'
            }
        ],
        runDegs: 0,                     //转盘上一次旋转的角度,默认0
        runNum:6
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 设置奖品数量、绘制转盘图、校验转盘显示角度、设置奖品名称旋转角度
    onLoad: function (options) {
        var awards = this.data.awards;
        var defaultData = this.data.defaultData;       //获取默认参数
        defaultData.awardsLen = Math.max(this.data.awards.length, defaultData.awardsLen);  //根据奖品数据,对扇形绘制数量进行重新赋值
        var centerPoint = 360 / defaultData.awardsLen / 2;  //指针中心点需要加的角度
        var verifyDeg = centerPoint + 90; //需要校验的角度
        for (var i in awards) {
            awards[i].verifyDeg = i * 360 / defaultData.awardsLen + 'deg';   //设置每个奖品文字的旋转角度
        }
        this.setData({
            awards: awards,
            verifyDeg: verifyDeg,
            centerPoint: centerPoint
        })
        this.drawTurntable(
            defaultData.canvasId,
            defaultData.circleX,
            defaultData.circleY,
            defaultData.circleR,
            defaultData.colorArr,
            defaultData.awardsLen
        )
    },

    // 点击开始按钮
    start: function () {
        var lock = this.data.lock;      //获取锁的状态
        var times = this.data.times;    //获取抽奖次数
        if (times) {
            if (lock) {                     //如果开启状态
                var awardsLen = this.data.defaultData.awardsLen;    //获取奖品数量
                var winIndex = Math.random() * awardsLen >>> 0;//根据奖品数量取随机数
                if (winIndex == null) return;
                var winName = winIndex == 0 ? '很遗憾，再接再厉！' : '恭喜您抽中' + this.data.awards[winIndex].name;      //获取奖品名称
                this.rotateAnimate(winIndex, winName);      //调用转盘旋转
                this.setData({
                    lock: false             //同时上锁
                })
            }
        } else {
            wx.showModal({
                title: '提示',
                content: '抽奖次数已用完!',
                showCancel: false
            })
        }
    },

    //旋转动画
    rotateAnimate: function (winIndex, winName) {
        var that = this;
        var animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 3000,
            timingFunction: "ease-in-out",
            delay: 0
        })
        this.data.runDegs = this.data.runDegs || 0;
        var runNum = Math.max(this.data.runNum,3);    //转盘至少需要转的圈数,最少三圈
        var awardsLen = this.data.defaultData.awardsLen;    //奖品数量
        var centerPoint = this.data.centerPoint;            //奖品中心点度数
        var verifyDeg = this.data.verifyDeg;                //校验角度
        // 新的度数 = 老的度数 + 360-老度数取模后的值 + 360*至少转的圈数 - 奖品*奖品度数 - 校验角度
        this.data.runDegs = this.data.runDegs + (360 - this.data.runDegs % 360) + (360 * runNum - winIndex * (360 / awardsLen)) - verifyDeg;
        this.animation = animation;
        animation.rotate(this.data.runDegs).step();  //首次点击获取同时启动定时器
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {            //同时设置一个跟动画同时间的定时器把锁打开,防止用户重复点击
            wx.showModal({
                title : '提示',
                content:winName,
                showCancel:false
            })
            if (winIndex < 2) {
                that.setData({
                    times: false
                })
            } else {
                that.setData({
                    lock: true
                })
            }
        }, 3000)
    },

    //canvas转盘绘制
    drawTurntable: function (canvasId, circleX, circleY, circleR, colorArr, awardsLen) {
        var ctx = wx.createCanvasContext(canvasId);
        var itemDeg = 360 / awardsLen;   //根据奖品数量求出绘制扇形角度
        var piItem = itemDeg / 360;   //每一份所占比例
        var color = null,       //绘制颜色
            startAngle = 0,     //开始弧度
            endAngle = 0;       //结束弧度
        for (var i = 1; i <= awardsLen; i++) {
            startAngle = endAngle;
            endAngle = piItem * i * Math.PI * 2;
            if (i % 2) {
                color = colorArr[1];
            } else {
                color = colorArr[0];
            }
            ctx.beginPath();
            ctx.moveTo(circleX, circleY);   //每绘制一个扇形就将起点挪到圆心
            ctx.arc(circleX, circleY, circleR, startAngle, endAngle);
            ctx.setFillStyle(color);
            ctx.fill();
        }
        // Draw arc     //圆心
        ctx.beginPath();
        ctx.arc(150, 150, 20, 0, 2 * Math.PI);
        ctx.setFillStyle('yellowgreen');
        ctx.fill();
        ctx.draw();
    }
})