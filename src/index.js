const electron = require('electron');
const url = require('url');
const path = require('path');





const {app ,BrowserWindow,Menu ,ipcMain}=electron;


let mainWindow;

app.on('ready',() => {
        mainWindow= new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
        }
        });

        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname,"index.html"),
            protocol: "file",
            slashes:true
          })
        );

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

        Menu.setApplicationMenu(mainMenu);
          console.log("Hi");
        ipcMain.on("test",(err,data) =>{
            console.log(data);
        })
        ipcMain.on("test:inputValue" ,(err,data)=>{
          console.log(data);
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