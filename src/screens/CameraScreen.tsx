import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useTheme } from '../styles/Theme';
import { Camera } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as VisionService from '../services/EnhancedVisionService';
import Button from '../components/Button';
import Card from '../components/Card';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

type Props = {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
};

const CameraScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors, spacing, typography, borders } = useTheme();
  const { challenge } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VisionService.VisionAnalysisResult | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleVerification = async () => {
    if (!photo) return;

    setIsVerifying(true);
    try {
      const result = await VisionService.verifyPhoto({
        imageUri: photo,
        challengeType: challenge.title.toLowerCase().split(' ')[0], // Simple keyword extraction
      });
      setVerificationResult(result);

      const isChallengeComplete = VisionService.validateChallenge(result, challenge.title.toLowerCase().split(' ')[0]);

      Alert.alert(
        isChallengeComplete ? 'Challenge Complete!' : 'Verification Failed',
        result.reasoning,
        [
          {
            text: 'OK',
            onPress: () => {
              if (isChallengeComplete) {
                // In a real app, you'd update global state here
                navigation.goBack();
              } else {
                setPhoto(null);
                setVerificationResult(null);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not verify the photo. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.verifyingText}>Verifying your photo...</Text>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.buttonContainerPreview}>
          <Button title="Retake" onPress={() => setPhoto(null)} />
          <Button title="Use Photo" onPress={handleVerification} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.challengeOverlay}>
          <Card>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </Card>
        </View>
      </Camera>
      <View style={styles.buttonContainerCamera}>
        <Button title="Take Picture" onPress={takePicture} />
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  buttonContainerCamera: {
    position: 'absolute',
    bottom: spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonContainerPreview: {
    position: 'absolute',
    bottom: spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  challengeOverlay: {
    position: 'absolute',
    top: 40,
    left: spacing.large,
    right: spacing.large,
    backgroundColor: colors.overlay,
    borderRadius: borders.radius,
  },
  challengeTitle: {
    ...typography.h3,
    color: colors.text,
  },
  challengeDescription: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.small,
  },
  verifyingText: {
    marginTop: spacing.medium,
    ...typography.h2,
    color: colors.text,
  },
});

export default CameraScreen;