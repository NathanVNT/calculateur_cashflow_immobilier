// types/global.d.ts
export {};

declare global {
    interface Window {
        cookieconsent: {
            initialise: (config: any) => void;
        };
    }
}
