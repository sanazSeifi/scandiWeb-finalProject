import { Component } from 'react';
import { gql } from '@apollo/client';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Currency } from '../models/currency';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';
import { client } from '../service/base';

interface CurrencySelectComponentProps {
    activeCurrency: Currency
    initialCurrencySet: (currency: Currency) => void;
}

interface CurrencySelectComponentState {
    allCurrencies: Array<Currency>;
    showDropDown: boolean;
}

class CurrencySelectComponent extends Component<CurrencySelectComponentProps, CurrencySelectComponentState> {

    constructor(props: CurrencySelectComponentProps) {
        super(props);
        this.state = {
            allCurrencies: [],
            showDropDown: false,
        }
    }

    componentDidMount() {
        this.fetchAllCurrencies();
    }

    async fetchAllCurrencies() {
        try {
            let res = await client.query({
                query: gql`
                        query{
                            currencies{
                                label,
                                symbol
                            }
                        }
              `
            })
            this.setState({ ...this.state, allCurrencies: res.data.currencies }, () => {
                if (this.props.activeCurrency.symbol === '') {
                    this.props.initialCurrencySet(res.data.currencies[0]);
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className='currency-select-wrapper'>
                <div
                    className="current-currency"
                    onClick={() => this.setState({ ...this.state, showDropDown: !this.state.showDropDown })}
                >
                    {this.props.activeCurrency.symbol}
                    {
                        this.state.showDropDown
                            ? <i className="fa fa-angle-up"></i>
                            : <i className="fa fa-angle-down"></i>
                    }
                </div>
                {
                    this.state.showDropDown
                        ? <ul className="currency-list">
                            {
                                this.state.allCurrencies.map((item: Currency, i: number) => {
                                    return <li
                                        className={`item ${item.symbol === this.props.activeCurrency.symbol ? "selected" : ""}`}
                                        key={i.toString()}
                                        onClick={() => {
                                            this.setState({ ...this.state, showDropDown: !this.state.showDropDown }, () => {
                                                this.props.initialCurrencySet(item)
                                            })
                                        }}
                                    >
                                        {item.symbol}{` `}{item.label}
                                    </li>
                                })
                            }
                        </ul>
                        : undefined
                }
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
        initialCurrencySet: (currency: Currency) => dispatch({ type: REDUX_ACTIONS.ACTIVE_CURRENCY_UPDATE, payload: currency })
    }
}

export const CurrencySelect = connect(storeToProps, dispatchToProps)(CurrencySelectComponent)