export {};

// Global type for the Kit (ConvertKit) script
declare global {
  interface Window {
    formkit?: {
      show?: (formId: string) => void;
    };
  }
}
