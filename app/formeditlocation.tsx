import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    View,
} from "react-native";

import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

// Firebase config
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

// CATEGORIES (ID lowercase)
const EVENT_CATEGORIES = [
    { id: "tourism_culture", label: "Tourism & Culture" },
    { id: "government", label: "Government" },
    { id: "education", label: "Education" },
    { id: "creative", label: "Creative" },
    { id: "sports", label: "Sports" },
    { id: "health", label: "Health" },
    { id: "economy", label: "Economy" },
];

// Format tanggal: dd/mm/yyyy
const formatShortDate = (dateObj: Date) => {
    const d = new Date(dateObj);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function EditEventScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // GET PARAMS
    const {
        id,
        name: initialName = "",
        category: initialCategory = "",
        date: initialDate = "",
        description: initialDescription = "",
        latitude: paramLat = "",
        longitude: paramLng = "",
        accuracy: initialAccuracy = "",
    } = params;

    // INITIAL COMBINED COORDINATES
    const initialCoordinates =
        paramLat && paramLng ? `${paramLat},${paramLng}` : "";

    // STATES
    const [name, setName] = useState(String(initialName));
    const [category, setCategory] = useState(
        String(initialCategory).trim().toLowerCase()
    );
    const [description, setDescription] = useState(String(initialDescription));
    const [location, setLocation] = useState(initialCoordinates);
    const [accuracy, setAccuracy] = useState(String(initialAccuracy));
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [date, setDate] = useState(
        initialDate ? new Date(String(initialDate)) : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    // GET GPS
    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Location access was denied.");
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
        setAccuracy(`${loc.coords.accuracy} m`);
    };

    // UPDATE EVENT
    const handleUpdate = () => {
        if (!id) {
            Alert.alert("Error", "Event ID not found.");
            return;
        }

        let latNew = "";
        let lngNew = "";

        if (location.includes(",")) {
            [latNew, lngNew] = location.split(",").map((v) => v.trim());
        }

        const eventRef = ref(db, `events/${id}`);

        update(eventRef, {
            name,
            category: category.toLowerCase(),
            description,
            accuracy,
            latitude: latNew,
            longitude: lngNew,
            coordinates: location,
            date: date.toISOString(),
        })
            .then(() => {
                Alert.alert("Success", "Event updated successfully!", [
                    { text: "OK", onPress: () => router.back() },
                ]);
            })
            .catch(() => Alert.alert("Error", "Failed to update event."));
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: "#FCF5EE" }}>
            <SafeAreaView>
                <Stack.Screen
                    options={{
                        title: "Edit Event",
                        headerStyle: { backgroundColor: "#FFC4C4" },
                        headerTintColor: "#850E35",
                        headerTitleAlign: "center",
                    }}
                />

                <ScrollView style={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.header}>Edit Event</Text>

                        {/* NAME */}
                        <Text style={styles.label}>Event Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />

                        {/* DESCRIPTION */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, { height: 90 }]}
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />

                        {/* CATEGORY */}
                        <Text style={styles.label}>Category</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <Text>
                                {
                                    EVENT_CATEGORIES.find(
                                        (c) => c.id === category
                                    )?.label
                                }
                            </Text>
                        </TouchableOpacity>

                        {dropdownOpen && (
                            <View style={styles.dropdownMenu}>
                                {EVENT_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setCategory(cat.id);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <Text>{cat.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* DATE */}
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>{formatShortDate(date)}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="calendar"
                                onChange={(evt, selected) => {
                                    setShowDatePicker(false);
                                    if (selected) setDate(selected);
                                }}
                            />
                        )}

                        {/* COORDINATES */}
                        <Text style={styles.label}>Coordinates</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="latitude,longitude"
                        />

                        {/* ACCURACY */}
                        <Text style={styles.label}>Accuracy</Text>
                        <TextInput
                            style={styles.input}
                            value={accuracy}
                            onChangeText={setAccuracy}
                        />

                        {/* BUTTONS */}
                        <TouchableOpacity
                            style={styles.btnSecondary}
                            onPress={getCoordinates}
                        >
                            <Text style={styles.btnSecondaryText}>
                                Get Current Location
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.btnPrimaryText}>
                                Update Event
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },

    card: {
        backgroundColor: "#FFF",
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#FFC4C4",
    },

    header: {
        fontSize: 20,
        fontWeight: "800",
        color: "#850E35",
        textAlign: "center",
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 4,
        fontWeight: "600",
        color: "#850E35",
    },

    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#FFC4C4",
        borderRadius: 10,
        backgroundColor: "#FCF5EE",
        fontSize: 14,
    },

    dropdownMenu: {
        borderWidth: 1,
        borderColor: "#FFC4C4",
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginTop: 4,
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#FFE3E3",
    },

    btnSecondary: {
        backgroundColor: "#FFC4C4",
        padding: 14,
        borderRadius: 12,
        marginTop: 22,
    },

    btnSecondaryText: {
        color: "#850E35",
        textAlign: "center",
        fontWeight: "700",
    },

    btnPrimary: {
        backgroundColor: "#EE6983",
        padding: 14,
        borderRadius: 12,
        marginTop: 25,
    },

    btnPrimaryText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
    },
});
