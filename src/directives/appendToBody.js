import debounce from "lodash.debounce";

function calculateBodyPosition(el, bindings, context) {
    const {height, top, left, width} = context.$refs.toggle.getBoundingClientRect();
    let scrollX = window.scrollX || window.pageXOffset;
    let scrollY = window.scrollY || window.pageYOffset;
    el.unbindPosition = context.calculatePosition(el, context, {
        width: width + 'px',
        left: (scrollX + left) + 'px',
        top: (scrollY + top + height) + 'px',
    });
}

export default {
    inserted (el, bindings, {context}) {
        if (context.appendToBody) {
            el.calcBodyPosition = () => {
                calculateBodyPosition(el, bindings, context);
            };
            el.observeInputChangeFn = () => {
                context.$nextTick(()=>{
                    el.calcBodyPosition();
                })
            };
            el.resizeFn = debounce(() => {
                console.log('in resize fn from vue-select')
                el.calcBodyPosition();
            }, 200);
            el.calcBodyPosition();
            context.$on('option:selected', el.observeInputChangeFn);
            context.$on('option:deselected', el.observeInputChangeFn);
            window.addEventListener('resize', el.resizeFn);
            document.body.appendChild(el);
        }
    },

    unbind (el, bindings, {context}) {
        if (context.appendToBody) {
            if (el.unbindPosition && typeof el.unbindPosition === 'function') {
                el.unbindPosition();
            }
            if( el.resizeFn ) {
                window.removeEventListener('resize', el.resizeFn);
                context.$off('option:selected', el.observeInputChangeFn);
                context.$off('option:deselected', el.observeInputChangeFn);
            }
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    },
}
