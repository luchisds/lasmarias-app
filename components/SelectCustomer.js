import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  List,
  Paragraph,
  Portal,
  Text
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { withStore } from '@spyna/react-store';
import { theme } from '../helpers/styles';
import { _removeOrder } from '../helpers/api';
import Reactotron from 'reactotron-react-native';
import PropTypes from 'prop-types';

class SelectCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  _showDialog = () => {
    this.setState({
      visible: true
    });
  };

  _cancelDialog = () => {
    this.setState({
      visible: false
    });
  };

  _removeCustomer = async () => {
    const { routeName } = this.props.navigation.state;

    await _removeOrder();
    this.props.store.set('id', null);
    this.props.store.set('name', null);
    this.setState({
      visible: false
    });

    // Set products in cart to 0
    this.props.store.set('productsInCart', 0);

    if (routeName === 'Checkout') {
      this.props.navigation.navigate('Home');
    }
  };

  render() {
    let content;
    if (!this.props.id) {
      content = (
        <List.Item
          title={<Text style={styles.listTitle}>Buscar Cliente</Text>}
          left={props => (
            <MaterialIcons
              name="search"
              size={moderateScale(24, 0.3)}
              color="white"
              style={styles.listIcon}
            />
          )}
          right={props => (
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24, 0.3)}
              color="white"
              style={styles.listIcon}
            />
          )}
          theme={{ colors: { text: '#FFFFFF' } }}
          style={{ padding: 0 }}
          onPress={() => this.props.navigation.navigate('SearchCustomer')}
        />
      );
    } else {
      content = (
        <List.Item
          title={<Text style={styles.listTitle}>{this.props.name}</Text>}
          left={props => (
            <MaterialIcons
              name="person"
              size={moderateScale(24, 0.3)}
              color="white"
              style={styles.listIcon}
            />
          )}
          right={props => (
            <IconButton
              {...props}
              icon="close"
              size={moderateScale(24, 0.3)}
              color={theme.RED_COLOR}
              onPress={() => this._showDialog()}
            />
          )}
          theme={{ colors: { text: '#FFFFFF' } }}
          style={{ padding: 0, backgroundColor: theme.ACCENT_COLOR }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View>{content}</View>
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={this.state.visible}
            dismissable={false}
            onDismiss={this._cancelDialog}
          >
            <Dialog.Title style={styles.title}>ATENCION!</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={styles.paragraph}>
                Se perderán todos los productos que haya agregado al carrito.
                ¿Está seguro?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._cancelDialog}>
                <Text style={styles.button}>CANCELAR</Text>
              </Button>
              <Button onPress={this._removeCustomer}>
                <Text style={styles.button}>ACEPTAR</Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: theme.PRIMARY_COLOR,
    marginVertical: '5@ms0.3'
  },
  listIcon: {
    margin: '4@ms0.3',
    paddingVertical: 5
  },
  listTitle: {
    fontSize: '15@ms0.3'
  },
  title: {
    color: theme.PRIMARY_COLOR,
    fontSize: '16@ms0.3'
  },
  paragraph: {
    fontSize: '14@ms0.3'
  },
  button: {
    color: theme.PRIMARY_COLOR,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    fontSize: '14@ms0.3'
  },
  dialog: {
    maxWidth: 400,
    width: '300@ms',
    alignSelf: 'center'
  }
});

export default withStore(SelectCustomer, ['id', 'name', 'productsInCart']);

SelectCustomer.propTypes = {
  navigation: PropTypes.object.isRequired,
  id: PropTypes.number,
  name: PropTypes.string,
  productsInCart: PropTypes.number
};
