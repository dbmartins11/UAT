import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { fetchMonuments } from '../../api/serpApi.js';
import { fetchMonumentsWiki } from '../../api/apiWikipedia.js';
import { fetchImagesUnsplash } from '../../api/apiUnsplash.js';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/backButton.js';

import { db } from '../../firebase/firebaseConf';
import { doc, getDoc, getDocs, setDoc, collection, updateDoc, arrayUnion} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback, Modal, TextInput } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry.js';

import { useTheme } from '../../components/ThemeContext';

export default function City() {
    const { darkMode } = useTheme();

    const navigation = useNavigation();
    const route = useRoute();
    const { city, urls, country, prevUrls } = route.params;

    const [url, setUrl] = useState(urls || []);
    const [images, setImages] = useState([]);
    const [getNames, setGetNames] = useState(false);
    const [imagesReady, setImagesReady] = useState(false);
    const [monuments, setMonuments] = useState([]);
    const [monumentsImg, setMonumentsImg] = useState([]);
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
        CrimsonText_400Regular,
    });


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

    const getLists = async () => {
        console.log("Get Lists from" + userID);
        if (!userID) return;
        try {
            console.log("Lists fetching");
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

    useFocusEffect(
        useCallback(() => {
            setImagesReady(false);
            setGetNames(false);
            setMonumentsImg([]);
            setMonuments([]);
            setImages([]);
            setUrl(urls || []);

            const getCountryImages = () => {
                const indImgs = [];
                while (indImgs.length < 4) {
                    const randomIndex = Math.floor(Math.random() * url.length);
                    if (!indImgs.includes(randomIndex)) {
                        indImgs.push(randomIndex);
                    }
                }
                setImages(indImgs);
            };

            const fetchData = async (city) => {
                let dataNames = [];
                try {
                    dataNames = await fetchMonuments(`${city}`);
                    setMonuments(dataNames);
                    setGetNames(true);
                } catch (error) {
                    console.error('Error fetching the cities\' names:', error);
                }
                try {
                    const urls = await Promise.all(
                        dataNames.map(async (monument) => {
                            const data = await fetchImagesUnsplash(monument);
                            return data;
                        })
                    );
                    setMonumentsImg(urls);
                } catch (error) {
                    console.error('Error fetching the images:', error);
                }
            }

            const getUserID = async () => {
                const id = await AsyncStorage.getItem('userID');
                setUserID(id || 'Unnamed');
                console.log("User ID: ", userID);
            };

            const fetchCityImages = async (city) => {
                try {
                    const data = await fetchImagesUnsplash(city);
                    setUrl(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            if (urls === undefined) {
                fetchCityImages(city);
            }

            getUserID();
            getLists();
            fetchData(city);
            getCountryImages();



        }, [city, urls])
    );


    useEffect(() => {
        const preloadImages = async (urls) => {
            const cacheImages = urls.map((url) => Image.prefetch(url));
            await Promise.all(cacheImages);
        }

        const LoadImages = async () => {
            await preloadImages(url);
            //await preloadImages(citiesUrls);
            setImagesReady(true);
        }

        if (getNames) {
            LoadImages();
        }

    }, [getNames]);


    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const onPress = () => {
        navigation.navigate('country', {
            country: country,
            //urls: prevUrls
        });
    }



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

    const updateList = async (listName, city) => {
        try {
            const userListsRef = collection(db, 'users', userID, 'lists');
            const listDoc = doc(userListsRef, listName);
            const docSnap = await getDoc(listDoc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.countries[country]) {
                    // Country exists, add new city
                    await updateDoc(listDoc, {
                        [`countries.${country}.cities.${city}`]: {
                            visited: false,
                        }
                    });
                } else {
                    // Country doesn't exist, create it
                    await updateDoc(listDoc, {
                        [`countries.${country}`]: {
                            visited: false,
                            cities: {
                                [city]: {
                                    visited: false,
                                }
                            }
                        }
                    });
                }
            }
            console.log("City added to list:", listName);
            getLists();
        } catch (error) {
            console.error('Error updating list:', error);
            Alert.alert('Error updating list', error.message);
        }
    };

    return (
        <View style={{ 
            flex: 1, 
            padding: 10, 
            backgroundColor: darkMode ? '#000' : '#fff' 
            }}>

            {imagesReady ? (
                <View>
                    <BackButton
                        onPress={onPress}
                    > </BackButton>
                    <View style={styles.imgBlock}>
                        {url[images[0]] && (
                            <Image
                                source={{ uri: url[images[0]] }}
                                style={styles.firstImg}
                            />
                        )}

                        <View style={styles.imgBlock_1}>
                            {url[images[1]] && (
                                <Image
                                    source={{ uri: url[images[1]] }}
                                    style={styles.secondImg}
                                />
                            )}

                            <View style={styles.imgBlock_2}>
                                {url[images[2]] && (
                                    <Image
                                        source={{ uri: url[images[2]] }}
                                        style={styles.thirdImg}
                                    />
                                )}
                                {url[images[3]] && (
                                    <Image
                                        source={{ uri: url[images[3]] }}
                                        style={styles.thirdImg}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        {city ?
                            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>{city}</Text>
                            :
                            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Undefined</Text>
                        }
                        <TouchableOpacity
                            style={{ marginLeft: 20, borderRadius: 25, color: darkMode ? '#fff' : '#000', backgroundColor: darkMode ? '#fff' : '#fff', padding: 10 }}
                            onPress={toggleSidebar}>
                            <Image
                                source={require('./../../assets/icons/save.png')}
                                style={{ width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal={false}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {monumentsImg.length > 0 ? (
                            monuments.map((monument, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.monuments}
                                    onPress={() => navigation.navigate('monument', {
                                        monument: monument,
                                        city: city,
                                        country: country,
                                        url: monumentsImg[index],
                                        country: country,
                                        prevUrls: urls,
                                    })}
                                >
                                    <View style={{ width: '30%', justifyContent: 'center' }}>
                                        <Text style={{
                                            fontFamily: 'OpenSans_400Regular',
                                            fontSize: 17,
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            color: darkMode ? '#fff' : '#000'
                                        }}>
                                            {monument}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '70%', marginHorizontal: 'auto' }}>
                                        <Image
                                            source={{ uri: monumentsImg[index][0] }}
                                            style={styles.cityImg}>
                                        </Image>
                                        <Image
                                            source={{ uri: monumentsImg[index][1] }}
                                            style={styles.cityImg}>
                                        </Image>
                                        <Image
                                            source={{ uri: monumentsImg[index][2] }}
                                            style={styles.cityImg}>
                                        </Image>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>No Monuments Found</Text>
                        )}
                    </ScrollView>
                </View>
            ) :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: darkMode ? '#fff' : '#fff', fontSize: 20, fontFamily: 'OpenSans_400Regular' }}>
                        Loading
                    </Text>
                    <ActivityIndicator
                        size="large"
                        color="#A0B5DB"
                    />
                </View>
            }


            {isSidebarOpen && (
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 10 }}>
                        <TouchableWithoutFeedback>
                            <View
                                ref={sidebarRef}
                                style={{
                                    backgroundColor: darkMode ? '#333' : '#000',
                                    width: '70%',
                                    height: '100%',
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    padding: 20,
                                }}>
                                <Text style={{color: darkMode ? '#fff' : '#000', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Lists</Text>
                                {(
                                    myLists.map((list, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={{ marginBottom: 10, padding: 10, backgroundColor: '#eee', borderRadius: 8 }}
                                            onPress={() => updateList(list.name, city)}
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
                                    onPress={() => { modalVisible ? setModalVisible(false) : setModalVisible(true) }}>
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
                                                backgroundColor: darkMode ? '#333' : '#000',
                                                padding: 30,
                                                borderRadius: 12,
                                                alignItems: 'center',
                                                width: 250
                                            }}>
                                                <Text style={{color: darkMode ? '#fff' : '#fff', fontSize: 18, marginBottom: 20 }}>Create a new list?</Text>
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
                                                        style={{ backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginRight: 10, }}
                                                        onPress={() => {
                                                            createList();
                                                        }}>
                                                        <Text style={{ color: darkMode ? '#fff' : '#fff', fontWeight: 'bold' }}>Create</Text>
                                                    </TouchableOpacity>


                                                    <TouchableOpacity style={{ backgroundColor: '#ccc', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, }}
                                                        onPress={() => setModalVisible(false)}>
                                                        <Text style={{ color: darkMode ? '#fff' : '#fff', fontWeight: 'bold' }}>Cancel</Text>
                                                    </TouchableOpacity>


                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Text style={{ color: darkMode ? '#fff' : '#fff', fontWeight: 'bold' }}>Create New List</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>


    );
}

const styles = StyleSheet.create({
    title: {
        marginVertical: '5%',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'CrimsonText_400Regular',
    },
    imgBlock: {
        width: '100%',
        height: '30%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2%'
    },
    imgBlock_1: {
        width: '48%',
        //height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2%'
    },
    imgBlock_2: {
        width: '98%',
        height: '48%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2%'
    },
    firstImg: {
        width: '50%',
        height: '100%',
        borderRadius: 5,
        resizeMode: 'cover',
    },
    secondImg: {
        width: '100%',
        height: '50%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    thirdImg: {
        width: '50%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    monuments: {
        width: '100%',
        height: 120,
        padding: '2%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#A0B5DB',
    },

    cityImg: {
        width: '30%',
        height: '100%',
        borderRadius: 10,
        marginRight: '5%',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: '80%',
    },

});