// App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

export default function App() {
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(40);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [targetVisible, setTargetVisible] = useState<boolean>(false);
    const [targetPosition, setTargetPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    useEffect(() => {
        if (gameStarted) {
            startGame();
        } else {
            resetGame();
        }
    }, [gameStarted]);

    useEffect(() => {
        if (time === 0 && intervalId) {
            clearInterval(intervalId);
            Alert.alert('Le jeu est terminé', `Votre score final est : ${score}`, [{ text: 'OK', onPress: resetGame }]);
        }
    }, [time]);

    const startGame = () => {
        setScore(0);
        setTime(40);

        const id = setInterval(() => {
            showTarget();
            setTime(prevTime => prevTime - 1);
        }, 1000);

        setIntervalId(id);
    };

    const stopGame = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setGameStarted(false);
    };

    const resetGame = () => {
        setScore(0);
        setTime(40);
        setTargetVisible(false);
        if (intervalId) clearInterval(intervalId);
    };

    const showTarget = () => {
        setTargetVisible(true);
        const maxTop = 300; // Ajustez en fonction de la hauteur de votre conteneur moins la hauteur de la cible
        const maxLeft = 400; // Ajustez en fonction de la largeur de votre conteneur moins la largeur de la cible
        setTargetPosition({
            top: Math.random() * maxTop,
            left: Math.random() * maxLeft
        });

        setTimeout(() => {
            setTargetVisible(false);
        }, 5000); // 5 secondes
    };

    const handleTargetClick = () => {
        setScore(prevScore => prevScore + 1);
        setTargetVisible(false);
    };

    return (
        <View style={styles.container}>
            {!gameStarted ? (
                <TouchableOpacity style={styles.startButton} onPress={() => setGameStarted(true)}>
                    <Text style={styles.buttonText}>Start/Restart</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.stopButton} onPress={stopGame}>
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
            )}
            <View style={styles.gameInfos}>
                <Text style={styles.infoText}>Score: {score}</Text>
                <Text style={styles.infoText}>Temps: {time}s</Text>
            </View>
            <View style={styles.gameContainer}>
                {targetVisible && (
                    <TouchableOpacity
                        style={[styles.target, { top: targetPosition.top, left: targetPosition.left }]}
                        onPress={handleTargetClick}
                    >
                        <Image source={require('@/assets/images/silly.png')} style={styles.targetImage} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    startButton: {
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'blue',
        borderRadius: 6,
    },
    stopButton: {
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'red',
        borderRadius: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    gameInfos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
    },
    gameContainer: {
        width: 400,
        height: 400,
        borderWidth: 1,
        borderColor: '#999',
        position: 'relative',
    },
    target: {
        position: 'absolute',
        width: 60,
        height: 60,
    },
    targetImage: {
        width: '100%',
        height: '100%',
    },
});
