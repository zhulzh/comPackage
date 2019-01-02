/* global */
/*
 cyan.js v0.9.7
 (c) 2016 zlz
 Released under the MIT License.
 */
class Cyan {
    coord(evt) {
        const x = evt.clientX + document.documentElement.scrollLeft;
        const y = evt.clientY + document.documentElement.scrollTop;
        return {
            x,
            y
        };
    }

    // 获取元素样式
    getStyle(el, style) {
        let gs = null;
        if (el.currentStyle) {
            gs = el.currentStyle.style;
        } else if (window.getComputedStyle) {
            gs = window.getComputedStyle(el, null).getPropertyValue(style);
        }
        return gs;
    }

    // 加载css
    loadCss(url, cb) {
        const node = document.createElement('link');
        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;
        document.getElementsByTagName('head')[0].appendChild(node);
        const poll = function (n, cba) {
            if (cba.isCalled) {
                return;
            }
            let isLoaded = false;
            if (/webkit/i.test(navigator.userAgent)) {
                if (n.sheet) {
                    isLoaded = true;
                }
            } else if (n.sheet) {
                try {
                    if (n.sheet.cssRules) {
                        isLoaded = true;
                    }
                } catch (ex) {
                    if (ex.code === 1000) {
                        isLoaded = true;
                    }
                }
            }
            if (isLoaded) {
                setTimeout(() => {
                    cba();
                }, 1);
            } else {
                setTimeout(() => {
                    poll(n, cba);
                }, 1);
            }
        };
        if (node.attachEvent) {
            node.attachEvent('onload', cb);
        } else {
            setTimeout(() => {
                poll(node, cb);
            }, 0);
        }
    }

