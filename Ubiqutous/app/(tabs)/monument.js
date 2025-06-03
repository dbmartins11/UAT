import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchMonumentDescription } from '../../api/apiWikipedia.js';
import { fetchCoordinates } from '../../api/apiNominatim.js';
import { fetchImagesUnsplash } from '../../api/apiUnsplash.js';
import BackButton from '../../components/backButton.js';
import MapView, { Marker } from 'react-native-maps';
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
const { height: screenHeight } = Dimensions.get('window');
import { doc, getDoc, setDoc, collection, updateDoc, arrayUnion} from 'firebase/firestore';
import { TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../../firebase/firebaseConf';
import { getDocs } from 'firebase/firestore'; // Add this import at the top if not present
import { use } from 'react';


export default function Monument() {
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_600SemiBold,
        CrimsonText_400Regular,
    });
    const [hasUrls, setHasUrls] = useState(false);
    const [urls, setUrls] = useState([]);
    
    const [description, setDescription] = useState([]);

    const [coordinatesC, setCoordinatesC] = useState([]);
    const [selfCoordinates, setSelfCoordinates] = useState([]);
    const [MCoordinates, setMCoordinates] = useState([]);
    const route = useRoute();
    const { monument, city, country, url, prevUrls } = route.params;

    const [listName, setListName] = useState('');
    const [myLists, setMyLists] = useState([]);
    const [userID, setUserID] = useState('');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);

   
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleBackdropPress = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    const createList = async () => {
        console.log("Create List");

        if (!listName) {
            console.log("List name is empty, not creating list.");
            return;
        }

        try {
            const userListsRef = collection(db, 'users', userID, 'lists');
            const listDoc = doc(userListsRef, listName);
            const docSnap = await getDoc(listDoc);
            if (docSnap.exists()) {
                Alert.alert('List already exists', 'Please choose a different name.');
                return;
            }
            await setDoc(listDoc, {
                name: listName,
                countries: {
                    [country]: {
                        visited: false,
                        cities: {
                            [city]: {
                                visited: false,
                                monuments: [{ name: monument, visited: false }]
                            }
                        }
                    }
                }
            });
            console.log("List created successfully:", listName);
            setModalVisible(false);            
            getLists();
        } catch (error) {
            Alert.alert('Error creating list', error.message);
        }
    };

    const updateList = async (listName, monument) => {
        try {
            const userListsRef = collection(db, 'users', userID, 'lists');
            const listDoc = doc(userListsRef, listName);
            const docSnap = await getDoc(listDoc);

            console.log("Updating list:", listName, "with monument:", monument, "in city:", city, "and country:", country, "for user:", userID);

            if (docSnap.exists()) {
                const data = docSnap.data();

                if (data.countries?.[country]?.cities?.[city]) {
                    // City exists, append monument
                    console.log("City exists, adding monument:", monument);
                    await updateDoc(listDoc, {
                        [`countries.${country}.cities.${city}.monuments`]: arrayUnion({ name: monument, visited: false })
                    });
                    
                } else if (data.countries?.[country]) {
                    console.log("City does not exist, adding new city:", city);
                    // Country exists, add new city
                    console.log("Country exists, adding new city:", city);
                    await updateDoc(listDoc, {
                        [`countries.${country}.cities.${city}`]: {
                            visited: false,
                            monuments: [{ name: monument, visited: false }]
                        }
                    });
                } else {
                    // Country doesn't exist, create it
                    console.log("Country does not exist, creating new country:", country);
                    await updateDoc(listDoc, {
                        [`countries.${country}`]: {
                            visited: false,
                            cities: {
                                [city]: {
                                    visited: false,
                                    monuments: [{ name: monument, visited: false }]
                                }
                            }
                        }
                    });
                }
            }
            console.log("Monument added to list:", listName);
            getLists();
        } catch (error) {
            console.error('Error updating list:', error);
            Alert.alert('Error updating list', error.message);
        }
    };

    const getLists = async () => {
        if (!userID) return;
        try {
            const listsRef = collection(db, 'users', userID, 'lists');
            const snapshot = await getDocs(listsRef);
            const lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            setMyLists(lists);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    };
            
    useEffect(() => {
        //monument === undefined ? monument = "Torre Eiffel" : monument = monument; 
        let url_;
        url === undefined ? url_ = false : url_ = true;
        setHasUrls(url_);
        const fetchData = async (monument) => {
            try {
                const data = await fetchMonumentDescription(monument);
                setDescription(data);
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
        }

        const fetchCoordinatesC = async () => {
            try {
                const coordsC = await fetchCoordinates(city);

                setCoordinatesC(coordsC);
            } catch (error) {
                console.error('Error fetching the coordinates:', error);
            }
        }

        const fetchCoordinatesM = async (monument) => {
            try {
                const coordsM = await fetchCoordinates(monument + " " + city);
                setMCoordinates(coordsM);
            } catch (error) {
                console.error('Error fetching the coordinates:', error);
            }
        }

        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return null;
                }
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setSelfCoordinates([latitude, longitude]);
            }
            catch (error) {
                console.error('Error getting location:', error);
            }
        }

        const fetchImagesMon = async (monument) => {
            try {
                const data = await fetchImagesUnsplash(monument);
                console.log('URLS IMAGES:', data);
                setUrls(data);
                setHasUrls(true);
                return data;

            } catch (error) {
                console.error('Error fetching monument images:', error);
                setHasUrls(false);
                return [];
            }
        }

        const getUserID = async () => {
            const id = await AsyncStorage.getItem('userID');
            if (!id) {
                id = auth.currentUser?.uid || 'Unnamed';
            }
            setUserID(id || 'Unnamed');
            console.log("User ID: ", userID);
        };


        fetchData(monument);
        getLocation();
        fetchCoordinatesC(monument);
        fetchCoordinatesM(monument);        
        getUserID();
        getLists();
        if (url_ === false) {
            fetchImagesMon(monument);
        }
        else {
            setUrls(url);
        }
    }, [url])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const onPress = () => {
        navigation.navigate('city', {
            city: city,
            country: country,
            url: prevUrls,
        });
    }

    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.main}>
                {hasUrls === true ? (
                    <ImageBackground
                        source={{ uri: urls[7] }}
                        style={styles.mainImg}>
                        <BackButton
                            style={styles.backButtonOverlay}
                            onPress={onPress} />
                    </ImageBackground>
                ) : (
                    <Text style={styles.description}>
                        No images to display
                    </Text>
                )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                {monument ?
                    <Text style={styles.title}>{monument}</Text>
                    :
                    <Text style={styles.title}>Undefined</Text>
                }
                <TouchableOpacity
                    style={{ marginLeft: 20, borderRadius: 25, }}
                    onPress={toggleSidebar}>
                    <Image
                        source={require('./../../assets/icons/save.png')}
                        style={{ width: 20, height: 20 }}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                {description}
            </Text>
            {/* {coordinatesC !== null && coordinatesC.length > 0 ? (
                <MapView
                    style={{ width: '100%', height: screenHeight * 0.4 }}
                    initialRegion={{
                        latitude: coordinatesC[0],
                        longitude: coordinatesC[1],
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {(MCoordinates !== null && MCoordinates.length > 0) &&  (
                        <Marker
                            coordinate={{
                                latitude: MCoordinates[0],
                                longitude: MCoordinates[1],
                            }}
                            title={monument}
                            description={description}
                        />
                    )
                    // :(
                    //     <Text style={styles.description}>
                    //         Coordinates not found for the monument.
                    //     </Text>
                    // )
                
                }
                    {selfCoordinates.length > 0 && (
                        <Marker
                            coordinate={{
                                latitude: selfCoordinates[0],
                                longitude: selfCoordinates[1],
                            }}
                            title="You are here"
                        />
                    )}
                </MapView>

            ) : (
                <Text style={styles.description}>
                    Loading map...
                </Text>)
            } */}


            {isSidebarOpen && (
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <View style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,backgroundColor: 'rgba(0,0,0,0.5)',justifyContent: 'flex-end',zIndex: 10}}>
                        <TouchableWithoutFeedback>
                            <View
                                ref={sidebarRef}
                                style={{
                                    backgroundColor: '#fff',width: '70%',
                                    height: '100%',
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    padding: 20,
                                }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Lists</Text>
                                {(
                                    myLists.map((list, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={{ marginBottom: 10, padding: 10, backgroundColor: '#eee', borderRadius: 8 }}
                                            onPress={() => updateList(list.name, monument)}
                                        >
                                            <Text>{list.name || `List ${idx + 1}`}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#000',
                                        padding: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}
                                    onPress={() => {modalVisible ? setModalVisible(false) : setModalVisible(true)}}>
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={modalVisible}
                                        onRequestClose={() => setModalVisible(false)}
                                    >
                                        <View style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <View style={{
                                                backgroundColor: '#fff',
                                                padding: 30,
                                                borderRadius: 12,
                                                alignItems: 'center',
                                                width: 250
                                            }}>
                                                <Text style={{ fontSize: 18, marginBottom: 20 }}>Create a new list?</Text>
                                                    <View>
                                                            <TextInput
                                                                placeholder="List Name"
                                                                value={listName}
                                                                onChangeText={setListName}
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: '#ccc',
                                                                    borderRadius: 8,
                                                                    padding: 10,
                                                                    marginBottom: 10,
                                                                    width: 150,
                                                                }}
                                                            />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                        
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: '#000',paddingVertical: 10,paddingHorizontal: 20, borderRadius: 8,marginRight: 10,}}
                                                        onPress={() => {                                                                
                                                            createList();
                                                        }}>
                                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
                                                    </TouchableOpacity>


                                                    <TouchableOpacity style={{backgroundColor: '#ccc', paddingVertical: 10,paddingHorizontal: 20,borderRadius: 8,}}
                                                        onPress={() => setModalVisible(false)}>
                                                        <Text style={{ color: '#333', fontWeight: 'bold' }}>Cancel</Text>
                                                    </TouchableOpacity>


                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create New List</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    main: {
        height: screenHeight * 0.35,
        marginBottom: 16,
        borderBottomLeftRadius: screenHeight * 0.10,
        overflow: 'hidden',
    },

    title: {
        marginVertical: '5%',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'CrimsonText_400Regular',
    },

    mainImg: {
        height: '100%',
        justifyContent: 'flex-start',
    },

    backButtonOverlay: {
        position: 'absolute',
        marginTop: '4%',
        left: '4%',
    },

    description: {
        textAlign: 'justify',
        margin: "7%",
        fontFamily: 'OpenSans_600SemiBold',
        fontSize: 18,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});