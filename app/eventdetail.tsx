import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ThemedText } from "@/components/themed-text";

export default function EventDetail() {
    const router = useRouter();
    const { id, name = "", category = "", date = "", description = "", coordinates = "", accuration = "" } = useLocalSearchParams();

    const parseCoordinates = (coords: string) => {
        try {
            const [lat, lng] = coords.split(",").map((v) => Number(v.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat, lng };
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Event Details",
                    headerStyle: { backgroundColor: "#FFC4C4" },
                    headerTintColor: "#850E35",
                    headerTitleAlign: "center",
                }}
            />

            <View style={styles.container}>
                <Text style={styles.title}>{name}</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>Category:</Text>
                    <Text style={styles.value}>{category}</Text>

                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{date}</Text>

                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.value}>{description}</Text>

                    <Text style={styles.label}>Coordinates:</Text>
                    <Text style={styles.value}>{coordinates}</Text>
                </View>

                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => {
                        const coords = parseCoordinates(coordinates);
                        if (coords) {
                            router.push({
                                pathname: "/mapwebview",
                                params: { lat: coords.lat, lng: coords.lng, category },
                            });
                        }
                    }}
                >
                    <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "white" },
    title: { fontSize: 26, fontWeight: "800", color: "#850E35", marginBottom: 20 },
    infoBox: {
        borderWidth: 1,
        borderColor: "#FFC4C4",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    label: { fontWeight: "700", color: "#850E35", marginTop: 10 },
    value: { color: "#850E35", opacity: 0.8 },
    mapButton: {
        backgroundColor: "#EE6983",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    mapButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
});