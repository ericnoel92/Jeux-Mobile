import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TetrixProps {
  initialScore?: number;
}

interface TetrixState {
  score: number;
  grid: number[][];
  gridHeight: number;
  gridWidth: number;
  currentPiece: {
    shape: number[][];
    color: string;
    row: number;
    col: number;
  } | null;
  pieces: {
    shape: number[][];
    color: string;
  }[];
  gameRunning: boolean;
}

export default class Tetrix extends Component<TetrixProps, TetrixState> {
  private timerId: NodeJS.Timeout | null = null;
  private spawnIntervalId: NodeJS.Timeout | null = null;

  constructor(props: TetrixProps) {
    super(props);
    this.state = {
      score: props.initialScore || 0,
      grid: [],
      gridHeight: 20,
      gridWidth: 10, // Taille de la grille standard Tetris
      currentPiece: null,
      pieces: [
        {
          shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ],
          color: 'red'
        },
        {
          shape: [
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 1]
          ],
          color: 'blue'
        },
        {
          shape: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
          ],
          color: 'green'
        },
        {
          shape: [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
          ],
          color: 'purple'
        },
        {
          shape: [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
          ],
          color: 'orange'
        },
        {
          shape: [
            [1, 1],
            [1, 1]
          ],
          color: 'yellow'
        },
      ],
      gameRunning: false,
    };
  }

  componentDidMount() {
    this.initGame();
    this.startSpawnInterval();
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.spawnIntervalId) {
      clearInterval(this.spawnIntervalId);
    }
  }

  initGame = () => {
    console.log("Initialisation du jeu...");
    const grid = this.buildGrid();
    this.setState({ grid, gameRunning: true }, () => {
      this.spawnPiece();
      this.startFalling();
    });
  };

  buildGrid = () => {
    const { gridHeight, gridWidth } = this.state;
    const grid = [];
    for (let y = 0; y < gridHeight; y++) {
      const line = [];
      for (let x = 0; x < gridWidth; x++) {
        line.push(0);
      }
      grid.push(line);
    }
    console.log("Grille construite :", grid);
    return grid;
  };

  startSpawnInterval = () => {
    this.spawnIntervalId = setInterval(() => {
      if (!this.state.currentPiece) {
        this.spawnPiece();
      }
    }, 20000); // Nouvelle pièce toutes les 20 secondes
  };

  spawnPiece = () => {
    const { pieces } = this.state;
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const selectedPiece = pieces[randomIndex];
    const initialRow = 0;
    const initialCol = Math.floor((this.state.gridWidth - selectedPiece.shape[0].length) / 2);

    // Création d'une copie profonde de la pièce sélectionnée
    const newPiece = {
      shape: selectedPiece.shape.map(row => [...row]), // Copie immuable de la forme de la pièce
      color: selectedPiece.color,
      row: initialRow,
      col: initialCol
    };

    if (this.isValidMove(newPiece.shape, initialRow, initialCol)) {
      this.setState({ currentPiece: newPiece });
    } else {
      this.endGame();
    }
  };

  startFalling = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(() => {
      this.movePieceDown();
    }, 1000); // Vitesse de descente d'une pièce par seconde (modifiable selon le niveau)
  };

  movePieceLeft = () => {
    this.setState(prevState => {
      if (!prevState.currentPiece) return null;
      const { currentPiece } = prevState;
      const { row, col } = currentPiece;
      if (this.isValidMove(currentPiece.shape, row, col - 1)) {
        return {
          currentPiece: { ...currentPiece, col: col - 1 }
        };
      }
      return null;
    });
  };

  movePieceRight = () => {
    this.setState(prevState => {
      if (!prevState.currentPiece) return null;
      const { currentPiece } = prevState;
      const { row, col } = currentPiece;
      if (this.isValidMove(currentPiece.shape, row, col + 1)) {
        return {
          currentPiece: { ...currentPiece, col: col + 1 }
        };
      }
      return null;
    });
  };

  movePieceDown = () => {
    this.setState(prevState => {
      if (!prevState.currentPiece) return null;
      const { currentPiece } = prevState;
      const { row, col } = currentPiece;
      if (this.isValidMove(currentPiece.shape, row + 1, col)) {
        return {
          currentPiece: { ...currentPiece, row: row + 1 }
        };
      } else {
        // Lock la pièce lorsqu'elle ne peut plus descendre
        this.lockPiece();
        this.spawnPiece();
      }
      return null;
    });
  };

  rotatePiece = () => {
    // Ne pas implémenter la rotation automatique des pièces en dehors de la grille
  };

  isValidMove = (shape: number[][], newRow: number, newCol: number) => {
    const { gridHeight, gridWidth } = this.state;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const newRowIndex = newRow + r;
          const newColIndex = newCol + c;
          if (newRowIndex < 0 || newRowIndex >= gridHeight || newColIndex < 0 || newColIndex >= gridWidth || this.state.grid[newRowIndex][newColIndex] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  lockPiece = () => {
    if (!this.state.currentPiece) return;
    const { grid, currentPiece } = this.state;
    const { shape, row, col } = currentPiece;

    // Copie immuable de la forme de la pièce
    const pieceShape = shape.map(row => [...row]);

    pieceShape.forEach((rowShape, r) => {
      rowShape.forEach((cell, c) => {
        if (cell === 1) {
          grid[row + r][col + c] = 1;
        }
      });
    });

    this.setState({ grid }, () => {
      this.checkLinesAndClear();
    });
  };

  checkLinesAndClear = () => {
    const { grid, score } = this.state;
    let linesCleared = 0;
    for (let r = grid.length - 1; r >= 0; r--) {
      if (grid[r].every(cell => cell === 1)) {
        grid.splice(r, 1);
        grid.unshift(Array(this.state.gridWidth).fill(0));
        linesCleared++;
      }
    }
    if (linesCleared > 0) {
      this.setState(prevState => ({ grid, score: prevState.score + linesCleared * 10 }));
    }
  };

  endGame = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.spawnIntervalId) {
      clearInterval(this.spawnIntervalId);
    }
    this.setState({ gameRunning: false });
    console.log("Game Over");
    // Ajouter ici la logique pour gérer la fin de partie
  };

  render() {
    const { score, grid, gameRunning } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Tetrix</Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>
        <View style={styles.wrapperTetris}>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={[styles.cell, { backgroundColor: cell === 0 ? 'white' : 'gray' }]} />
              ))}
            </View>
          ))}
          {/* Rendu de la pièce courante */}
          {this.state.currentPiece && this.state.currentPiece.shape.map((rowShape, r) => (
            <View key={r} style={{ position: 'absolute', top: (this.state.currentPiece.row + r) * 30, left: this.state.currentPiece.col * 30 }}>
              {rowShape.map((cell, c) => (
                <View key={c} style={{ width: 30, height: 30, backgroundColor: cell === 1 ? this.state.currentPiece.color : 'transparent', borderWidth: 1, borderColor: 'black' }} />
              ))}
            </View>
          ))}
        </View>
        {gameRunning && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={this.movePieceLeft}>
              <Text style={styles.buttonText}>Gauche</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.movePieceRight}>
              <Text style={styles.buttonText}>Droite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.rotatePiece}>
              <Text style={styles.buttonText}>Rotation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.movePieceDown}>
              <Text style={styles.buttonText}>Bas</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 20,
  },
  score: {
    fontSize: 20,
  },
  wrapperTetris: {
    position: 'relative',
    borderWidth: 2,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});
