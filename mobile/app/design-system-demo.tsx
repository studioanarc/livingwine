/**
 * Design System Demo Screen
 * Showcases all components from the Tipsy aesthetic design system
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Text,
  DisplayText,
  DisplayLargeText,
  H1,
  H2,
  H3,
  BodyText,
  BodyLargeText,
  LabelText,
  AccentText,
  Button,
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  GhostButton,
  Card,
  FlatCard,
  RaisedCard,
  FloatingCard,
  WineCheckInCard,
  ProducerCard,
  EventCard,
  BlobShape,
  BackgroundBlob,
  WineStainBlob,
  HeaderBlob,
  IconBlobBackground,
  Colors,
  SemanticColors,
  Gradients,
} from '../components/design-system';

export default function DesignSystemDemo() {
  return (
    <ScrollView style={styles.container}>
      {/* Background Decorations */}
      <BackgroundBlob
        position="top-right"
        gradient={Gradients.sunset}
        size={250}
        opacity={0.15}
      />
      <BackgroundBlob
        position="bottom-left"
        gradient={Gradients.earth}
        size={300}
        opacity={0.1}
      />

      {/* Header Section */}
      <View style={styles.section}>
        <DisplayLargeText color={Colors.naturalWineRed}>
          Tipsy
        </DisplayLargeText>
        <BodyLargeText color={Colors.warmGray}>
          Design System Showcase
        </BodyLargeText>
      </View>

      {/* Typography Section */}
      <View style={styles.section}>
        <H1>Typography</H1>

        <View style={styles.subsection}>
          <LabelText>Display Text</LabelText>
          <DisplayText>Natural Wine</DisplayText>
        </View>

        <View style={styles.subsection}>
          <LabelText>Headings</LabelText>
          <H1>Heading 1</H1>
          <H2>Heading 2</H2>
          <H3>Heading 3</H3>
        </View>

        <View style={styles.subsection}>
          <LabelText>Body Text</LabelText>
          <BodyLargeText>
            Large body text for emphasized content and introductions.
          </BodyLargeText>
          <BodyText>
            Regular body text for general content. Perfect for descriptions,
            tasting notes, and longer form content.
          </BodyText>
        </View>

        <View style={styles.subsection}>
          <LabelText>Accent Text</LabelText>
          <AccentText>Handwritten accent for special moments</AccentText>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.section}>
        <H1>Buttons</H1>

        <View style={styles.subsection}>
          <LabelText>Primary Buttons</LabelText>
          <PrimaryButton onPress={() => {}}>Check In Wine</PrimaryButton>
        </View>

        <View style={styles.subsection}>
          <LabelText>Secondary Buttons</LabelText>
          <SecondaryButton onPress={() => {}}>Discover Wines</SecondaryButton>
        </View>

        <View style={styles.subsection}>
          <LabelText>Accent Buttons</LabelText>
          <AccentButton onPress={() => {}}>Join Tasting</AccentButton>
        </View>

        <View style={styles.subsection}>
          <LabelText>Ghost & Outline</LabelText>
          <GhostButton onPress={() => {}}>Cancel</GhostButton>
          <View style={{ height: 12 }} />
          <Button variant="outline" onPress={() => {}}>
            View Details
          </Button>
        </View>

        <View style={styles.subsection}>
          <LabelText>Button Sizes</LabelText>
          <Button size="small" onPress={() => {}}>
            Small
          </Button>
          <View style={{ height: 8 }} />
          <Button size="medium" onPress={() => {}}>
            Medium
          </Button>
          <View style={{ height: 8 }} />
          <Button size="large" onPress={() => {}}>
            Large
          </Button>
        </View>
      </View>

      {/* Cards Section */}
      <View style={styles.section}>
        <H1>Cards</H1>

        <View style={styles.subsection}>
          <LabelText>Flat Card</LabelText>
          <FlatCard padding={16}>
            <H3>Flat Card</H3>
            <BodyText>Minimal shadow, subtle appearance</BodyText>
          </FlatCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Raised Card (Default)</LabelText>
          <RaisedCard padding={16}>
            <H3>Raised Card</H3>
            <BodyText>Medium shadow, default style</BodyText>
          </RaisedCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Floating Card</LabelText>
          <FloatingCard padding={16}>
            <H3>Floating Card</H3>
            <BodyText>Large shadow, emphasis</BodyText>
          </FloatingCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Wine Check-in Card</LabelText>
          <WineCheckInCard
            padding={16}
            wineStain
            wineColor={Colors.naturalWineRed}
          >
            <H3>Domaine Rietsch</H3>
            <BodyText>Orange Wine • Alsace, France</BodyText>
            <BodyText color={Colors.warmGray}>
              2021 Vintage • Natural • Unfiltered
            </BodyText>
          </WineCheckInCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Producer Card (Certified)</LabelText>
          <ProducerCard padding={16} certified>
            <H3>Biodynamic Producer</H3>
            <BodyText>
              Certified organic and biodynamic vineyard practicing minimal
              intervention winemaking.
            </BodyText>
          </ProducerCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Event Card</LabelText>
          <EventCard padding={16}>
            <H3>Natural Wine Tasting</H3>
            <BodyText>Saturday, November 15 • 7:00 PM</BodyText>
            <BodyText color={Colors.warmGray}>
              Join us for an evening of natural wine exploration
            </BodyText>
          </EventCard>
        </View>

        <View style={styles.subsection}>
          <LabelText>Card with Halftone</LabelText>
          <Card padding={16} halftone variant="raised">
            <H3>Premium Feature</H3>
            <BodyText>Card with halftone pattern overlay</BodyText>
          </Card>
        </View>
      </View>

      {/* Blob Shapes Section */}
      <View style={styles.section}>
        <H1>Blob Shapes</H1>

        <View style={styles.subsection}>
          <LabelText>Solid Color Blobs</LabelText>
          <View style={styles.blobRow}>
            <BlobShape size={80} color={Colors.warmBeige} opacity={0.8} />
            <BlobShape
              size={80}
              color={Colors.mondrianBlue}
              opacity={0.6}
              preset="wine"
            />
            <BlobShape
              size={80}
              color={Colors.orangeWine}
              opacity={0.7}
              preset="cloud"
            />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Gradient Blobs</LabelText>
          <View style={styles.blobRow}>
            <BlobShape
              size={80}
              gradient={Gradients.sunset}
              gradientAngle={135}
            />
            <BlobShape size={80} gradient={Gradients.earth} />
            <BlobShape size={80} gradient={Gradients.wine} />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Wine Stain Effect</LabelText>
          <View style={styles.blobRow}>
            <WineStainBlob size={100} />
            <WineStainBlob size={100} rotation={45} />
            <WineStainBlob size={100} rotation={90} />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Icon Blob Backgrounds</LabelText>
          <View style={styles.blobRow}>
            <View style={styles.iconContainer}>
              <IconBlobBackground color={Colors.mondrianBlue} />
              <Text variant="h2" color={Colors.offWhite}>
                🍷
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <IconBlobBackground color={Colors.orangeWine} />
              <Text variant="h2" color={Colors.offWhite}>
                🍇
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <IconBlobBackground color={Colors.oliveGreen} />
              <Text variant="h2" color={Colors.offWhite}>
                🌱
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Color Palette Section */}
      <View style={styles.section}>
        <H1>Color Palette</H1>

        <View style={styles.subsection}>
          <LabelText>Primary Colors</LabelText>
          <View style={styles.colorRow}>
            <ColorSwatch color={Colors.cream} name="Cream" />
            <ColorSwatch color={Colors.warmBeige} name="Warm Beige" />
            <ColorSwatch color={Colors.terracotta} name="Terracotta" />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Mondrian Accents</LabelText>
          <View style={styles.colorRow}>
            <ColorSwatch color={Colors.mondrianBlue} name="Blue" />
            <ColorSwatch color={Colors.mondrianRed} name="Red" />
            <ColorSwatch color={Colors.mondrianYellow} name="Yellow" />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Wine Colors</LabelText>
          <View style={styles.colorRow}>
            <ColorSwatch color={Colors.naturalWineRed} name="Red" />
            <ColorSwatch color={Colors.orangeWine} name="Orange" />
            <ColorSwatch color={Colors.pinkWine} name="Rosé" />
          </View>
        </View>

        <View style={styles.subsection}>
          <LabelText>Earth Tones</LabelText>
          <View style={styles.colorRow}>
            <ColorSwatch color={Colors.oliveGreen} name="Olive" />
            <ColorSwatch color={Colors.clayBrown} name="Clay" />
            <ColorSwatch color={Colors.grapePurple} name="Grape" />
          </View>
        </View>
      </View>

      {/* Spacing at bottom */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

/**
 * Color Swatch Component
 */
interface ColorSwatchProps {
  color: string;
  name: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name }) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <BodyText size={12} align="center">
      {name}
    </BodyText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  subsection: {
    marginTop: 20,
  },
  blobRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    alignItems: 'center',
    width: 100,
  },
  colorBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
});
