import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RatingStars from '../../components/checkin/RatingStars';
import SeriousnessSlider from '../../components/checkin/SeriousnessSlider';
import ContextTags from '../../components/checkin/ContextTags';
import checkinService from '../../services/checkinService';
import { CheckInFormData, VenueSuggestion, Wine } from '../../types';

/**
 * Review and edit screen for wine check-in
 * Allows users to review OCR-extracted data, edit fields, and add additional information
 */
export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Form state
  const [wineName, setWineName] = useState(params.wineName as string || '');
  const [producer, setProducer] = useState(params.producer as string || '');
  const [vintage, setVintage] = useState(params.vintage as string || '');
  const [region, setRegion] = useState(params.region as string || '');
  const [rating, setRating] = useState(0);
  const [tastingNotes, setTastingNotes] = useState('');
  const [seriousness, setSeriousness] = useState(3);
  const [foodPairingStyle, setFoodPairingStyle] = useState<'solo' | 'companion' | 'versatile'>('versatile');
  const [contextTags, setContextTags] = useState<string[]>([]);
  const [foodPairings, setFoodPairings] = useState('');
  const [venueQuery, setVenueQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<VenueSuggestion | null>(null);
  const [venueSuggestions, setVenueSuggestions] = useState<VenueSuggestion[]>([]);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchingWine, setSearchingWine] = useState(false);
  const [matchedWine, setMatchedWine] = useState<Wine | null>(null);

  // Auto-search for existing wine when name/producer changes
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (wineName.length > 2 || producer.length > 2) {
        searchExistingWine();
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [wineName, producer]);

  // Fetch venue suggestions when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (venueQuery.length >= 2) {
        fetchVenueSuggestions();
      } else {
        setVenueSuggestions([]);
        setShowVenueSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [venueQuery]);

  const searchExistingWine = async () => {
    try {
      setSearchingWine(true);
      const query = `${producer} ${wineName}`.trim();
      const result = await checkinService.searchWines(query);

      if (result.data && result.data.length > 0) {
        // Find best match
        const match = result.data[0];
        setMatchedWine(match);
      } else {
        setMatchedWine(null);
      }
    } catch (error) {
      console.error('Wine search error:', error);
    } finally {
      setSearchingWine(false);
    }
  };

  const fetchVenueSuggestions = async () => {
    try {
      const result = await checkinService.getVenueSuggestions(venueQuery);
      if (result.data) {
        setVenueSuggestions(result.data);
        setShowVenueSuggestions(true);
      }
    } catch (error) {
      console.error('Venue suggestions error:', error);
    }
  };

  const handleVenueSelect = (venue: VenueSuggestion) => {
    setSelectedVenue(venue);
    setVenueQuery(venue.name);
    setShowVenueSuggestions(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!wineName.trim()) {
      Alert.alert('Missing Information', 'Please enter a wine name');
      return;
    }

    if (!producer.trim()) {
      Alert.alert('Missing Information', 'Please enter a producer name');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare check-in data
      const formData: CheckInFormData = {
        rating,
        tastingNotes: tastingNotes.trim(),
        contextTags,
        foodPairings: foodPairings.trim(),
        seriousnessLevel: seriousness,
        foodPairingStyle,
        venueId: selectedVenue?.id,
        venueName: selectedVenue?.name,
        isPublic: true,
      };

      // If we found a matching wine, use it
      if (matchedWine) {
        formData.wineId = matchedWine.id;
      } else {
        // Create new wine entry
        const wineData = {
          name: wineName.trim(),
          producerId: producer.trim(), // This would need to be handled properly
          vintage: vintage ? parseInt(vintage) : undefined,
          region: region.trim() || undefined,
          seriousnessLevel: seriousness,
          foodPairingStyle,
        };

        // Note: In a real app, you'd need to create/find the producer first
        // For now, we'll show an error
        Alert.alert(
          'Wine Not Found',
          'This wine is not in our database yet. Would you like to add it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add Wine',
              onPress: () => {
                // Navigate to wine creation screen
                Alert.alert('Coming Soon', 'Wine creation feature coming soon!');
              },
            },
          ]
        );
        return;
      }

      // Create check-in
      const result = await checkinService.createCheckIn(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      Alert.alert(
        'Success!',
        'Your check-in has been created',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create check-in'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Check-In</Text>
            <Text style={styles.headerSubtitle}>
              Review and add details about this wine
            </Text>
          </View>

          {/* Wine Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wine Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wine Name *</Text>
              <TextInput
                style={styles.input}
                value={wineName}
                onChangeText={setWineName}
                placeholder="e.g., Côtes du Jura Rouge"
                placeholderTextColor="#8C7A6A"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Producer *</Text>
              <TextInput
                style={styles.input}
                value={producer}
                onChangeText={setProducer}
                placeholder="e.g., Domaine de la Tournelle"
                placeholderTextColor="#8C7A6A"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Vintage</Text>
                <TextInput
                  style={styles.input}
                  value={vintage}
                  onChangeText={setVintage}
                  placeholder="2022"
                  keyboardType="numeric"
                  placeholderTextColor="#8C7A6A"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Region</Text>
                <TextInput
                  style={styles.input}
                  value={region}
                  onChangeText={setRegion}
                  placeholder="Jura"
                  placeholderTextColor="#8C7A6A"
                />
              </View>
            </View>

            {/* Wine match indicator */}
            {searchingWine && (
              <View style={styles.matchIndicator}>
                <ActivityIndicator size="small" color="#0055AA" />
                <Text style={styles.matchText}>Searching database...</Text>
              </View>
            )}

            {matchedWine && (
              <View style={[styles.matchIndicator, styles.matchFound]}>
                <Text style={styles.matchIcon}>✓</Text>
                <Text style={styles.matchText}>
                  Found in database: {matchedWine.name}
                </Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              showLabel
            />
          </View>

          {/* Tasting Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasting Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={tastingNotes}
              onChangeText={setTastingNotes}
              placeholder="Share your thoughts about this wine..."
              placeholderTextColor="#8C7A6A"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Seriousness Slider */}
          <View style={styles.section}>
            <SeriousnessSlider
              value={seriousness}
              onValueChange={setSeriousness}
            />
          </View>

          {/* Food Pairing Style */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Pairing Style</Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  foodPairingStyle === 'solo' && styles.optionButtonActive,
                ]}
                onPress={() => setFoodPairingStyle('solo')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    foodPairingStyle === 'solo' && styles.optionButtonTextActive,
                  ]}
                >
                  Solo Sipper
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  foodPairingStyle === 'companion' && styles.optionButtonActive,
                ]}
                onPress={() => setFoodPairingStyle('companion')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    foodPairingStyle === 'companion' && styles.optionButtonTextActive,
                  ]}
                >
                  Food Companion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  foodPairingStyle === 'versatile' && styles.optionButtonActive,
                ]}
                onPress={() => setFoodPairingStyle('versatile')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    foodPairingStyle === 'versatile' && styles.optionButtonTextActive,
                  ]}
                >
                  Versatile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Context Tags */}
          <View style={styles.section}>
            <ContextTags
              selectedTags={contextTags}
              onTagsChange={setContextTags}
            />
          </View>

          {/* Food Pairings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Pairings</Text>
            <TextInput
              style={styles.input}
              value={foodPairings}
              onChangeText={setFoodPairings}
              placeholder="What did you eat with this wine?"
              placeholderTextColor="#8C7A6A"
            />
          </View>

          {/* Venue */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Venue (Optional)</Text>
            <TextInput
              style={styles.input}
              value={venueQuery}
              onChangeText={setVenueQuery}
              placeholder="Where are you drinking this?"
              placeholderTextColor="#8C7A6A"
              onFocus={() => venueQuery.length >= 2 && setShowVenueSuggestions(true)}
            />

            {showVenueSuggestions && venueSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {venueSuggestions.map((venue) => (
                  <TouchableOpacity
                    key={venue.id}
                    style={styles.suggestionItem}
                    onPress={() => handleVenueSelect(venue)}
                  >
                    <Text style={styles.suggestionName}>{venue.name}</Text>
                    {venue.address && (
                      <Text style={styles.suggestionAddress}>{venue.address}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedVenue && (
              <View style={styles.selectedVenue}>
                <Text style={styles.selectedVenueIcon}>📍</Text>
                <View style={styles.selectedVenueInfo}>
                  <Text style={styles.selectedVenueName}>{selectedVenue.name}</Text>
                  {selectedVenue.address && (
                    <Text style={styles.selectedVenueAddress}>
                      {selectedVenue.address}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVenue(null);
                    setVenueQuery('');
                  }}
                  style={styles.removeVenueButton}
                >
                  <Text style={styles.removeVenueText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Check-In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF8F2',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2416',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#5C4A3A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2416',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EAD5C8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2C2416',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3E4DB',
    borderRadius: 8,
    gap: 8,
  },
  matchFound: {
    backgroundColor: '#E8F5E9',
  },
  matchIcon: {
    fontSize: 18,
    color: '#4CAF50',
  },
  matchText: {
    fontSize: 14,
    color: '#2C2416',
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EAD5C8',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#0055AA',
    borderColor: '#0055AA',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2416',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EAD5C8',
    marginTop: 8,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E4DB',
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2416',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 13,
    color: '#5C4A3A',
  },
  selectedVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  selectedVenueIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedVenueInfo: {
    flex: 1,
  },
  selectedVenueName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2416',
  },
  selectedVenueAddress: {
    fontSize: 13,
    color: '#5C4A3A',
  },
  removeVenueButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C2416',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeVenueText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0055AA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#5C4A3A',
    fontSize: 16,
    fontWeight: '500',
  },
});
