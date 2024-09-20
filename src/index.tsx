import { Chat, MessageType } from "@flyerhq/react-native-chat-ui";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import DropdownComponent from "./components/DropdownComponent";
import { Settings } from "./components/Settings";

import streaming from "./helpers/streaming";
import { fetchSystemPrompt, systemPrompts } from "./helpers/systemPrompts";
import uuid from "./helpers/uuid";

const App = () => {
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState("ai");
  const [model, setModel] = useState("llama2:chat" as string);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [maxTokens, setMaxTokens] = useState(600);
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistance."
  );
  const [url, setUrl] = useState("http://192.168.31.126:1234/v1");
  const user = { id: "06c33e8b-e835-4736-80f4-63f44b66666c" };
  const bot = { id: "02202200-e835-4736-80f4-63f44b66ff6d" };

  const handleSystemPromptSelect = useCallback((selectedItem: string) => {
    setSelectedSystemPrompt(selectedItem);
    fetchSystemPrompt(selectedItem).then(setSystemPrompt);
  }, []);

  useEffect(() => {
    fetchSystemPrompt("ai").then(setSystemPrompt);
  }, []);

  const handleSendPressStream = useCallback(
    async (message: MessageType.PartialText) => {
      const textMessage: MessageType.Text = {
        author: user,
        createdAt: Date.now(),
        id: uuid(),
        text: message.text,
        type: "text",
      };

      const replyMessage: MessageType.Text = {
        author: bot,
        createdAt: Date.now(),
        id: uuid(),
        text: "...",
        type: "text",
      };

      const updateReplyMessage = (done: boolean, delta: string) => {
        if (!done) {
          replyMessage.text = delta;
          setMessages((previousMessages) => {
            previousMessages[0] = replyMessage;
            return [...previousMessages];
          });
        }
      };
      setMessages((previousMessages) => [
        replyMessage,
        textMessage,
        ...previousMessages,
      ]);
      const response = await streaming(
        url,
        model,
        maxTokens,
        messages,
        textMessage,
        temperature,
        systemPrompt,
        updateReplyMessage
      );
      console.log("Response", response);
      replyMessage.text = response;

      setMessages((previousMessages) => {
        previousMessages[0] = replyMessage;
        return [...previousMessages];
      });
    },
    [url, model, maxTokens, messages, temperature, systemPrompt]
  );

  if (showSettings) {
    return (
      <Settings
        setShowSettings={setShowSettings}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        url={url}
        setUrl={setUrl}
        setMessages={setMessages}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setShowSettings(true);
            }}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsButtonText}>{url}</Text>
          </TouchableOpacity>
        </View>
        <DropdownComponent
          data={systemPrompts}
          label="SystemPrompt"
          onChange={handleSystemPromptSelect}
        />
        <TouchableOpacity
          onPress={() => {
            setShowSystemPrompt(!showSystemPrompt);
          }}
        >
          <Text style={styles.title}>{selectedSystemPrompt}</Text>
        </TouchableOpacity>
        {selectedSystemPrompt && showSystemPrompt ? (
          <View>
            <ScrollView style={styles.sysprompt}>
              <Text selectable={true}>{systemPrompt}</Text>
            </ScrollView>
          </View>
        ) : null}
        <Chat
          messages={messages}
          onSendPress={handleSendPressStream}
          user={user}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
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
  sysprompt: {
    fontSize: 12,
    color: "#007bff",
    maxHeight: "80%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
  },
});

export default App;
