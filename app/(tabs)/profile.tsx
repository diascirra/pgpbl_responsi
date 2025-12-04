import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const data = await AsyncStorage.getItem("userData");
            if (data) {
                setUser(JSON.parse(data));
            }
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userData");
        setMessage("You have been logged out.");
        setVisible(true);
        router.replace("/login");
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>My Profile</Text>
                <Ionicons name="person-circle" size={120} color="#850E35" style={styles.iconCenter} />
                <Text style={styles.info}>No user data found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <Ionicons name="person-circle" size={120} color="#850E35" style={styles.iconCenter} />

            <View style={styles.menuItem}>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>{user.username}</Text>
            </View>

            <View style={styles.menuItem}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.menuItem}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{user.phone}</Text>
            </View>

            <View style={styles.menuItem}>
                <Text style={styles.label}>Birthday</Text>
                <Text style={styles.value}>{user.dob}</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={2000}
                style={{ backgroundColor: "#EE6983" }}
            >
                <Text style={{ color: "#FFF8F0" }}>{message}</Text>
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FCF5EE", padding: 20 },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
        color: "#850E35",
    },
    iconCenter: {
        alignSelf: "center",
        marginBottom: 30,
    },
    menuItem: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#FFC4C4",
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        color: "#850E35",
        fontWeight: "600",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    footer: {
        marginTop: "auto",
    },
    logoutButton: {
        backgroundColor: "#EE6983",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: "#FFF8F0",
        fontSize: 18,
        fontWeight: "700",
    },
    info: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
});