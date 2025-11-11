export {};

// Global type for the ConvertKit FormKit script injected on RoadmapPage
// This avoids TS errors like: Property 'formkit' does not exist on type 'Window'
declare global {
  interface Window {
    formkit?: {
      show?: (formId: string) => void;
      // You can extend with more methods if needed (e.g., hide, close)
    };
    popupLocked?: boolean;
  }
}
