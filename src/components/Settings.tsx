import { Slider } from "@react-native-assets/slider";
import React from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface SettingsProps {
  setShowSettings: (show: boolean) => void;
  model: string;
  setModel: (model: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  url: string;
  setUrl: (url: string) => void;
  setMessages: (messages: any[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  setShowSettings,
  model,
  setModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  url,
  setUrl,
  setMessages,
}) => (
  <SafeAreaProvider>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setShowSettings(false);
          }}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View>
        <Text>Ollama model:</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={(newModel) => setModel(newModel)}
        />
      </View>
      <View>
        <Text>Temperature:</Text>
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={temperature}
            onValueChange={(value) => setTemperature(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
        </View>
        <View style={styles.sliderValueWrapper}>
          <Text> {temperature}</Text>
        </View>
      </View>
      <View>
        <Text>Max Tokens:</Text>
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={16}
            maximumValue={4096}
            step={16}
            value={maxTokens}
            onValueChange={(value) => setMaxTokens(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
        </View>
        <View style={styles.sliderValueWrapper}>
          <Text> {maxTokens}</Text>
        </View>
      </View>
      <ScrollView>
        <View>
          <Text>LLM API URL:</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUrl(text)}
            value={url}
          />
        </View>
        <View>
          <Button
            title="Clear Chat History"
            onPress={() => {
              setMessages([]);
            }}
          />
        </View>
      </ScrollView>
    </View>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    backgroundColor: "#f7f7f7",
  },
  settingsButton: {
    paddingTop: 60,
  },
  settingsButtonText: {
    fontSize: 18,
    color: "#007bff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    paddingLeft: 5,
  },
  sliderContainer: {
    flexDirection: "row",
    paddingLeft: 20,
  },
  sliderWrapper: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingBottom: 20,
  },
  slider: {
    width: 200,
    height: 40,
  },
  sliderValueWrapper: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
