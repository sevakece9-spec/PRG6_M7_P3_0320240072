import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
  const dataPresensi = route?.params?.dataPresensi;

  if (!dataPresensi) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Data tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present": return styles.present;
      case "Late": return styles.late;
      default: return styles.absent;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{dataPresensi.course || "-"}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Kode MK</Text>
          <Text style={styles.value}>{dataPresensi.kodeMk || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pertemuan</Text>
          <Text style={styles.value}>{dataPresensi.pertemuanKe ?? "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{dataPresensi.date || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jam</Text>
          <Text style={styles.value}>{dataPresensi.jamPresensi || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ruangan</Text>
          <Text style={styles.value}>{dataPresensi.ruangan || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dosen Pengampu</Text>
          <Text style={styles.value}>{dataPresensi.dosenPengampu || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, getStatusStyle(dataPresensi.status)]}>
            {dataPresensi.status || "-"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    marginBottom: 15
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    color: "gray"
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flexShrink: 1,
    textAlign: "right"
  },
  present: { color: "green" },
  late: { color: "orange" },
  absent: { color: "red" }
});