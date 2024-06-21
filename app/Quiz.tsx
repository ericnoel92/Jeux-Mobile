import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface State {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: string | null;
  quizCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  showExplanation: boolean;
}

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      quizCompleted: false,
      isLoading: true,
      error: null,
      showExplanation: false,
    };
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3001/questions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Data received from API:", data); // Vérification des données reçues

      if (data.response_code !== 0) {
        throw new Error('API returned an error response');
      }

      const questions: Question[] = data.results.map((item: any, index: number) => {
        const options = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);

        return {
          id: index,
          questionText: item.question,
          options: options,
          correctAnswer: item.correct_answer,
          explanation: '' // Vous pouvez remplir l'explication ici si nécessaire
        };
      });

      console.log("Questions fetched: ", questions);
      this.setState({
        questions,
        isLoading: false
      });
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Fetch error: ", errorMessage);
      this.setState({
        error: errorMessage,
        isLoading: false
      });
    }
  };

  handleAnswer = (answer: string) => {
    const { currentQuestionIndex, score, questions } = this.state;
    const currentQuestion = questions[currentQuestionIndex];

    if (answer === currentQuestion.correctAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
        selectedAnswer: answer
      }));
    } else {
      this.setState({
        selectedAnswer: answer
      });
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        this.setState({
          currentQuestionIndex: nextQuestionIndex,
          selectedAnswer: null
        });
      } else {
        this.setState({
          quizCompleted: true
        });
      }
    }, 1000);
  };

  restartQuiz = () => {
    this.setState({
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      quizCompleted: false,
      isLoading: true,
      error: null,
      showExplanation: false
    });
    this.fetchQuestions();
  };

  toggleExplanation = () => {
    this.setState((prevState) => ({
      showExplanation: !prevState.showExplanation
    }));
  };

  render() {
    const { questions, currentQuestionIndex, score, selectedAnswer, quizCompleted, isLoading, error, showExplanation } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }

    if (quizCompleted) {
      return (
        <View style={styles.container}>
          <Text style={styles.resultText}>Quiz terminé!</Text>
          <Text style={styles.resultText}>Votre score est: {score} / {questions.length}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.restartQuiz}>
            <Text style={styles.retryButtonText}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.explanationButton} onPress={this.toggleExplanation}>
            <Text style={styles.explanationButtonText}>Voir les explications</Text>
          </TouchableOpacity>
          {showExplanation && (
            <ScrollView style={styles.explanationContainer}>
              {questions.map((question, index) => (
                <View key={index} style={styles.explanationItem}>
                  <Text style={styles.questionText}>{question.questionText}</Text>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && (option === currentQuestion.correctAnswer ? styles.correctAnswer : styles.incorrectAnswer)
            ]}
            onPress={() => this.handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.navigationContainer}>
          {selectedAnswer !== null && currentQuestionIndex < questions.length - 1 && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                const nextQuestionIndex = currentQuestionIndex + 1;
                if (nextQuestionIndex < questions.length) {
                  this.setState({
                    currentQuestionIndex: nextQuestionIndex,
                    selectedAnswer: null
                  });
                } else {
                  this.setState({
                    quizCompleted: true
                  });
                }
              }}
            >
              <Text style={styles.nextButtonText}>Question suivante</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  optionButton: {
    backgroundColor: '#DDDDDD',
    padding: 15,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
  },
  correctAnswer: {
    backgroundColor: 'green',
  },
  incorrectAnswer: {
    backgroundColor: 'red',
  },
  navigationContainer: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333',
  },
  retryButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  explanationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  explanationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  explanationContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  explanationItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 10,
  },
  explanationText: {
    fontSize: 16,
    color: '#555555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
