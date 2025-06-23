# Code Style and Conventions Standards

## Project-Specific Requirements (CRITICAL)

**Framework:** React with TypeScript and Next.js
**Internationalization:** next-intl
**Comment Language:** ALL code comments must be written in Dutch
**File Organization:** Feature-based directory structure required

---

## 1. Naming Conventions

### Priority: CRITICAL

**Rule:** Use descriptive and consistent naming conventions

**Decision Tree:**

- Variables/Functions → camelCase
- Components → PascalCase (file name must match component name)
- Constants → UPPER_SNAKE_CASE
- Classes/Interfaces → PascalCase
- i18n variables → consistent pattern (e.g., "i18n_key", "localizeMessage")

**Examples:**

```typescript
// ✅ Do This
const getUserProfile = () => {...}
const API_BASE_URL = 'https://api.example.com'
interface UserProfile {...}

// ❌ Don't Do This
const x = () => {...}
const api_url = 'https://api.example.com'
interface userprofile {...}
```

---

## 2. Component Design Standards

### 2.1 Component Architecture (CRITICAL)

**Decision Tree for Component Size:**

- If component > 200 lines → Break into smaller components
- If logic is reusable → Extract to custom hook
- If UI pattern repeats → Create reusable component

**Single Responsibility Principle:**
Each component must have ONE clear purpose.

```typescript
// ✅ Do This - Single responsibility
const UserAvatar = ({ user, size }: UserAvatarProps) => {...}
const UserContactInfo = ({ user }: UserContactInfoProps) => {...}

// ❌ Don't Do This - Multiple responsibilities
const UserComponent = ({ user }: Props) => {
  // Handles avatar, contact info, preferences, AND notifications
}
```

### 2.2 Functional Components (CRITICAL)

**Rule:** Always use functional components with hooks

**Exception:** Only use class components for legacy code integration

---

## 3. TypeScript Standards

### 3.1 Type Definitions (CRITICAL)

**Decision Tree:**

- Object shapes → Use `interface`
- Type aliases, unions, mapped types → Use `type`
- Can properties be optional? → Use `?` operator
- Need to extend/merge? → Use `interface`

```typescript
// ✅ Do This
interface UserProps {
  name: string;
  email?: string; // Optional property
}

type Status = "pending" | "complete" | "error"; // Union type

// ❌ Don't Do This
type UserProps = {
  // Should be interface for object shapes
  name: any; // Avoid 'any'
};
```

### 3.2 Nullability (CRITICAL)

**Rule:** Handle null/undefined explicitly

```typescript
// ✅ Do This
const processUser = (user: User | undefined) => {
  if (!user) return null;
  // Process user safely
};

// ❌ Don't Do This
const processUser = (user: any) => {
  return user.name; // Potential runtime error
};
```

---

## 4. Performance Optimization

### 4.1 Memoization (IMPORTANT)

**Decision Tree:**

- Component receives stable props + expensive renders → Use `React.memo`
- Expensive calculations in component → Use `useMemo`
- Functions passed as props → Use `useCallback`
- Simple components that rarely re-render → Skip memoization

```typescript
// ✅ Do This - When component has expensive renders
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() =>
    expensiveCalculation(data), [data]
  );

  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div>{processedData}</div>;
});
```

### 4.2 Code Organization (IMPORTANT)

- Utility functions → `lib/utils.ts`
- Custom hooks → `hooks/` directory
- Reusable components → `components/` directory

---

## 5. Accessibility (CRITICAL)

**Requirements:**

- Semantic HTML elements
- Alt text for images
- Proper ARIA attributes
- Keyboard navigation support

```typescript
// ✅ Do This
<button
  onClick={handleSubmit}
  aria-label="Submit form"
  disabled={isLoading}
>
  Submit
</button>

// ❌ Don't Do This
<div onClick={handleSubmit}>Submit</div>
```

---

## 6. Code Comments (IMPORTANT)

**Rule:** All comments in Dutch, explain WHY not WHAT

```typescript
// ✅ Do This
// We gebruiken debounce hier om API calls te beperken tijdens het typen
const debouncedSearch = useMemo(() =>
  debounce(searchFunction, 300), []);

// ❌ Don't Do This
// This function searches for users
const searchUsers = () => {...}
```

---

## 7. When to Deviate

**Approved Exceptions:**

1. **Performance Requirements:** Document with Dutch comment explaining trade-off
2. **Third-party Integration:** When external library requires different pattern
3. **Legacy Code:** Only when refactoring would break functionality

**Required:** Always document deviations with Dutch comments explaining reasoning.

---

## 8. Tool Configuration

**Required Tools:**

- Prettier (automatic formatting)
- ESLint with TypeScript + unused-imports rules
- Remove dead code, commented blocks, unused imports

---

## Quick Reference Checklist

- [ ] Component names in PascalCase
- [ ] Dutch comments explaining complex logic
- [ ] TypeScript interfaces for object shapes
- [ ] Functional components with hooks
- [ ] Accessibility attributes included
- [ ] Memoization applied where beneficial
- [ ] Single responsibility per component
- [ ] Explicit null/undefined handling
