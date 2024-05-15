import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token },
      });
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.due_date}</Text>
            <Button
              title="Edit"
              onPress={() => navigation.navigate('TaskForm', { task: item })}
            />
          </View>
        )}
      />
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  task: {
    padding: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
  },
});
