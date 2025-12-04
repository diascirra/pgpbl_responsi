import React from 'react';
import { StyleSheet, TextInput, Text, Button, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const TextInputExample = () => {
    const [text, onChangeText] = React.useState('Useless Text');
    const [number, onChangeNumber] = React.useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Stack.Screen options={{ title: 'Form Input' }} />
                
                <Text style={styles.inputTitle}>NAMA</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder='Nama'
                />

                <Text style={styles.inputTitle}>NIM</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="NIM"
                />

                <Text style={styles.inputTitle}>KELAS</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="Kelas"
                />

                <View style={styles.button}>
                    <Button
                        title="Save"
                        onPress={() => alert('Button pressed!')}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    inputTitle: {
        marginLeft: 12,
        marginTop: 12,
        fontSize: 18,
        fontWeight: '600',
    },
    button: {
        margin: 12,
    },
});

export default TextInputExample;
