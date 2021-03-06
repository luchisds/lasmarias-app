import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { withStore } from '@spyna/react-store';
import Sentry from 'sentry-expo';
import { theme } from '../helpers/styles';
import { _getToken } from '../helpers/api';

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    const token = await _getToken();
    if (token !== null) {
      this.props.store.set('userData', {
        userType: token.user_type,
        userName: token.name,
        userLastName: token.last_name,
        userEmail: token.email
      });

      // Set Sentry scope
      Sentry.setUserContext({
        email: token.email,
        extra: {
          userType: token.user_type,
          name: token.name,
          lastName: token.last_name
        }
      });

      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.PRIMARY_COLOR
        }}
      >
        <ActivityIndicator color="#FFFFFF" size={25} />
      </View>
    );
  }
}

export default withStore(AuthLoadingScreen, ['userData']);
