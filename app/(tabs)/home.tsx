import React, { useRef, useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import ParallaxScrollView from '@/components/parallax-scroll-view';

// 🔹 Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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

export default function HomeScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const eventsRef = ref(db, "events/");
        const unsub = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list = Object.entries(data).map(([id, v]) => ({
                id,
                name: v.name,
                category: v.category,
                date: v.date,
                description: v.description,
                latitude: Number(v.latitude),
                longitude: Number(v.longitude),
            }));
            setEvents(list);
        });
        return () => unsub();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const upcomingEvents = events
        .filter(ev => ev.date > today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    const latestEvents = events
        .filter(ev => ev.date < today)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 2);

    const scrollRef = useRef(null);
    const scrollX = useRef(0);

    const handleScroll = (e) => {
        scrollX.current = e.nativeEvent.contentOffset.x;
    };

    const scrollBy = (delta) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                x: scrollX.current + delta,
                animated: true,
            });
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FFC4C4', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/home.jpg')}
                    style={styles.headerImage}
                />
            }
        >
            <ScrollView style={styles.container}>

                {/* HERO */}
                <View style={styles.heroCard}>
                    <ThemedText style={styles.heroTitle}>Gawé Yogyakarta</ThemedText>
                    <ThemedText style={styles.heroSubtitle}>
                        Your guide to finding events, festivals, and local activities in Yogyakarta. Explore what’s happening near you anytime, anywhere.
                    </ThemedText>
                </View>

                {/* QUICK MENU */}
                <View style={styles.quickRow}>
                    <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/mapwebview')}>
                        <View style={styles.quickIconCircle}>
                            <FontAwesome5 name="map-marked-alt" size={18} color="#850E35" />
                        </View>
                        <ThemedText style={styles.quickLabel}>Map</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/lokasi')}>
                        <View style={styles.quickIconCircle}>
                            <FontAwesome5 name="th-large" size={18} color="#850E35" />
                        </View>
                        <ThemedText style={styles.quickLabel}>Categories</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/explore')}>
                        <View style={styles.quickIconCircle}>
                            <FontAwesome5 name="calendar-alt" size={18} color="#850E35" />
                        </View>
                        <ThemedText style={styles.quickLabel}>Explore</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/forminputlocation')}>
                        <View style={styles.quickIconCircle}>
                            <FontAwesome5 name="plus" size={18} color="#850E35" />
                        </View>
                        <ThemedText style={styles.quickLabel}>Add</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* UPCOMING EVENTS */}
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Upcoming Events
                </ThemedText>

                <View style={styles.upcomingWrapper}>
                    <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollBy(-260)}>
                        <FontAwesome name="chevron-left" size={22} color="#850E35" />
                    </TouchableOpacity>

                    <ScrollView
                        horizontal
                        ref={scrollRef}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {upcomingEvents.map(ev => (
                            <View key={ev.id} style={styles.eventCard}>
                                <ThemedText style={styles.eventName}>{ev.name}</ThemedText>
                                <ThemedText style={styles.eventMeta}>{ev.date} — {ev.category}</ThemedText>

                                <View style={styles.rowButtons}>
                                    {/* 🔹 Details */}
                                    <TouchableOpacity
                                        style={styles.detailsButton}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/eventdetail',
                                                params: {
                                                    id: ev.id,
                                                    name: ev.name,
                                                    category: ev.category,
                                                    date: ev.date,
                                                    description: ev.description,
                                                    coordinates: `${ev.latitude},${ev.longitude}`, // 🔹 pastikan ini bukan undefined
                                                    accuration: ev.accuration,
                                                },
                                            })
                                        }
                                    >
                                        <ThemedText style={styles.detailsText}>Details</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.arrowRight} onPress={() => scrollBy(260)}>
                        <FontAwesome name="chevron-right" size={20} color="#850E35" />
                    </TouchableOpacity>
                </View>

                {/* LATEST EVENTS */}
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Latest Events
                </ThemedText>

                {latestEvents.map(ev => (
                    <View key={ev.id} style={styles.listEventCard}>
                        <View style={styles.listLeft}></View>
                        <View style={styles.listRight}>
                            <ThemedText style={styles.listEventName}>{ev.name}</ThemedText>
                            <ThemedText style={styles.listEventMeta}>{ev.date} — {ev.category}</ThemedText>
                        </View>
                    </View>
                ))}

                {/* FOOTER */}
                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        Running on {Platform.select({ ios: 'iOS', android: 'Android', web: 'Web' })}
                    </ThemedText>
                </View>

            </ScrollView>
        </ParallaxScrollView>
    );
}

/* ====================== STYLES ====================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 3,
        paddingTop: 10,
    },

    headerImage: { width: '100%', height: 220, position: 'absolute', bottom: 0, left: 0, },

    /* HERO */
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 26,
        paddingVertical: 28,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: '#FFC4C4',
        marginBottom: 20,
        alignItems: 'center',
        elevation: 3,
    },
    heroTitle: {
        color: '#850E35',
        fontSize: 20,
        fontWeight: '800',
    },
    heroSubtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#850E35',
        opacity: 0.8,
        textAlign: 'center',
    },

    /* UPCOMING EVENTS */
    upcomingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    /* QUICK MENU */
    quickRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    quickItem: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    quickIconCircle: {
        width: 55,
        height: 55,
        borderRadius: 27,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FFC4C4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    quickLabel: {
        fontSize: 11,
        color: '#850E35',
        fontWeight: '600',
    },

    /* UPCOMING */
    sectionTitle: {
        marginTop: 10,
        marginBottom: 6,
        color: '#850E35',
        fontWeight: '700',
        fontSize: 18,
    },

    arrowLeft: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: [{ translateY: -11 }],
        zIndex: 20,
    },
    arrowRight: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: -11 }],
        zIndex: 20,
    },

    eventCard: {
        width: 260,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#FFC4C4',
        marginHorizontal: 10,
    },

    eventName: {
        fontWeight: '700',
        fontSize: 16,
        color: '#850E35',
    },
    eventMeta: {
        opacity: 0.7,
        fontSize: 12,
        marginTop: 4,
        color: '#850E35',
    },

    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },

    detailsButton: {
        width: '100%',          // 🔹 penuh satu baris
        backgroundColor: '#EE6983',
        borderRadius: 12,
        paddingVertical: 12,    // sedikit lebih tinggi biar proporsional
        alignItems: 'center',   // pastikan teks di tengah
    },
    detailsText: {
        color: '#FCF5EE',
        textAlign: 'center',
        fontWeight: '700',      // sedikit lebih tebal biar menonjol
        fontSize: 15,           // naikkan sedikit ukuran font
    },

    /* LATEST EVENTS */
    listEventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#FFC4C4',
        marginTop: 12,
        marginBottom: 10,
        elevation: 2,
    },

    listLeft: {
        display: 'none',
    },

    listRight: {
        flex: 1,
        marginLeft: 14,
    },

    listEventName: {
        fontWeight: '700',
        fontSize: 15,
        color: '#850E35',
    },

    listEventMeta: {
        opacity: 0.7,
        fontSize: 12,
        marginTop: 4,
        color: '#850E35',
    },

    /* FOOTER */
    footer: {
        marginTop: 20,
        marginBottom: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#850E35',
        opacity: 0.6,
    },
});
