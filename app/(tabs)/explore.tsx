import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAtaRONAV-cl784A9ooKuh-Mhdh0y-7SVY",
  authDomain: "reactnative-cirra.firebaseapp.com",
  databaseURL: "https://reactnative-cirra-default-rtdb.firebaseio.com",
  projectId: "reactnative-cirra",
  storageBucket: "reactnative-cirra.firebasestorage.app",
  messagingSenderId: "585333627445",
  appId: "1:585333627445:web:3bf07382f4b7a35e4f6f7c",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const categoryColors: Record<string, string> = {
  tourism_culture: "#FFD700", // kuning
  government: "#FF0000",      // merah
  education: "#0000FF",       // biru
  creative: "#800080",        // ungu
  sports: "#FFA500",          // oranye
  health: "#008000",          // hijau
  economy: "#000000",         // hitam
};

export default function ExploreScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const router = useRouter();

  useEffect(() => {
    const eventsRef = ref(db, "events/");
    const unsub = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, v]: any) => ({
        id,
        name: v.name,
        description: v.description,
        category: v.category,
        date: v.date,
        latitude: v.latitude,
        longitude: v.longitude,
        coordinates: v.coordinates,
        accuracy: v.accuracy,
      }));

      setEvents(list);

      const marks: any = {};
      list.forEach((ev) => {   // ⬅️ ganti events -> list
        marks[ev.date] = {
          selected: true,
          selectedColor: categoryColors[ev.category] || "#808080",
        };
      });
      setMarkedDates(marks);
    });

    return () => unsub();
  }, []);

  if (!events.length) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events Schedule</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          const selectedEvent = events.find(ev => ev.date === day.dateString);
          if (selectedEvent) {
            router.push({
              pathname: "/eventdetail",
              params: selectedEvent,
            });
          }
        }}
        theme={{
          backgroundColor: "#FCF5EE",
          calendarBackground: "#FCF5EE",
          textSectionTitleColor: "#850E35",
          selectedDayBackgroundColor: "#EE6983",
          selectedDayTextColor: "#fff",
          todayTextColor: "#EE6983",
          dayTextColor: "#333",
          arrowColor: "#EE6983",
          monthTextColor: "#850E35",
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
      />

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>- Event Categories:</Text>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#FFD700" }]} />
          <Text style={styles.legendText}>Tourism & Culture</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#FF0000" }]} />
          <Text style={styles.legendText}>Government</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#0000FF" }]} />
          <Text style={styles.legendText}>Education</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#800080" }]} />
          <Text style={styles.legendText}>Creative</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#FFA500" }]} />
          <Text style={styles.legendText}>Sports</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#008000" }]} />
          <Text style={styles.legendText}>Health</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "#000000" }]} />
          <Text style={styles.legendText}>Economy</Text>
        </View>
      </View>
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FCF5EE",
      paddingTop: 40,
    },
    header: {
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 20,
      color: "#850E35",
    },
    legend: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    legendTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#850E35",
      marginBottom: 10,
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    colorBox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      marginRight: 10,
    },
    legendText: {
      fontSize: 16,
      color: "#333",
    },
  });