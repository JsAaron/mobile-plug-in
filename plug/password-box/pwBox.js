/**
 * 密码输入框
 */
function pwBox(fn) {

    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var START_EV = SUPPORT_TOUCH ? 'touchstart' : 'mousedown';
    var END_EV = SUPPORT_TOUCH ? 'touchend' : 'mouseup';

    //密码输入框
    var keyboard = document.querySelector('.cm-modal-bd')
    //密码显示框
    var pwBox = document.querySelector('.cm-password-box');
    //密码框的li框
    var pwBox_li = pwBox.querySelectorAll("li");

    //密码
    var passwordArr = [];

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

    keyboard.addEventListener(START_EV, function (e) {
        start(compatibilityEvent(e))
    }, false);
    keyboard.addEventListener(END_EV, function (e) {
        end(compatibilityEvent(e))
    }, false);

    function addPassWord(value) {
        passwordArr.push(value)
        pwBox_li[passwordArr.length - 1].children[0].style.display = "block"
    }

    function delPassWord() {
        passwordArr.pop();
        pwBox_li[passwordArr.length].children[0].style.display = "none"
    }

    function isNumer(value) {
        return value && /^[0-9]*$/.test(value)
    }

    var delName = ['icon-del-img', 'item-del'];

    function action(event, numberback, delback) {
        var target = event.target;
        if (passwordArr.length > 5) return
        if (~delName.indexOf(target.className)) {
            delback && delback(target)
            return;
        }
        var textContent = target.textContent
        if (isNumer(textContent)) {
            textContent = Number(textContent)
            numberback && numberback(target, textContent);
            if (passwordArr.length === 6) {
                if (fn) {
                    fn(passwordArr, function () {
                    }, function () {
                        passwordArr = [];
                        for (var i = 0; i < pwBox_li.length; i++) {
                            pwBox_li[i].children[0].style.display = "none"
                        }
                    })
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
        action(event, function (elem, number) {
            setColor(elem, '#efefef')
        }, function (elem) {
            setColor(filter(elem), '#fff')
        })
    }

    function end(event) {
        action(event, function (elem, number) {
            setColor(elem, '#fff')
            addPassWord(number)
        }, function (elem) {
            setColor(filter(elem), '#e2e2e2')
            delPassWord()
        })
    }


}



