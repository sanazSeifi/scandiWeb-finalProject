import { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreModel } from '../redux/storeModel';
import { Currency } from '../models/currency';
import { Product } from '../models/product';
import { CurrencySelect } from './CurrencySelect';
import { CartQuickAccess } from './CartQuickAccess';

interface HeaderComponentProps {
    orders: Array<{
        product: Product;
        count: number;
    }>
    allCategories: Array<string>;
    activeCategory: string;
    setActiveCategory: (categoryName: string) => void;
}

interface HeaderComponentState {
    showCurrencyDropDown: boolean;
    showCartDropDown: boolean;
    allCurrencies: Array<Currency>;
}

class HeaderComponent extends Component<HeaderComponentProps, HeaderComponentState> {

    constructor(props: HeaderComponentProps) {
        super(props);
        this.state = {
            showCurrencyDropDown: false,
            showCartDropDown: false,
            allCurrencies: [],
        }
    }

    render() {
        return (
            <div className='header-wrapper'>
                <div className='left-side'>
                    {
                        this.props.allCategories.map((item: string, i: number) => {
                            return <div
                                key={i.toString()}
                                onClick={() => this.props.setActiveCategory(item)}
                                className={`item ${item === this.props.activeCategory ? "selected" : ""}`}
                            >{item}</div>
                        })
                    }
                </div>
                <div className='right-side' >
                    <CurrencySelect />
                    <CartQuickAccess />
                </div>
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        orders: store.orders,
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {

    }
}

export const Header = connect(storeToProps, dispatchToProps)(HeaderComponent)