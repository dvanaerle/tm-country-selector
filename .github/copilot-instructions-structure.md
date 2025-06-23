## .github/[copilot-instructions.md](http://copilot-instructions.md) 

**\# Code Style and Conventions Standards**

**\#\# Naming Conventions**

\*\*Standard:\*\* Use descriptive and consistent naming conventions for i18n-related (next-intl) variables, functions, and files.  
   
\*   \*\*Do This:\*\* Use clear, self-documenting names, avoiding abbreviations. Use a consistent pattern, e.g., "i18n\_key", "localizeMessage", "getSupportedLocales".  
   
\*   \*\*Don't Do This:\*\* Use vague or cryptic names like "x", "msg", or "i18n()". Avoid naming conflicts or using reserved keywords.  
   
\*\*Explanation:\*\* Meaningful names significantly improve code readability and reduce cognitive load.  
   
**\#\#\# Variables and Constants**  
\*   \*\*Do This:\*\* Use "camelCase" for variable and function names. Use descriptive and meaningful names. For constants, use "UPPER\_SNAKE\_CASE".  
   
\*   \*\*Don't Do This:\*\* Use single-letter variable names (except in simple loops) or abbreviations that are unclear.  
   
**\#\#\# Components**  
\*   \*\*Do This:\*\* Use "PascalCase" for component names. File names should match the component name.  
   
\*   \*\*Don't Do This:\*\* Use lowercase or snake\_case for component names.

**\#\#\# Classes and Interfaces**  
   
\*   \*\*Standard:\*\* Use PascalCase for class and interface names.  
   
   \*   \*\*Why:\*\* Clearly identifies classes and interfaces.  
   \*   \*\*Do This:\*\*

**\#\#\# File and Directory Structure**  
\*   \*\*Do This:\*\* Organize files and directories logically based on feature or functionality. Use a consistent naming scheme.  
   
\*   \*\*Don't Do This:\*\* Dump all files into a single directory or use inconsistent naming schemes.

**\#\#\# Functional Components**  
\*   \*\*Do This:\*\* Prefer functional components with Hooks over class components.  
   
   \*   \*\*Why:\*\* Functional components are generally more concise, easier to test, and promote code reusability with Hooks.  They are the modern React standard.  
   
\*   \*\*Don't Do This:\*\*  Use class components unless there's a specific reason to do so (e.g., integrating with legacy code).

**\#\#\# Accessibility (a11y)**  
\*   \*\*Do This:\*\* Write semantic HTML, provide alternative text for images ("alt" attribute), use proper ARIA attributes.  
   
   \*   \*\*Why:\*\* Accessibility ensures that your application is usable by everyone, including people with disabilities.  
   
\*   \*\*Don't Do This:\*\*  Ignore accessibility concerns.

**\#\#\# Utility Functions**  
   
\*   \*\*Standard:\*\* Store utility functions in "lib/utils.ts" or similar dedicated files.  
\*   \*\*Why:\*\* Allow use the same function across all the project.

**\# Performance Optimization Standards**

\*   Use \*\*Prettier\*\* for automatic formatting and \*\*ESLint\*\* (with TypeScript \+ unused-imports rules) to keep the codebase free of dead code, commented-out blocks, and unused imports.

**\#\# Avoiding Large Components**  
   
\*\*Standard:\*\* Break down large components into smaller, more manageable components.  
   
\*   \*\*Do This:\*\*  
   \*   Identify distinct sections of a large component and extract them into separate components.  
   \*   Create reusable components for common UI elements.  
   \*   Use a component-driven architecture to improve maintainability and testability.  
   
\*   \*\*Don't Do This:\*\*  
   \*   Create monolithic components with hundreds of lines of code.  
   \*   Duplicate code across multiple components.  
   
\*\*Why:\*\* Smaller components are easier to understand, test, and maintain. They also improve performance by allowing React to efficiently update only the parts of the UI that have changed.

**\#\#\# Memoization**  
   
