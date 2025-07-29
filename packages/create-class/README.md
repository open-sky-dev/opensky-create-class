# @opensky/create-class

A utility function for merging CSS class names with Tailwind CSS support.

## Installation

```bash
npm install @opensky/create-class
```

## Usage

```typescript
import { createClass, preserveClass } from '@opensky/create-class'

// Basic usage
createClass('text-lg', 'text-sm')
// Returns: "text-sm" (last conflicting Tailwind class wins)

// With conditional classes
createClass('flex', isActive && 'bg-blue-500')
// Returns: "flex bg-blue-500" (if isActive is true)

// Preserving non-Tailwind classes
createClass('flex', preserveClass('custom-animation'))
// Returns: "flex custom-animation"
```

## API

### createClass(...inputs)

Merges and processes CSS class names using clsx and tailwind-merge.

**Parameters:**
- `inputs` - Class values to merge (strings, objects, arrays)

**Returns:**
- String of merged and processed class names

### preserveClass(classes)

Marks classes to be preserved without Tailwind conflict resolution.

**Parameters:**
- `classes` - Class values to preserve

**Returns:**
- Preserved class object for use with createClass

## Dependencies

- clsx - For conditional class handling
- tailwind-merge - For Tailwind CSS class conflict resolution

## License

MIT
