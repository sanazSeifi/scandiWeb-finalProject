export interface Attributes {
    id: string;
    name: string;
    type: string;
    items: Array<{
        id: string;
        value: string;
        displayValue: string;
    }>
}