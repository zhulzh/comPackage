/* global cyan */
window.cyan = window.cyan || {};
cyan.loadJs = function (urls, cb) {
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
};
