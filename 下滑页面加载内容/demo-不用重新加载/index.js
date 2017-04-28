var js_ = {
    index: function() {
        var windowHeight = $(window).height();
        //屏幕高度
        //console.log(windowHeight);
        var timeOk = true;
        //为 true 时，上一组数据已经加载完成，可以继续加载下一组数据
        var dataNum = [];
        //list里的 box 数据都放在这里
        var scrollOver;
        //判断是否还需要加载数据
        var defaultNum;
        //默认加载几个数据
        var loadData;
        //每次加载几个数据
        var listBox;
        //当前显示的数据列表是哪个 list
        var tabName = 'a';
        //当前切换的 tab 名
        var index = 0;
        //表示加载到第几个
        var loadEndNum;
        //每次加载后，list 的最后一组索引值
        getData('a');
        //默认页面获取数据列表 a 的值，相当于获得不同的 ajax 数据列表
        function getData(dataClass) {
            //获取需要加载的数据
            switch (dataClass) {
                case 'a':
                    //获得数据列表 a 的数据，相当于获得 ajax 数据列表
                    dataNum = [{
                            'id': '1',
                            'num': '1'
                        }, {
                            'id': '2',
                            'num': '2'
                        }, {
                            'id': '3',
                            'num': '3'
                        }, {
                            'id': '4',
                            'num': '4'
                        }, {
                            'id': '5',
                            'num': '5'
                        },
                        {
                            'id': '6',
                            'num': '6'
                        }, {
                            'id': '7',
                            'num': '7'
                        }, {
                            'id': '8',
                            'num': '8'
                        }, {
                            'id': '9',
                            'num': '9'
                        }, {
                            'id': '10',
                            'num': '10'
                        },
                        {
                            'id': '11',
                            'num': '11'
                        }, {
                            'id': '12',
                            'num': '12'
                        }, {
                            'id': '13',
                            'num': '13'
                        }, {
                            'id': '14',
                            'num': '14'
                        }, {
                            'id': '15',
                            'num': '15'
                        },
                        {
                            'id': '16',
                            'num': '16'
                        }, {
                            'id': '17',
                            'num': '17'
                        }, {
                            'id': '18',
                            'num': '18'
                        }, {
                            'id': '19',
                            'num': '19'
                        }, {
                            'id': '20',
                            'num': '20'
                        }
                    ];

                    //console.log(dataNum.length);
                    //dataNum 数据有几组

                    loadData = 5;
                    //每次加载几组数据

                    //console.log(dataNum[0].id);
                    //获取 dataNum 数据列表里第一个值的 id

                    break;

                case 'b':
                    //获得数据列表 b 的数据，相当于获得 ajax 数据列表
                    dataNum = [{
                            'id': '21',
                            'num': '21'
                        }, {
                            'id': '22',
                            'num': '22'
                        }, {
                            'id': '23',
                            'num': '23'
                        }, {
                            'id': '24',
                            'num': '24'
                        }, {
                            'id': '25',
                            'num': '25'
                        },
                        {
                            'id': '26',
                            'num': '26'
                        }, {
                            'id': '27',
                            'num': '27'
                        }, {
                            'id': '28',
                            'num': '28'
                        }, {
                            'id': '29',
                            'num': '29'
                        }, {
                            'id': '30',
                            'num': '30'
                        },
                        {
                            'id': '31',
                            'num': '31'
                        }, {
                            'id': '32',
                            'num': '32'
                        }, {
                            'id': '33',
                            'num': '33'
                        }, {
                            'id': '34',
                            'num': '34'
                        }, {
                            'id': '35',
                            'num': '35'
                        },
                        {
                            'id': '36',
                            'num': '36'
                        }, {
                            'id': '37',
                            'num': '37'
                        }, {
                            'id': '38',
                            'num': '38'
                        }, {
                            'id': '39',
                            'num': '39'
                        }, {
                            'id': '40',
                            'num': '40'
                        }
                    ];
                    //console.log(dataNum.length);
                    //dataNum 数据有几组

                    loadData = 3;
                    //每次加载几组数据

                    break;
                case 'c':
                    //获得数据列表 c 的数据，相当于获得 ajax 数据列表
                    dataNum = [{
                            'id': '41',
                            'num': '41'
                        }, {
                            'id': '42',
                            'num': '42'
                        }, {
                            'id': '43',
                            'num': '43'
                        }, {
                            'id': '44',
                            'num': '44'
                        }, {
                            'id': '45',
                            'num': '45'
                        },
                        {
                            'id': '46',
                            'num': '46'
                        }, {
                            'id': '47',
                            'num': '47'
                        }
                    ];
                    //console.log(dataNum.length);
                    //dataNum 数据有几组

                    loadData = 5;
                    //每次加载几组数据

                    break;
            }
            defaultNum = $('.tab li[data-name='+dataClass+']').attr('data-index');
            //默认显示数据数
            index = $('.tab li[data-name='+dataClass+']').attr('data-index');
            //开始算加载的数据

            if (dataNum.length > defaultNum) {
                //如果数据列表的组数，大于默认加载的数量，那么可以继续加载数据
                scrollOver = true;
                //可以继续加载数据

            } else {
                scrollOver = false;
                //不可以继续加载数据
                defaultNum = dataNum.length;
            }

            listBox = $('.list[data-listName=' + dataClass + ']');
            //获得和 tab 相应的 list
            listBox.show().siblings().hide();
            //只有相应的 list 显示
            getDefault();
            //在 list 写入默认数据组（不包含需要加载的数据组）
            //console.log('scrollOver:'+scrollOver);
            tabData();
        }

        function loadingAnimate() {
            $('html,body').stop(true, true).animate({
                scrollTop: (0)
            }, 100);
            //页面返回到顶部
            $('.shadow,.loadIcon').show();
            $('body').css({
                'height': windowHeight,
                'overflow': 'hidden'
            });
            var t = setTimeout(function() {
                $('.shadow,.loadIcon').hide();
                $('body').css({
                    'height': 'auto',
                    'overflow': 'auto'
                });
            }, 2000);
        }

        function tabData() {
            //点击上面的 tab 切换数据列表
            $('.tab li').bind('click', function() {
              if(timeOk===true){
              //只有在不记载数据的情况下可以点，不然数据会串行
                timeOk = false;
                loadingAnimate();

                $('.loadingIcon,.noThing').hide();

                tabName = $(this).attr('data-name');
                //console.log(tabName);
                var t = setTimeout(function() {
                    getData(tabName);
                    timeOk = true;

                }, 2000);

                //获得切换到的 数据列表，相当于切换 ajax 数据
              }
            });

        }
        tabData();

        function getDefault() {
            //对不同 list 添加不同写法的 box 写法
            $('html,body').stop(true, true).animate({
                scrollTop: (0)
            }, 10);

            listBox.html('');
            var tabIndex = $('.tab li[data-name='+tabName+']').attr('data-index');
            if(tabIndex>dataNum.length){
              $('.tab li[data-name='+tabName+']').attr('data-index',dataNum.length);
              tabIndex = dataNum.length;

            }
            if(tabIndex<defaultNum){
              tabIndex = defaultNum;
            }
            switch (tabName) {
                case 'a':

                    for (var i = 0; i < tabIndex; i++) {
                        //写入默认数量的 box
                        listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[i].id + '</div><div class="rightBox">' + dataNum[i].num + '</div></div>');
                    }
                    break;
                case 'b':
                    for (var j = 0; j < tabIndex; j++) {
                        listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[j].id + '</div><div class="rightBox">' + dataNum[j].num + '</div></div>');
                    }
                    break;
                case 'c':
                    for (var k = 0; k < tabIndex; k++) {
                        listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[k].id + '</div><div class="rightBox">' + dataNum[k].num + '</div></div>');
                    }
                    break;
            }
            slideLoad();
        }

        function slideLoad() {

            $(window).scroll(function() {
                var lastBoxBottom = parseFloat(listBox.children(".box:last-child").offset().top) + parseFloat(listBox.children('.box').height());
                //最后一个影院底部距离
                //console.log(lastBoxBottom);

                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                //页面滚动距离
                //console.log('scrollOver'+scrollOver);
                var thisTabIndex = Number($('.tab li[data-name='+tabName+']').attr('data-index'));
                //获得当前数据加载到索引几
                if(thisTabIndex>=dataNum.length){
                //如果当前加载的索引值大于数据个数
                  //$('.tab li[data-name='+tabName+']').attr('data-index',dataNum.length);

                  $('.noThing').show();
                  //提示用户已经到底部了
                  scrollOver=false;
                } else {
                    $('.noThing').hide();
                    scrollOver=true;
                }

                if (lastBoxBottom < scrollTop + windowHeight && scrollOver && timeOk) {
                    //如果 最后一个影院位置距离小于 页面滚动距离 + 屏幕设备高度 并且 可以继续加载 并且 上一组影院加载完成
                    //console.log('加载数据');
                    timeOk = false;
                    //数据还没有加载完成

                    if (index < dataNum.length) {
                        //判断影院一维数组，如果影院还能继续加载，就显示 loading
                        $('.loadingIcon').show();
                    }

                    loadEndNum = thisTabIndex + loadData;
                    //获得这次加载后，得到的加载到索引值多少
                    //console.log(loadData);
                    if (loadEndNum > dataNum.length) {
                    //如果加载的索引值大于，数据个数
                      //console.log(loadEndNum);
                        loadEndNum = dataNum.length;
                    }
                    //console.log('loadEndNum,'+loadEndNum);

                    var t = setTimeout(function() {
                        //举个例子，就当之前 loading 了 2秒，这里是 loading 结束后
                        $('.loadingIcon').hide();
                        //loading消失

                        for (index; index < loadEndNum; index++) {
                            switch (tabName) {
                                case 'a':

                                    listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[index].id + '</div><div class="rightBox">' + dataNum[index].num + '</div></div>');

                                    break;
                                case 'b':

                                    listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[index].id + '</div><div class="rightBox">' + dataNum[index].num + '</div></div>');

                                    break;
                                case 'c':

                                    listBox.append('<div class="box clear"><div class="leftBox">' + dataNum[index].id + '</div><div class="rightBox">' + dataNum[index].num + '</div></div>');

                                    break;
                            }
                        }
                        timeOk = true;
                        //可以继续加载下一组影院了
                        $('.tab li[data-name='+tabName+']').attr('data-index',loadEndNum);
                        //加载完数据后，给列表写入 已加载到什么索引位置
                        //console.log('a,'+loadEndNum);
                    }, 2000);
                    //console.log('index'+index);

                    if (index == dataNum.length) {
                        //如果当前加载的影院一维数组数，等于一维数组最大值
                        scrollOver = false;
                        //所有影院加载完成，不能继续加载影院了
                        $('.noThing').show();
                        //提示用户已经到底部了
                    }
                    //console.log('scrollOver'+scrollOver);


                }

            });

        }
    }
};
