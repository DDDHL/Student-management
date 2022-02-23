/**
 * 函数防抖 
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
 export const Debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    return function() {
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};


/**
 1. 函数节流
 2. @param fn
 3. @param interval
 4. @returns {Function}
 5. @constructor
 */
export const Throttle = (fn, t) => {
    let last;
    let timer;
    let interval = t || 500;
    return function() {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
}
