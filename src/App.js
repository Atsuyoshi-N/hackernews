import React from 'react';
import axios from 'axios';
import Table from './Table';
import Button from './Button';
import './App.css';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PATH_PAGE,
  PARAM_HPP,
} from './constants/index.js';

const Loading = () => <div>Loading...</div>;
const withLoading = Component => ({isLoading, ...rest}) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}},
      isLoading: false,
    });
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}},
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({isLoading: true});
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PATH_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
    )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({error}));
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  render() {
    const {searchTerm, results, searchKey, error, isLoading} = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

class Search extends React.Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const {value, onChange, onSubmit, children} = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}
