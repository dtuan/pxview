import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Linking,
  findNodeHandle,
} from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import PXThumbnailTouchable from '../../components/PXThumbnailTouchable';
import PXImage from '../../components/PXImage';
import OutlineButton from '../../components/OutlineButton';
import * as authActionCreators from '../../common/actions/auth';
import * as i18nActionCreators from '../../common/actions/i18n';

const avatarSize = 70;
const windowWidth = Dimensions.get('window').width;
const defaultProfileImage =
  'https://source.pixiv.net/common/images/no_profile.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  coverContainer: {
    // backgroundColor: '#5cafec',
    height: 150,
  },
  coverInnerContainer: {
    position: 'absolute',
    width: windowWidth,
    top: 15,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    // backgroundColor: '#5cafec',
    // flex: 1,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  profileImage: {
    resizeMode: 'cover',
    width: windowWidth,
    height: 150,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // top: 0,
    // left: 10,
    // right: 0,
    bottom: -(avatarSize / 2),
    // flex: 1,
    width: windowWidth,
    alignItems: 'center',
    //paddingBottom: 40
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
  },
  statType: {
    color: '#90949c',
  },
  authActionContainer: {
    // width: 200,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
  },
  commentContainer: {
    padding: 10,
  },
  hyperlink: {
    color: '#2980b9',
  },
  externalLink: {
    color: '#90949c',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 16,
    color: '#90949c',
    marginHorizontal: 5,
  },
});

const menuList = [
  {
    id: 'works',
    title: 'Submitted Works',
    icon: 'picture-o',
    type: 'font-awesome',
  },
  {
    id: 'connection',
    title: 'My Connection',
    icon: 'users',
    type: 'font-awesome',
  },
  {
    id: 'collection',
    title: 'Collection',
    icon: 'heart',
    type: 'font-awesome',
  },
  {
    id: 'history',
    title: 'Browsing History',
    icon: 'clock-o',
    type: 'font-awesome',
  },
];

const menuList2 = [
  {
    id: 'settings',
    title: 'Settings',
    icon: 'cog',
    type: 'font-awesome',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'comment-o',
    type: 'font-awesome',
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: 'sign-out',
    type: 'font-awesome',
  },
];

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isShowTitle: false,
      viewRef: 0,
    };
  }

  handleOnAvatarImageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  };

  handleOnPressListItem = item => {
    const { user, navigation: { navigate }, screenProps, logout } = this.props;
    switch (item.id) {
      case 'works':
        if (!user) {
          this.handleOnPressLogin();
        } else {
          navigate('MyWorks', { userId: user.id, screenProps });
        }
        // navigate('Web', { source: { uri: 'https://touch.pixiv.net/setting_user.php?ref=ios-app' } });
        break;
      case 'collection':
        // require user login
        if (!user) {
          this.handleOnPressLogin();
        } else {
          navigate('MyCollection', { userId: user.id, screenProps });
        }
        break;
      case 'connection':
        if (!user) {
          this.handleOnPressLogin();
        } else {
          // Actions.myConnection({ userId: user.id });
          navigate('MyConnection', { userId: user.id, screenProps });
        }
        break;
      case 'history':
        navigate('BrowsingHistory');
        break;
      case 'settings': {
        // temp
        const { setLanguage } = this.props;
        setLanguage('ja');
        break;
      }
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  handleOnPressSignUp = () => {
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => console.error('An error occurred', err));
  };

  handleOnPressLogin = () => {
    const { navigation: { navigate } } = this.props;
    navigate('Login');
  };

  handleOnProfileImageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  };

  renderProfile = user => {
    const { viewRef } = this.state;
    return (
      <View style={styles.coverContainer}>
        <PXImage
          key={
            (user && user.profile_image_urls.px_170x170) || defaultProfileImage
          }
          uri={
            (user && user.profile_image_urls.px_170x170) || defaultProfileImage
          }
          style={{
            resizeMode: 'cover',
            width: windowWidth,
            height: 150,
            backgroundColor: 'transparent',
          }}
          ref={ref => (this.backgroundImage = ref)}
          onLoadEnd={this.handleOnProfileImageLoaded}
        />
        <BlurView
          blurType="light"
          blurAmount={20}
          overlayColor={'rgba(255, 255, 255, 0.3)'}
          viewRef={viewRef}
          style={styles.blurView}
        />
        <View style={styles.coverInnerContainer}>
          <PXThumbnailTouchable
            key={
              (user && user.profile_image_urls.px_170x170) ||
                defaultProfileImage
            }
            uri={
              (user && user.profile_image_urls.px_170x170) ||
                defaultProfileImage
            }
            size={avatarSize}
          />
          {user
            ? <Text>{user.name}</Text>
            : <View style={styles.authActionContainer}>
                <OutlineButton
                  text="Sign Up"
                  onPress={this.handleOnPressSignUp}
                />
                <OutlineButton
                  text="Login"
                  style={{ marginLeft: 5 }}
                  onPress={this.handleOnPressLogin}
                />
              </View>}
        </View>
      </View>
    );
  };

  renderList = list => {
    const { user } = this.props;
    if (!user && list.some(l => l.id === 'logout')) {
      list = list.filter(l => l.id !== 'logout');
    }
    return (
      <List>
        {list.map(item => (
          <ListItem
            key={item.id}
            title={item.title}
            leftIcon={{
              name: item.icon,
              type: item.type,
              style: { width: 30, textAlign: 'center' },
            }}
            onPress={() => this.handleOnPressListItem(item)}
          />
        ))}
      </List>
    );
  };

  render() {
    // user illusts
    // bookmark illusts
    // const { userDetail, userId } = this.props;
    const { user } = this.props;
    console.log('user ', user);
    return (
      <View style={styles.container}>
        {
          <ScrollView style={styles.container}>
            {this.renderProfile(user)}
            {this.renderList(menuList)}
            {this.renderList(menuList2)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connect(
  state => ({
    user: state.auth.user,
  }),
  { ...authActionCreators, ...i18nActionCreators },
)(UserProfile);