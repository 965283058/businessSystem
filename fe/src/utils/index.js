// 添加千分符
export const milliFormat = (() => {
    return (input) => input && input.toString()
        .replace(/(^|\s)\d+(?=\.?\d*($|\s))/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
})()

// trim
export const trim = (val) => {
    return val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

// 加
export const accAdd = (arg1, arg2) => {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

// 减
export const accSub = (a, b) => {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (accMul(a, e) - accMul(b, e)) / e;
}

// 乘
export const accMul = (a, b) => {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {
    }
    try {
        c += e.split(".")[1].length;
    } catch (f) {
    }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// 除
export const accDiv = (a, b) => {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {
    }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {
    }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), accMul(c / d, Math.pow(10, f - e));
}

export const dateFormater = (date, isAddZero) => {
    date = date ? new Date(date) : new Date()
    let formater = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millsecond: date.getMilliseconds()
    }
    isAddZero && Object.keys(formater).forEach(k => {
        let n = formater[k]
        formater[k] = String(n).length == 1 ? `0${n}` : n
    })
    return formater
}


export const getDateString = (date = new Date(), isAddZero = true) => {
    let dateObj = dateFormater(date, isAddZero)
    return `${dateObj.year}-${dateObj.month}-${dateObj.date}`
}

export const getDateTimeString = (date = new Date(), isAddZero = true, millisecond = false) => {
    let dateObj = dateFormater(date, isAddZero)
    let str = `${dateObj.year}-${dateObj.month}-${dateObj.date} ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`
    return millisecond ? `${str}:${dateObj.millsecond}` : str
}


export const guid = ()=> {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


export const hasPower = (code)=> {
    let admin = null
    try {
        admin = JSON.parse(sessionStorage.getItem("admin"))
    } catch (e) {
        return false
    }

    if (admin.superAdmin === 1) {
        return true
    }
    if (admin.apis.indexOf(code) > -1) {
        return true
    }
    return false
}