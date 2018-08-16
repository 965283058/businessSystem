let refs, definition

refs = {}
definition = {
    bind(el, binding, vnode) {
        el.binding = binding
        el.setAttribute('novalidate', 'novalidate')

        el.callback = function (e) {
            e.preventDefault()

            let count, components, component, result

            count = 0
            components = Array.from(el.querySelectorAll('[data-key="validator"]'))

            for (component of components) {
                if ((result = refs[component.dataset.uuid].execute()) !== true) {
                    break
                }

                count += 1
            }

            el.binding.value(count === components.length ? null : result, e)
        }

        el.addEventListener('submit', el.callback, false)
    },
    componentUpdated(el, binding, vnode) {
        el.binding = binding
    },
    unbind(el, binding, vnode) {
        el.removeEventListener('submit', el.callback, false)
        delete el.binding
        delete el.callback
    }
}

export {
    refs,
    definition
}