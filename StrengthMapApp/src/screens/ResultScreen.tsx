import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StrengthMap from '../components/StrengthMap';

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Result'
>;

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

const ResultScreen: React.FC<Props> = ({navigation, route}) => {
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      const data = await AsyncStorage.getItem('assessments');
      if (data) {
        const assessments = JSON.parse(data);
        const found = assessments.find(
          (a: any) => a.id === route.params.assessmentId,
        );
        if (found) {
          setAssessment(found);
        }
      }
    } catch (error) {
      console.error('Failed to load assessment:', error);
    }
  };

  const handleShare = async () => {
    if (!assessment) return;
    
    const strengthsList = assessment.strengths
      .map((s: any) => `・${s.title}`)
      .join('\n');
    
    const message = `わたしの強みマップの結果\n\n【私の強み】\n${strengthsList}\n\n#わたしの強みマップ #自己分析`;
    
    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!assessment) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>あなたの強みマップ</Text>
        <Text style={styles.date}>
          {new Date(assessment.date).toLocaleDateString('ja-JP')}
        </Text>
      </View>

      <StrengthMap strengths={assessment.strengths} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 あなたの強み</Text>
        {assessment.strengths.map((strength: any, index: number) => (
          <View key={index} style={styles.strengthItem}>
            <Text style={styles.strengthTitle}>{strength.title}</Text>
            <View style={styles.scoreBar}>
              <View
                style={[styles.scoreFill, {width: `${strength.score}%`}]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💎 大切にしている価値観</Text>
        <View style={styles.valuesContainer}>
          {assessment.values.map((value: string, index: number) => (
            <View key={index} style={styles.valueChip}>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>✨ メッセージ</Text>
        <Text style={styles.messageText}>
          今回の分析で見つかったあなたの強みは、あなたらしさの一部です。
          これらの強みを活かして、より充実した毎日を送りましょう！
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>結果をシェア</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>ホームに戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  strengthItem: {
    marginBottom: 16,
  },
  strengthTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  scoreBar: {
    height: 20,
    backgroundColor: '#FFE0EC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#FF69B4',
    borderRadius: 10,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueChip: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  valueText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  actions: {
    padding: 20,
  },
  shareButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    borderColor: '#FF69B4',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultScreen;