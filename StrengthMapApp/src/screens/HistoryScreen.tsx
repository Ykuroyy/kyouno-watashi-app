import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'History'
>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({navigation}) => {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const data = await AsyncStorage.getItem('assessments');
      if (data) {
        const parsed = JSON.parse(data);
        setAssessments(parsed.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
    }
  };

  const handleViewResult = (assessmentId: string) => {
    navigation.navigate('Result', {assessmentId});
  };

  const handleCompare = (currentId: string, previousId: string) => {
    navigation.navigate('Comparison', {currentId, previousId});
  };

  const handleDelete = async (assessmentId: string) => {
    Alert.alert(
      '削除の確認',
      'この結果を削除してもよろしいですか？',
      [
        {text: 'キャンセル', style: 'cancel'},
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              const filtered = assessments.filter(a => a.id !== assessmentId);
              await AsyncStorage.setItem('assessments', JSON.stringify(filtered));
              setAssessments(filtered);
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ],
    );
  };

  if (assessments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>まだ分析結果がありません</Text>
        <Text style={styles.emptySubText}>
          自己分析を始めて、あなたの強みを見つけましょう！
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Question')}>
          <Text style={styles.startButtonText}>分析を始める</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          これまでに{assessments.length}回の分析を行いました
        </Text>
      </View>

      {assessments.map((assessment, index) => (
        <View key={assessment.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>
              {new Date(assessment.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <TouchableOpacity
              onPress={() => handleDelete(assessment.id)}
              style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>削除</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.strengthsList}>
            <Text style={styles.strengthsTitle}>強み:</Text>
            {assessment.strengths.slice(0, 3).map((strength: any, idx: number) => (
              <Text key={idx} style={styles.strengthItem}>
                • {strength.title}
              </Text>
            ))}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewResult(assessment.id)}>
              <Text style={styles.viewButtonText}>詳細を見る</Text>
            </TouchableOpacity>

            {index < assessments.length - 1 && (
              <TouchableOpacity
                style={styles.compareButton}
                onPress={() => 
                  handleCompare(assessment.id, assessments[index + 1].id)
                }>
                <Text style={styles.compareButtonText}>前回と比較</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFF5F7',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFE0EC',
  },
  headerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  strengthsList: {
    marginBottom: 16,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  strengthItem: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginVertical: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#FF69B4',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  compareButton: {
    flex: 1,
    borderColor: '#FF69B4',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  compareButtonText: {
    color: '#FF69B4',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HistoryScreen;