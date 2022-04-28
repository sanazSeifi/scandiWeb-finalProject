import { gql } from '@apollo/client';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Attributes } from '../models/attributes';
import { Currency } from '../models/currency';
import { Price } from '../models/price';
import { Product } from '../models/product';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';
import { client } from '../service/base';

interface ProductDetailComponentProps {
    orders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>;
    activeCurrency: Currency
    ordersUpdate: (updatedOrders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>) => void
}

interface ProductDetailComponentState {
    product: {
        category: string;
        id: string,
        name: string;
        brand: string;
        inStock: boolean;
        description: string,
        gallery: Array<string>;
        prices: Array<Price>
        attributes: Array<Attributes>
    } | null;
    imageIndex: number;
    selectedAttr: Array<{
        attrId: string | number;
        attritemId: string | number;
    }>
}


class ProductDetailComponent extends Component<ProductDetailComponentProps, ProductDetailComponentState> {

    constructor(props: ProductDetailComponentProps) {
        super(props);
        this.state = {
            product: null,
            imageIndex: 0,
            selectedAttr: []
        }
    }

    componentDidMount() {
        let productId = window.location.pathname.replace('/product-detail/', '');
        this.fetchProduct(productId)
    }

    async fetchProduct(id: string) {
        try {
            let res = await client.query({
                query: gql`
                  query{
	                product(id:\"${id}\"){
                        category
                        id,
                        name,
                        brand,
                        inStock,
                        description,
                        gallery,
                        prices{
                            amount,
                            currency{
                                label,
                                symbol,
                            },
                        },
                        attributes{
                            id,
                            name,
                            type,
                            items{
                                id,
                                value,
                                displayValue,
                            },
                        },
                    }
                }
              `
            })
            this.setState({ ...this.state, product: res.data.product });
        } catch (error) {
            console.error(error)
        }
    }

    isSelected(attrId: string | number, attrItemId: string | number): boolean {
        let itemIndex: number | undefined = undefined;
        for (let i = 0; i < this.state.selectedAttr.length; i++) {
            if (this.state.selectedAttr[i].attrId === attrId) {
                itemIndex = i;
                break;
            }
        }
        if (typeof itemIndex === 'number' && this.state.selectedAttr[itemIndex].attritemId === attrItemId) return true;
        return false;
    }

    toggleSelect(attrId: string | number, attrItemId: string | number) {
        let newSelectedAttr = [...this.state.selectedAttr
            .filter((value: { attrId: string | number; attritemId: string | number; }) => value.attrId !== attrId)]
        if (this.isSelected(attrId, attrItemId)) {
            newSelectedAttr.push({ attrId: attrId, attritemId: attrItemId });
            this.setState({ ...this.state, selectedAttr: newSelectedAttr });
        } else {
            newSelectedAttr.push({ attrId: attrId, attritemId: attrItemId });
            this.setState({ ...this.state, selectedAttr: newSelectedAttr });
        }
    }

    render() {
        return (
            <div className="product-detail-wrapper">
                <div className="gallery">
                    <div
                        className='back-to-list'
                        onClick={() => { window.location.replace('/') }}
                    >
                        <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                        {` `}
                        <span>Back To List</span>
                    </div>
                    {
                        this.state.product !== null
                            ? <>
                                {
                                    this.state.product.gallery.map((item: string, i: number) => {
                                        return <div
                                            key={`item-${i.toString()}`}
                                            className="img-wrapper"
                                            onClick={() => {
                                                this.setState({ ...this.state, imageIndex: i })
                                            }}
                                        >
                                            <img className='item-img' src={item} alt="" />
                                        </div>
                                    })
                                }
                            </>
                            : undefined
                    }
                </div>
                <div className="main-img">
                    {
                        this.state.product !== null
                            ? <div className="main-img-wrapper">
                                <img className='main-image' src={this.state.product.gallery[this.state.imageIndex]} alt="" />
                            </div>
                            : undefined
                    }
                </div>
                <div className="shopping-box">
                    {
                        this.state.product !== null
                            ? <>
                                <div className="brand">{this.state.product.brand}</div>
                                <div className="name">{this.state.product.name}</div>
                                <div className="attributes">
                                    {
                                        this.state.product.attributes.map((atrr: Attributes, i: number) => {
                                            return <div key={i.toString()} className='attr'>
                                                <div className="atrr-name">{atrr.name}</div>
                                                <div className={`items attr-${i + 1}`}>
                                                    {
                                                        atrr.items.map((value: { id: string; value: string; displayValue: string; }, j: number) => {
                                                            return <div
                                                                key={j.toString()}
                                                                className={`attr-item ${this.isSelected(atrr.id, value.id) ? "selected" : ""}`}
                                                                onClick={() => this.toggleSelect(atrr.id, value.id)}
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
                                <div className="price-title">PRICE:</div>
                                <div className="price">
                                    {
                                        this.state.product !== null
                                            ? <>
                                                {this.state.product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].currency.symbol}
                                                {this.state.product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].amount}
                                            </>
                                            : undefined
                                    }
                                </div>
                                {
                                    this.state.product !== null
                                        ? <button
                                            onClick={() => {
                                                let copiedOrders: StoreModel['orders'] = this.props.orders.length ? [...this.props.orders] : [];
                                                let newOrder = {
                                                    product: this.state.product!,
                                                    count: 1,
                                                    attr: this.state.selectedAttr
                                                };
                                                copiedOrders.push(newOrder);
                                                this.props.ordersUpdate(copiedOrders);
                                                debugger
                                                window.location.replace('/')
                                            }}
                                        >
                                            ADD TO CART
                                        </button>
                                        : undefined
                                }
                                <div className="description" dangerouslySetInnerHTML={{ __html: this.state.product.description }}></div>
                            </>
                            : undefined
                    }
                </div>
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

export const ProductDetail = connect(storeToProps, dispatchToProps)(ProductDetailComponent)