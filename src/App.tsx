import { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Categories } from './pages/Categories';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Header } from './components/Header';
import { client } from './service/base';
import { gql } from '@apollo/client';
import './assets/main.scss';

interface AppProps {

}

interface AppState {
  allCategories: Array<string>;
  activeCategory: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      allCategories: [],
      activeCategory: ''
    }
  }

  componentDidMount() {
    this.fetchAllCategories()
  }

  async fetchAllCategories() {
    try {
      let res = await client.query({
        query: gql`
                query{
	                categories{
                    name
                  }
                }
          `
      })
      let categories: Array<string> = res.data.categories.map((category: any, i: number) => { return category.name });
      this.setState({ ...this.state, allCategories: categories, activeCategory: categories[0] })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div className='app-wrapper'>
        <div className="header">
          <Header
            activeCategory={this.state.activeCategory}
            allCategories={this.state.allCategories}
            setActiveCategory={(categoryName: string) => { this.setState({ ...this.state, activeCategory: categoryName }) }}
          />
        </div>
        <div className="body">
          <Router>
            <Routes>
              <Route path='/' element={<Categories activeCategory={this.state.activeCategory} />} />
              <Route path='/product-detail/:id' element={<ProductDetail />} />
              <Route path='/cart' element={<Cart />} />
            </Routes>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
