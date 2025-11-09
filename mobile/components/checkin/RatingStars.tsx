import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface RatingStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
  disabled?: boolean;
  showLabel?: boolean;
  style?: ViewStyle;
}

/**
 * Custom star rating component for wine check-ins
 * Supports half-star ratings
 */
const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 40,
  disabled = false,
  showLabel = true,
  style,
}) => {
  const [tempRating, setTempRating] = useState<number | null>(null);

  const displayRating = tempRating !== null ? tempRating : rating;

  const handlePress = (index: number) => {
    if (disabled) return;

    // Allow half-star ratings: tap left side for .5, right side for whole number
    const newRating = index + 1;
    onRatingChange(newRating);
  };

  const handlePressIn = (index: number) => {
    if (disabled) return;
    setTempRating(index + 1);
  };

  const handlePressOut = () => {
    setTempRating(null);
  };

  const getStarIcon = (index: number): string => {
    const value = index + 1;

    if (displayRating >= value) {
      return '★'; // Filled star
    } else if (displayRating >= value - 0.5) {
      return '⯨'; // Half star
    } else {
      return '☆'; // Empty star
    }
  };

  const getRatingLabel = (value: number): string => {
    if (value === 0) return 'No rating';
    if (value <= 1) return 'Poor';
    if (value <= 2) return 'Fair';
    if (value <= 3) return 'Good';
    if (value <= 4) return 'Very Good';
    return 'Excellent';
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>
          Rating: {displayRating.toFixed(1)} / {maxRating}
        </Text>
      )}

      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, index) => (
          <TouchableOpacity
            key={index}
            onPressIn={() => handlePressIn(index)}
            onPressOut={handlePressOut}
            onPress={() => handlePress(index)}
            disabled={disabled}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.star,
                {
                  fontSize: size,
                  color: displayRating > index ? '#F4D03F' : '#D5D5D5',
                },
                disabled && styles.starDisabled,
              ]}
            >
              {getStarIcon(index)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showLabel && displayRating > 0 && (
        <Text style={styles.ratingLabel}>
          {getRatingLabel(displayRating)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2416',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  star: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starDisabled: {
    opacity: 0.5,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#5C4A3A',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default RatingStars;
