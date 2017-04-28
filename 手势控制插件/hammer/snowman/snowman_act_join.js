$(function(){
    var url_search = window.location.search, activity_id, package_id, max_ticketnum_perone, min_ticketnum_perone, sel_seat_mode = 0, join_num = 0, max_member = 0, ch;
    var phoneNum = $("#phonenum")[0], vaildCode = $("#vaildcode")[0], wraningText = $("#phone_wraning"), hadSelNum = 0, codeNum = 0, envelopeNum = 0, codeTotalNum = 0, envelopeTotalNum = 0;
    var ticketNum = $("#ticket_num")[0], selectedSeatsNum_ul = $("#selectedSeatsNum_ul"), payMoney = $("#payMoney")[0], price, blankCodes = $("#blank_codes"), cdkeysList = $("#cdkeysList"), check_box = $('#check_box')[0], fav_code = $('#fav_code'), check_box_tag = true, cutnum = 0;
    var seat_content_scale = 1, seat_content_row_top, seat_content_top, seat_content_left, seat_content_width, seat_content_height;
    var user_name, user_phonenum, pc, is_book_whole;

    var searchArray = url_search.substring(1).split("&");
    for(var i = 0;i < searchArray.length; i++){
        var temp = searchArray[i].split('=');
        if(temp[0] == 'activity'){
            activity_id = temp[1] ? temp[1] : '';
        }else if(temp[0] == 'package' && temp[1]){
            package_id = temp[1];
        }else if(temp[0] == 'pc' && temp[1]){
            pc = temp[1];
        }
    }
    $('#wrap').hide();
    // 初始化活动影厅数据
    init_activity_hall(activity_id, package_id);
    // 获取万能码
    init_commoncode();
    // 获取消费券
    init_redenvelope();
    // 设置渠道id
    setPartnerID();

    // 登陆
    var click_status = 0;
    var user_code_span2 = $("#user_code_span2");
    user_code_span2.bind("click",function(){
        sendCode();
    });
    var now_timestamp = Date.parse(new Date())/1000;
    var user_login = $("#user_login");
    user_login.bind("click",function(){
        userLogin();
    });
    var login_cancel = $('#login_cancel');
    login_cancel.bind("click",function(){
        $('#bind_phonenum').hide();
    });

    // 发送手机验证码ajax
    $("#sendcode").bind("click",function(){
        sendCodeNum(phoneNum,wraningText);
    });

    // ajax提交选座
    var oSubmit_btn = $('#submit_btn');
    var oBuyTicketForm = document.getElementById('buyTicketForm');
//    if(join_num >= max_member){
//        oSubmit_btn.css('background-color', '#ADADAD');
//        oSubmit_btn.html('已售罄');
//    }else{
//        oSubmit_btn.bind('click', function (){
//            submit_selected_seat();
//        });
//    }

    $(phoneNum).focus(function(){
        if(phoneNum.value == '购票手机号：'){
            this.value = '';
        }
    });

    $('#code').bind('click', function(){
        $('#black2').css('margin-top', getTop($('#seats')[0])+'px');
        $('#black_shade').css('display', 'block').find('.popup_watch').show();
		$('.popup_cash').hide();

    });
	$('#cashCoupon').bind('click', function(){
        $('#black2').css('margin-top', getTop($('#seats')[0])+'px');
        $('#black_shade').css('display', 'block').find('.popup_cash').show();
		$('.popup_watch').hide();
	});
    // 取消
    $('.popup_watch .table001').click(function(){
        initCommonCodeChecked(); // 检查万能码

		$('.popup_watch').hide();
        $('#black_shade').hide();
    });
	$('.popup_cash .table001').click(function(){

        initRedEnvelopeChecked(); // 检查红包
		$('.popup_cash').hide();
        $('#black_shade').hide();
    });
    // 确定
    $('.table002').bind('click', function(){
        var commoncodeArray = [];
        var redenvelopeArray = [];
        var redenvelopeValueArray = [];
        var table02_list_o = $('.table02[data-status=1]');
        var table02_envelope_list_o = $('.table02_envelope[data-status=1]');
        // 万能码
        for(var i=0; i<table02_list_o.length; i++){
            commoncodeArray.push(table02_list_o[i].getAttribute('data-id'));
        }
        // 红包
        for(var j=0; j<table02_envelope_list_o.length; j++){
            redenvelopeArray.push(table02_envelope_list_o[j].getAttribute('data-id'));
            redenvelopeValueArray.push(table02_envelope_list_o[j].getAttribute('data-value'));
        }
        $('#commoncode').val(commoncodeArray.join('|'));
        $('#redenvelope').val(redenvelopeArray.join('|'));
        if(codeNum>0){
            $('#amount').css('color', '#34e75e');
            $('#amount').html('已使用'+(codeNum)+'个');
			$('.order_amount p').show();
        }else{
            $('#amount').css('color', '#8a8a8a');
            $('#amount').html(codeTotalNum+'个可用');
			$('.order_amount p').hide();
        }
		if(envelopeNum>0){
			$('#cash_amount').css('color', '#34e75e');
            $('#cash_amount').html('已使用'+(envelopeNum)+'个');
		}else{
            $('#cash_amount').css('color', '#8a8a8a');
            $('#cash_amount').html(envelopeTotalNum+'个可用');
        }
		if(codeNum>0||envelopeNum>0){
			$('.order_amount p').show();
		}else{
			$('.order_amount p').hide();
		}
        if(price){
            var discount = 0.0;
            // 计算红包总价
            for(var k=0; k<redenvelopeValueArray.length; k++){
                discount += parseFloat(redenvelopeValueArray[k]);
            }
            // 计算总价
            var temp_price = parseFloat((hadSelNum-codeNum) * price - discount).toFixed(1);
			var price_ori = parseFloat(hadSelNum * price).toFixed(1);
			var price_discount = parseFloat(codeNum * price + discount).toFixed(1);
			if(parseFloat(price_discount) > parseFloat(price_ori)){
                price_discount = price_ori;
            }
			if(parseFloat(temp_price) < 0){
                temp_price = 0.0;
            }
			$('#total_price').text(price_ori);
			$('#delete_price').text(price_discount);
            payMoney.innerHTML = temp_price + ' 元';
        }
        $('#black_shade').css('display', 'none');
    });

    /*$('#title_left').bind('click', function(){
        $('#title_left').attr('class', 'title_header02');
        $('#title_right').attr('class', 'title_header01');
        $('#code_list').show();
        $('#envelope_list').hide();
    });

    $('#title_right').bind('click', function(){
        $('#title_right').attr('class', 'title_header02');
        $('#title_left').attr('class', 'title_header01');
        $('#code_list').hide();
        $('#envelope_list').show();
    });*/

    // 初始化活动座位图
    var unpay_seat_id_list='';
    var seatIds = $("#seatIds")[0], seatArray = [], needMoney;
    init_activity_seat(activity_id);





    function init_activity_hall(activity_id, package_id){
        var request_url = base_url + '/snowman_api/booking/act_hall/'+activity_id+'/?format=jsonp';
        if(package_id){
            request_url += '&package='+package_id;
        }
        $.ajax({
            type: "get",
            async: false,
            url: request_url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"activity_hall",
            success: function(json){
                if(json.join_phonenum){
                    $("#phonenum").val(json.join_phonenum);
                    user_phonenum = json.join_phonenum;
                }else if(json.join_username){
                    user_name = json.join_username;
                    $("#telnum").hide();
//                    window.location.href="http://www.xuerendianying.com/snowman/snowman_user_edit.html?to="+encodeURIComponent(window.location.href);
                }else{
                    $("#telnum").hide();
//                    window.location.href="http://www.xuerendianying.com/snowman/snowman_user_login.html?to="+encodeURIComponent(window.location.href);
                }
                var act_id = json.id;
                var act_title = json.title;
                var movie_title = json.movie;
                var cinema_name = json.cinema;
                var hall_name = json.session;
                var showtime = json.showtime;
                var movie_version = json.movie_version_str;
                join_num = json.join_num;
                max_member = json.max_member;
                var oSubmit_btn = $('#submit_btn');
                if(join_num >= max_member){
                    oSubmit_btn.css('background-color', '#ADADAD');
                    oSubmit_btn.html('已售罄');
                }else{
                    oSubmit_btn.bind('click', function (){
                        submit_selected_seat();
                    });
                }
                if(json.city_id=='293'){
                    $('#kefu').html(json.creator_phonenum);
                }
                price = json.price;
//                    max_ticketnum_perone = json.max_ticketnum_perone;
//                    $("#ticketnum").val(json.max_ticketnum_perone);
                $('#screen').html(hall_name);
				$("#movie_name").html(movie_title);
                $("#act_title").html(act_title);
                $("#showtime").html(showtime);
                $("#movie_version").html(movie_version);
                $("#price").html('￥'+price+'元');
				//$('#total_price').html(price);
                $("#cinema_name").html(cinema_name);
                $("#showtime2").html(showtime);
                $("#movie_title").html(movie_title);
                if(json.is_book_whole){
                    is_book_whole = true;
                    $("#price").html('免费');
                    $('#buy_phonenum_span').html('接收短信手机号:');
//                        $("#ticketnum").val(json.max_ticketnum_perone);
//                    if(json.sel_seat_mode == 1){
//                        sel_seat_mode = 1;
//                        $("#ticketnum").val(1);
//                        $("#sel_seat_cdkey_p").show();
//                    }else if (json.sel_seat_mode == 2){
//                        sel_seat_mode = 2;
//                        $("#ticketnum").val(0);
//                        weidian_phonenum_binding();
//                    }

                }else{
                    $('#buy_phonenum_span').html('接收短信手机号:');
                }
                $("#ticketnum").val(json.max_ticketnum_perone);
                min_ticketnum_perone = json.min_ticketnum_perone;
                $('#wrap').show();
            },
            error: function(){
                alert('您的网络不给力，挪个地儿试试~~');
            }
        });
    }

    //座位图
    function init_activity_seat(activity_id){
        $.ajax({
            type: "get",
            async: false,
            url: base_url + '/snowman_api/booking/unpay_act_seat/'+activity_id+'/?format=jsonp',
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"getSeatMes",
            success: function(json){
                if(json.seat_id_list.length>0){
                    unpay_seat_id_list = json.seat_id_list.join(',');
                }
                ajax_act_seat();
            },
            error: function(){
                ajax_act_seat()
            }
        });
    }

    function ajax_act_seat(){
        $.ajax({
            type: "get",
            async: false,
            url: base_url + '/snowman_api/booking/act_seat/'+activity_id+'/?format=jsonp',
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"getSeatMes",
            success: function(json){
                var htmlNum = [], htmlSeat = [], bigNum = 0;
                // 计算中间排，中间列
                var middle_row = parseInt(json.length/2)-1;// 舍掉小数部分，减1因为下面画座位图的循环是从0开始的
                var total_col = 0; // 所有座位数， 用以取平均每排座位数
                // 取加权
                for(var ii = 0, max_row = json.length;ii < max_row; ii++){
                    var rowSeats_row = json[ii].list;
                    total_col += rowSeats_row.length;
                }
                var avg_col = Math.round(total_col/json.length); // 加权 四舍五入
                var center_col = parseInt(avg_col/2);// 同理
                //画座位图
                for(var i = 0, max = json.length;i < max; i++){
                    if(json[i].list.length > bigNum){
                        bigNum = json[i].list.length;
                    }
                    if(json[i].vol.vol_name){
                        htmlNum.push(['<tr><td><span>' , json[i].vol.vol_name , '</span></td></tr>'].join(''));
                    }
                    else{
                        htmlNum.push(['<tr><td></td></tr>'].join(''));
                    }
                    htmlSeat.push(['<tr>'].join(''));
                    var rowSeats = json[i].list;
                    for(var j = 0, maxS = rowSeats.length;j < maxS; j++){
                        var sType, rowSeats_status, td_class, sHave;
                        rowSeats_status = rowSeats[j].status;
                        td_class = '';
                        if(rowSeats[j].type == 0){
                            if(rowSeats[j].status == 0){
                                sType = 'exist_noSel';
                            }
                            else{
                                sType = 'exist_sel';
                            }
                            if(unpay_seat_id_list && unpay_seat_id_list.indexOf(rowSeats[j].id+'')!=-1){
                                sType = 'exist_noSel doSel';
                                rowSeats_status = '1';
                                td_class = ' class="mySel" ';
                                hadSelNum++;
                                if(ticketNum){
                                    ticketNum.innerHTML = hadSelNum;
                                }
                                if(price){
                                    needMoney = payMoney.innerHTML = parseFloat(hadSelNum * price).toFixed(1) + ' 元';
                                }
                                var $tempLi = $('<span class="selectedSeatsNum_span" seatId="' + rowSeats[j].id + '">' + rowSeats[j].name + '</span>');
                                selectedSeatsNum_ul.append($tempLi);
                                seatArray.push(rowSeats[j].id);
                                seatIds.value = seatArray.join('|');
                            }
                        }
                        else {
                            sType = "blank";
                        }
                        var td_style = 'style="';
                        if(i == middle_row){
                            td_style += 'border-bottom: 1px solid #000;';
                        }
                        if(j == center_col){
                            td_style += 'border-right: 1px solid #000;';
                        }
                        td_style += '"';
                        htmlSeat.push(['<td ',td_class , td_style ,' type="' , rowSeats[j].type , '" status="' , rowSeats_status , '" name="' , rowSeats[j].name , '" seatId="' , rowSeats[j].id , '"><span class="' , sType , '" type="' , rowSeats[j].type , '" status="' , rowSeats_status , '" name="' , rowSeats[j].name , '" seatId="' , rowSeats[j].id , '"></span></td>'].join(''));
                    }
                    htmlSeat.push(['</tr>'].join(''));
                }
                $("#RowsNum").html(htmlNum.join(''));
                $("#SeatShow").html(htmlSeat.join(''));
                seat_content_width = bigNum * 34 + 18; // 34是座位width，+18是因为padding是9px
                seat_content_height = json.length * 30 + 18; // 30是座位height，+18是因为padding是9px
                seat_content_scale = 300/seat_content_width;
                var seat_content_scale2 = 200/seat_content_height;
                seat_content_scale = seat_content_scale <= seat_content_scale2 ? seat_content_scale : seat_content_scale2;
                seat_content_row_top = -(seat_content_height * (1 - seat_content_scale)/2+5) + 'px'; // 原高-缩后高 再/2 +靠近银幕
                seat_content_top = seat_content_row_top;
//                seat_content_left = '-' + ((seat_content_width - 300)/2-26) + 'px'; // (原宽-300)/2-排数div的宽*缩放比率
                seat_content_left = -(seat_content_width * (1 - seat_content_scale)/2-40) + 'px'; // 原宽-缩后宽 再/2 +留白
                $('#SeatContentRowNum').css("-webkit-transform", "scale("+seat_content_scale+")");
                $('#SeatContentNum').css("-webkit-transform", "scale("+seat_content_scale+")");
                $("#SeatContentNum").css("left", seat_content_left);
                $("#SeatContentNum").css("top", seat_content_top);
                $("#SeatContentRowNum").css("top", seat_content_row_top);
//                $('#cinema_name').html($('#cinema_name').html()+'|'+parseInt($('#SeatContentRowNum').css('left')));

//                var seat_content_width = bigNum * 40 + 136;
//                seat_content_scale = 320/seat_content_width;
//                $('#SeatContent').css("-webkit-transform", "scale("+seat_content_scale+")");
//                $("#SeatContent").css("width", seat_content_width + 'px');
//                $("#SeatContent").css("top", '-' + (json.length * 8 + 40) + 'px');
//                $("#SeatContent .SeatContentNum").css("width", bigNum * 40 + 'px');
//                if($("#SeatContent").hasClass("phone_flag")){
//                    seat_content_width = bigNum * 34 + 126;
//                    seat_content_scale = 320/seat_content_width;
//                    $('#SeatContent').css("-webkit-transform", "scale("+seat_content_scale+")");
//                    $("#SeatContent").css("width", seat_content_width + 'px');
//                    $("#SeatContent .SeatContentNum").css("width", bigNum * 34 + 'px');
//                }
                //选座位 最多ticketnum个
                var bind_type = 'tap';
                if(pc){
                    bind_type = 'click';
                }
                $("#SeatShow td span[type=0]").live(bind_type, function(){
                    if($(this).attr("status") == 0){
                        var max_ticketnum = max_ticketnum_perone;
                        var weixin_ticketnum = $("#ticketnum");
						$('.order_amount').hide();
                        if(weixin_ticketnum){
                            max_ticketnum = Number(weixin_ticketnum.val());
                        }

                        if(hadSelNum == max_ticketnum && !$("#no_limit")[0]){
                            alert("对不起，最多能选"+max_ticketnum+"个座位！");
                        }
                        else{
                            //增加一个座位
                            $(this).attr("status", 1);
                            $(this).parent().attr("status", 1);
                            $(this).addClass("doSel");
                            $(this).parent().addClass("mySel");
                            hadSelNum++;
							$('.order_amount').show();

                            if(ticketNum){
                                ticketNum.innerHTML = hadSelNum;
                            }

                            if(price){
								var redenvelopeValueArray = [];
								var table02_envelope_list_o = $('.table02_envelope[data-status=1]');

								for(var j=0; j<table02_envelope_list_o.length; j++){
									redenvelopeValueArray.push(table02_envelope_list_o[j].getAttribute('data-value'));
								}
								var discount = 0.0;
								for(var k=0; k<redenvelopeValueArray.length; k++){
									discount += parseFloat(redenvelopeValueArray[k]);
								}
								var price_ori = parseFloat(hadSelNum * price).toFixed(1);

								var price_discount = parseFloat(codeNum * price + discount).toFixed(1);

								needMoney = payMoney.innerHTML = parseFloat((hadSelNum-codeNum) * price - discount).toFixed(1) + ' 元';

								if(parseFloat(needMoney) < 0){
									needMoney = 0.0;
								}

								if(parseFloat(price_discount) > parseFloat(price_ori)){
									price_discount = price_ori;
								}
								$('#delete_price').text(price_discount);
								$('#total_price').text(price_ori);
								$('#payMoney').text(needMoney);
							}


                            var $tempLi = $('<span class="selectedSeatsNum_span" seatId="' + $(this).attr("seatId") + '">' + $(this).attr("name") + '</span>');
                            //var $tempInput = $('<input type="hidden" value="' + $(this).attr("seatId") + '"/>');
                            selectedSeatsNum_ul.append($tempLi);
                            //$tempLi.append($tempInput);
                            seatArray.push($(this).attr("seatId"));
                            seatIds.value = seatArray.join('|');
                            //兑换码
                            if(cdkeysList){
                                blankCodes.css("display", "none");
                                cdkeysList.parent().css("display", "block");
                                var $tempCode = $('<li><input type="text" maxlength="9" value="" name="cdkey_list" /></li>');
                                cdkeysList.append($tempCode);
                            }
                            /* if(check_box){
                             if(check_box.checked){
                             payMoney.innerHTML = (parseFloat(needMoney) - 2).toFixed(1) + '元 = ' + (parseFloat(needMoney)).toFixed(1) + '元' + ' - 2元';
                             }
                             } */
                        }

                    }
                    else if($(this).attr("status") == 1 && $(this).hasClass('doSel')){
                        if(hadSelNum <= codeNum){
                            alert('请先取消电子码~');
                            return;
                        }
                        //删除一个座位
                        $(this).attr("status", 0);
                        $(this).parent().attr("status", 0);
                        $(this).removeClass("doSel");
                        $(this).parent().removeClass("mySel");
                        hadSelNum--;
						if(hadSelNum==0){
							$('.order_amount').hide();

						}
                        if(ticketNum){
                            ticketNum.innerHTML = hadSelNum;
                        }
                        if(price){
								var redenvelopeValueArray = [];
								var table02_envelope_list_o = $('.table02_envelope[data-status=1]');

								for(var j=0; j<table02_envelope_list_o.length; j++){
									redenvelopeValueArray.push(table02_envelope_list_o[j].getAttribute('data-value'));
								}
								var discount = 0.0;
								for(var k=0; k<redenvelopeValueArray.length; k++){
									discount += parseFloat(redenvelopeValueArray[k]);
								}
								var price_ori = parseFloat(hadSelNum * price).toFixed(1);

								var price_discount = parseFloat(codeNum * price + discount).toFixed(1);

								needMoney = payMoney.innerHTML = parseFloat((hadSelNum-codeNum) * price - discount).toFixed(1) + ' 元';

								if(parseFloat(needMoney) < 0){
									needMoney = 0.0;
								}

								if(parseFloat(price_discount) > parseFloat(price_ori)){
									price_discount = price_ori;
								}
								$('#delete_price').text(price_discount);
								$('#total_price').text(price_ori);
								$('#payMoney').text(needMoney);
							}
                        $("#selectedSeatsNum_ul span").remove('span[seatId=' + $(this).attr("seatId") + ']');
                        for(var n = 0; n < seatArray.length; n++){
                            if(seatArray[n] == $(this).attr("seatId")){
                                seatArray.splice(n, 1);
                                break;
                            }
                        }
                        seatIds.value = seatArray.join('|');
                        //兑换码
                        if(cdkeysList){
                            if(hadSelNum == 0){
                                blankCodes.css("display", "block");
                                cdkeysList.parent().css("display", "none");
                            }
                            $("#cdkeysList li:last-child").remove();
                        }
                        /* if(check_box){
                         if(check_box.checked){
                         payMoney.innerHTML = (parseFloat(needMoney) - 2).toFixed(1) + '元 = ' + (parseFloat(needMoney)).toFixed(1) + '元' + ' - 2元';
                         }
                         } */
                        if(hadSelNum == 0){
                            payMoney.innerHTML = "0 元";
                        }
                    }
                    else{
                        return;
                    }

                });

                $("#selectedCinema").css("display", "block");
                $("#noSelCinema").css("display", "none");
                // 缩放功能绑定
                transform_binding();
            },
            error: function(){
                alert('亲，网络不好哦，挪地儿试试吧~');
            }
        });
    }

    // 选择座位
    function submit_selected_seat(){
        if(!user_phonenum){
            $('#bind_phonenum').show();
            return;
        }
        var rule = 1;
        //不要在周围留下单个空座（暂时去掉此规则）
        $("#SeatShow .mySel").each(function(){
            // 该座位的左边是空座位，但左边的左边不是空座位（没座位，不是座位，已被选）
            if($(this).prev() && $(this).prev().attr("type") == 0 && $(this).prev().attr("status") == 0 && (!$(this).prev().prev().attr("seatid") || $(this).prev().prev().attr("type") != 0 || $(this).prev().prev().attr("status") == 1)){
                rule = 0;
            }
            // 该座位的右边是空座位，但右边的右边不是空座位（没座位，不是座位，已被选）
            if($(this).next() && $(this).next().attr("type") == 0 && $(this).next().attr("status") == 0 && (!$(this).next().next().attr("seatid") || $(this).next().next().attr("type") != 0 || $(this).next().next().attr("status") == 1)){
                rule = 0;
            }
        });
        if(ticketNum && ticketNum.innerHTML == 0){
            alert("请先选择座位！");
        }
        else{
            if(rule){
                if(isNaN(parseFloat(phoneNum.value)) || phoneNum.value.length != 11 || /[^\d]/.test(phoneNum.value)){
//					$("#phone_wraning").css("display","block");
                    alert("请输入手机号！");
                }
                else{
                    if(ticketNum && parseInt(ticketNum.innerHTML) < min_ticketnum_perone){
                        alert('本场活动至少购买'+min_ticketnum_perone+'张票！');
                        return;
                    }
                    $("#phone_wraning").css("display","none");
                    var user =  $("#user");
                    var hall_id =  $("#hall_id");
                    var activity_session =  $("#activity_session");
                    var no_limit =  $("#no_limit");
                    var city_id =  $("#city_id");
                    var seatIds =  $("#seatIds");
                    var channel =  $("#channel");
                    var phonenum =  $("#phonenum");
                    var vaildcode =  $("#vaildcode");
                    var ticketnum =  $("#ticketnum");
                    $("#ticketnum").val(ticketNum.innerHTML);
                    var act_join_form = $('#act_join_form');
                    $('#activity').val(activity_id);
                    if(window.sessionStorage && sessionStorage.ch){
                        $('#channel').val(sessionStorage.ch);
                    }
                    var action_url = base_url + '/snowman_api/booking/act_seat/'+activity_id+'/';
                    if(sel_seat_mode == 2){
                       action_url = base_url + '/snowman_api/pick/weixin_seat/';
                    }
                    act_join_form.attr('action', action_url);
                    act_join_form.submit();
//                    var oData = {"no_limit":no_limit.val(), "seat":seatIds.val(), "channel":channel.val(), "mobile":"mobile",
//                        "phonenum":phonenum.val(), "weixin":vaildcode.val(), "weixin_ticketnum":ticketnum.val(), "activity": activity_id};
//                    $.ajax({
//                        type: "post",
//                        async: false,
////                        url:base_url + '/snowman_api/pick/weixin_seat/',
//                        url:base_url + '/snowman_api/booking/act_seat/'+activity_id+'/?format=json',
//                        data: oData,
//                        success: function(json){
//                            var status = json.respond.status;
//                            if(status == 200){
//                                alert('选座成功~');
//                            }
//                            else{
//                                alert(json.respond.msg);
//                            }
//                        },
//                        error: function(){
//                            alert('选座失败~');
//                        }
//                    });
                }
            }
            else{
                alert('请重新选择座位，尽量不要在周围留下单个空座');
            }
        }
    }

    //发送验证码
    function sendCodeNum(num,wraning){
        var telNumber = num;
        var wranPlay = wraning;
        if(isNaN(parseFloat(telNumber.value))||(telNumber.value.length!=11) || /[^\d]/.test(telNumber.value)){
//            wranPlay.css("display","block");
            alert('手机号输入错误！');
        }else{
//            wranPlay.css("display","none");
            $.ajax({
                type: "get",
                async: false,
                url: base_url + '/snowman/user/send/code?phonenum=' + telNumber.value,
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback:"validcode",
                success: function(json){
                    var status = json.respond.status;
                    if(status == 200){
                        alert('亲，验证码已发送~请用手机查看~');
                    }
                    else if(status == 500){
                        alert(json.respond.msg);
                    }
                },
                error: function(){
                    alert('您的网络不给力，挪个地儿试试~~');
                }
            });
        }
    }

    // 获取微店手机号对应票数
    function weidian_phonenum_binding(){
        var user =  $("#user");
        var hall_id =  $("#hall_id");
        var activity_session =  $("#activity_session");
        var no_limit =  $("#no_limit");
        var phonenum_input = $("#phonenum");
        if(phonenum_input.val()){
            $.ajax({
                type: "get",
                async: false,
                url: base_url+'/snowman_api/pick/weixin_order/?activity='+activity_id+'&phonenum='+phonenum_input.val()+'&activity_session='+activity_session.val(),
                dataType: "json",
                jsonp: "callback",
                jsonpCallback:"getWeixin_order",
                success: function(json){
                    var status = json.respond.status;
                    if(status == 200){
                        var ticketnum = $("#ticketnum");
                        ticketnum.val(json.ticketnum);
                    }
                    else{
                        alert('您不是本次活动的用户~');
                    }
                },
                error: function(){
                    alert('您的网络不给力，挪个地儿试试~~');
                }
            });
        }
        phonenum_input.blur(function(){
            if(phonenum_input.val()){
                $.ajax({
                    type: "get",
                    async: false,
                    url: base_url+'/snowman_api/pick/weixin_order/?activity='+activity_id+'&phonenum='+phonenum_input.val()+'&activity_session='+activity_session.val(),
                    dataType: "json",
                    jsonp: "callback",
                    jsonpCallback:"getWeixin_order",
                    success: function(json){
                        var status = json.respond.status;
                        if(status == 200){
                            var ticketnum = $("#ticketnum");
                            ticketnum.val(json.ticketnum);
                        }
                        else{
                            alert('您不是本次活动的用户~');
                        }
                    },
                    error: function(){
                        alert('您的网络不给力，挪个地儿试试~~');
                    }
                });
            }
        });
    }

    // 获取万能码
    function init_commoncode(){
        var request_url = base_url + '/snowman_api/user/clientuser/commoncode_list/?type=0&code_type=commoncode&activity='+activity_id+'&format=jsonp';
        $.ajax({
            type: "get",
            async: false,
            url: request_url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"commoncode_list",
            success: function(json){
                if(json.results.length>0){
                    var code_list = $('#code_list');
                    var code_list_o = [];
                    for(var i=0; i<json.results.length; i++){
                        var code_one = json.results[i];
						var code_name = '全场通兑：';
						if(code_one.movie_title){
							code_name = '本场专用：';
						}
                        var code_one_o = [];
                        code_list_o.push(['<div class="table02" data-id="',code_one.id,'" data-status="0">'+code_name+'',code_one.cdkey,'</div>'].join(''));
                    }
                    code_list.html(code_list_o.join(''));
                    commoncode_binding_click();
                    codeTotalNum=json.results.length;
                    $('#amount').html(codeTotalNum+'个可用');
					if(codeTotalNum>0){
						$('#go_activation').hide();
						$('#code').show();
					}else{
						$('#go_activation').show();
						$('#code').hide();
					}
                }
            },
            error: function(){
                alert('您的网络不给力，挪个地儿试试~~');
            }
        });
    }

    // 获取红包
    function init_redenvelope(){
        var request_url = base_url + '/snowman_api/user/clientuser/red_envelope_list/?type=0&format=jsonp';
        $.ajax({
            type: "get",
            async: false,
            url: request_url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"red_envelope_list",
            success: function(json){
                if(json.length>0){
                    var envelope_list = $('#envelope_list');
                    var code_list_o = [];
                    for(var i=0; i<json.length; i++){
                        var code_one = json[i];
                        var desc = '';
                        if(code_one.redenvelop.kind == 1){
                            desc = '红包：'+code_one.redenvelop.value+'元';
                        }else{
                            desc = '红包：'+code_one.redenvelop.description;
                        }
                        code_list_o.push(['<div class="table02_envelope" data-id="',code_one.id,'" data-status="0" data-value="',code_one.redenvelop.value,'">',desc,'</div>'].join(''));
                    }
                    envelope_list.html(code_list_o.join(''));
                    redenvelope_binding_click();
                    envelopeTotalNum=json.length;
                    $('#cash_amount').html(envelopeTotalNum+'个可用');

                }
            },
            error: function(){
                alert('您的网络不给力，挪个地儿试试~~');
            }
        });
    }

    // 勾选万能码
    function commoncode_binding_click(){
        $('.table02').bind('click', function(){
            if(hadSelNum<=0){
                alert('请先选座位~');
                $(this).removeClass('table02_selected');
                return;
            }
//            codeNum = $('.table02[data-status=1]').length;
            // 取消勾选
            if($(this).attr('data-status') == 1){
                $(this).removeClass('table02_selected');
                $(this).attr('data-status', 0);
            }
            // 增加勾选
            else{
                if(is_book_whole){
                    if(codeNum >= hadSelNum){
                        alert('请先增加座位~');
                        return;
                    }
                }else{
                    if(codeNum >= 1){
                        alert('亲，每次只能用一个~');
                        return;
                    }
                }
                $(this).addClass('table02_selected');
                $(this).attr('data-status', 1);
            }
            codeNum = $('.table02[data-status=1]').length;
        });
    }
    // 勾选红包
    function redenvelope_binding_click(){
        $('.table02_envelope').bind('click', function(){
            if(hadSelNum<=0){
                alert('请先选座位~');
                $(this).removeClass('table02_envelope_selected');
                return;
            }
//            envelopeNum = $('.table02_envelope[data-status=1]').length;
            // 取消勾选
            if($(this).attr('data-status') == 1){
                $(this).removeClass('table02_envelope_selected');
                $(this).attr('data-status', 0);
            }
            // 增加勾选
            else{
                if(envelopeNum >= 1){
                    alert('亲，每次只能用一个~');
                    return;
                }
                $(this).addClass('table02_envelope_selected');
                $(this).attr('data-status', 1);
            }
            envelopeNum = $('.table02_envelope[data-status=1]').length;
        });
    }

    // 检查万能码
    function initCommonCodeChecked(){
        var code_list_o = $('.table02');
        /*var radio_list_o = $('.radio');*/
        var code_id_str = $('#commoncode').val();
        for(var i=0; i<code_list_o.length; i++){
            // 已选择的电子码里没有该电子码时
            if(code_id_str.indexOf(code_list_o[i].getAttribute('data-id'))==-1){
                code_list_o[i].className = 'table02';
                //radio_list_o[i].checked = false;
                code_list_o[i].setAttribute('data-status', 0);
            }
            // 已选择的电子码里有该电子码时
            else{
                // 该电子码被取消了，此刻要恢复它为被选中状态
                if(code_list_o[i].getAttribute('data-status') == 0){
                    code_list_o[i].className = 'table02 table02_selected';
                    //radio_list_o[i].checked = true;
                    code_list_o[i].setAttribute('data-status', 1);
                }
            }
        }
        codeNum = $('.table02[data-status=1]').length;
    }

    // 检查红包
    function initRedEnvelopeChecked(){
        var code_list_o = $('.table02_envelope');
        //var radio_list_o = $('.radio_envelope');
        var code_id_str = $('#redenvelope').val();
        for(var i=0; i<code_list_o.length; i++){
            // 已选择的电子码里没有该电子码时
            if(code_id_str.indexOf(code_list_o[i].getAttribute('data-id'))==-1){
                code_list_o[i].className = "table02_envelope";
                //radio_list_o[i].checked = false;
                code_list_o[i].setAttribute('data-status', 0);
            }
            // 已选择的电子码里有该电子码时
            else{
                // 该电子码被取消了，此刻要恢复它为被选中状态
                if(code_list_o[i].getAttribute('data-status') == 0){
                    code_list_o[i].className = "table02_envelope table02_envelope_selected";
                    //radio_list_o[i].checked = true;
                    code_list_o[i].setAttribute('data-status', 1);
                }
            }
        }
        envelopeNum = $('.table02_envelope[data-status=1]').length;
    }

    function setPartnerID(){
        if(ch){
            sessionStorage.ch = ch;
        }else{
            if(!window.sessionStorage){
                sessionStorage.ch = 'part100000';
            }
        }
    }

    // 更新用户数据
    function userLogin(){
        var phonenum = $('#phonenum_bind').val();
        var code = $('#code_bind').val();
        var oData = {"phonenum": phonenum, "code": code};
        $.ajax({
            type: "post",
            async: false,
            url: base_url + '/snowman_api/user/clientuser/login/?tt='+now_timestamp,
            data: oData,
            dataType: "json",
            jsonp: "callback",
            jsonpCallback:"user_Login",
            success: function(json){
                $("#phonenum").val(json.user_phonenum);
                $("#telnum").show();
                user_phonenum = json.user_phonenum;
                $('#bind_phonenum').hide();
                // 获取万能码
                init_commoncode();
                // 获取消费券
                init_redenvelope();
            },
            error: function(HttpResponse, textStatus, errorThrown){
                alert('登陆出错啦~');
            }
        });
    }

    // 发送验证码
    function sendCode(){
        var phonenum = $('#phonenum_bind').val();
        if(isNaN(parseFloat(phonenum))||(phonenum.length!=11) || /[^\d]/.test(phonenum)){
            alert('手机号输入错误！');
            return;
        }
        if(click_status == 0){
            click_status = 1;
            var oTimer1 = null;
            var oTimer2 = null;
            var countdown = 30, countdown2 = countdown; // 30秒
            // 定时恢复按钮可点击
            oTimer1 = setTimeout(function(){ // 30秒后恢复
                $('#user_code_span2').attr('class', 'user_code_span2');
                $('#user_code_span2').html('获取验证码');
                $('#user_code_span2').bind("click",function(){
                    sendCode();
                });
                click_status = 0;
                clearTimeout(oTimer1);
                clearInterval(oTimer2);
                countdown2 = countdown;
            },countdown*1000);
            $('#user_code_span2').attr('class', 'user_code_span3');
            $('#user_code_span2').html(countdown2+'秒');
            $('#user_code_span2').bind("click",function(){});
            // 倒计时
            oTimer2 = setInterval(function(){
                countdown2 -= 1;
                $('#user_code_span2').html(countdown2+'秒');
            },1000); // 每秒减1

            $.ajax({
                type: "get",
                async: false,
                url: base_url + '/snowman_api/firmware/send/code/?format=jsonp&phonenum=' + phonenum,
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback:"sendValidCode",
                success: function(json){
                    var status = json.status;
                    if(status == 200){
                        alert('亲，验证码已发送，请用手机查看~');
                    }else{
                        alert(json.msg);
                    }
                },
                error: function(){
                    alert('亲，网络不好哦，挪地儿试试吧~');
                }
            });
        }
    }

    function transform_binding(){
        if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
            Hammer.plugins.fakeMultitouch();
        }
        var SeatContentRowNum = $('#SeatContentRowNum')[0];
        var SeatContentNum = $('#SeatContentNum')[0];
        var hammertime = Hammer(SeatContentNum, {
            preventDefault		: true,
            transformMinScale   : seat_content_scale,
            dragBlockHorizontal : true,
            dragBlockVertical   : true,
            dragMinDistance     : 0
        });
        var posX = 0, posY = 0,
            last_posX = 0, last_posY = 0,
            scale = seat_content_scale, last_scale = seat_content_scale,
            init_offset_left_max = $('#SeatContentNum').offset().left, //seat_content_left,//$('#SeatContentNum').offset().left,
            init_offset_left_min = 280 - $('#SeatContentNum').width()*seat_content_scale,
            init_offset_top_max = $('#SeatContentNum').offset().top, //seat_content_top,//$('#SeatContentNum').offset().top,
            init_offset_top_min = 330 - $('#SeatContentNum').height()*seat_content_scale,
            init_offset_row_top_max = $('#SeatContentRowNum').offset().top, //seat_content_top,//$('#SeatContentNum').offset().top,
            init_offset_row_top_min = 330 - $('#SeatContentRowNum').height()*seat_content_scale;

        hammertime.on('touch drag transform', function(ev) {
            switch(ev.type) {
                case 'touch':
                    last_scale = scale;
                    last_posX = posX;
                    last_posY = posY;
                    break;

                case 'drag':
                    posX = last_posX + ev.gesture.deltaX;
                    posY = last_posY + ev.gesture.deltaY;
                    if($('#SeatContentNum').offset().left>init_offset_left_max){
                        $('#SeatContentNum').offset({left:init_offset_left_max});
                    }
                    if($('#SeatContentNum').offset().left<init_offset_left_min){
                        $('#SeatContentNum').offset({left:init_offset_left_min});
                    }
                    if($('#SeatContentNum').offset().top>init_offset_top_max){
                        $('#SeatContentNum').offset({top:init_offset_top_max});
                        $('#SeatContentRowNum').offset({top:init_offset_row_top_max});
                    }
                    if($('#SeatContentNum').offset().top<init_offset_top_min){
                        $('#SeatContentNum').offset({top:init_offset_top_min});
                        $('#SeatContentRowNum').offset({top:init_offset_row_top_min});
                    }

                    break;

                case 'transform':
                    scale = Math.max(seat_content_scale, Math.min(last_scale * ev.gesture.scale, 1.5));
                    init_offset_left_min = 320 - $('#SeatContentNum').width()*scale;
                    init_offset_top_min = 350 - $('#SeatContentNum').height()*scale;
                    init_offset_row_top_min = 350 - $('#SeatContentRowNum').height()*scale;
                    break;
            }

            $('#SeatContentRowNum').offset({left:'-19px'});

            // transform!
            var transform_row = "translate3d(0," + posY + "px, 0) " + "scale3d(" + scale + "," + scale + ", 1)";
            var transform = "translate3d(" + posX + "px," + posY + "px, 0) " + "scale3d(" + scale + "," + scale + ", 1)";

            SeatContentRowNum.style.transform = transform_row;
            SeatContentRowNum.style.oTransform = transform_row;
            SeatContentRowNum.style.msTransform = transform_row;
            SeatContentRowNum.style.mozTransform = transform_row;
            SeatContentRowNum.style.webkitTransform = transform_row;

            SeatContentNum.style.transform = transform;
            SeatContentNum.style.oTransform = transform;
            SeatContentNum.style.msTransform = transform;
            SeatContentNum.style.mozTransform = transform;
            SeatContentNum.style.webkitTransform = transform;
        });
    }

    function getTop(e)
    {
        var offset = e.offsetTop;
        if (e.offsetParent != null)
            offset += getTop(e.offsetParent);
        return offset;
    }

	$('.popup_watch .instructions').click(function(){
		$('#tongdui').show();
	});
	$('.popup_cash .instructions').click(function(){
		$('#xianjin').show();
	});
	$('.popup_prompt').click(function(){
		$(this).hide();
	})


























//    var activityName = $("#activity_name")[0];
//    var slug = $("#slug")[0];
//
//	var codePayTip = $("#code_pay_tip");
//	codePayTip.bind("mouseover", function(){
//		this.children[0].style.display = "block";
//	}).bind("mouseout", function(){
//		this.children[0].style.display = "none";
//	});
//
//	 var check_result = $("#check_result"), cut_money = $("#cut_money");
//	 if(check_box) {
//		$("#check_box").click(function(){
//			$('#fav_code input')[0].value = '';
//			if(check_box.checked){
//				fav_code.css("display", "inline-block");
//			}
//			else{
//				check_result.css("display","none");
//				cut_money.css("display","none");
//				fav_code.css("display", "none");
//			}
//			/* if(parseInt(payMoney.innerHTML) != 0){
//				if(check_box.checked && check_box_tag){
//					payMoney.innerHTML = (parseFloat(payMoney.innerHTML) - 2).toFixed(1) + '元 = ' + (parseFloat(payMoney.innerHTML)).toFixed(1) + '元' + ' - 2元';
//					check_box_tag = false;
//				}
//				else if(!check_box.checked){
//					payMoney.innerHTML = (parseFloat(payMoney.innerHTML) + 2).toFixed(1) + ' 元';
//					check_box_tag = true;
//				}
//			} */
//		});
//	 }
//	 //有优惠码
//	if(check_box){
//		$("#cdkey").focus(function(){
//			this.value = '';
//			check_result.css("display","none");
//			cut_money.css("display","none");
//		});
//		$("#cdkey").blur(function(){
//			if(this.value && this.value.length ==6){
//				$.ajax({
//						 type: "get",
//						 async: false,
//						 url: 'http://event.leyingke.com/act/xiong_chu_mo_org/coupon/cdkey/?coupon_cdkey='+ this.value,
//						 dataType: "jsonp",
//						 jsonp: "callback",
//						 jsonpCallback:"validcode",
//						 success: function(json){
//							check_result.css("display","inline-block");
//							if(json.result == 'success'){
//								check_result[0].innerHTML = '验证成功';
//								cut_money.css("display","inline-block");
//								cut_money[0].innerHTML = ' - ' + json.price + '元';
//								cutnum = json.price;
//							}
//							else{
//								check_result[0].innerHTML = '验证失败';
//								cut_money.css("display","none");
//							}
//						 },
//						 error: function(){
//							 alert('您的网络不给力，挪个地儿试试~~');
//						 }
//					 });
//			}
//			else{
//				if(this.value.length !=6 && this.value){
//					alert("您输入的优惠券码格式不正确！");
//				}
//				cut_money.css("display","none");
//			}
//		});
//	}
//
//
//
//	//加载城市影院列表
//	var selCinema = $("#selCinema"), selCity = $("#selCity");
//	$.ajax({
//        type: "get",
//        async: false,
//        url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/city/?format=jsonp',
//        dataType: "jsonp",
//        jsonp: "callback",
//        jsonpCallback:"ajaxCityList",
//        success: function(json){
//            var citylist_json = json.results, htmls = [], selectCinemaBtn = $("#select_cinema_btn"), selectCityBtn = $("#select_city_btn"), cityId = $("#city_id")[0], hallId = $("#hall_id")[0], activity_session = $("#activity_session")[0];
//            if(citylist_json.length == 1){
//                htmls.push(['<option value="', citylist_json[0].cityid ,'">', citylist_json[0].cityname ,'</option>'].join(''));
//                selCity.html(htmls.join(''));
//                selCity.attr("disabled", true);
//                cityId.value = citylist_json[0].cityid;
//                $.ajax({
//                    type: "get",
//                    async: false,
//                    url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/cinema/?format=jsonp&city='+citylist_json[0].cityid,
//                    dataType: "jsonp",
//                    jsonp: "callback",
//                    jsonpCallback:"ajaxCinemaList",
//                    success: function(json){
//                        var cinemalist_json = json.results;
//                        var htmlCon = [];
//                        if(cinemalist_json.length == 1){
//                            htmlCon.push(['<option value="', cinemalist_json[0].id ,'" title="', cinemalist_json[0].name ,'" address="' , '' , '">', cinemalist_json[0].name ,'</option>'].join(''));
//                            selCinema.html(htmlCon.join(''));
//                            selCinema.attr("disabled", true);
//                            $.ajax({
//                                type: "get",
//                                async: false,
//                                url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/session/'+cinemalist_json[0].id+'/?format=jsonp',
//                                dataType: "jsonp",
//                                jsonp: "callback",
//                                jsonpCallback:"ajaxSessionList",
//                                success: function(json){
//                                    if(json.length==1){
//                                        var activity_session_value = json[0].id;
//                                        activity_session.value = activity_session_value;
//                                        var activity_session_time = json[0].showtime;
//                                        $("#session_time")[0].innerHTML = "时间："+activity_session_time.substr(0,16);
//                                        $("#selectedCinema").css("display", "block");
//                                        $("#noSelCinema").css("display", "none");
//                                        ajaxGetSeat1(activityName.value, activity_session_value);
////                                        $("#hall_title")[0].innerHTML = selCinema.children()[selectedCinema].innerHTML;
//                                    }
//                                },
//                                error: function(){
//                                    alert('亲，网络不好哦，挪地儿试试吧~');
//                                }
//                            });
//                        }else{
//                            for(var i = 0; i < cinemalist_json.length; i++ ){
//                                htmlCon.push(['<option value="', cinemalist_json[i].id ,'" title="', cinemalist_json[i].name ,'" address="' , '' , '">', cinemalist_json[i].name ,'</option>'].join(''));
//                            }
//                            selCinema.html(htmlCon.join(''));
//                            //选择影院
//                            selCinema[0].onchange = function(){
//                                clearInfor();
//                                var selectedCinema = this.selectedIndex;
//                                $.ajax({
//                                    type: "get",
//                                    async: false,
//                                    url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/session/'+this.value+'/?format=jsonp',
//                                    dataType: "jsonp",
//                                    jsonp: "callback",
//                                    jsonpCallback:"ajaxSessionList",
//                                    success: function(json){
//                                        if(json.length==1){
//                                            var activity_session_value = json[0].id;
//                                            activity_session.value = activity_session_value;
//                                            var activity_session_time = json[0].showtime;
//                                            $("#session_time")[0].innerHTML = "时间："+activity_session_time;
//                                            $("#selectedCinema").css("display", "block");
//                                            $("#noSelCinema").css("display", "none");
//                                            ajaxGetSeat1(activityName.value, activity_session_value);
////                                            $("#hall_title")[0].innerHTML = selCinema.children()[selectedCinema].innerHTML;
//                                        }
//                                    },
//                                    error: function(){
//                                        alert('亲，网络不好哦，挪地儿试试吧~');
//                                    }
//                                });
//                            }
//                        }
//                    },
//                    error: function(){
//                        alert('亲，网络不好哦，挪地儿试试吧~');
//                    }
//                });
//            }else{
//                htmls.push(['<option value="">-城市-</option>'].join(''));
//                for(var i = 0; i < citylist_json.length; i++ ){
//                    htmls.push(['<option value="', citylist_json[i].cityid ,'">', citylist_json[i].cityname ,'</option>'].join(''));
//                }
//                selCity.html(htmls.join(''));
//                //选择城市
//                selCity[0].onchange = function(){
//                    cityId.value = this.value;
//                    clearInfor();
//                    var selectedCity = this.selectedIndex;
//                    var htmlCon = [];
//                    htmlCon.push(['<option value="">-影院-</option>'].join(''));
//                    if(selectedCity == 0){
//                        //return false;
//                    }else{
//                        $.ajax({
//                            type: "get",
//                            async: false,
//                            url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/cinema/?format=jsonp&city='+this.value,
//                            dataType: "jsonp",
//                            jsonp: "callback",
//                            jsonpCallback:"ajaxCinemaList",
//                            success: function(json){
//                                var cinemalist_json = json.results;
//                                for(var i = 0; i < cinemalist_json.length; i++ ){
//                                    htmlCon.push(['<option value="', cinemalist_json[i].id ,'" title="', cinemalist_json[i].name ,'" address="' , '' , '">', cinemalist_json[i].name ,'</option>'].join(''));
//                                }
//                                selCinema.html(htmlCon.join(''));
//                                //选择影院
//                                selCinema[0].onchange = function(){
//                                    clearInfor();
//                                    var selectedCinema = this.selectedIndex;
//                                    $.ajax({
//                                        type: "get",
//                                        async: false,
//                                        url: 'http://event.leyingke.com/act/' + activityName.value + '/booking/session/'+this.value+'/?format=jsonp',
//                                        dataType: "jsonp",
//                                        jsonp: "callback",
//                                        jsonpCallback:"ajaxSessionList",
//                                        success: function(json){
//                                            if(json.length==1){
//                                                var activity_session_value = json[0].id;
//                                                activity_session.value = activity_session_value;
//                                                var activity_session_time = json[0].showtime;
//                                                $("#session_time")[0].innerHTML = "时间："+activity_session_time;
//                                                $("#selectedCinema").css("display", "block");
//                                                $("#noSelCinema").css("display", "none");
//                                                ajaxGetSeat1(activityName.value, activity_session_value);
////                                                $("#hall_title")[0].innerHTML = selCinema.children()[selectedCinema].innerHTML;
//                                            }
//                                        },
//                                        error: function(){
//                                            alert('亲，网络不好哦，挪地儿试试吧~');
//                                        }
//                                    });
//                                }
//                            },
//                            error: function(){
//                                alert('亲，网络不好哦，挪地儿试试吧~');
//                            }
//                        });
//                    }
//                };
//            }
//		},
//        error: function(){
//            alert('亲，网络不好哦，挪地儿试试吧~');
//        }
//	});
//
//	function clearInfor(){
//		//清空右侧内容
//		$("#selectedCinema").css("display", "none");
//		$("#noSelCinema").css("display", "block");
////		$("#hall_title")[0].innerHTML = '您选择的影院';
//        if(ticketNum){
//            ticketNum.innerHTML = 0;
//        }
//		if(price && payMoney){
//			payMoney.innerHTML = 0 + ' 元';
//		}
//		$("#selectedSeatsNum_ul li").remove();
//	}
//    var oShare_Submit_btn = document.getElementById('share_submit_btn');
//    // 上传头像
//    var img =  $("#img");
//    //头像上传服务器返回地址
//    $("#img").live("change",function(){
//        var imgvalue= img.val();
//        if(imgvalue){
//            $.ajaxFileUpload({
//                url:'http://event.leyingke.com/act/' + activityName.value + '/pick/upload_pic/',
//                secureuri:false,
//                fileElementId:'img',//与页面处理代码中file相对应的ID值
//                dataType: 'json',
//                success: function (data, status){
//                    if(data.respond.status == 200){
//                        var imgurl = data.img_url;
//                        var actseatmessage_id = data.actseatmessage_id;
//                        $("#actseatmessage_id").val(actseatmessage_id);
//
//                        $("#upload_pic").attr("src", imgurl);
//                        $("#upload_pic").show();
//                    }else{
//                        alert("上传出现错误");
//                    }
//                },
//                error: function (data, status, e){
//                    alert("上传错误"+e+" data:"+data+" status: "+status);
//                }
//            });
//        }
//    });
//    // 提交消息
//    oShare_Submit_btn.onclick = function(){
//        var actseatmessage_id = $("#actseatmessage_id").val();
//        if(actseatmessage_id){
//            var oData = {"user":user.val(), "hall_id":hall_id.val(), "activity_session":activity_session.val(),
//                "no_limit":'1', "actseatmessage_id":actseatmessage_id};
//            $.ajax({
//                type: "post",
//                async: false,
//                url:'http://event.leyingke.com/act/' + activityName.value + '/pick/seat_message/',
//                data: oData,
//                success: function(json){
//                    var status = json.respond.status;
//                    if(status == 200){
//                        alert('上传成功~');
//                    }
//                    else{
//                        alert(json.msg);
//                    }
//                },
//                error: function(){
//                    alert('上传失败~');
//                }
//            });
//        }
//    }
	$('.act_join_button').click(function(){
		$(this).hide();
		$('.hidden_box').show();
	});
	$('.act_join_button').hide();
        $('.hidden_box').show();
});
