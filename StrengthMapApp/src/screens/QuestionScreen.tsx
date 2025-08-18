import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {questions, analyzeResults} from '../data/questions';
import AsyncStorage from '@react-native-async-storage/async-storage';

type QuestionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Question'
>;

interface Props {
  navigation: QuestionScreenNavigationProp;
}

const QuestionScreen: React.FC<Props> = ({navigation}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: string; value: number}[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = async (value: number) => {
    const newAnswer = {
      questionId: currentQuestion.id,
      value,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const results = analyzeResults(updatedAnswers);
      const assessmentId = Date.now().toString();
      
      const assessment = {
        id: assessmentId,
        date: new Date().toISOString(),
        answers: updatedAnswers,
        strengths: results.strengths,
        values: results.values,
      };

      try {
        const existingData = await AsyncStorage.getItem('assessments');
        const assessments = existingData ? JSON.parse(existingData) : [];
        assessments.push(assessment);
        await AsyncStorage.setItem('assessments', JSON.stringify(assessments));
        
        navigation.navigate('Result', {assessmentId});
      } catch (error) {
        Alert.alert('エラー', '結果の保存に失敗しました');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      <View style={styles.answerContainer}>
        <Text style={styles.scaleLabel}>どのくらい当てはまりますか？</Text>
        
        <View style={styles.scaleContainer}>
          {[1, 2, 3, 4, 5].map(value => (
            <TouchableOpacity
              key={value}
              style={styles.scaleButton}
              onPress={() => handleAnswer(value)}>
              <View style={[styles.scaleCircle, value === 3 && styles.neutralCircle]}>
                <Text style={styles.scaleNumber}>{value}</Text>
              </View>
              <Text style={styles.scaleText}>
                {value === 1 && '全く\n違う'}
                {value === 2 && 'あまり\n違う'}
                {value === 3 && 'どちら\nでもない'}
                {value === 4 && 'やや\n当てはまる'}
                {value === 5 && 'とても\n当てはまる'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentQuestionIndex > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>前の質問に戻る</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFE0EC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF69B4',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 32,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scaleLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scaleButton: {
    alignItems: 'center',
  },
  scaleCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  neutralCircle: {
    backgroundColor: '#FFC0CB',
  },
  scaleNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scaleText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  backButton: {
    padding: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF69B4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default QuestionScreen;