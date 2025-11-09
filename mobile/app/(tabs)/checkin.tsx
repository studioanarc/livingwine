import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import ocrService from '../../services/ocrService';
import { OCRResult } from '../../types';

/**
 * Camera screen for scanning wine labels
 * Uses expo-camera for capturing images and OCR for text extraction
 */
export default function CheckInScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [showExtractedInfo, setShowExtractedInfo] = useState(false);
  const [extractedData, setExtractedData] = useState<OCRResult['data'] | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    // Request camera permissions on mount
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsScanning(true);

      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      // Send to OCR service
      const result = await ocrService.scanLabel(photo.uri);

      if (result.success && result.data) {
        setExtractedData(result.data);
        setShowExtractedInfo(true);
      } else {
        Alert.alert(
          'Scan Failed',
          result.error || 'Could not extract wine information from the label. Please try again or enter manually.',
          [
            { text: 'Try Again', style: 'cancel' },
            { text: 'Enter Manually', onPress: handleManualEntry },
          ]
        );
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert(
        'Error',
        'Failed to capture or process image. Please try again.',
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Enter Manually', onPress: handleManualEntry },
        ]
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualEntry = () => {
    // Navigate to review screen without OCR data
    router.push({
      pathname: '/checkin/review',
      params: { manual: 'true' },
    });
  };

  const handleProceedWithData = () => {
    // Navigate to review screen with extracted data
    router.push({
      pathname: '/checkin/review',
      params: {
        wineName: extractedData?.wineName || '',
        producer: extractedData?.producer || '',
        vintage: extractedData?.vintage?.toString() || '',
        region: extractedData?.region || '',
        grapeVarietals: JSON.stringify(extractedData?.grapeVarietals || []),
        alcoholPercentage: extractedData?.alcoholPercentage?.toString() || '',
      },
    });
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Handle permission states
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0055AA" />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan wine labels.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualEntry}
          >
            <Text style={styles.manualButtonText}>Enter Manually Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showExtractedInfo ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            <View style={styles.overlay}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Scan Wine Label</Text>
                <Text style={styles.headerSubtitle}>
                  Position the label within the frame
                </Text>
              </View>

              {/* Scanning frame */}
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>

              {/* Bottom controls */}
              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.manualEntryButton}
                  onPress={handleManualEntry}
                >
                  <Text style={styles.manualEntryText}>Manual Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
                  onPress={handleCapture}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                >
                  <Text style={styles.flipButtonText}>↻</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </>
      ) : (
        <View style={styles.extractedContainer}>
          <Text style={styles.extractedTitle}>✓ Label Scanned!</Text>
          <Text style={styles.extractedSubtitle}>
            Here's what we found:
          </Text>

          <View style={styles.extractedData}>
            {extractedData?.wineName && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Wine Name:</Text>
                <Text style={styles.dataValue}>{extractedData.wineName}</Text>
              </View>
            )}

            {extractedData?.producer && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Producer:</Text>
                <Text style={styles.dataValue}>{extractedData.producer}</Text>
              </View>
            )}

            {extractedData?.vintage && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Vintage:</Text>
                <Text style={styles.dataValue}>{extractedData.vintage}</Text>
              </View>
            )}

            {extractedData?.region && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Region:</Text>
                <Text style={styles.dataValue}>{extractedData.region}</Text>
              </View>
            )}

            {extractedData?.grapeVarietals && extractedData.grapeVarietals.length > 0 && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Grapes:</Text>
                <Text style={styles.dataValue}>
                  {extractedData.grapeVarietals.join(', ')}
                </Text>
              </View>
            )}

            {extractedData?.alcoholPercentage && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>ABV:</Text>
                <Text style={styles.dataValue}>{extractedData.alcoholPercentage}%</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedWithData}
            >
              <Text style={styles.proceedButtonText}>Looks Good!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => {
                setShowExtractedInfo(false);
                setExtractedData(null);
              }}
            >
              <Text style={styles.rescanButtonText}>Scan Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleManualEntry}
            >
              <Text style={styles.editButtonText}>Edit Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FCF8F2',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5C4A3A',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2416',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#5C4A3A',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#0055AA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  manualButton: {
    paddingVertical: 12,
  },
  manualButtonText: {
    color: '#0055AA',
    fontSize: 14,
    fontWeight: '500',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#F4D03F',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  manualEntryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  manualEntryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F4D03F',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F4D03F',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
  },
  extractedContainer: {
    flex: 1,
    backgroundColor: '#FCF8F2',
    padding: 24,
  },
  extractedTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2416',
    marginBottom: 8,
    textAlign: 'center',
  },
  extractedSubtitle: {
    fontSize: 16,
    color: '#5C4A3A',
    marginBottom: 24,
    textAlign: 'center',
  },
  extractedData: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#EAD5C8',
  },
  dataRow: {
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: 18,
    color: '#2C2416',
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  proceedButton: {
    backgroundColor: '#0055AA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  rescanButton: {
    backgroundColor: '#F3E4DB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rescanButtonText: {
    color: '#2C2416',
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0055AA',
    fontSize: 14,
    fontWeight: '500',
  },
});
