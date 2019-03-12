import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { theme } from '../../helpers/styles';
import { signUp, saveUserProfile } from '../../helpers/api';
import Logo from '../../components/Logo';
import Reactotron from 'reactotron-react-native';

// TODO: unify sign up in a single request
export default class SignUp2Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameText: '',
      lastNameText: '',
      businessText: '',
      telText: '',
      celText: '',
      addressText: '',
      cityText: '',
      zipText: '',
      errorText: null,
      loading: false
    };
  }

  _saveData = async () => {
    try {
      await AsyncStorage.setItem('SignUpData', JSON.stringify(this.state));
    } catch (error) {
      Reactotron.error('Error saving data');
    }
    this.props.navigation.goBack();
  };

  _getData = async () => {
    try {
      return await AsyncStorage.getItem('SignUpData');
    } catch (error) {
      Reactotron.error('Error retrieving data');
    }
  };

  _removeData = async () => {
    try {
      await AsyncStorage.removeItem('SignUpData');
    } catch (error) {
      Reactotron.error('Error deleting data');
    }
  };

  _signUp = async () => {
    const email = this.props.navigation.getParam('email');
    const password = this.props.navigation.getParam('password');
    const password2 = this.props.navigation.getParam('password2');

    this.setState({
      errorText: null,
      loading: true
    });

    this._removeData();

    let isSignUpOk = false;
    let isSaveProfileOk = false;

    isSignUpOk = await signUp(email, password, password2)
      .then(response => {
        Reactotron.log(response);
        if (response.error === false) {
          return true;
        } else {
          this.setState({
            errorText: response.msg
          });
          return false;
        }
      })
      .catch(error => {
        Reactotron.error(error);
        this.setState({
          loading: false
        });
        return false;
      });

    if (isSignUpOk) {
      isSaveProfileOk = await saveUserProfile(email, this.state)
        .then(response => {
          Reactotron.log(response);
          return true;
        })
        .catch(error => {
          Reactotron.error(error);
          this.setState({
            loading: false
          });
          return false;
        });
    }

    if (isSaveProfileOk) {
      Reactotron.log('A Navegar');
      this.setState({
        loading: false
      });
      this.props.navigation.navigate('SignUpOk', {
        name: this.state.nameText
      });
    }
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._saveData);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._saveData);
  }

  async componentDidMount() {
    const data = await this._getData();
    await this._removeData();
    this.setState(JSON.parse(data));
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidContainer}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Logo />
          <View style={styles.titleContainer}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/user-128.png')}
            />
            <Text style={styles.title}>REGISTRATE</Text>
          </View>
          <Text style={styles.sub}>Ingresá tus Datos Personales:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              label="Nombre"
              placeholder="Nombre"
              style={styles.input}
              value={this.state.nameText}
              onChangeText={text => this.setState({ nameText: text })}
            />
            <TextInput
              label="Apellido"
              placeholder="Apellido"
              style={styles.input}
              value={this.state.lastNameText}
              onChangeText={text => this.setState({ lastNameText: text })}
            />
            <TextInput
              label="Nombre del Comercio"
              placeholder="Nombre del Comercio"
              style={styles.input}
              value={this.state.businessText}
              onChangeText={text => this.setState({ businessText: text })}
            />
            <TextInput
              label="Teléfono"
              placeholder="Teléfono"
              autoComplete="tel"
              keyboardType="number-pad"
              style={styles.input}
              value={this.state.telText}
              onChangeText={text => this.setState({ telText: text })}
            />
            <TextInput
              label="Celular"
              placeholder="Celular"
              autoComplete="tel"
              keyboardType="number-pad"
              style={styles.input}
              value={this.state.celText}
              onChangeText={text => this.setState({ celText: text })}
            />
            <TextInput
              label="Dirección del Comercio"
              placeholder="Dirección del Comercio"
              autoComplete="street-address"
              style={styles.input}
              value={this.state.addressText}
              onChangeText={text => this.setState({ addressText: text })}
            />
            <TextInput
              label="Ciudad"
              placeholder="Ciudad"
              style={styles.input}
              value={this.state.cityText}
              onChangeText={text => this.setState({ cityText: text })}
            />
            <TextInput
              label="Código Postal"
              placeholder="Código Postal"
              autoComplete="postal-code"
              style={styles.input}
              value={this.state.zipText}
              onChangeText={text => this.setState({ zipText: text })}
            />
            <View>
              <ActivityIndicator
                animating={this.state.loading}
                color={theme.PRIMARY_COLOR}
                size={'large'}
                style={[
                  styles.loading,
                  { display: this.state.loading ? 'flex' : 'none' }
                ]}
              />
            </View>
            {this.state.errorText ? (
              <Text style={styles.error}>{this.state.errorText}</Text>
            ) : null}
          </View>
          <View style={styles.nextButtonContainer}>
            <Button
              mode="contained"
              style={styles.nextButton}
              color={theme.ACCENT_COLOR}
              theme={{ roundness: 0 }}
              onPress={() => this._signUp()}
            >
              <Text
                style={styles.nextButtonText}
                theme={{
                  colors: {
                    text: '#FFFFFF'
                  }
                }}
              >
                CREAR CUENTA
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  keyboardAvoidContainer: {
    flex: 1
  },
  container: {
    // flex: 1,
    justifyContent: 'center'
  },
  titleContainer: {
    // flex: 2.5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    marginTop: 10,
    color: theme.PRIMARY_COLOR,
    fontWeight: theme.FONT_WEIGHT_MEDIUM
  },
  sub: {
    fontSize: 14,
    width: 260,
    alignSelf: 'center',
    marginTop: 40,
    fontWeight: theme.FONT_WEIGHT_MEDIUM
  },
  inputContainer: {
    // flex: 5,
    alignItems: 'center'
  },
  input: {
    backgroundColor: 'transparent',
    width: 260
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
    width: 250
  },
  loading: {
    marginVertical: 10
  },
  nextButtonContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 30
  },
  nextButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 50
  },
  nextButtonText: {
    fontSize: 16
  }
});
