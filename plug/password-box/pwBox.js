/**
 * 密码输入框
 * @param  {[type]} keyboardContainer [键盘节点]
 * @param  {[type]} passWord1 [密码框节点1]
 * @param  {[type]} passWord2 [密码框节点2]
 * @return {[type]}            [description]
 */
function pwBox(keyboardContainer, passWord1, passWord2) {

    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var START_EV = SUPPORT_TOUCH ? 'touchstart' : 'mousedown';
    var END_EV = SUPPORT_TOUCH ? 'touchend' : 'mouseup';

    var passWordChild_1 = passWord1.querySelectorAll("li");
    var passWordChild_2 = passWord2 && passWord2.querySelectorAll("li");

    var callback = {
        check   : null,
        success : null
    }
    var passwordArr = [];
    var passWordCheck = [];
    var startCheck = false;

    function compatibilityEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        var point;
        if (e.touches && e.touches[0]) {
            point = e.touches[0];
        } else {
            point = e;
        }
        return point
    }

    keyboardContainer.addEventListener(START_EV, function(e) {
        start(compatibilityEvent(e))
    }, false);
    keyboardContainer.addEventListener(END_EV, function(e) {
        end(compatibilityEvent(e))
    }, false);


    function switchArgs(fn){
        if(!startCheck){
            fn(passwordArr,passWordChild_1)
        }else{
            fn(passWordCheck,passWordChild_2)
        }
    }

    function addPassWord(value) {
        switchArgs(function(arr,elem) {
            arr.push(value);
            elem[arr.length - 1].children[0].style.display = "block";
        })
    }

    function delPassWord() {
        switchArgs (function(arr, elem) {
            arr.pop();
            elem[arr.length].children[0].style.display = "none";
        })
    }

    function isNumer(value) {
        return value && /^[0-9]*$/.test(value)
    }

    var delName = ['icon-del-img', 'item-del'];

    function action(event, numberback, delback) {
        var target = event.target;
        //密码上下文
        var passwordContent = passwordArr;
        if (startCheck) { //启动检测
            passwordContent = passWordCheck; //是否换行
        } else {
            if (passwordContent.length > 5) return
        }
        if (~delName.indexOf(target.className)) {
            delback && delback(target)
            return;
        }
        var textContent = target.textContent
        if (isNumer(textContent)) {
            textContent = Number(textContent)
            numberback && numberback(target, textContent);
            if (passwordContent.length === passWordChild_1.length) {
                //第一验证
                if(!startCheck && !passWordChild_2){
                    callback.success && callback.success(passwordArr)
                    return
                }
                //如果有检测框，继续
                if (!startCheck && passWordChild_2) { 
                    startCheck = true;
                    callback.check && callback.check(true);
                }
                //验证密码
                if (passWordCheck && passWordChild_2 && passWordCheck.length === passWordChild_2.length) {
                    if (passwordArr.toString() == passWordCheck.toString()) {
                        callback.success && callback.success(passwordArr)
                    } else {
                        callback.check && callback.check(false, true);
                    }
                }


            }
            return;
        }
    }


    function setColor(element, color) {
        element.style.backgroundColor = color;
    }

    function filter(elem) {
        if (elem.className == 'icon-del-img') {
            return elem.parentNode;
        }
        return elem;
    }

    function start(event) {
        action(event, function(elem, number) {
            setColor(elem, '#efefef')
        }, function(elem) {
            setColor(filter(elem), '#fff')
        })
    }

    function end(event) {
        action(event, function(elem, number) {
            setColor(elem, '#fff')
            addPassWord(number)
        }, function(elem) {
            setColor(filter(elem), '#e2e2e2')
            delPassWord()
        })
    }


    function reset() {
        passwordArr = [];
        passWordCheck = []
        clear(passWordChild_1)
        clear(passWordChild_2)
        startCheck = false;
    }

    function clear(li){
        for (var i = 0; i < li.length; i++) {
            li[i].children[0].style.display = "none"
        }
    }

    return {
        monitor: function(args) {
            if (args.check) {
                callback.check = args.check
            }
            if (args.success) {
                callback.success = args.success;
            }
        },
        reset:function(){
            reset();
        }
    }
}
