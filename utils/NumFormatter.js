// 数字格式化方法汇总

/**
 * @description 金额展示位数计算-保留小数点后不为0的4位或2位
 * @param price 金额
 * @param type  1：四舍五入，2：向下取整
 * @param toNum 1：取小数点后不为0的两位
 * @param thousShow 1：不给千分位加逗号
 */
export function fixPrice(price,type,toNum,thousShow){
    let result=null;
    if(typeof(price) == 'string'){
        let num_re = parseFloat(price.replace(/\,/g, ""))
        // console.log(66666444,num_re)
        // result = toolNumber(num_re)
        result = num_re
    } else{
        let num_re = parseFloat(price)
        // result = toolNumber(num_re)
        result = num_re
    }
    if(result == 0){
        return 0
    }
    let x = Math.log10(result)
    let tofixedNum = 4
    if(toNum == 1) {
        tofixedNum = 2
    }
    if(x >= 1){
        let str = String(result)
        let strL = str.length
        let indexs = str.indexOf(".");
        let smallNum = Number('0' + str.substring(indexs,strL))
        let sz = Math.floor(Math.abs(Math.log10(smallNum)))
        // let sdec = Math.pow(10,sz+4)
		let sdec = Math.pow(10,tofixedNum)
        let tmpNum = null
        if(type == 1) {
            // 规则1
            tmpNum = Math.round(pluswith(result,sdec))/sdec
        } else {
            tmpNum = Math.floor(pluswith(result,sdec))/sdec
        }
        if(sz<8){
            result = tmpNum
        }
        else{
            result = tmpNum.toExponential(4)
        }
    }
    else{
        let z = Math.floor(Math.abs(x))
        let dec = parseInt(Math.pow(10,z+tofixedNum))
        let tmpresult = null
        if(type == 1) {
            // 规则1
            tmpresult = Math.round(pluswith(result,dec))/dec
        } else {
            tmpresult = Math.floor(pluswith(result,dec))/dec
        }
        if(z<8){
            result = tmpresult
        }
        else{
            result = tmpresult.toExponential(4)
            // console.log('科学计数法',result)
        }
    }
    let ls_returnData = null
    if(thousShow==1) {
        ls_returnData = result
    } else {
        ls_returnData = get_thousand_num(result)==0?0:get_thousand_num(result)
    }
    return ls_returnData
}
// 金额千分位添加逗号
export function get_thousand_num(num) {
    return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
            return $1 + ",";
        });
    });
}
// 解析千分位逗号
export function fixLimitToNumber(limit){
    let result = limit
    if(typeof(limit) == 'string'){
        result = parseFloat(limit.replace(/\,/g, ""))
    }
    return result
}
// 将科学计数法转化为普通数字
export function toolNumber(num_str) {
    console.log('将科学计数法转化为普通数字',num_str)
    num_str = num_str.toString();
    if (num_str.indexOf("+") != -1) {
        num_str = num_str.replace("+", "");
    }
    if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
        var resValue = "",
        power = "",
        result = null,
        dotIndex = 0,
        resArr = [],
        sym = "";
        var numStr = num_str.toString();
        if (numStr[0] == "-") {
            //如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
            numStr = numStr.substr(1);
            sym = "-";
        }
        if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
            var regExp = new RegExp(
                "^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$",
                "ig"
            );
            result = regExp.exec(numStr);
            if (result != null) {
                resValue = result[2];
                power = result[5];
                result = null;
            }
            if (!resValue && !power) {
                return false;
            }
            dotIndex = resValue.indexOf(".") == -1 ? 0 : resValue.indexOf(".");
            resValue = resValue.replace(".", "");
            resArr = resValue.split("");
            if (Number(power) >= 0) {
                var subres = resValue.substr(dotIndex);
                power = Number(power);
                //幂数大于小数点后面的数字位数时，后面加0
                for (var i = 0; i <= power - subres.length; i++) {
                    resArr.push("0");
                }
                if (power - subres.length < 0) {
                    resArr.splice(dotIndex + power, 0, ".");
                }
            } else {
                power = power.replace("-", "");
                power = Number(power);
                //幂数大于等于 小数点的index位置, 前面加0
                for (var i = 0; i < power - dotIndex; i++) {
                    resArr.unshift("0");
                }
                var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
                resArr.splice(n, 0, ".");
            }
        }
        resValue = resArr.join("");
        console.log('sym + resValue',sym + resValue,typeof(sym + resValue),Number(sym + resValue))
        return sym + resValue;
    } else {
        console.log('num_str',num_str)
        return num_str;
    }
}
//计算币种弹框高度
export function handleDrawerHei(confirmBuy) {
    let scrollHeight = window.screen.height;
    let scrollHeights = null,scrollHc1=true,scrollHc2=false;
    if (scrollHeight <= 568) {
        scrollHeights = "drawerHeights1";
        if(confirmBuy) {
            scrollHc1 = true
            scrollHc2 = false
        } else {
            scrollHc2 = true
            scrollHc1 = false
        }
    } else if (568 < scrollHeight && scrollHeight <= 667) {
        scrollHeights = "drawerHeights2";
    } else if (667 < scrollHeight && scrollHeight <= 736) {
        scrollHeights = "drawerHeights3";
    } else if (736 < scrollHeight && scrollHeight <= 812) {
        scrollHeights = "drawerHeights4";
    }
    return {scrollHeights:scrollHeights,scrollHc1:scrollHc1,scrollHc2:scrollHc2}
}
// 数字戳转化为想要的时间   2020-12-12 09:12:12
export function formatDateTime(inputTime,type) {
    type =( type||'-').toString()
    var date = new Date(inputTime * 1000);
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + type;
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
    return M+D+h+m;
}
// 数字戳转化时间  2020/1/1 09:12:12
export function formatDateTime1(ts) {
    let d = new Date(ts * 1000);
    return (
      d.toLocaleDateString() +
      " " +
      d.getHours() +
      ":" +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds()
    );
}

