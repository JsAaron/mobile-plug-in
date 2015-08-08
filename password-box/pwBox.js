/**
 * 密码输入框
 */
var pwBox = function (fn) {
    //密码输入框
    var keyboard = document.querySelector('.cm-modal-bd')
    //密码显示框
    var pwBox = document.querySelector('.cm-password-box');
    //密码框的li框
    var pwBox_li = pwBox.querySelectorAll("li");

    //密码
    var passwordArr = [];

    plat.execEvent('on', {
        context: keyboard,
        callback: {
            start: start,
            move: move,
            end: end
        }
    })

    //增加密码
    function addPassWord(value){
        passwordArr.push(value)
        pwBox_li[passwordArr.length - 1].children[0].style.display = "block"
    }

    //删除密码
    function delPassWord(){
        passwordArr.pop();
        pwBox_li[passwordArr.length].children[0].style.display = "none"
    }

    //检测数字
    function isNumer(value) {
        return /^[0-9]*$/.test(value)
    }

    function start(event) {
        if (passwordArr.length > 5) return
        var textContent = event.target.textContent
        //如果是纯数字
        if (isNumer(textContent)) {
            textContent = Number(textContent)
            addPassWord(textContent)
            if(passwordArr.length === 6){
                fn && fn(passwordArr)
            }
            return;
        }
        //删除
        if(event.target.className === 'cm-keyboard-list'){
            delPassWord()
        }
    }

    function move(event) {

    }

    function end(event) {

    }


    return {

        create: function () {

        }
    }

}


