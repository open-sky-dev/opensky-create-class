import type { VariantOptions, VariantGroupOptions, CompoundRule } from './types'

/**
 * Props passed to select variants at runtime
 */
interface VariantProps {
    /** When true, applies reset styles and ignores all variants */
    resetStyles?: boolean | string
    /** Variant selections - can be variant names, boolean flags, or custom class strings */
    [prop: string]: boolean | string | number | undefined
}

/**
 * Result returned by createVariants containing the final classes and selected variant values
 * 
 * Note: Variant properties may contain special values:
 * - '_reset' when resetStyles is true
 * - '_custom' when using a custom class or default string
 * - The group name itself when a boolean true is passed
 */
interface VariantResult {
    /** Final merged class string */
    classes: string
    /** 
     * Selected variant values for each group
     * Can be the variant name, '_reset', '_custom', or the original prop value
     */
    [variantProp: string]: string | boolean | number | undefined
}

/**
 * Creates a variant-based styling system for components with support for base styles,
 * variant groups, compound variants, and reset functionality.
 * 
 * @param options - Variant configuration object
 * @param props - Runtime props to select variants
 * @returns Object containing the final class string and selected variant values
 * 
 * @example
 * // Basic usage with size and color variants
 * const buttonVariants = {
 *   base: 'px-4 py-2 font-medium rounded',
 *   size: {
 *     sm: 'text-sm',
 *     md: 'text-base',
 *     lg: 'text-lg',
 *     _default: 'md'
 *   },
 *   variant: {
 *     primary: 'bg-blue-500 text-white',
 *     secondary: 'bg-gray-200 text-gray-800'
 *   }
 * }
 * 
 * createVariants(buttonVariants, { size: 'lg', variant: 'primary' })
 * // Returns: { classes: 'px-4 py-2 font-medium rounded text-lg bg-blue-500 text-white', size: 'lg', variant: 'primary' }
 * 
 * @example
 * // Using boolean variants with string values
 * const cardVariants = {
 *   base: 'p-4 border rounded',
 *   elevated: 'shadow-lg',  // String value for boolean toggle
 *   bordered: 'border-2 border-gray-300'
 * }
 * 
 * createVariants(cardVariants, { elevated: true, bordered: true })
 * // Returns: { classes: 'p-4 border rounded shadow-lg border-2 border-gray-300', elevated: true, bordered: true }
 * 
 * @example
 * // Using compound variants
 * const variants = {
 *   base: 'btn',
 *   size: { sm: 'text-sm', lg: 'text-lg' },
 *   variant: { primary: 'bg-blue-500', danger: 'bg-red-500' },
 *   compound: [
 *     { size: 'lg', variant: 'danger', classes: 'font-bold uppercase' }
 *   ]
 * }
 * 
 * createVariants(variants, { size: 'lg', variant: 'danger' })
 * // Returns: { classes: 'btn text-lg bg-red-500 font-bold uppercase', size: 'lg', variant: 'danger' }
 * 
 * @example
 * // Using reset styles
 * const variants = {
 *   base: 'px-4 py-2 bg-gray-100',
 *   reset: 'p-0 bg-transparent',
 *   size: { sm: 'text-sm', lg: 'text-lg' }
 * }
 * 
 * createVariants(variants, { resetStyles: true })
 * // Returns: { classes: 'p-0 bg-transparent', size: '_reset' }
 * 
 * @example
 * // Using custom classes (not defined in variant options)
 * const variants = {
 *   base: 'btn',
 *   variant: { primary: 'bg-blue-500', secondary: 'bg-gray-500' }
 * }
 * 
 * createVariants(variants, { variant: 'custom-gradient-class' })
 * // Returns: { classes: 'btn custom-gradient-class', variant: 'custom-gradient-class' }
 */
export function createVariants(options: VariantOptions, props: VariantProps): VariantResult {
    // Object to return with classes and variant values
    const result: VariantResult = {
        classes: ''
    }

    // Add properties for each variant type
    Object.keys(options)
        .filter((key) => key !== 'base' && key !== 'reset' && key !== 'compound')
        .forEach((key) => {
            result[key] = undefined
        })

    // Check if reset is being applied
    if (props.resetStyles !== undefined) {
        result.classes = options.reset || ''

        // Mark all other variant properties as reset
        Object.keys(result).forEach((key) => {
            if (key !== 'classes') {
                result[key] = '_reset'
            }
        })

        return result
    }
    // Otherwise if not reset

    // Start by applying base classes
    let classList = options.base || ''

    // Process each variant group
    for (const [groupName, groupOptions] of Object.entries(options)) {
        // Skip base, compound, reset properties
        if (groupName === 'base' || groupName === 'compound' || groupName === 'reset') continue

        // Handle string values as boolean toggles
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

        // Skip if not an object
        if (typeof groupOptions !== 'object' || groupOptions === null || Array.isArray(groupOptions)) {
            continue
        }

        // Check if this variant was passed as a prop
        const propValue = props[groupName]
        if (propValue !== undefined) {
            // Store the selected variant value
            if (typeof propValue === 'string') {
                result[groupName] = propValue
                // Add classes if this variant exists in the definition
                // Note: undefined, null, and empty string values are treated as no-ops (no classes added)
                if (groupOptions[propValue]) {
                    classList += ' ' + groupOptions[propValue]
                }
                // If it's a string but not a defined variant, use directly as a class
                else {
                    classList += ' ' + propValue
                }
            }
        } else if (groupOptions._default) {
            // No prop passed, use default if available

            const defaultValue = groupOptions._default

            if (groupOptions[defaultValue]) {
                result[groupName] = defaultValue
                classList += ' ' + groupOptions[defaultValue]
            } else {
                result[groupName] = '_custom'
                classList += ' ' + defaultValue
            }
        }
    }

    // Process compound variants
    if (options.compound) {
        for (const compound of options.compound) {
            // Check if all conditions in this compound variant match
            const isMatch = Object.entries(compound).every(([key, value]) => {
                // Skip the 'classes' property
                if (key === 'classes') return true
                return result[key] === value
            })
            // If all conditions match, add the compound classes
            if (isMatch && compound.classes) {
                classList += ' ' + compound.classes
            }
        }
    }

    // Store the final class string
    result.classes = classList.trim()
    return result
}