import { getRule } from './rule'

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }

    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

function parseRules(element, validators) {
    let rules = []

    for (let attr of Array.from(element.attributes)) {
        if (attr.name.indexOf('data-') === -1 && attr.name !== 'class') {
            if ((validators && validators[attr.name]) || getRule(attr.name)) {
                rules = [...rules, attr.name, attr.value]
                element.removeAttribute(attr.name)
            }
        }
    }

    return rules
}

function getElementByForm(el) {
    if (!el.tagName) {
        return
    }

    if (el.tagName.toUpperCase() === 'FORM') {
        return el
    }

    return getElementByForm(el.parentNode)
}

function getElementByInput(el) {
    return el.querySelector('input') || el.querySelector('select') || el.querySelector('textarea')
}

export {
    guid,
    parseRules,
    getElementByForm,
    getElementByInput
}