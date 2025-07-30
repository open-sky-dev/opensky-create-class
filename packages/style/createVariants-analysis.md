# createVariants Analysis

## How createVariants Works

The `createVariants` function is designed to create a flexible variant system for components. It takes two parameters:
1. `options` - Configuration object defining all possible variants
2. `props` - Runtime props that select which variants to apply

### Basic Flow:

1. **Initialize Result Object**: Creates an object with a `classes` property and properties for each variant group
2. **Check for Reset**: If `resetStyles` prop is true, returns only reset classes
3. **Build Classes**: Otherwise, starts with base classes and adds classes based on selected variants
4. **Process Compound Variants**: Applies additional classes when specific variant combinations are active
5. **Return Result**: Returns an object with the final class string and the selected variant values

### Example Usage:

```typescript
const options = {
  base: 'px-4 py-2',
  size: {
    sm: 'text-sm',
    lg: 'text-lg',
    _default: 'sm'
  },
  color: {
    red: 'bg-red-500',
    blue: 'bg-blue-500'
  },
  compound: [{
    size: 'lg',
    color: 'red',
    classes: 'shadow-lg'
  }]
}

// Usage
createVariants(options, { size: 'lg', color: 'red' })
// Returns: {
//   classes: 'px-4 py-2 text-lg bg-red-500 shadow-lg',
//   size: 'lg',
//   color: 'red'
// }
```

## Issue 3: Missing Type Exports

### The Problem:
The types aren't exported, making it hard for users to type their configurations:

```typescript
// User's code - they can't import these types!
const myVariants: VariantOptions = {  // Error: Cannot find name 'VariantOptions'
  base: 'btn',
  size: { sm: 'text-sm' }
}
```

### The Fix:
Export all the types:

```typescript
export type CompoundRule = {
    [variantGroup: string]: string
    classes: string
}

export type VariantGroupOptions = {
    [key: string]: string | undefined
    _default?: string
}

export type VariantOptions = {
    base: string
    reset?: string
    compound?: CompoundRule[] | undefined
    [variantGroup: string]: string | VariantGroupOptions | CompoundRule[] | undefined
}

export interface VariantProps {
    resetStyles?: boolean | string
    [prop: string]: boolean | string | number | undefined
}

export interface VariantResult {
    classes: string
    [variantProp: string]: string | boolean | number | undefined
}
```

## Issue 5: Boolean Prop Handling

### The Problem:
When a boolean `true` is passed, it uses the variant group name as both the value and the class:

```typescript
const options = {
  base: 'btn',
  elevated: {
    raised: 'shadow-md',
    flat: 'shadow-none'
  }
}

createVariants(options, { elevated: true })
// Current: { classes: 'btn elevated', elevated: 'elevated' }
// Adds 'elevated' as a class, which might not exist!
```

### Why It's Confusing:
The boolean `true` doesn't select a defined variant; it creates a new behavior where the group name becomes a class.

### Use Case:
This might be intentional for boolean-style variants:

```typescript
const options = {
  base: 'btn',
  disabled: {},  // Empty object, used as boolean flag
  loading: {}
}

createVariants(options, { disabled: true, loading: true })
// Result: { classes: 'btn disabled loading', disabled: 'disabled', loading: 'loading' }
```

### The Fix:
Document this behavior clearly or make it more explicit:

```typescript
// Option 1: Only allow boolean for empty variant groups
if (propValue === true && Object.keys(groupOptions).length === 0) {
    result[groupName] = true
    classList += ' ' + groupName
}

// Option 2: Add a special boolean flag
const options = {
  base: 'btn',
  disabled: {
    _boolean: true,  // Explicitly mark as boolean variant
  }
}
```

## Summary of Recommended Changes

1. **Export all types** for better developer experience
2. **Fix the default value bug** to prevent adding variant keys as classes
3. **Document or improve boolean handling** to make the behavior clearer
4. **Add validation** for configuration errors (like non-existent defaults)
5. **Consider adding runtime warnings** for development to catch configuration mistakes

The function is quite powerful but these issues could lead to confusion or unexpected behavior in production.
