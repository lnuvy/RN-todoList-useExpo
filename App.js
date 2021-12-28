import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from "./colors";


const STORAGE_KEY = "@tods"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveTodos = async (toSave) => {
    try {
      const str = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY, str)
    } catch (e) {
      console.log(`failed to Save!! ${e}`);
    }

  }
  const loadTodos = async () => {
    const str = await AsyncStorage.getItem(STORAGE_KEY)
    setTodos(JSON.parse(str));
  }

  // componentDidMount 
  useEffect(() => {
    loadTodos()
  }, [])

  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // assign() 방법
    // const newTodos = Object.assign({}, todos, {
    //   [Date.now()]: { text, work: working },
    // });

    // ES6 방법
    const newTodos = { ...todos, [Date.now()]: { text, working }, };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };
  const deleteTodo = async (key) => {
    const newTodos = { ...todos }
    delete newTodos[key]
    setTodos(newTodos);
    await saveTodos(newTodos);
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          // multiline
          onChangeText={onChangeText}
          returnKeyType='done'
          value={text}
          // returnKeyType='send'
          style={styles.input} placeholder={working ? "Add a Todo" : "Where do you want to go?"}
        />
        <ScrollView>{Object.keys(todos).map((key) => {
          return (
            todos[key].working === working ? (
              <View style={styles.todo} key={key}>
                <Text style={styles.todoText}>{todos[key].text}</Text>
              </View>
            ) : null
          )
        })}
        </ScrollView>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    // color: theme.grey,
    fontWeight: "600",
    fontSize: 40,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 15,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
