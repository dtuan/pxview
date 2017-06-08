import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import SearchAutoCompleteResult from './SearchAutoCompleteResult';
import SearchUsersAutoCompleteResult from './SearchUsersAutoCompleteResult';
import { connectLocalization } from '../components/Localization';
import PXTabView from '../components/PXTabView';
import * as searchAutoCompleteActionCreators
  from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators
  from '../common/actions/searchUsersAutoComplete';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import * as searchTypeActionCreators from '../common/actions/searchType';
import { SEARCH_TYPES } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    // top: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    const { searchType, i18n } = props;
    this.state = {
      index: searchType === SEARCH_TYPES.USER ? 1 : 0,
      routes: [
        { key: '1', title: i18n.illustManga },
        { key: '2', title: i18n.user },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustManga },
          { key: '2', title: i18n.user },
        ],
      });
    }
  }

  handleChangeTab = index => {
    const { setSearchType } = this.props;
    this.setState({ index });
    if (index === 1) {
      setSearchType(SEARCH_TYPES.USER);
    } else {
      setSearchType(SEARCH_TYPES.ILLUST);
    }
  };

  renderScene = ({ route }) => {
    const {
      word,
      searchAutoComplete,
      searchUsersAutoComplete,
      searchHistory,
    } = this.props;
    switch (route.key) {
      case '1':
        return (
          <SearchAutoCompleteResult
            searchAutoComplete={searchAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            word={word}
          />
        );
      case '2':
        return (
          <SearchUsersAutoCompleteResult
            searchUsersAutoComplete={searchUsersAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressUser}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            loadMoreItems={this.loadMoreUsers}
            word={word}
          />
        );
      default:
        return null;
    }
  };

  submitSearch = word => {
    word = word.trim();
    if (word) {
      const {
        navigation: { navigate },
        isPushNewSearch,
        searchType,
        onSubmitSearch,
        addSearchHistory,
      } = this.props;
      addSearchHistory(word);
      onSubmitSearch(word);
      if (isPushNewSearch) {
        navigate('SearchResult', { word, searchType });
      }
    }
  };

  handleOnPressAutoCompleteItem = word => {
    this.submitSearch(word);
  };

  handleOnPressSearchHistoryItem = word => {
    this.submitSearch(word);
  };

  handleOnPressUser = userId => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate('UserDetail', { userId });
  };

  handleOnPressRemoveSearchHistoryItem = item => {
    const { removeSearchHistory } = this.props;
    removeSearchHistory(item);
  };

  handleOnPressClearSearchHistory = () => {
    const { clearSearchHistory } = this.props;
    clearSearchHistory();
  };

  loadMoreUsers = () => {
    const {
      fetchSearchUserAutoComplete,
      searchUsersAutoComplete: { nextUrl },
    } = this.props;
    if (nextUrl) {
      fetchSearchUserAutoComplete(null, nextUrl);
    }
  };

  render() {
    const {
      word,
      searchType,
      searchAutoComplete,
      searchUsersAutoComplete,
      searchHistory,
    } = this.props;
    return (
      <View style={styles.container}>
        <PXTabView
          navigationState={{
            ...this.state,
            word,
            searchAutoComplete,
            searchUsersAutoComplete,
            searchHistory,
            searchType,
          }}
          renderScene={this.renderScene}
          onRequestChangeTab={this.handleChangeTab}
          lazy={false}
        />
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => {
      const { word } = props;
      return {
        searchAutoComplete: state.searchAutoComplete,
        searchUsersAutoComplete: state.searchUsersAutoComplete,
        searchHistory: state.searchHistory,
        word,
      };
    },
    {
      ...searchAutoCompleteActionCreators,
      ...searchUserAutoCompleteActionCreators,
      ...searchHistoryActionCreators,
      ...searchTypeActionCreators,
    },
  )(Search),
);
