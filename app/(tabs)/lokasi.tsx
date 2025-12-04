import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAtaRONAV-cl784A9ooKuh-Mhdh0y-7SVY",
    authDomain: "reactnative-cirra.firebaseapp.com",
    databaseURL: "https://reactnative-cirra-default-rtdb.firebaseio.com",
    projectId: "reactnative-cirra",
    storageBucket: "reactnative-cirra.firebasestorage.app",
    messagingSenderId: "585333627445",
    appId: "1:585333627445:web:3bf07382f4b7a35e4f6f7c",
};

initializeApp(firebaseConfig);
const db = getDatabase();

export default function ListByCategory() {
    const router = useRouter();

    // CATEGORY LIST (ID lowercase)
    // CATEGORY LIST (ID lowercase sesuai input page)
    const categories = [
        { id: "all", label: "All" },
        { id: "tourism_culture", label: "Tourism & Culture" },
        { id: "government", label: "Government" },
        { id: "education", label: "Education" },
        { id: "creative", label: "Creative" },
        { id: "sports", label: "Sports" },
        { id: "health", label: "Health" },
        { id: "economy", label: "Economy" },
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [events, setEvents] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // LOAD EVENTS
    useEffect(() => {
        const refEvents = ref(db, "events/");

        const unsubscribe = onValue(refEvents, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const list = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...(val as any),
                }));

                // Jika kategori "all" → tampilkan semua event
                if (selectedCategory === "all") {
                    setEvents(list);
                } else {
                    // Filter kategori
                    setEvents(
                        list.filter(
                            (item) =>
                                String(item.category).trim().toLowerCase() ===
                                String(selectedCategory).trim().toLowerCase()
                        )
                    );
                }
            } else {
                setEvents([]);
            }
        });

        return () => unsubscribe();
    }, [selectedCategory]);

    // DELETE EVENT
    const handleDelete = (id: string) => {
        Alert.alert("Delete Event?", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => remove(ref(db, "events/" + id)),
            },
        ]);
    };

    // REFRESH
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* CATEGORY SELECTOR */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryItem,
                                selectedCategory === cat.id && styles.categoryItemActive,
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === cat.id && styles.categoryTextActive,
                                ]}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* EVENT LIST TITLE */}
                <Text style={styles.subtitle}>
                    Events ({selectedCategory || "All"})
                </Text>

                {/* EVENT LIST */}
                {events.length === 0 ? (
                    <Text style={styles.noEventText}>No events in this category.</Text>
                ) : (
                    events.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.eventCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/eventdetail",
                                    params: { ...item },
                                })
                            }
                        >
                            <Text style={styles.eventName}>{item.name}</Text>
                            <Text style={styles.eventInfo}>{item.date}</Text>
                            <Text style={styles.eventInfo2}>{item.description}</Text>

                            <View style={styles.buttonRow}>
                                {/* EDIT */}
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/formeditlocation",
                                            params: {
                                                id: item.id,
                                                name: item.name,
                                                category: item.category,
                                                date: item.date,
                                                description: item.description,
                                                latitude: String(item.latitude ?? ""),
                                                longitude: String(item.longitude ?? ""),
                                                accuracy: String(item.accuracy ?? ""),
                                            },
                                        })
                                    }
                                >
                                    <FontAwesome5 name="pencil-alt" size={18} color="#850E35" />
                                </TouchableOpacity>

                                {/* DELETE */}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <FontAwesome5 name="trash" size={18} color="#850E35" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* FLOATING BUTTON */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/forminputlocation")}
            >
                <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "white" },

    subtitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 16,
        marginBottom: 10,
        color: "#850E35",
    },

    /* CATEGORY */
    categoryScroll: { flexDirection: "row", marginBottom: 10 },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#FFC4C4",
        marginRight: 10,
    },
    categoryItemActive: {
        backgroundColor: "#EE6983",
    },
    categoryText: {
        color: "#850E35",
        fontWeight: "700",
    },
    categoryTextActive: {
        color: "white",
    },

    /* EVENTS */
    noEventText: {
        color: "#850E35",
        opacity: 0.7,
        marginTop: 20,
    },
    eventCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FFC4C4",
        marginBottom: 14,
    },
    eventName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#850E35",
    },
    eventInfo: {
        fontSize: 13,
        color: "#850E35",
        marginTop: 4,
        opacity: 0.8,
    },
    eventInfo2: {
        fontSize: 12,
        color: "#850E35",
        marginTop: 4,
        opacity: 0.6,
    },

    /* BUTTON ROW */
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    editButton: { padding: 8, marginRight: 7 },
    deleteButton: { padding: 8 },

    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#EE6983',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },

});
