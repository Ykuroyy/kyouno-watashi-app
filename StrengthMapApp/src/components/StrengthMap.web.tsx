import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

interface StrengthMapProps {
  strengths: {title: string; score: number}[];
}

const StrengthMap: React.FC<StrengthMapProps> = ({strengths}) => {
  const {width} = Dimensions.get('window');
  const size = Math.min(width - 60, 400);
  const center = size / 2;
  const radius = size / 2 - 30;
  
  const angleStep = (2 * Math.PI) / Math.max(strengths.length, 1);
  
  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (radius * value) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return {x, y};
  };

  const polygonPoints = strengths
    .map((_, index) => {
      const coord = getCoordinates(index, strengths[index].score);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <svg width={size} height={size} style={{marginVertical: 20}}>
        {[20, 40, 60, 80, 100].map(level => {
          const levelRadius = (radius * level) / 100;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={levelRadius}
              stroke="#FFE0EC"
              strokeWidth="1"
              fill="none"
            />
          );
        })}

        {strengths.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#FFE0EC"
              strokeWidth="1"
            />
          );
        })}

        {strengths.length > 0 && (
          <polygon
            points={polygonPoints}
            fill="#FF69B4"
            fillOpacity="0.3"
            stroke="#FF69B4"
            strokeWidth="2"
          />
        )}

        {strengths.map((strength, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          const coord = getCoordinates(index, strength.score);
          
          return (
            <React.Fragment key={index}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="5"
                fill="#FF69B4"
              />
              <text
                x={x}
                y={y}
                fontSize="11"
                textAnchor="middle"
                fill="#333">
                {strength.title}
              </text>
            </React.Fragment>
          );
        })}
      </svg>

      <View style={styles.legend}>
        {strengths.map((strength, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>
              {strength.title}: {Math.round(strength.score)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    paddingHorizontal: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF69B4',
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default StrengthMap;