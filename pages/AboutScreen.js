import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import {
  CameraView,
  useCameraPermissions
} from 'expo-camera';

export default function AboutScreen() {

  const [permission, requestPermission] =
    useCameraPermissions();

  const [isCameraOpen, setIsCameraOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [mahasiswa, setMahasiswa] =
    useState(null);

  const cameraRef = useRef(null);

  const NIM = "0320240072";

  const SERVER =
    "http://10.1.12.186:8080";

  const BASE_URL =
    `${SERVER}/api/mahasiswa`;

  useEffect(() => {

    fetchMahasiswa();

  }, []);

  const fetchMahasiswa = async () => {

    try {

      setIsLoading(true);

      const response =
        await fetch(
          `${BASE_URL}/${NIM}`
        );

      console.log(
        "GET STATUS =",
        response.status
      );

      if (!response.ok) {

        throw new Error(
          "GET gagal"
        );
      }

      const data =
        await response.json();

      console.log(
        "GET DATA =",
        data
      );

      setMahasiswa(data);

    } catch (err) {

      console.log(
        "GET ERROR =",
        err
      );

    } finally {

      setIsLoading(false);

    }

  };

  const takePicture = async () => {

    try {

      if (!cameraRef.current)
        return;

      const photo =
        await cameraRef.current
          .takePictureAsync({
            quality:0.5
          });

      console.log(
        "PHOTO =",
        photo
      );

      await uploadPhoto(
        photo.uri
      );

    } catch(err){

      console.log(
        "CAMERA ERROR =",
        err
      );

    }

  };

  const uploadPhoto = async (
    photoUri
  ) => {

    try {

      setIsLoading(true);

      const formData =
        new FormData();

      formData.append(
        'nim',
        NIM
      );

      formData.append(
        'nama',
        mahasiswa?.namaMhs ||
        "Nama Mahasiswa"
      );

      formData.append(
        'foto',
        {
          uri:photoUri,
          type:'image/jpeg',
          name:'profile.jpg'
        }
      );

      const response =
        await fetch(
          `${BASE_URL}/upload`,
          {
            method:'POST',
            body:formData
          }
        );

      console.log(
        "UPLOAD STATUS =",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "UPLOAD RESPONSE =",
        text
      );

      if(response.ok){

        Alert.alert(
          "Success",
          "Foto berhasil diupload"
        );

        await fetchMahasiswa();

      }else{

        Alert.alert(
          "Error",
          "Upload gagal"
        );

      }

    } catch(err){

      console.log(
        "UPLOAD ERROR =",
        err
      );

    } finally {

      setIsLoading(false);

      setIsCameraOpen(false);

    }

  };

  if(isLoading){

    return(

      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
        />

      </View>

    );

  }

  if(isCameraOpen){

    if(!permission){

      return(

        <View
          style={
            styles.container
          }
        >

          <Text>
            Loading permission...
          </Text>

        </View>

      );

    }

    if(!permission.granted){

      return(

        <View
          style={
            styles.container
          }
        >

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              requestPermission
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              Izinkan Kamera
            </Text>

          </TouchableOpacity>

        </View>

      );

    }

    return(

      <View style={{flex:1}}>

        <CameraView
          ref={cameraRef}
          facing="front"
          style={
            StyleSheet
            .absoluteFillObject
          }
        />

        <View
          style={
            styles.cameraButtons
          }
        >

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              takePicture
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              Ambil Foto
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>
              setIsCameraOpen(
                false
              )
            }
          >

            <Text
              style={
                styles.cancel
              }
            >
              Batal
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    );

  }

  return(

    <View style={styles.container}>

      <View
        style={
          styles.profileCard
        }
      >

        <Image
          style={
            styles.image
          }
          source={{
            uri:
            `${BASE_URL}/foto/${NIM}`
          }}
          onLoad={()=>
            console.log(
              "IMAGE LOADED"
            )
          }
          onError={(e)=>
            console.log(
              "IMAGE ERROR =",
              e.nativeEvent
            )
          }
        />

        <Text
          style={
            styles.name
          }
        >

          {
            mahasiswa?.namaMhs
            || "No Name"
          }

        </Text>

        <Text
          style={
            styles.nim
          }
        >

          {NIM}

        </Text>

        <TouchableOpacity
          style={
            styles.button
          }
          onPress={()=>
            setIsCameraOpen(
              true
            )
          }
        >

          <Text
            style={
              styles.buttonText
            }
          >
            Ambil Selfie
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

}

const styles =
StyleSheet.create({

loadingContainer:{
flex:1,
justifyContent:'center',
alignItems:'center'
},

container:{
flex:1,
justifyContent:'center',
alignItems:'center',
backgroundColor:'#f2f2f2'
},

profileCard:{
width:'85%',
backgroundColor:'white',
padding:30,
borderRadius:16,
alignItems:'center',
elevation:5
},

image:{
width:170,
height:170,
borderRadius:20,
backgroundColor:'#ddd'
},

name:{
fontSize:20,
marginTop:15
},

nim:{
fontSize:14,
color:'gray',
marginTop:5
},

button:{
marginTop:20,
backgroundColor:'#007bff',
padding:15,
borderRadius:10
},

buttonText:{
color:'white',
fontWeight:'bold'
},

cameraButtons:{
position:'absolute',
bottom:40,
width:'100%',
alignItems:'center'
},

cancel:{
marginTop:15,
fontSize:18,
color:'white'
}

});