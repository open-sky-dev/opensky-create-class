import type { VariantOptions, VariantGroupOptions, CompoundRule } from './types'

interface VariantProps {
    resetStyles?: boolean | string
    [prop: string]: boolean | string | number | undefined
}

interface VariantResult {
    classes: string
    [variantProp: string]: string | boolean | number | undefined
}

/**
 * Creates a variant-based styling system for components.
 * Supports base styles, variant groups, compound variants, and reset functionality.
 */
export function createVariants(options: VariantOptions, props: VariantProps): VariantResult {
    const result: VariantResult = {
        classes: ''
    }

    Object.keys(options)
        .filter((key) => key !== 'base' && key !== 'reset' && key !== 'compound')
        .forEach((key) => {
            result[key] = undefined
        })

    if (props.resetStyles !== undefined) {
        result.classes = options.reset || ''

        Object.keys(result).forEach((key) => {
            if (key !== 'classes') {
                result[key] = '_reset'
            }
        })

        return result
    }

    let classList = options.base || ''

    for (const [groupName, groupOptions] of Object.entries(options)) {
        if (groupName === 'base' || groupName === 'compound' || groupName === 'reset') continue

        if (typeof groupOptions === 'string') {
            const propValue = props[groupName]
            if (propValue === true) {
                result[groupName] = true
                classList += ' ' + groupOptions
            } else {
                result[groupName] = false
            }
            continue
        }

        if (typeof groupOptions !== 'object' || groupOptions === null || Array.isArray(groupOptions)) {
            continue
        }

        const propValue = props[groupName]
        if (propValue !== undefined) {
            if (typeof propValue === 'string') {
                result[groupName] = propValue
                const variantClasses = groupOptions[propValue]
                if (variantClasses) {
                    classList += ' ' + variantClasses
                } else {
                    classList += ' ' + propValue
                }
            }
        } else if (groupOptions._default) {
            const defaultValue = groupOptions._default
            const defaultClasses = groupOptions[defaultValue]
            if (defaultClasses) {
                result[groupName] = defaultValue
                classList += ' ' + defaultClasses
            } else {
                result[groupName] = '_custom'
                classList += ' ' + defaultValue
            }
        }
    }

    if (options.compound) {
        for (const compound of options.compound) {
            const isMatch = Object.entries(compound).every(([key, value]) => {
                if (key === 'classes') return true
                return result[key] === value
            })
            if (isMatch && compound.classes) {
                classList += ' ' + compound.classes
            }
        }
    }

    result.classes = classList.trim()
    return result
}