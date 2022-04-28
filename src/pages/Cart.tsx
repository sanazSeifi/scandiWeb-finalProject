import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ImageSlider from '../components/ImageSlider';
import { Attributes } from '../models/attributes';
import { Currency } from '../models/currency';
import { Product } from '../models/product';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';

interface CartComponentProps {
    orders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
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

interface CartComponentState {

}

class CartComponent extends Component<CartComponentProps, CartComponentState> {

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

    getQTY(): number {
        let total: number = 0;
        for (let i = 0; i < this.props.orders.length; i++) {
            total = total + this.props.orders[i].count;
        }
        return total
    }

    render() {
        return (
            <div className='cart'>
                <div className='title'>cart</div>
                <div
                    className='back-to-list'
                    onClick={() => { window.location.replace('/') }}
                >
                    <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                    {` `}
                    <span>Back To List</span>
                </div>
                {
                    this.props.orders.length > 0
                        ? <ul className='orders-list'>
                            {
                                this.props.orders.map((item: {
                                    product: Product;
                                    count: number;
                                    attr: Array<{
                                        attrId: string | number;
                                        attritemId: string | number;
                                    }>
                                }, i: number) => {
                                    return <li
                                        key={i.toString()}
                                        className='order-item'
                                    >
                                        <div className='text'>
                                            <div className="brand">
                                                {item.product.brand}
                                            </div>
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
                                        <div className="inner-flex">
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
                                            <ImageSlider images={item.product.gallery} />
                                        </div>
                                    </li>
                                })
                            }
                            <div className="footer">
                                <div className="tax">
                                    Tax: <span>15.00</span>
                                </div>
                                <div className="qty">
                                    QTY: <span>{this.getQTY()}</span>
                                </div>
                                <div className="total">
                                    Total: <span>{this.props.activeCurrency.symbol}{this.totalByCurrency().toFixed(2)}</span>
                                </div>
                                <div className="btn-wrapper">
                                    <button
                                        className='order'
                                        onClick={() => { window.location.replace('/cart') }}
                                    >
                                        ORDER
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

export const Cart = connect(storeToProps, dispatchToProps)(CartComponent)