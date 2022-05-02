import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Attributes } from '../models/attributes';
import { Currency } from '../models/currency';
import { Product } from '../models/product';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';

interface CartQuickAccessComponentProps {
    orders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number ;
            attritemId: string | number ;
        }>
    }>;
    activeCurrency: Currency;
    ordersUpdate: (updatedOrders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>) => void;
}

interface CartQuickAccessComponentState {
    showDropDown: boolean
}

class CartQuickAccessComponent extends Component<CartQuickAccessComponentProps, CartQuickAccessComponentState> {

    constructor(props: CartQuickAccessComponentProps) {
        super(props);
        this.state = {
            showDropDown: false
        }
    }

    isSelected(attrId: string | number, attrItemId: string | number, index: number): boolean {
        let itemIndex: number | undefined = undefined;
        for (let i = 0; i < this.props.orders[index].attr.length; i++) {
            if (this.props.orders[index].attr[i].attrId === attrId) {
                itemIndex = i;
                break;
            }
        }
        if (typeof itemIndex === 'number' && this.props.orders[index].attr[itemIndex].attritemId === attrItemId) return true;
        return false;
    }

    toggleSelect(attrId: string | number, attrItemId: string | number, index: number) {
        let newSelectedAttr = [...this.props.orders[index].attr
            .filter((value: { attrId: string | number; attritemId: string | number; }) => value.attrId !== attrId)]
        if (this.isSelected(attrId, attrItemId, index)) {
            newSelectedAttr.push({ attrId: attrId, attritemId: attrItemId });
            let copiedOrders = [...this.props.orders];
            copiedOrders[index].attr = newSelectedAttr;
            this.props.ordersUpdate(copiedOrders);
        } else {
            newSelectedAttr.push({ attrId: attrId, attritemId: attrItemId });
            let copiedOrders = [...this.props.orders];
            copiedOrders[index].attr = newSelectedAttr;
            this.props.ordersUpdate(copiedOrders);
        }
    }

    totalByCurrency(): number {
        let total: number = 0;
        for (let i = 0; i < this.props.orders.length; i++) {
            let count: number = this.props.orders[i].count;
            let price: number = this.props.orders[i].product.prices.filter((item: { amount: number, currency: { symbol: string } }) =>
                    item.currency.symbol === this.props.activeCurrency.symbol)[0].amount
            total = total + (price * count);
        }
        return total;
    }

    render() {
        return (
            <div className='cart-quick-access-wrapper'>
                <div
                    className="icon-wrapper"
                    onClick={() => this.setState({ ...this.state, showDropDown: !this.state.showDropDown })}
                >
                    <i className="fa fa-shopping-cart"></i>
                    {
                        this.props.orders.length > 0
                            ? <div className='counter'>{this.props.orders.length}</div>
                            : undefined
                    }
                </div>
                {
                    (this.state.showDropDown === true && this.props.orders.length > 0)
                        ? <div
                            className="back-drop"
                            onClick={() => this.setState({ ...this.state, showDropDown: !this.state.showDropDown })}
                        ></div>
                        : undefined
                }
                {
                    (this.state.showDropDown === true && this.props.orders.length > 0)
                        ? <ul className='orders-list'>
                            <div className="header">
                                {`My Bag ${this.props.orders.length} items`}
                            </div>
                            <div className="body">
                                {
                                    this.props.orders.map((item: {
                                        product: Product;
                                        count: number;
                                    }, i: number) => {
                                        return <li
                                            key={i.toString()}
                                            className='order-item'
                                        >
                                            <div className='text'>
                                                <div className="name">
                                                    {item.product.name}
                                                </div>
                                                <div className="amount">
                                                    {item.product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].currency.symbol}
                                                    {item.product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].amount}
                                                </div>
                                                <div className="attributes">
                                                    {
                                                        item.product.attributes.map((atrr: Attributes, j: number) => {
                                                            return <div key={i.toString()} className='attr'>
                                                                <div className="atrr-name">{atrr.name}</div>
                                                                <div className={`items attr-${i + 1}`}>
                                                                    {
                                                                        atrr.items.map((value: { id: string; value: string; displayValue: string; }, j: number) => {
                                                                            return <div
                                                                                key={j.toString()}
                                                                                className={`attr-item ${this.isSelected(atrr.id, value.id, i) ? "selected" : ""}`}
                                                                                onClick={() => this.toggleSelect(atrr.id, value.id, i)}
                                                                            >
                                                                                {value.displayValue}
                                                                            </div>
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='actions-count'>
                                                <div className='inc'>
                                                    <div
                                                        className="sign"
                                                        onClick={() => {
                                                            let copiedOrders = [...this.props.orders];
                                                            copiedOrders[i].count = copiedOrders[i].count + 1;
                                                            debugger
                                                            this.props.ordersUpdate(copiedOrders);
                                                        }}
                                                    >+</div>
                                                </div>
                                                <div className='count'>{item.count}</div>
                                                <div className='dec'>
                                                    <div
                                                        onClick={() => {
                                                            let copiedOrders = [...this.props.orders];
                                                            if (copiedOrders[i].count <= 1) {
                                                                copiedOrders.splice(i, 1);
                                                                debugger
                                                                this.props.ordersUpdate(copiedOrders);
                                                            } else {
                                                                copiedOrders[i].count = copiedOrders[i].count - 1;
                                                                debugger
                                                                this.props.ordersUpdate(copiedOrders);
                                                            }
                                                        }}
                                                        className="sign"
                                                    >-</div>
                                                </div>
                                            </div>
                                            <div className='img'>
                                                <img className='item-image' src={item.product.gallery[0]} alt="" />
                                            </div>
                                        </li>
                                    })
                                }

                            </div>
                            <div className="footer">
                                <div className="total">
                                    <span>Total</span>
                                    <span>{this.props.activeCurrency.symbol}{this.totalByCurrency().toFixed(2)}</span>
                                </div>
                                <div className="btns-wrapper">
                                    <button
                                        className='bag'
                                        onClick={() => { window.location.replace('/cart') }}
                                    >
                                        VIEW BAG
                                    </button>
                                    <button
                                        className='checkout'
                                    >
                                        CHECK OUT
                                    </button>
                                </div>
                            </div>
                        </ul>
                        : undefined
                }
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        orders: store.orders,
        activeCurrency: store.activeCurrency
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {
        ordersUpdate: (orders: Array<{
            product: Product;
            count: number;
            attr: Array<{
                attrId: string | number;
                attritemId: string | number;
            }>
        }>) => dispatch({ type: REDUX_ACTIONS.ORDERS_UPDATE, payload: orders })
    }
}

export const CartQuickAccess = connect(storeToProps, dispatchToProps)(CartQuickAccessComponent)
