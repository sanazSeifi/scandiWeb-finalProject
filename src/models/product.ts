import { Attributes } from "./attributes";
import { Price } from "./price";

export interface Product {
    category: string;
    id: string,
    name: string;
    brand: string;
    inStock: boolean;
    description: string,
    gallery: Array<string>;
    prices: Array<Price>
    attributes: Array<Attributes>
}