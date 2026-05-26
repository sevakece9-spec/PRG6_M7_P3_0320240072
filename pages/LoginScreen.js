import React, { useState, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://10.1.12.186:8080/api/user";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!nim.trim() || !password.trim()) {
      Alert.alert("Error", "NIM dan Password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        BASE_URL + "/Login",
        { nim: nim.trim(), password: password.trim() },
        { headers: { authcode: "astratech@123" } }
      );

      if (res.data.status === 200 && res.data.data) {
        login(res.data.data);
      } else {
        Alert.alert("Login Gagal", res.data.message);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Tidak bisa konek ke server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presensi Mahasiswa</Text>
      <Text style={styles.subtitle}>Masuk dengan akun kampus Anda</Text>

      <TextInput
        placeholder="NIM"
        value={nim}
        onChangeText={setNim}
        style={styles.input}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="white" />
          : <Text style={styles.buttonText}>Login</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4f1',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});