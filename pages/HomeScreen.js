import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { userData } = useContext(AuthContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = "http://10.1.12.186/api/presensi";

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Memuat perizinan kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Aplikasi butuh akses kamera untuk memindai QR Code Presensi Dosen!
        </Text>
        <TouchableOpacity style={styles.buttonRequest} onPress={requestPermission}>
          <Text style={styles.buttonText}>Aktifkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning || isSubmitting) return;
    setIsScanning(false);

    try {
      const qrData = JSON.parse(data);
      setScannedData(qrData);

      Alert.alert(
        "QR Code Terdeteksi",
        `Mata Kuliah: ${qrData.kodeMk}\nPertemuan: ${qrData.pertemuanKe}\nRuangan: ${qrData.ruangan}\n\nLanjutkan Presensi (Check-In)?`,
        [
          {
            text: "Batal",
            onPress: () => {
              setIsScanning(true);
              setScannedData(null);
            },
            style: "cancel"
          },
          {
            text: "Ya, Check In",
            onPress: () => handleSubmitPresensi(qrData)
          }
        ]
      );
    } catch (error) {
      Alert.alert("QR Tidak Valid", "Pastikan Anda memindai QR Code Presensi Dosen.");
      setIsScanning(true);
    }
  };

  const handleSubmitPresensi = async (qrData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      kodeMk: qrData.kodeMk,
      course: qrData.course,
      nimMhs: userData?.mhsNim,
      pertemuanKe: qrData.pertemuanKe,
      date: new Date().toISOString().split('T')[0],
      jamPresensi: new Date().toLocaleTimeString('en-GB'),
      status: "Present",
      ruangan: qrData.ruangan
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsCheckedIn(true);
        Alert.alert(
          "Berhasil!",
          "Presensi sukses dicatat ke Database.",
          [
            {
              text: "Lihat Riwayat",
              onPress: () => {
                setIsSubmitting(false);
                setIsScanning(true);
                setScannedData(null);
                navigation.navigate('HistoryTab', { screen: 'HistoryList' });
              }
            }
          ]
        );
        return;
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan di server.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar dan API berjalan.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsScanning(true);
      setScannedData(null);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
      />

      <View style={styles.overlay}>
        <View style={styles.overlayTop} />

        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.overlaySide} />
        </View>

        <View style={styles.overlayBottom}>
          <Text style={styles.scanText}>Arahkan kamera ke QR Code Dosen</Text>
          {!isScanning && !isSubmitting && (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setIsScanning(true)}
            >
              <Text style={styles.scanButtonText}>Scan Lagi</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const BOX_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
    margin: 30,
    fontSize: 16,
  },
  buttonRequest: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: BOX_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 20,
  },
  scanText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scanButton: {
    marginTop: 20,
    backgroundColor: '#FF6107',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#0070ff',
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 5, borderLeftWidth: 5,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 5, borderRightWidth: 5,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 5, borderLeftWidth: 5,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 5, borderRightWidth: 5,
  },
});