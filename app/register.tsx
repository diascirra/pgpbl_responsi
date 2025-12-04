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
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            setVisible(true);
            return;
        }

        const userData = {
            username,
            email,
            phone,
            dob: formatDate(dob),
            password,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        setMessage("Account registered successfully!");
        setVisible(true);
        router.push("/login");
    };

    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const InputWithIcon = ({
        icon,
        placeholder,
        secure,
        value,
        onChangeText,
        keyboardType = "default",
    }) => (
        <View style={styles.inputContainer}>
            <Ionicons name={icon} size={22} color="#850E35" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secure}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                placeholderTextColor="#999"
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Register</Text>

                    <InputWithIcon icon="person" placeholder="Username" value={username} onChangeText={setUsername} />
                    <InputWithIcon icon="mail" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <InputWithIcon icon="call" placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    {/* Birthday */}
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputContainer}>
                        <Ionicons name="calendar" size={22} color="#850E35" style={styles.icon} />
                        <Text style={{ color: "#333" }}>{formatDate(dob)}</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={dob}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) setDob(selectedDate);
                            }}
                        />
                    )}

                    <InputWithIcon icon="lock-closed" placeholder="Password" secure value={password} onChangeText={setPassword} />
                    <InputWithIcon icon="lock-closed" placeholder="Confirm Password" secure value={confirmPassword} onChangeText={setConfirmPassword} />

                    {/* Tombol Register */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    {/* Link ke Login */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/login")}>
                            <Text style={styles.loginLink}>Login</Text>
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
    container: { flex: 1, padding: 20, backgroundColor: "#FCF5EE" },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
        color: "#850E35",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#EE6983",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: "#333" },
    button: {
        backgroundColor: "#EE6983",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#FFF8F0", fontSize: 18, fontWeight: "700" },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    loginText: { color: "#333", fontSize: 14 },
    loginLink: { color: "#EE6983", fontSize: 14, fontWeight: "600" },
});