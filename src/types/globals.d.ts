    // globals.d.ts or src/types/globals.d.ts
    declare module '*.css' {
      const content: Record<string, string>;
      export default content;
    }