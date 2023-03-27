import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useState, useRef } from 'react'
import RNFetchBlob from 'rn-fetch-blob'

const App = () => {
  const [pastedURL, setPastedURL] = useState('')
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
          'Downloader App needs access to your storage ' + 'so you can download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile();
      } else {
        console.log('storage permission denied');
      } 
    } catch (err) {
        console.warn(err);
    }
  };

  const downloadFile = () => {
    const {config, fs} = RNFetchBlob;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir;
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:fileDir+ "/download_" + Math.floor(date.getDate()+date.getSeconds() / 2)+".mp4",
        description: 'file download'
      }
    })
    .fetch('GET', pastedURL, {

    })
    .then(res=> {
      console.log('The file saved to ', res.path());
      alert("File downloaded successfully");
    });
  }

  const ref = useRef(null);
  return (
    <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
      <TextInput 
      placeholder='paste file url' 
      style={{width:'90%',height:50,borderWidth:0.5,alignSelf:'center',paddingLeft:20,borderRadius:20,}} 
      value={pastedURL} 
      onChangeText={text=> setPastedURL(text)}
      ref={ref}/>
      <View style={{ 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,}}>

      <TouchableOpacity 
      style={{
        width:'30%', height:50, borderWidth:0.5, alignSelf: 'center', backgroundColor:'purple', borderRadius: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center'
      }}
      onPress={()=>{
        if(pastedURL!==''){
          requestStoragePermission();
        } else {
          alert('Please enter a valid URL')
        }
      }}>
        <Text style={{color:'#fff'}}>Download File</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={{
        width:'30%', height:50, borderWidth:0.5, alignSelf: 'center', backgroundColor:'brown', borderRadius: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center'
      }}
      onPress={()=>{
        ref.current.clear()
      }}>
        <Text style={{color:'#fff'}}>Clear Input</Text>
      </TouchableOpacity>
        </View>
    </View>
  )
}

export default App