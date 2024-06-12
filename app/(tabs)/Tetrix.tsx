import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

interface TetrixProps {
  initialScore?: number;
}

interface TetrixState {
  score: number;
}

export default class Tetrix extends Component<TetrixProps, TetrixState> {
  constructor(props: TetrixProps) {
    super(props);
    this.state = {
      score: props.initialScore || 0,
    };
  }

  handleButtonPress = () => {
    this.setState((prevState) => ({ score: prevState.score + 1 }));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/Tetrix.png')} style={styles.logo} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Tetrix</Text>
          <Text style={styles.score}>Score: {this.state.score}</Text>
          <Button
            title="Increase Score"
            onPress={this.handleButtonPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120, // ajustez la largeur selon vos besoins
    height: 120, // ajustez la hauteur selon vos besoins
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'red',
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
});
