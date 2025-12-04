import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

// Firebase Realtime
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Convert date → DD/MM/YYYY
const formatShortDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
};

// Categories
const EVENT_CATEGORIES = [
    { id: "education", label: "Education" },
    { id: "government", label: "Government" },
    { id: "tourism_culture", label: "Tourism & Culture" },
    { id: "sports", label: "Sports" },
    { id: "health", label: "Health" },
    { id: "economy", label: "Economy" },
    { id: "creative", label: "Creative" }
];

const AddEventScreen = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [coordinates, setCoordinates] = useState('');
    const [accuracy, setAccuracy] = useState('');

    // Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyAtaRONAV-cl784A9ooKuh-Mhdh0y-7SVY",
        authDomain: "reactnative-cirra.firebaseapp.com",
        databaseURL: "https://reactnative-cirra-default-rtdb.firebaseio.com",
        projectId: "reactnative-cirra",
        storageBucket: "reactnative-cirra.firebasestorage.app",
        messagingSenderId: "585333627445",
        appId: "1:585333627445:web:3bf07382f4b7a35e4f6f7c"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Get GPS
    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission denied", "Location access was denied.");
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude.toString();
        const lng = loc.coords.longitude.toString();
        setCoordinates(`${lat},${lng}`);
        setAccuracy(loc.coords.accuracy.toString());
    };

    // Save Event
    const saveEvent = () => {
        if (!name || !description || !category || !coordinates) {
            Alert.alert("Missing Data", "Please fill all fields!");
            return;
        }

        const [lat, lng] = coordinates.split(",").map((v) => v.trim());

        const eventsRef = ref(db, 'events/');
        push(eventsRef, {
            name,
            description,
            category,
            date: date ? date.toISOString().split("T")[0] : null,
            coordinates,   // simpan gabungan untuk ditampilkan di detail
            latitude: lat,
            longitude: lng,
            accuracy,
            createdAt: Date.now()
        })
            .then(() => {
                Alert.alert("Success", "Event saved successfully!");
                setName('');
                setDescription('');
                setCategory('');
                setCoordinates('');
                setAccuracy('');
            })
            .catch(() => {
                Alert.alert("Error", "Failed to save event.");
            });
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: "#FCF5EE" }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ title: "Add Event" }} />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.header}>Add Event</Text>

                            {/* Event Name */}
                            <Text style={styles.label}>Event Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Event Name"
                                value={name}
                                onChangeText={setName}
                            />

                            {/* Description */}
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                multiline
                                value={description}
                                onChangeText={setDescription}
                            />

                            {/* Category */}
                            <Text style={styles.label}>Category</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Text>
                                    {category
                                        ? EVENT_CATEGORIES.find((c) => c.id === category)?.label
                                        : "Select category"}
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

                            {/* Date */}
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>
                                    {date ? formatShortDate(date) : "Select date"}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date ?? new Date()}
                                    mode="date"
                                    display="calendar"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setDate(selectedDate);
                                        }
                                    }}
                                />
                            )}

                            {/* Coordinates */}
                            <Text style={styles.label}>Event Coordinates</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Latitude,Longitude"
                                value={coordinates}
                                onChangeText={setCoordinates}
                            />

                            {/* Accuracy */}
                            <Text style={styles.label}>GPS Accuracy (meters)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Accuracy"
                                keyboardType="numeric"
                                value={accuracy}
                                onChangeText={setAccuracy}
                            />

                            {/* Get location button */}
                            <TouchableOpacity style={styles.btnSecondary} onPress={getCoordinates}>
                                <Text style={styles.btnSecondaryText}>Get Current Location</Text>
                            </TouchableOpacity>

                            {/* Save button */}
                            <TouchableOpacity style={styles.btnPrimary} onPress={saveEvent}>
                                <Text style={styles.btnPrimaryText}>Save Event</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};
const styles = StyleSheet.create({
    container: { padding: 16 },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#FFC4C4",
    },
    header: {
        fontSize: 20,
        fontWeight: "700",
        color: "#850E35",
        textAlign: "center",
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 4,
        fontWeight: "600",
        color: "#850E35"
    },
    input: {
        borderWidth: 1,
        borderColor: "#FFC4C4",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#FCF5EE",
        fontSize: 14
    },
    dropdownMenu: {
        borderWidth: 1,
        borderColor: "#FFC4C4",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        marginTop: 5
    },
    dropdownItem: {
        padding: 12,
        borderBottomColor: "#FFC4C4",
        borderBottomWidth: 1
    },
    box: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#FFC4C4",
        backgroundColor: "#FCF5EE"
    },
    btnSecondary: {
        backgroundColor: "#FFC4C4",
        padding: 14,
        borderRadius: 12,
        marginTop: 16
    },
    btnSecondaryText: {
        color: "#850E35",
        textAlign: "center",
        fontWeight: "700"
    },
    btnPrimary: {
        backgroundColor: "#EE6983",
        padding: 14,
        borderRadius: 12,
        marginTop: 20
    },
    btnPrimaryText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700"
    }
});

export default AddEventScreen;
