import React from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import { theme } from '../../helpers/styles';
import { updateDbData, getProducts } from '../../helpers/api';
import SelectCustomer from '../../components/SelectCustomer';
import CategoryFilter from './components/CategoryFilter';
import Product from './components/Product';
import ProductDetailModal from './components/ProductDetailModal';
import Reactotron from 'reactotron-react-native';

//TODO: Add logic and products fetch
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selectedItem: null,
      products: [],
      filteredProducts: [],
      selectedBrand: null,
      selectedProductLine: null,
      selectedUnit: null
    };
  }

  _navigateCheckout = () => {
    this.props.navigation.navigate('Checkout');
  };

  _onPressItem = item => {
    this._showModal(item);
  };

  _showModal = selectedItem => {
    this.setState({ isModalVisible: true, selectedItem });
  };

  _hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  _keyExtractor = (item, index) => item.product_id.toString();

  _renderItem = ({ item }) => (
    <Product
      name={item.name.toUpperCase()}
      brand={item.brand.toUpperCase()}
      productLine={item.product_line}
      price={item.price}
      unit={item.unit}
      packaging={item.package}
      item={item}
      onPress={this._onPressItem}
      navigateCheckout={this._navigateCheckout}
    />
  );

  async componentDidMount() {
    await updateDbData();

    const products = await getProducts(
      this.state.selectedBrand,
      this.state.selectedProductLine,
      this.state.selectedUnit
    );

    // Reactotron.log(products);

    this.setState({
      products: products,
      filteredProducts: products
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <SelectCustomer
          navigation={this.props.navigation}
          screenProps={this.props.screenProps}
        />
        <CategoryFilter />
        <View style={styles.titleBackground}>
          <Text style={styles.title}>OFERTAS / DESTACADOS</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={{ height: 6, backgroundColor: '#EEE' }} />
            )}
            data={this.state.filteredProducts}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </View>
        <Portal style={styles.modal}>
          <Modal
            visible={this.state.isModalVisible}
            onDismiss={this._hideModal}
            style={styles.modal}
          >
            <ProductDetailModal
              data={this.state.selectedItem}
              onDismiss={this._hideModal}
              navigateCheckout={this._navigateCheckout}
            />
          </Modal>
        </Portal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleBackground: {
    backgroundColor: theme.PRIMARY_COLOR,
    paddingVertical: 5
  },
  title: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  listContainer: {
    flex: 1
  },
  modal: {
    flex: 1
  }
});
