function calculateBodyPosition(el, bindings, context) {
    console.log('contextTest @ calculateBodyPosition', context);
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
            el.resizeFn = () => {
                calculateBodyPosition(el, bindings, context);    
            };
            calculateBodyPosition(el, bindings, context);
            context.$on('input', el.resizeFn);
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
            }
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    },
}
