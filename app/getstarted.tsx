import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function GetStartedScreen() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require("../assets/images/bg_tugu.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Gawé Yogyakarta</Text>
                    <Text style={styles.subtitle}>
                        Explore the soul of Yogyakarta through local events, traditions, and shared moments.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={() => router.push("/login")}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 80,
        paddingHorizontal: 30,
    },
    textContainer: {
        alignItems: "center",
        marginTop: 60,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#89A8B2",
        textAlign: "center",
        letterSpacing: 1.2,
        marginBottom: 10,
        textShadowColor: "rgba(0,0,0,0.8)", // warna bayangan
        textShadowOffset: { width: 4, height: 4 }, // arah bayangan
        textShadowRadius: 3, // blur bayangan

    },
    subtitle: {
        fontSize: 17,
        color: "#FBFBFB",
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#FFF7DD",
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: "#313647",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.8,
    },
});