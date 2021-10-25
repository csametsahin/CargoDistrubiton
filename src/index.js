const electron = require('electron');
const url = require('url');
const path = require('path');
const  initialize =require('firebase/app');
const getFire  = require('firebase/firestore');




//MAPS YOL BULMADA SIRA

const {app ,BrowserWindow,Menu ,ipcMain}=electron;

const {  initializeApp} = initialize;
const { getFirestore , collection, addDoc ,getDocs}  = getFire;


const firebaseApp = initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'demomap-329008.firebaseapp.com',
  projectId: 'demomap-329008'
});

const db = getFirestore();

var markers = [];
var lat=[];
var lng=[];
var durum=[];


let mainWindow;
let addWindow;
app.on('ready',() => {
        mainWindow= new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false ,
            enableRemoteModule: true
        }
        });

        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname,"index.html"),
            protocol: "file",
            slashes:true
          })
        );
        getFirebaseLocation();
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

        Menu.setApplicationMenu(mainMenu);
          console.log("Hi");
        ipcMain.on("test",(err,data) =>{
            console.log(data);
        })
        ipcMain.on("test:inputValue" ,(err,data)=>{
          console.log(data);
        })

        ipcMain.on("key:latlng",(err,...args)=>{
         addFirebaseClickedLatLng(args[0],args[1]);
        })

       
  

      
});

const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu : [
      {
        label : "Maps Sıfırla"
      },
      {
        label : "Çıkış",
        accelaretor:process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        role:"quit"
      }
    ]
  }
]

if(process.env.NOD_ENV !=="production"){
  mainMenuTemplate.push(  {
    label : "Dev Tools",
    submenu: [
      {
        label : " Geliştirici Menüsünü Aç ",
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        label : "Yenile",
        role : "reload"
      }
    ]
  });
}
/*
function createWindow(){
  addWindow = new BrowserWindow({
    width=482,
    height=200,
    title = "Yeni Pencere"
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname,"login.html"),
      protocol: "file",
      slashes:true
    })
  );
}*/

function addFirebaseClickedLatLng(lat,lng){
  try {
    const docRef =addDoc(collection(db, "kargo_location"), {
      location: {lat: lat,long: lng},
      durum :0
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const getFirebaseLocation =async function (){
  try {
    
    const querySnapshot = await getDocs(collection(db, "kargo_location"));
    querySnapshot.forEach((doc) => {
      if(doc.data().durum == 0){
        markers.push({coords:doc.data().location , durum : doc.data().durum});
    
      }
    });
            
         }
         catch(e){
           console.log(e);
         }
         finally{
           mainWindow.webContents.on('did-finish-load',()=>{
            mainWindow.webContents.send("key:markers",markers);
           })
         }
}

