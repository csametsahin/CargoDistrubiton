const electron = require('electron');
const url = require('url');
const path = require('path');
const  initialize =require('firebase/app');
const getFire  = require('firebase/firestore');







const {app ,BrowserWindow,Menu ,ipcMain}=electron;

const {  initializeApp} = initialize;
const { getFirestore , collection, addDoc ,doc,getDocs,onSnapshot,updateDoc}  = getFire;


const firebaseApp = initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'demomap-329008.firebaseapp.com',
  projectId: 'demomap-329008'
});

const db = getFirestore();


let mainWindow;
var username;
var password;
var register; 

app.on('ready',() => {
        mainWindow= new BrowserWindow({
          height:1300,
          width:1000,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
        }
        });

        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname,"login.html"),
            protocol: "file",
            slashes:true
          })
        );

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

        Menu.setApplicationMenu(mainMenu);
          console.log("Hi");
     
        ipcMain.on("key:usernamepass" ,(err,...args)=>{
         checkFirebaseData(args[0],args[1]);
        
      });
       
          ipcMain.on("key:regUsernamePass" ,(err,...args)=>{
           addFireBaseUser(args[0],args[1]);
             });
        
       ipcMain.on("key:kargolocation",(err,...args)=>{
            addFireBaseLocation(args[0],args[1]);
       })
       
       ipcMain.on("newpass",(err,...args)=>{
          writeUserData(args[0],args[1],args[2]);
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


const addFireBaseUser = function (username,password){

  try {
    const docRef =addDoc(collection(db, "users"), {
      name : username,
      password: password
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

 const checkFirebaseData =  async function(username,password){
     try {
    
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  if(doc.data().name == username && doc.data().password == password){
    console.log("basarili");
    newWindow();

  }
});
        
     }
     catch(e){
       console.log(e);
     }

   
 
}


function newWindow(){
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname,"main.html"),
      protocol: "file",
      slashes:true
    })
  );

}

const addFireBaseLocation = function (lt,lg){

  try {
    const docRef =addDoc(collection(db, "kargo_location"), {
      location: {lat: lt,long: lg},
      durum :0
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const writeUserData= async function (name,oldpass,newpass) {
  try {
    
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if(doc.data().name == name && doc.data().password == oldpass){
        writeUserCont(doc.id,newpass);
     
    
      }
    });
            
         }
         catch(e){
           console.log(e);
         }

}

const writeUserCont = async function(id,newpass){
  const adminRef = doc(db, "users", id);
         updateDoc(adminRef, {
          password:newpass
        });
}
