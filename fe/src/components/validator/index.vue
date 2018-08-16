<template>
    <div data-key="validator" :data-uuid="uuid">
        <slot></slot>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { refs, definition } from './directive'
    import { getRule, addRule, getMessage, setMessage } from './rule'
    import { guid, parseRules, getElementByForm, getElementByInput } from './utils'
    
    Vue.directive('submit', definition)

    export default {
        props: {
            name: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                rules: {},
                element: null
            }
        },
        computed: {
            uuid() {
                return guid()
            },
            validators() {
                return this.$vnode.context.$options.validators
            }
        },
        methods: {
            execute() {
                let result = true

                this.$emit('validate', this.$el)

                for(let index = 0; index < this.rules.length; index++) {
                    let rule, fn, match

                    rule = this.rules[index]
                    fn = this.getRule(rule)
                    
                    if(!fn(this.element.value, this.element, match = this.rules[++index])) {
                        result = {
                            rule: rule,
                            name: this.name,
                            element: this.element,
                            value: this.element.value,
                            message: this.getMessage(rule, this.name, match)
                        }

                        break
                    }
                }

                if (typeof result === 'boolean') {
                    this.$emit('validated', {
                        rule: '',
                        message: '',
                        name: this.name,
                        element: this.element,
                        value: this.element.value
                    }, this.$el)
                } else {
                    this.$emit('validated', result, this.$el)
                }

                return result
            },
            getRule(rule) {
                if(this.validators && this.validators[rule]) {
                    return this.validators[rule]['handler']
                }

                return getRule(rule)
            },
            getMessage(rule, name, match) {
                let message = getMessage(rule)

                if (this.validators && this.validators[rule]) {
                    message = this.validators[rule]['message'] || ''
                }
                
                return message.replace('{{name}}', name).replace(`{{${rule}}}`, match)
            },
            mountedEvents() {
                let tagName, type, eventName

                eventName = 'blur'
                type = this.element.type
                tagName = this.element.tagName.toUpperCase()

                if(tagName === 'SELECT' || type === 'RADIO' || type === 'CHECKBOX' || type === 'FILE') {
                    eventName = 'change'
                }
                
                this.element.addEventListener(eventName, this.execute)
            },
            unmountedEvents() {
                let tagName, type, eventName

                eventName = 'blur'
                type = this.element.type
                tagName = this.element.tagName.toUpperCase()

                if(tagName === 'SELECT' || type === 'RADIO' || type === 'CHECKBOX' || type === 'FILE') {
                    eventName = 'change'
                }

                this.element.removeEventListener(eventName, this.execute)
            }
        },
        mounted() {
            if(!getElementByForm(this.$el)) {
                console.error('Validator component must within the form element')
                return
            }

            if(!(this.element = getElementByInput(this.$el))) {
                console.error('Validator component must contain the input element')
                return
            }

            this.mountedEvents()
            refs[this.uuid] = this
            this.rules = parseRules(this.$el, this.validators)
        },
        beforeDestroy() {
            delete refs[this.uuid]
            this.unmountedEvents()
        },
        getRule,
        addRule,
        setMessage
    }
</script>