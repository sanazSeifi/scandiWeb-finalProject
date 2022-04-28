import { Currency } from "../../models/currency";
import { REDUX_ACTIONS } from "../actions";

export function reducer(
    preState: Currency,
    action: { type: REDUX_ACTIONS, payload: Currency }
): Currency {
    switch (action.type) {
        case REDUX_ACTIONS.ACTIVE_CURRENCY_UPDATE:
            return action.payload;
    }
    if (preState) return preState;
    return {
        symbol: '',
        label: '',
    }
}