    // 批量加载js
    loadJs(urls, cb) {
        let i = 0;
        let script;
        const loop = function () {
            if (urls.length === 0) {
                return false;
            } if (i === urls.length) {
                if (cb && cb instanceof Function) {
                    cb();
                }
                return false;
            }
            script = document.createElement('script');
            script.type = 'text/javascript';
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        i += 1;
                        loop();
                    }
                };
            } else {
                script.onload = function () {
                    i += 1;
                    loop();
                };
            }
            script.src = urls[i];
            document.body.appendChild(script);
        };
        loop();
    }

    // 顶部提示，自动隐藏
    pop(txt, type, cb) {
        const jct = {};
        const cssText = 'transition:opacity ease-in 1s; border-radius: 0 0 5px 5px; position:fixed; z-index:100000000; opacity:0.8; left:1px; top:0; padding:3px 20px; text-align:center; background:#F2DEDE; color:#333; font-weight:normal;';
        jct.pp = document.createElement('div');
        jct.pp.id = 'cyanPop';
        jct.pp.innerHTML = txt;
        document.body.appendChild(jct.pp);
        switch (type) {
            case 'error':
                jct.pp.style.cssText = cssText + ' background:#f2dede; color:#a94442;';
                break;
            case 'warning':
                jct.pp.style.cssText = cssText + ' background:#fcf8e3; color:#8a6d3b;';
                break;
            case 'success':
                jct.pp.style.cssText = cssText + ' background:#dff0d8; color:#3c763d;';
                break;
            default:
                jct.pp.style.cssText = cssText + ' background:#d9edf7; color:#31708f';
                break;
        }
        jct.pp.style.left = (document.documentElement.clientWidth - jct.pp.offsetWidth) / 2 + 'px';
        if (cb && cb instanceof Function) {
            cb();
        }
        window.setTimeout(() => {
            document.getElementById('cyanPop').style.opacity = 0;
        }, 2000);
        window.setTimeout(() => {
            document.body.removeChild(jct.pp);
        }, 3000);
    }

    //
    alert(txt, event) {
        const jct = {};
        let cssText = 'transition:opacity ease-in 1s; border-radius: 10px; position:fixed; z-index:100000000; opacity:.8; left:1px; top:50%; padding:3px 20px; text-align:center; background:#5A5858; color:#FFF; font-weight:normal;';
        jct.pp = document.createElement('div');
        jct.pp.id = 'cyanPop';
        jct.pp.innerHTML = txt;
        document.body.appendChild(jct.pp);
        if (event) {
            cssText = `transition:opacity ease-in 1s; border-radius: 10px; position:fixed; z-index:100000000; opacity:.8; left:1px; top:${event.clientY
                - document.getElementById('cyanPop').offsetHeight
                - 6
                - event.offsetY
                - 20}px; padding:3px 20px; text-align:center; background:#5A5858; color:#FFF; font-weight:normal;`;
        }
        jct.pp.style.cssText = cssText;
        jct.pp.style.left = (document.documentElement.clientWidth - jct.pp.offsetWidth) / 2 + 'px';
        window.setTimeout(() => {
            document.getElementById('cyanPop').style.opacity = 0;
        }, 2000);
        window.setTimeout(() => {
            document.body.removeChild(jct.pp);
        }, 3000);
    }

    confirm(cb, txt) {
        let cbVal = false;
        if (!txt) {
            txt = '确定删除？';
        }
        const htmStr = '<div style="z-index:100000000; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.4)"></div><div style="z-index:100000001;font-size:13px;background:#fff;border-radius:5px;position:fixed;width:300px; height:120px; top:50%; left:50%; margin-left:-150px; margin-top:-125px;border:1px solid #ddd; color:#333;"><div style="text-align:center; margin-top:30px;height:50px;">' + txt + '</div><div style="text-align:center;font-size:12px;"><span class="cyan-confirm-y" style="background:#337ab7; color:#fff;border:1px solid #337ab7; cursor:pointer; padding:5px 20px;border-radius:5px;margin-right:10px;">确定</span><span class="cyan-confirm-n" style="background:#f1f1f1;border:1px solid #ddd; cursor:pointer; padding:5px 20px;border-radius:5px;">取消</span></div></div>';
        const el = document.createElement('div');
        el.innerHTML = htmStr;
        document.body.appendChild(el);
        const si = setInterval(() => {
            if (el) {
                document.body.removeChild(el);
                clearInterval(si);
                if (cb && cb instanceof Function) {
                    cb(cbVal);
                }
            }
        }, 6e4);
        document.querySelector('.cyan-confirm-y').addEventListener('click', () => {
            clearInterval(si);
            document.body.removeChild(el);
            cbVal = true;
            if (cb && cb instanceof Function) {
                cb(cbVal);
            }
        }, false);
        document.querySelector('.cyan-confirm-n').addEventListener('click', () => {
            clearInterval(si);
            document.body.removeChild(el);
            if (cb && cb instanceof Function) {
                cb(cbVal);
            }
        }, false);
    }

    // 返回当前年月日星期
    date() {
        const d = new Date();
        const wd = new Array(7);
        wd[0] = '星期日';
        wd[1] = '星期一';
        wd[2] = '星期二';
        wd[3] = '星期三';
        wd[4] = '星期四';
        wd[5] = '星期五';
        wd[6] = '星期六';
        const dt = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + wd[d.getDay()];
        return dt;
    }

    // 获取url参数name的值
    getUrlParam(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        const r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    // 获取pathName的值
    getPathName(param) {
        const pathName = window.location.pathname.split('/').splice(1);
        if (pathName[param] !== '' && pathName[param].indexOf('.') === -1) {
            return decodeURIComponent(pathName[param]);
        }
        return null;
    }

    // 邮箱正则测试
    emailTest(val) {
        const regexp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
        return !regexp.test(val);
    }

    // 电话号码正则测试
    telTest(val) {
        const regexp = /((\d{11})|^((\d{7,8})|(\d{5}|d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
        return !regexp.test(val);
    }

    // 手机号正则测试
    phoneTest(val) {
        const regexp = /^(0?1\d{10})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/;
        return !regexp.test(val);
    }

    // 查找数组arr的val是否存在
    arrFind(arr, val) {
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i] === val) {
                return i;
            }
        }
        return -1;
    }

    // 去除HTML标签
    removeHtmlTag(html) {
        html = html.replace(/(\n)/g, '');
        html = html.replace(/(\t)/g, '');
        html = html.replace(/(\r)/g, '');
        html = html.replace(/<\/?[^>]*>/g, '');
        html = html.replace(/\s*/g, '');
        return html;
    }

    // ajax封装
    crud(crud, cb, ecb) {
        if (crud.method.toUpperCase() === 'GET') {
            crud.data._v = 0;
        }
        $.ajax({
            url: crud.url,
            method: crud.method,
            data: crud.data,
            headers: crud.headers || null,
            beforeSend: crud.beforeSend || null,
            dataType: crud.dataType || 'json',
            async: crud.async || true,
            contentType: crud.contentType || 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            if (res.errorcode !== 0 && res.errordesc !== '' && !crud.noErrMSG) {
                this.alert(res.errordesc);
            }
            if (cb && cb instanceof Function) {
                cb(res);
            }
        }, res => {
            if (res.status === 0) {
                this.alert('未连接到网络，请稍后再试');
            }
            if (res.errorcode === 400) {
                this.alert('错误请求');
            }
            if (res.errorcode === 401) {
                this.alert('未经授权的访问');
            }
            if (res.errorcode === 404) {
                this.alert('请求失败');
            }
            if (res.errorcode === 500) {
                this.alert('服务器内部错误');
            }
            if (ecb && ecb instanceof Function) {
                ecb(res);
            }
        });
    }

    setHome(obj, url) {
        try {
            obj.style.behavior = 'url(#default#homepage)';
            obj.setHomePage(url);
        } catch (e) {
            if (window.netscape) {
                try {
                    window.netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                } catch (ev) {
                    this.pop("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
                }
            } else {
                this.pop('抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【' + url + '】设置为首页。');
            }
        }
    }

    addFav(title, url) {
        try {
            window.external.addFavorite(url, title);
        } catch (e) {
            try {
                window.sidebar.addPanel(title, url, '');
            } catch (ev) {
                this.pop('抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加');
            }
        }
    }

    get isIphone() {
        return navigator.userAgent.match(/iPhone/i) !== null;
    }

    get isIPad() {
        return navigator.userAgent.match(/iPad/i) !== null;
    }

    get isIos() {
        return navigator.userAgent.match(/iPhone/i) !== null || navigator.userAgent.match(/iPad/i) !== null;
    }

    get isAndroid() {
        return navigator.userAgent.match(/Android/i) !== null;
    }

    get isWX() {
        return navigator.userAgent.match(/MicroMessenger/i) !== null;
    }

    get poweredBy() {
        return 'powered by zlz.';
    }
}
const cyan = new Cyan();
window.cyan = cyan;
export default cyan;
Array.prototype.indexOf = function (val) {
    for (let i = 0; i < this.length; i += 1) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
};
// 删除数组值val
Array.prototype.remove = function (val) {
    const index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
// 数组去重
Array.prototype.unique = function () {
    const arr = [];
    for (let i = 0; i < this.length; i += 1) {
        if (arr.indexOf(this[i]) === -1) {
            arr.push(this[i]);
        }
    }
    return arr;
};
// console兼容
if (!window.console) {
    window.console = { log() {} };
}
