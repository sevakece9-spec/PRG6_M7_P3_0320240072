import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View, Text, SafeAreaView, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

export default function HistoryScreen({ navigation }) {
  const { userData } = useContext(AuthContext);

  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const isFetchingRef = useRef(false);

  const BASE_URL = "http://10.1.12.186:8080/api/presensi";

  const fetchAttendanceData = async (targetPage = 0) => {
    if (!userData?.mhsNim) return;
    if (isFetchingRef.current) return;
    if (isLastPage && targetPage !== 0) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const url = `${BASE_URL}/history/${userData.mhsNim}?page=${targetPage}&size=10`;

      const response = await fetch(url);
      const json = await response.json();

      const newItems = json.content || json || [];

      if (targetPage === 0) {
        setHistoryData(newItems);
      } else {
        setHistoryData(prev => [...prev, ...newItems]);
      }

      setPage(targetPage);
      setIsLastPage(json.last ?? true);

    } catch (error) {
      console.error("Gagal tarik data:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData?.mhsNim) {
      fetchAttendanceData(0);
    }
  }, [userData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsLastPage(false);
    setPage(0);
    fetchAttendanceData(0);
  };

  const handleLoadMore = () => {
    if (!isLastPage && !isFetchingRef.current) {
      fetchAttendanceData(page + 1);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present": return styles.statusPresent;
      case "Late": return styles.statusLate;
      case "Absent": return styles.statusAbsent;
      default: return styles.statusAbsent;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { dataPresensi: item })}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.course}>{item.course || "-"}</Text>
        <Text style={styles.subInfo}>
          {item.kodeMk || "-"} • Pertemuan {item.pertemuanKe ?? "-"}
        </Text>
        <Text style={styles.date}>
          {item.date || "-"} | {item.jamPresensi || "-"}
        </Text>
      </View>
      <Text style={getStatusStyle(item.status)}>{item.status || "-"}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#999" style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#B056A0" />
        <Text style={styles.loaderText}>Menarik data...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="history" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Tidak ada riwayat absensi.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemLeft: {
    flex: 1,
  },
  course: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  subInfo: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  statusPresent: {
    color: "green",
    fontWeight: "bold",
    fontSize: 13,
  },
  statusLate: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 13,
  },
  statusAbsent: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: "gray",
    fontSize: 14,
  },
  footerLoader: {
    padding: 15,
    alignItems: "center",
  },
  loaderText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});