export function formatDate(ts) {
    return new Date(ts * 1000).toLocaleDateString();
}



// 精度检查
export function checkAccuracy1(inToken,outToken,drawerbuy,tokenSellPrice,tokenBuyPrice,leftInput,rightInput,isdircetion){
    let itoken = inToken
    let otoken = outToken
    let nowPrice = fixLimitToNumber(tokenSellPrice)
    if(drawerbuy) {
        nowPrice = fixLimitToNumber(tokenBuyPrice)
    }
    
    let smallLen = 0
    let sz = null
    if(isdircetion == 'left') {
        if(typeof(leftInput) == 'string') {
            if(leftInput.indexOf('.')>=0) {
                smallLen = leftInput.length - leftInput.indexOf('.') - 1
            }
        }
        let lInput = fixLimitToNumber(leftInput)
        if(smallLen > itoken.decimals) {
            if(this.$store.state.lan == 'cn') {
                this.$showFailMsg('小数点位数超过币种精度，自动调为'+itoken.decimals+'位');
            } else {
                this.$showFailMsg('The number of decimal places exceeds the currency precision, and it is automatically adjusted to'+itoken.decimals+'digits');
            }
            sz = Math.floor(Math.abs(Math.log10(lInput)))
            let sdec = Math.pow(10,itoken.decimals)
            leftInput = fixPrice(Math.floor(lInput*sdec)/sdec,2)
            rightInput = fixPrice(lInput*nowPrice,2)
        }
    } else {
        if(typeof(rightInput) == 'string') {
            if(rightInput.indexOf('.')>=0) {
                smallLen = rightInput.length - rightInput.indexOf('.') - 1
            }
        }
        let rInput = fixLimitToNumber(rightInput)
        if(smallLen > otoken.decimals) {
            if(this.$store.state.lan == 'cn') {
                this.$showFailMsg('小数点位数超过币种精度，自动调为'+otoken.decimals+'位');
            } else {
                this.$showFailMsg('The number of decimal places exceeds the currency precision, and it is automatically adjusted to'+otoken.decimals+'digits');
            }
            sz = Math.floor(Math.abs(Math.log10(rInput)))
            let sdec = Math.pow(10,otoken.decimals)
            rightInput = fixPrice(Math.floor(rInput*sdec)/sdec,2)
            leftInput = fixPrice(rInput/nowPrice,2)
        }
    }
    return {leftInput:leftInput,rightInput:rightInput}
}
// 余额检查 
export function checkBalance1(inToken,outToken,inAmount,outAmount,drawerbuy,tokenSellPrice,tokenBuyPrice,leftInput,rightInput){
    let itoken = inToken
    let otoken = outToken
    let lInput = fixLimitToNumber(leftInput)
    let rInput = fixLimitToNumber(rightInput)
    inAmount = lInput
    outAmount = rInput

    if(drawerbuy){
        itoken = outToken
        otoken = inToken
        
        outAmount = lInput
        inAmount = rInput
    }

    if (parseFloat(inAmount) > parseFloat(itoken.uBalance)) {
        if(this.$store.state.lan == 'cn') {
            this.$showFailMsg('币种余额不足，交易量已自动调整');
        } else {
            this.$showFailMsg('Insufficient currency balance, transaction volume has been automatically adjusted');
        }
        if(drawerbuy){
            rightInput = fixPrice(itoken.uBalance,2) 
            leftInput = fixPrice(itoken.uBalance/tokenBuyPrice,2)
        }
        else{
            leftInput = fixPrice(itoken.uBalance,2)
            rightInput = fixPrice(itoken.uBalance*tokenSellPrice,2)
        }
        // return this.inputErrorType.balanceMax
    } else {
        if(leftInput != '') {
            leftInput = fixPrice(lInput)
            rightInput = fixPrice(rInput)
        }
    }
    return {leftInput:leftInput,rightInput:rightInput}
    // return this.inputErrorType.normal
}
// 限额检查
export function checkOverInput1(inToken,outToken,inAmount,outAmount,drawerbuy,tokenSellAmountLimit,unitSellAmountLimit,tokenSellPrice,tokenBuyAmountLimit,unitBuyAmountLimit,tokenBuyPrice,leftInput,rightInput) {
    let itoken = inToken
    let otoken = outToken
    let lInput = fixLimitToNumber(leftInput)
    let rInput = fixLimitToNumber(rightInput)
    inAmount = lInput
    outAmount = rInput
    
    let tokenMaxLimit = fixLimitToNumber(tokenSellAmountLimit) //卖出左边上限
    let unitMaxLimit = fixLimitToNumber(unitSellAmountLimit)	//卖出右边边上限
    let nowPrice = fixLimitToNumber(tokenSellPrice)

    let maxNum = tokenMaxLimit*nowPrice
    console.log('maxNum',maxNum)
    if(drawerbuy){
        
        itoken = outToken
        otoken = inToken
        
        outAmount = lInput
        inAmount = rInput

        tokenMaxLimit = fixLimitToNumber(tokenBuyAmountLimit) //买入左边上限
        unitMaxLimit = fixLimitToNumber(unitBuyAmountLimit)	//买入右边上限
        nowPrice = fixLimitToNumber(tokenBuyPrice)	//买入当前价格

        maxNum = tokenMaxLimit*nowPrice
        console.log('maxNum22222',maxNum)

    }

    if (parseFloat(outAmount) > parseFloat(otoken.balance)) {
        if(this.$store.state.lan == 'cn') {
            this.$showFailMsg('合约池余额不足！');
        } else {
            this.$showFailMsg('Insufficient contract pool balance!');
        }
        // this.exchangDisabled = true
        // return this.inputErrorType.contractBalanceMax
    }

    let lepr = lInput*nowPrice
    if(maxNum < unitMaxLimit) {
        if(lepr > maxNum) {
            if(this.$store.state.lan == 'cn') {
                this.$showFailMsg('高于兑换限额，交易量已自动调整');
            } else {
                this.$showFailMsg('Above the exchange limit, the transaction volume has been automatically adjusted');
            }
            leftInput = get_thousand_num(tokenMaxLimit)
            rightInput = fixPrice(tokenMaxLimit*nowPrice,2)
        }
    } else {
        if(lepr > unitMaxLimit) {
            if(this.$store.state.lan == 'cn') {
                this.$showFailMsg('高于兑换限额，交易量已自动调整');
            } else {
                this.$showFailMsg('Above the exchange limit, the transaction volume has been automatically adjusted');
            }
            rightInput = get_thousand_num(unitMaxLimit)
            leftInput = fixPrice(unitMaxLimit/nowPrice,2)
        }
    }
    return {leftInput:leftInput,rightInput:rightInput,inAmount:inAmount,outAmount:outAmount}
}
