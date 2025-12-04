import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

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

const webmap = require("../../assets/html/map.html");

export default function MapWebView() {
    const [events, setEvents] = useState([]);
    const webRef = useRef(null);
    const params = useLocalSearchParams();
    const { lat, lng, category, name, description } = params;

    // Ambil semua events dari Firebase
    useEffect(() => {
        const eventsRef = ref(db, "events/");
        const unsub = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list = Object.entries(data).map(([id, v]) => ({
                id,
                name: v.name,
                description: v.description,
                category: v.category,
                latitude: Number(v.latitude),
                longitude: Number(v.longitude),
            }));

            setEvents(list);
            // kirim events ke WebView kalau sudah siap
            webRef.current?.postMessage(JSON.stringify({ events: list }));
        });

        return () => unsub();
    }, []);

    // Kirim fokus ke titik event dari params
    const sendFocus = () => {
        if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
            webRef.current?.postMessage(
                JSON.stringify({
                    focus: {
                        lat: Number(lat),
                        lng: Number(lng),
                        category,
                        name,
                        description,
                    },
                })
            );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webRef}
                style={{ flex: 1 }}
                source={webmap}
                originWhitelist={["*"]}
                javaScriptEnabled
                onLoadEnd={() => {
                    // kirim data setelah WebView siap
                    webRef.current?.postMessage(JSON.stringify({ events }));
                    sendFocus();
                }}
                onMessage={(msg) => {
                    if (msg.nativeEvent.data === "filter_changed") {
                        webRef.current?.postMessage(JSON.stringify({ events }));
                    }
                }}
                startInLoadingState
                renderLoading={() => (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({});