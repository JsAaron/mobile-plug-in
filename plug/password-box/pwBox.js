/**
 * 密码输入框
 */
function pwBox(fn) {

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var START_EV = SUPPORT_TOUCH ? 'touchstart' : 'mousedown';

	//密码输入框
	var keyboard = document.querySelector('.cm-modal-bd')
	//密码显示框
	var pwBox = document.querySelector('.cm-password-box');
	//密码框的li框
	var pwBox_li = pwBox.querySelectorAll("li");

	//密码
	var passwordArr = [];
	 
    function compatibilityEvent(e) {
        var point;
        if (e.touches && e.touches[0]) {
            point = e.touches[0];
        } else {
            point = e;
        }
        return point
    }

	keyboard.addEventListener(START_EV,function(e){
		start(compatibilityEvent(e))
	},false);

	function addPassWord(value) {
		passwordArr.push(value)
		pwBox_li[passwordArr.length - 1].children[0].style.display = "block"
	}

	function delPassWord() {
		passwordArr.pop();
		pwBox_li[passwordArr.length].children[0].style.display = "none"
	}

	function isNumer(value) {
		return /^[0-9]*$/.test(value)
	}

    var del = ['icon-del-img','item-del'];

	function start(event) {
		if (passwordArr.length > 5) return
        var target = event.target;
        if(~del.indexOf(target.className)){
            delPassWord()
            return;
        }
		var textContent = target.textContent
		if (isNumer(textContent)) {
			textContent = Number(textContent)
			addPassWord(textContent)
			if (passwordArr.length === 6) {
				fn && fn(passwordArr)
			}
			return;
		}
	}

}