\*   \*\*Standard:\*\* Use "React.memo" for functional components to prevent unnecessary re-renders. Use "useMemo" and "useCallback" hooks for optimizing performance within components.  
   
   \*   \*\*Do This ("React.memo"):\*\*  
    
   \*   \*\*Don't Do This:\*\* Overusing memoization without profiling, as it can add overhead. Creating new functions or objects inline in render methods, as this will defeat memoization efforts.  
   
   \*   \*\*Why:\*\* Memoization can significantly improve performance by preventing unnecessary re-renders and re-calculations. "useCallBack" prevents functions passed as props from being recreated on every render (which would break "React.memo"'s shallow prop comparison.)

**\#\#\# Single Responsibility Principle**  
   
\*\*Do This:\*\*  
   
\*   Each component should have a single, well-defined purpose. If a component becomes too complex, refactor it into smaller, more focused components.  
   
\*\*Don't Do This:\*\*  
   
\*   Create "god components" that handle multiple unrelated responsibilities.  
\*   Write components that are tightly coupled to specific use cases.  
   
\*\*Why:\*\* The Single Responsibility Principle makes components easier to understand, test, and reuse. It reduces the impact of changes, as modifications to one component are less likely to affect others.  
   
**\#\#\# DRY (Don't Repeat Yourself)**  
   
\*\*Connection to Performance:\*\* Code duplication often leads to redundant computations. Refactoring duplicated code into reusable functions or classes can improve performance by reducing the amount of work that needs to be done.  
   
**\#\#\# YAGNI (You Ain't Gonna Need It)**  
   
\*\*Connection to Performance:\*\* Avoid adding features or optimizations prematurely. Focus on solving the current problem efficiently. Adding unnecessary code can lead to performance overhead.  
   
**\#\#\# KISS (Keep It Simple, Stupid)**  
   
\*\*Connection to Performance:\*\* Simple code is easier to understand, test, and optimize. Complex code is often less efficient and more prone to errors.  
   
**\#\#\# Code Comments**  
Adding code comments to justify complex performance choices. Code comments should be added to justify why one approach was taken versus another, especially if the resulting code is less readable as a result.

\*   Write code that is easy to understand and follow. Use descriptive variable and function names, and add comments where necessary to explain complex logic.  
\*   Write \*Dutch comments\* that explain \*\*why\*\*, not just \*\*what\*\*. Use \*Dutch\* block comments (\`/\* … \*/\`) for multi-line explanations and single-line comments (\`// …\`) for inline notes about tricky code.

**\# Component Design Standards**

**\#\#\# Reusability**  
   
\*\*Standard:\*\* Design components to be reusable across different parts of the application or even different projects.  
   
\*\*Why:\*\* Reusability reduces code duplication, simplifies maintenance, and promotes consistency.  
   
\*\*Do This:\*\*  
   
\*   \*\*Parameterize:\*\* Accept properties (props) to configure behavior and appearance.  
\*   \*\*Separate Concerns:\*\* Avoid tightly coupling components to specific application contexts.  
\*   \*\*Use Interfaces:\*\* Define clear interfaces for props and component interactions.  
   
\*\*Don't Do This:\*\*  
   
\*   Hardcode values that could vary in different contexts.  
\*   Include business logic that is specific to one part of the application within a generic component.

**\#\#\# Composability**  
   
\*\*Standard:\*\* Design components that can be easily composed together to create more complex UI elements.  
   
\*\*Why:\*\* Composition allows developers to build complex functionalities by combining simple, independent components.  
   
\*\*Do This:\*\*  
   
\*   \*\*Use Children Props:\*\* Allow components to render child elements passed as props.  
\*   \*\*Provide Configuration Options:\*\* Offer flexibility in how components can be composed.  
\*   \*\*Design for Extensibility:\*\* Allow adding new features or behaviors without modifying existing code.  
   
\*\*Don't Do This:\*\*  
   
\*   Prevent components from being nested or combined with other components.  
\*   Make assumptions about the parent or child components.

**\#\#\# Explicit Typing**  
   
\*\*Standard:\*\* Use explicit types for all component props, state variables, and return types.  
   
\*\*Why:\*\* TypeScript's static typing helps catch errors early, improves code readability, and makes refactoring easier.  
   
\*\*Do This:\*\*  
   
\*   Always define interfaces or types for component props.  
\*   Use type annotations for all state variables.  
\*   Specify return types for functions and methods.  
\*   Leverage TypeScript's "unknown" and "any" types judiciously.  
   
\*\*Don't Do This:\*\*  
   
\*   Rely on implicit "any" types.  
\*   Avoid type annotations altogether.

**\#\#\# Interface vs. Type**  
   
\*\*Standard:\*\* Use interfaces to define the shape of objects, and types for type aliases and unions.  
   
\*\*Why:\*\*  Interfaces are generally preferred for defining object shapes because they are more extensible and mergeable.  
   
\*\*Do This:\*\*  
   
\*   Use "interface" for describing the structure of component props and state.  
\*   Use "type" for creating aliases, unions, and mapped types.  
   
\*\*Don't Do This:\*\*  
   
\*   Inconsistently use "interface" and "type" without a clear rationale.

**\#\#\# Generics**  
   
\*\*Standard:\*\* Use generics to create reusable components that can work with different types of data.  
   
\*\*Why:\*\*  Generics provide type safety while maintaining flexibility, reducing the need for type casting and improving code reusability.  
   
\*\*Do This:\*\*  
   
\*   Use generics for components that operate on different data types.  
\*   Provide default type parameters when appropriate.  
   
\*\*Don't Do This:\*\*  
   
\*   Avoid using generics when they can provide better type safety.  
\*   Overuse generics, making code unnecessarily complex.

**\#\#\# Utility Types**  
   
\*\*Standard:\*\*  Utilize TypeScript's utility types ("Partial", "Readonly", "Pick", "Omit", "Record", etc.) to manipulate types effectively.  
   
\*\*Why:\*\*  Utility types simplify type transformations and reduce boilerplate code.  
   
\*\*Do This:\*\*  
   
\*   Use "Partial" to create a type where all properties of "T" are optional.  
\*   Use "Readonly" to create a type where all properties of "T" are read-only.  
\*   Use "Pick" to create a type by picking a set of properties "K" from "T".  
\*   Use "Omit" to create a type by excluding a set of properties "K" from "T".  
\*   USE "Record" to create a type defining an object with key type "K" and value type "T".  
   
\*\*Don't Do This:\*\*  
   
\*   Manually create types that can be derived using utility types.  
\*   Overuse utility types, leading to overly complex type definitions.

**\#\#\# Enums**  
   
\*\*Standard:\*\* Use enums for defining a set of named constants, but be mindful of their limitations in TypeScript. Consider using union types with const assertions for more flexibility.  
   
\*\*Why:\*\* Enums provide a way to organize and document related values, improving code readability.  
   
\*\*Do This:\*\*  
   
\*   Use enums for representing a fixed set of options.  
\*   Use const enums to avoid generating unnecessary JavaScript code.  
   
\*\*Don't Do This:\*\*  
   
\*   Overuse enums when union types or literal types might be more appropriate.  
\*   Rely on enums for values that may change frequently.  
   
**\#\#\# Nullability and Optional Properties**  
   
\*\*Standard:\*\*  Handle null and undefined values explicitly to prevent runtime errors. Utilize optional properties and non-null assertion operators judiciously.  
   
\*\*Why:\*\*  Explicit handling of nullability improves code safety and reliability.  
   
\*\*Do This:\*\*  
   
\*   Use optional properties ("?") to indicate that a property may be undefined.  
\*   Use union types ("string | undefined") to allow a property to be either a specific type or undefined.  
\*   Use non-null assertion operators ("\!") only when you are absolutely sure that a value is not null or undefined.  
   
\*\*Don't Do This:\*\*  
   
\*   Ignore potential null or undefined values.  
\*   Overuse non-null assertion operators without proper justification.  
    
**\#\#\# React Component Specifics**  
   
\*\*Standard:\*\* When using TypeScript with React, follow established best practices for typing components, hooks, and events.  
   
\*\*Why:\*\* React, combined with TypeScript, introduces its own set of type-related challenges that require specific solutions.  
   
\*\*Do This:\*\*  
   
\*   Use "React.FC" (or "React.FunctionComponent") to define functional components with type safety. Note however, that explicit props typing is frequently preferred over "React.FC" as it provides more control and readability.  
\*   Use "React.useState", "React.useEffect", and other hooks with proper type annotations.  
\*   Type event handlers correctly using "React.ChangeEvent", "React.MouseEvent", etc.  
   
\*\*Don't Do This:\*\*  
   
\*   Use JavaScript-style React components without any TypeScript annotations.  
\*   Ignore the types of event handlers or hooks.  
\*   Use "any" excessively in React components, especially for event handlers.  
   
**\#\#\# Hooks for Reusable Logic**  
   
\*\*Do This:\*\*  
   
\*   Extract complex logic into custom hooks to promote reuse and separation of concerns.  
\*   Name hooks using the "use" prefix (e.g., "useFetchData", "useFormValidation").  
\*   Ensure hooks are composable and can be used in multiple components.  
   
\*\*Don't Do This:\*\*  
   
\*   Embed complex logic directly within components, making them harder to understand and test.  
\*   Create hooks that are tightly coupled to specific components or contexts.  
   
\*\*Why:\*\* Hooks allow you to reuse stateful logic between components. They improve code organization, testability, and maintainability.