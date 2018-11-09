import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Text,
  TouchableRipple,
  Surface,
  withTheme
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class BigButton extends React.Component {
  render() {
    const label = this.props.label;
    const backgroundColor = this.props.backgroundColor;
    const textColor = this.props.textColor;
    const elevation = this.props.elevation;
    const radius = this.props.radius;
    const icon = this.props.icon;
    const iconSize = this.props.iconSize;

    return (
      <Surface style={[styles.button, {elevation: elevation, borderRadius: radius, backgroundColor: backgroundColor, color: textColor}]}>
        <TouchableRipple borderless onPress={() => console.log('Pressed')}>
           <View style={styles.content}>
              <View>
                <MaterialCommunityIcons name={icon} size={iconSize} color={textColor} />
              </View>
              <Text
                style={[styles.label, {color: textColor}]}
                numberOfLines={2}>
                {label}
              </Text>
           </View>
        </TouchableRipple>
      </Surface>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    width: 150,
    padding: 8
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  label: {
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 9,
    marginHorizontal: 16,
    fontSize: 16
  }
});
