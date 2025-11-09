import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';

interface ContextTag {
  id: string;
  label: string;
  emoji?: string;
}

interface ContextTagsProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  style?: ViewStyle;
}

/**
 * Multi-select chip component for context tags
 * Preset tags like "sunny afternoon", "pizza wine", etc.
 */
const ContextTags: React.FC<ContextTagsProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 10,
  style,
}) => {
  // Preset context tags based on natural wine culture
  const presetTags: ContextTag[] = [
    { id: 'sunny_afternoon', label: 'Sunny Afternoon', emoji: '☀️' },
    { id: 'dinner_party', label: 'Dinner Party', emoji: '🍽️' },
    { id: 'pizza_wine', label: 'Pizza Wine', emoji: '🍕' },
    { id: 'contemplative', label: 'Contemplative', emoji: '🤔' },
    { id: 'chillable_red', label: 'Chillable Red', emoji: '🧊' },
    { id: 'natural_wine_gateway', label: 'Beginner Friendly', emoji: '🚪' },
    { id: 'advanced_taste', label: 'Advanced', emoji: '🎓' },
    { id: 'funky', label: 'Funky', emoji: '🎵' },
    { id: 'aperitif', label: 'Aperitif', emoji: '🥂' },
    { id: 'late_night', label: 'Late Night', emoji: '🌙' },
    { id: 'picnic_wine', label: 'Picnic Wine', emoji: '🧺' },
    { id: 'cozy_evening', label: 'Cozy Evening', emoji: '🔥' },
    { id: 'natural_wine_bar', label: 'Natural Wine Bar', emoji: '🍷' },
    { id: 'food_pairing', label: 'Food Pairing', emoji: '👨‍🍳' },
    { id: 'celebration', label: 'Celebration', emoji: '🎉' },
    { id: 'casual', label: 'Casual', emoji: '👕' },
    { id: 'special_occasion', label: 'Special Occasion', emoji: '✨' },
    { id: 'solo_drinking', label: 'Solo Drinking', emoji: '🧘' },
    { id: 'summer_wine', label: 'Summer Wine', emoji: '🏖️' },
    { id: 'winter_warmer', label: 'Winter Warmer', emoji: '❄️' },
  ];

  const handleTagPress = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);

    if (isSelected) {
      // Remove tag
      onTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      // Add tag if under max limit
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tagId]);
      }
    }
  };

  const isTagSelected = (tagId: string): boolean => {
    return selectedTags.includes(tagId);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Context Tags</Text>
        <Text style={styles.subtitle}>
          Select up to {maxTags} tags ({selectedTags.length}/{maxTags})
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tagsContainer}>
          {presetTags.map((tag) => {
            const isSelected = isTagSelected(tag.id);
            const isMaxReached = selectedTags.length >= maxTags && !isSelected;

            return (
              <TouchableOpacity
                key={tag.id}
                onPress={() => handleTagPress(tag.id)}
                disabled={isMaxReached}
                style={[
                  styles.tag,
                  isSelected && styles.tagSelected,
                  isMaxReached && styles.tagDisabled,
                ]}
                activeOpacity={0.7}
              >
                {tag.emoji && (
                  <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                )}
                <Text
                  style={[
                    styles.tagLabel,
                    isSelected && styles.tagLabelSelected,
                    isMaxReached && styles.tagLabelDisabled,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Selected tags summary */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected:</Text>
          <View style={styles.selectedTags}>
            {selectedTags.map((tagId) => {
              const tag = presetTags.find(t => t.id === tagId);
              if (!tag) return null;

              return (
                <View key={tagId} style={styles.selectedTag}>
                  {tag.emoji && (
                    <Text style={styles.selectedTagEmoji}>{tag.emoji}</Text>
                  )}
                  <Text style={styles.selectedTagLabel}>{tag.label}</Text>
                  <TouchableOpacity
                    onPress={() => handleTagPress(tagId)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 16,
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FCF8F2',
    borderWidth: 2,
    borderColor: '#D5D5D5',
  },
  tagSelected: {
    backgroundColor: '#0055AA',
    borderColor: '#0055AA',
  },
  tagDisabled: {
    opacity: 0.4,
  },
  tagEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2416',
  },
  tagLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tagLabelDisabled: {
    color: '#8C7A6A',
  },
  selectedContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAD5C8',
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3E4DB',
  },
  selectedTagEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  selectedTagLabel: {
    fontSize: 13,
    color: '#2C2416',
    marginRight: 4,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2C2416',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default ContextTags;
