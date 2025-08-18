import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>わたしの強みマップ</Text>
        <Text style={styles.subtitle}>5分で見つかる、あなたの魅力</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>✨ あなたの強みを発見</Text>
          <Text style={styles.featureText}>
            簡単な質問に答えるだけで、あなたの隠れた強みや価値観が見えてきます
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>📊 成長を可視化</Text>
          <Text style={styles.featureText}>
            過去の結果と比較して、自分の成長や変化を確認できます
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🎯 人生の棚卸し</Text>
          <Text style={styles.featureText}>
            就活や転職だけでなく、日常の自己理解にも活用できます
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Question')}>
          <Text style={styles.startButtonText}>分析を始める</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>過去の結果を見る</Text>
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
    paddingVertical: 40,
    backgroundColor: '#FFB6C1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF69B4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    borderColor: '#FF69B4',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  historyButtonText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;