import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Line, Circle, Polyline, Text as SvgText} from 'react-native-svg';

type ComparisonScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Comparison'
>;

type ComparisonScreenRouteProp = RouteProp<RootStackParamList, 'Comparison'>;

interface Props {
  navigation: ComparisonScreenNavigationProp;
  route: ComparisonScreenRouteProp;
}

const ComparisonScreen: React.FC<Props> = ({navigation, route}) => {
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);
  const [previousAssessment, setPreviousAssessment] = useState<any>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const data = await AsyncStorage.getItem('assessments');
      if (data) {
        const assessments = JSON.parse(data);
        const current = assessments.find(
          (a: any) => a.id === route.params.currentId,
        );
        const previous = assessments.find(
          (a: any) => a.id === route.params.previousId,
        );
        setCurrentAssessment(current);
        setPreviousAssessment(previous);
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
    }
  };

  const renderGrowthChart = () => {
    if (!currentAssessment || !previousAssessment) return null;

    const {width} = Dimensions.get('window');
    const chartWidth = width - 40;
    const chartHeight = 200;
    const padding = 20;

    const allStrengths = new Map();
    
    previousAssessment.strengths.forEach((s: any) => {
      allStrengths.set(s.title, {previous: s.score, current: 0});
    });
    
    currentAssessment.strengths.forEach((s: any) => {
      if (allStrengths.has(s.title)) {
        allStrengths.get(s.title).current = s.score;
      } else {
        allStrengths.set(s.title, {previous: 0, current: s.score});
      }
    });

    const strengthsArray = Array.from(allStrengths.entries());
    const xStep = (chartWidth - padding * 2) / Math.max(strengthsArray.length - 1, 1);

    return (
      <Svg width={chartWidth} height={chartHeight + 40}>
        <Line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#DDD"
          strokeWidth="1"
        />

        {[0, 25, 50, 75, 100].map(value => {
          const y = chartHeight - padding - ((chartHeight - padding * 2) * value) / 100;
          return (
            <React.Fragment key={value}>
              <Line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#EEE"
                strokeWidth="1"
              />
              <SvgText
                x={padding - 5}
                y={y + 4}
                fontSize="10"
                textAnchor="end"
                fill="#999">
                {value}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Polyline
          points={strengthsArray
            .map((_, index) => {
              const x = padding + index * xStep;
              const y = chartHeight - padding - 
                ((chartHeight - padding * 2) * strengthsArray[index][1].previous) / 100;
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#FFB6C1"
          strokeWidth="2"
        />

        <Polyline
          points={strengthsArray
            .map((_, index) => {
              const x = padding + index * xStep;
              const y = chartHeight - padding - 
                ((chartHeight - padding * 2) * strengthsArray[index][1].current) / 100;
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#FF69B4"
          strokeWidth="2"
        />

        {strengthsArray.map((_, index) => {
          const x = padding + index * xStep;
          const prevY = chartHeight - padding - 
            ((chartHeight - padding * 2) * strengthsArray[index][1].previous) / 100;
          const currY = chartHeight - padding - 
            ((chartHeight - padding * 2) * strengthsArray[index][1].current) / 100;
          
          return (
            <React.Fragment key={index}>
              <Circle cx={x} cy={prevY} r="4" fill="#FFB6C1" />
              <Circle cx={x} cy={currY} r="4" fill="#FF69B4" />
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  if (!currentAssessment || !previousAssessment) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  const calculateGrowth = () => {
    const growthItems: any[] = [];
    
    currentAssessment.strengths.forEach((current: any) => {
      const previous = previousAssessment.strengths.find(
        (p: any) => p.title === current.title
      );
      
      if (previous) {
        const diff = current.score - previous.score;
        growthItems.push({
          title: current.title,
          previous: previous.score,
          current: current.score,
          diff,
          isNew: false,
        });
      } else {
        growthItems.push({
          title: current.title,
          previous: 0,
          current: current.score,
          diff: current.score,
          isNew: true,
        });
      }
    });
    
    return growthItems.sort((a, b) => b.diff - a.diff);
  };

  const growthItems = calculateGrowth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>成長の変化</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <View style={[styles.dateDot, {backgroundColor: '#FFB6C1'}]} />
            <Text style={styles.dateText}>
              前回: {new Date(previousAssessment.date).toLocaleDateString('ja-JP')}
            </Text>
          </View>
          <View style={styles.dateItem}>
            <View style={[styles.dateDot, {backgroundColor: '#FF69B4'}]} />
            <Text style={styles.dateText}>
              今回: {new Date(currentAssessment.date).toLocaleDateString('ja-JP')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>強みの推移</Text>
        {renderGrowthChart()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 成長した強み</Text>
        {growthItems
          .filter(item => item.diff > 0)
          .map((item, index) => (
            <View key={index} style={styles.growthItem}>
              <Text style={styles.growthTitle}>
                {item.title} {item.isNew && '🆕'}
              </Text>
              <View style={styles.growthBar}>
                <Text style={styles.growthValue}>
                  {Math.round(item.previous)}% → {Math.round(item.current)}%
                </Text>
                <Text style={[styles.growthDiff, {color: '#4CAF50'}]}>
                  +{Math.round(item.diff)}%
                </Text>
              </View>
            </View>
          ))}
      </View>

      {growthItems.filter(item => item.diff < 0).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 変化した強み</Text>
          {growthItems
            .filter(item => item.diff < 0)
            .map((item, index) => (
              <View key={index} style={styles.growthItem}>
                <Text style={styles.growthTitle}>{item.title}</Text>
                <View style={styles.growthBar}>
                  <Text style={styles.growthValue}>
                    {Math.round(item.previous)}% → {Math.round(item.current)}%
                  </Text>
                  <Text style={[styles.growthDiff, {color: '#FF9800'}]}>
                    {Math.round(item.diff)}%
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>💪 成長のメッセージ</Text>
        <Text style={styles.messageText}>
          前回から今回にかけて、あなたの強みに変化が見られます。
          新しく発見された強みや、より強化された能力は、
          あなたの成長の証です。この調子で自分らしさを磨いていきましょう！
        </Text>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
  growthItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  growthBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  growthValue: {
    fontSize: 14,
    color: '#666',
  },
  growthDiff: {
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ComparisonScreen;