import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskFormScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { task } = route.params || {};

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date);
    }
  }, [task]);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: { Authorization: token },
    };

    if (task) {
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
        title,
        description,
        due_date: dueDate,
      }, config);
    } else {
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        due_date: dueDate,
      }, config);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task ? 'Edit Task' : 'Add Task'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
