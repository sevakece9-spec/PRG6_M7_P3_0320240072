import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function AttendanceApp() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('11.49.57');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeString = now.getHours().toString().padStart(2, '0') + '.' +
                         now.getMinutes().toString().padStart(2, '0') + '.' +
                         now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(timeString);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.cardContainer}>
          <View style={styles.profileRow}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.nameText}>Roshela Amelia Sari</Text>
              <Text style={styles.subText}>NIM : 0320240072</Text>
              <Text style={styles.subText}>Class : Informatika-2A</Text>
            </View>
          </View>
        </View>

        {/* Today's Class Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Today's Class</Text>
          <View style={styles.classDetail}>
            <Text style={styles.className}>Mobile Programming</Text>
            <Text style={styles.subText}>08:00 - 10:00</Text>
            <Text style={styles.subText}>Lab 3</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attendance History Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Attendance History</Text>
          
          {isCheckedIn && (
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyName}>Mobile Programming</Text>
                <Text style={styles.historyDate}>16/3/2026</Text>
              </View>
              <Text style={[styles.statusText, { color: '#4CAF50' }]}>Present</Text>
            </View>
          )}

          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyName}>Web Programming</Text>
              <Text style={styles.historyDate}>2026-03-01</Text>
            </View>
            <Text style={[styles.statusText, { color: '#F44336' }]}>Absent</Text>
          </View>

          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyName}>Database System</Text>
              <Text style={styles.historyDate}>2026-03-02</Text>
            </View>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>Present</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9', 
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  clockText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  classDetail: {
    marginBottom: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonActive: {
    backgroundColor: "#4A90E2",
  },
  buttonDisabled: {
    backgroundColor: "#ADCFFF",
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});