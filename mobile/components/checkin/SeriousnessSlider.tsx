import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface SeriousnessSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Custom slider for wine seriousness level (1-5)
 * 1 = Pure Fun, 5 = Serious/Contemplative
 */
const SeriousnessSlider: React.FC<SeriousnessSliderProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const labels = [
    { value: 1, label: 'Pure Fun', description: 'Easy-drinking, party wine, glou-glou' },
    { value: 2, label: 'Casual', description: 'Approachable, laid-back' },
    { value: 3, label: 'Balanced', description: 'Can be fun or serious' },
    { value: 4, label: 'Contemplative', description: 'Rewards attention, complex' },
    { value: 5, label: 'Serious', description: 'Study wine, age-worthy' },
  ];

  const getCurrentLabel = () => {
    return labels.find(l => l.value === value) || labels[2];
  };

  const currentLabel = getCurrentLabel();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wine Style</Text>
        <Text style={styles.subtitle}>How would you describe this wine?</Text>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.labelsRow}>
          <Text style={styles.endLabel}>Fun</Text>
          <Text style={styles.endLabel}>Serious</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#6B8E23"
          maximumTrackTintColor="#D5D5D5"
          thumbTintColor="#0055AA"
          disabled={disabled}
        />

        <View style={styles.markersContainer}>
          {[1, 2, 3, 4, 5].map((val) => (
            <View
              key={val}
              style={[
                styles.marker,
                value === val && styles.markerActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.currentLabelContainer}>
        <Text style={styles.currentLabel}>{currentLabel.label}</Text>
        <Text style={styles.currentDescription}>{currentLabel.description}</Text>
      </View>

      {/* All options as reference */}
      <View style={styles.referenceContainer}>
        {labels.map((item) => (
          <View
            key={item.value}
            style={[
              styles.referenceItem,
              value === item.value && styles.referenceItemActive,
            ]}
          >
            <View style={styles.referenceNumber}>
              <Text
                style={[
                  styles.referenceNumberText,
                  value === item.value && styles.referenceNumberTextActive,
                ]}
              >
                {item.value}
              </Text>
            </View>
            <Text
              style={[
                styles.referenceLabel,
                value === item.value && styles.referenceLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2416',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5C4A3A',
  },
  sliderContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  endLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  markersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -8,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D5D5D5',
  },
  markerActive: {
    backgroundColor: '#0055AA',
    transform: [{ scale: 1.5 }],
  },
  currentLabelContainer: {
    backgroundColor: '#F3E4DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#0055AA',
  },
  currentLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2416',
    marginBottom: 4,
  },
  currentDescription: {
    fontSize: 14,
    color: '#5C4A3A',
    fontStyle: 'italic',
  },
  referenceContainer: {
    gap: 8,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FCF8F2',
  },
  referenceItemActive: {
    backgroundColor: '#EAD5C8',
  },
  referenceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  referenceNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  referenceNumberTextActive: {
    color: '#0055AA',
  },
  referenceLabel: {
    fontSize: 14,
    color: '#5C4A3A',
  },
  referenceLabelActive: {
    fontWeight: '600',
    color: '#2C2416',
  },
});

export default SeriousnessSlider;
