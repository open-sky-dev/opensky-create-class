/**
 * Configuration for a single variant group with multiple options and an optional default
 * @example
 * { sm: 'text-sm', md: 'text-base', lg: 'text-lg', _default: 'md' }
 */
export type VariantGroupOptions = {
    [key: string]: string | undefined | null
    /** The default variant to use when none is specified. Can reference a key in this group or be raw classes */
    _default?: string
}

/**
 * Defines compound variant rules that apply classes when multiple variants match specific values
 * @example
 * { size: 'lg', variant: 'primary', classes: 'shadow-lg hover:shadow-xl' }
 */
export type CompoundRule = {
    [variantGroup: string]: string
    classes: string
}

/**
 * Complete variant configuration including base classes, variants, compound rules, and reset styles
 * 
 * @example
 * const buttonVariants: VariantOptions = {
 *   base: 'px-4 py-2 font-medium rounded',
 *   reset: 'p-0 bg-transparent border-0',
 *   size: {
 *     sm: 'text-sm',
 *     md: 'text-base', 
 *     lg: 'text-lg',
 *     _default: 'md'
 *   },
 *   variant: {
 *     primary: 'bg-blue-500 text-white',
 *     secondary: 'bg-gray-200 text-gray-800'
 *   },
 *   compound: [
 *     { size: 'lg', variant: 'primary', classes: 'shadow-lg' }
 *   ]
 * }
 */
export type VariantOptions = {
    /** Base classes that are always applied */
    base: string
    /** Classes to apply when resetStyles prop is true (overrides all other styles) */
    reset?: string
    /** Compound variant rules that apply when multiple variants match */
    compound?: CompoundRule[] | undefined
    /** 
     * Variant group definitions
     * - String values create boolean toggles that apply those classes when true
     * - VariantGroupOptions objects create multi-option variants
     */
    [variantGroup: string]: string | VariantGroupOptions | CompoundRule[] | undefined
}