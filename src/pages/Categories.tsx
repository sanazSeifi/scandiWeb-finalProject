import { gql } from '@apollo/client';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Currency } from '../models/currency';
import { StoreModel } from '../redux/storeModel';
import { client } from '../service/base';

interface CategoriesProps {
    activeCategory: string;
    activeCurrency: Currency
}

interface CategoriesState {
    activeCategory: string;
    data: Array<{
        name: string;
        products: Array<{
            id: string;
            gallery: Array<string>;
            name: string;
            prices: Array<{ amount: number, currency: { symbol: string } }>
        }>
    }>
}

class CategoriesComponent extends Component<CategoriesProps, CategoriesState> {

    constructor(props: CategoriesProps) {
        super(props);
        this.state = {
            activeCategory: this.props.activeCategory,
            data: [],
        }
    }

    componentDidMount() {
        this.fetchAllCategories()
    }

    componentDidUpdate(prevProps: CategoriesProps) {
        if (prevProps.activeCategory === this.props.activeCategory) {
            return
        } else {
            this.setState({ ...this.state, activeCategory: this.props.activeCategory })
        }

    }

    async fetchAllCategories() {
        try {
            let res = await client.query({
                query: gql`
                    query{
                        categories{
                            name,
                            products{
                                id,
                                gallery,
                                name,
                                prices{
                                amount,
                                currency{
                                    symbol
                                }
                            }
                        }
                    }
                }
              `
            })
            this.setState({ ...this.state, data: res.data.categories })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className='categories'>
                <div className='active-category'>{this.state.activeCategory}</div>
                <div className="list-wrapper">
                    {
                        this.state.data.find((item: {
                            name: string;
                            products: Array<{
                                id: string;
                                gallery: Array<string>;
                                name: string;
                                prices: Array<{ amount: number, currency: { symbol: string } }>
                            }>
                        }) => { return item.name === this.state.activeCategory }) !== null
                            ? this.state.data.find((item: {
                                name: string;
                                products: Array<{
                                    id: string;
                                    gallery: Array<string>;
                                    name: string;
                                    prices: Array<{ amount: number, currency: { symbol: string } }>
                                }>
                            }) => { return item.name === this.state.activeCategory })?.products.map((product: {
                                id: string;
                                gallery: Array<string>;
                                name: string;
                                prices: Array<{ amount: number, currency: { symbol: string } }>
                            }, i: number) => {
                                return <div
                                    className='item'
                                    key={i.toString()}
                                >
                                    <div className="img-wrapper">
                                        <img className='item-img' src={product.gallery[0]} alt=''/>
                                        <div
                                            onClick={() => {
                                                window.location.replace(`/product-detail/${product.id}`)
                                            }}
                                            className="order-icon"
                                        >
                                            <i className="fa fa-shopping-cart fa-2x"></i>
                                        </div>
                                    </div>
                                    <h6 className='name'>{product.name}</h6>
                                    <div className='price'>
                                        {product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].currency.symbol}
                                        {product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].amount}
                                    </div>
                                </div>
                            })
                            : undefined
                    }
                </div>
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        activeCurrency: store.activeCurrency
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {

    }
}

export const Categories = connect(storeToProps, dispatchToProps)(CategoriesComponent)