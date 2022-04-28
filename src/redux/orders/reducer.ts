import { Product } from "../../models/product";
import { REDUX_ACTIONS } from "../actions";

export function reducer(
    preState: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>,
    action: {
        type: REDUX_ACTIONS,
        payload: Array<{
            product: Product;
            count: number;
            attr: Array<{
                attrId: string | number;
                attritemId: string | number;
            }>
        }>
    }
): Array<{
    product: Product;
    count: number;
    attr: Array<{
        attrId: string | number;
        attritemId: string | number;
    }>
}> {
    switch (action.type) {
        case REDUX_ACTIONS.ORDERS_UPDATE:
            return action.payload;
    }
    if (preState) return preState;
    return [];
}