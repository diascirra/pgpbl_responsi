import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";

export default function LoginScreen() {
    const router = useRouter();
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        const data = await AsyncStorage.getItem("userData");
        if (!data) {
            setMessage("No registered account found!");
            setVisible(true);
            return;
        }

        const user = JSON.parse(data);

        const matchUser =
            (usernameOrEmail === user.username || usernameOrEmail === user.email) &&
            password === user.password;

        if (matchUser) {
            setMessage("Login successful!");
            setVisible(true);
            router.replace("/(tabs)/home");
        } else {
            setMessage("Credentials do not match!");
            setVisible(true);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Username or Email"
                        value={usernameOrEmail}
                        onChangeText={setUsernameOrEmail}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don’t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/register")}>
                            <Text style={styles.registerLink}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <Snackbar
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        duration={2000}
                        style={{ backgroundColor: "#9A3F3F" }}
                    >
                        <Text style={{ color: "#FFF8F0" }}>{message}</Text>
                    </Snackbar>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCF5EE",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        color: "#850E35",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#EE6983",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#EE6983",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#FFF8F0", fontSize: 18, fontWeight: "700" },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    registerText: { color: "#333", fontSize: 14 },
    registerLink: { color: "#EE6983", fontSize: 14, fontWeight: "600" },
});