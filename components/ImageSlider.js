import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { api } from '../helpers/api';
import Reactotron from 'reactotron-react-native';

export default class Slider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;

    Reactotron.log(images);

    let imageArray = [];

    images.map((uri, i) => {
      const imgURL = api + uri.image;
      imageArray.push(
        <View style={styles.container} key={i}>
          <Image
            source={{
              uri: imgURL
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      );
    });

    return (
      <View
        style={{
          height: 250,
          width: '100%',
          // backgroundColor: '#AAAAAA',
          padding: 5,
          overflow: 'hidden'
        }}
      >
        <Swiper height={200}>{imageArray}</Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    height: 180,
    width: '100%',
    alignSelf: 'center'
  }
});
