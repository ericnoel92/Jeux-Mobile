import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert, ImageBackground } from 'react-native';

interface State {
  board: (string | null)[];
  currentPlayer: string;
  scoreX: number;
  scoreO: number;
  againstComputer: boolean;
}

export default class Morpion extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      scoreX: 0,
      scoreO: 0,
      againstComputer: false,
    };
  }

  handlePress = (index: number) => {
    const { board, currentPlayer, againstComputer } = this.state;

    if (board[index] || this.checkWinner(board, currentPlayer)) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;

    this.setState({ board: newBoard }, () => {
      const winner = this.checkWinner(newBoard, currentPlayer);
      if (winner) {
        this.updateScore(winner);
        this.resetBoard();
        this.showWinnerMessage(winner);
      } else if (newBoard.every(cell => cell !== null)) {
        this.resetBoard();
        this.showWinnerMessage(null);
      } else {
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        this.setState({ currentPlayer: nextPlayer }, () => {
          if (againstComputer && nextPlayer === 'O') {
            this.makeComputerMove();
          }
        });
      }
    });
  };

  makeComputerMove = () => {
    const { board } = this.state;

    if (this.checkWinner(board, 'X') || this.checkWinner(board, 'O') || board.every(cell => cell !== null)) return;

    const emptyCells: number[] = [];
    board.forEach((cell, index) => {
      if (cell === null) {
        emptyCells.push(index);
      }
    });

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMoveIndex = emptyCells[randomIndex];

    const newBoard = board.slice();
    newBoard[computerMoveIndex] = 'O';

    this.setState({ board: newBoard, currentPlayer: 'X' }, () => {
      const winner = this.checkWinner(newBoard, 'O');
      if (winner) {
        this.updateScore(winner);
        this.resetBoard();
        this.showWinnerMessage(winner);
      } else if (newBoard.every(cell => cell !== null)) {
        this.resetBoard();
        this.showWinnerMessage(null);
      }
    });
  };

  checkWinner = (board: (string | null)[], player: string) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  updateScore = (player: string) => {
    if (player === 'X') {
      this.setState(prevState => ({ scoreX: prevState.scoreX + 1 }));
    } else {
      this.setState(prevState => ({ scoreO: prevState.scoreO + 1 }));
    }
  };

  resetBoard = () => {
    this.setState({
      board: Array(9).fill(null),
    });
  };

  toggleMode = () => {
    this.setState(prevState => ({ againstComputer: !prevState.againstComputer }), () => {
      this.resetBoard();
      if (this.state.againstComputer && this.state.currentPlayer === 'O') {
        this.makeComputerMove();
      }
    });
  };

  showWinnerMessage = (winner: string | null) => {
    if (winner) {
      Alert.alert(`Partie terminée !`, `${winner} a gagné !`);
    } else {
      Alert.alert(`Partie terminée !`, `Match nul !`);
    }
  };

  renderCell = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.cell}
        onPress={() => this.handlePress(index)}
      >
        <Text style={styles.cellText}>{this.state.board[index]}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ImageBackground
        source={require('@/assets/images/Morpion.png')}
        style={styles.container}
      >
        <View style={styles.board}>
          {this.state.board.map((cell, index) => this.renderCell(index))}
        </View>
        <View style={styles.scoreBoard}>
          <Text style={styles.scoreText}>Score X: {this.state.scoreX}</Text>
          <Text style={styles.scoreText}>Score O: {this.state.scoreO}</Text>
        </View>
        <Button
          title={this.state.againstComputer ? 'Jouer contre un ami' : 'Jouer contre l\'ordinateur'}
          onPress={this.toggleMode}
        />
        <Button
          title="Réinitialiser la partie"
          onPress={this.resetBoard}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  cellText: {
    fontSize: 24,
  },
  scoreBoard: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
