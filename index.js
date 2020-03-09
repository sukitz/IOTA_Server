const Mam = require("@iota/mam");
const Converter = require("@iota/converter")
const Microgear = require("microgear")

const APPID = "IOTADHT11";
  const KEY = "tUyxQy8A3852y2s";
  const SECRET = "GcHYWDtJh5kBlzjVdhUZNlAxy";

  const ALIAS = "HTML_web";         //  ชื่อตัวเอง
  const thing1 = "NodeMCU1";          //  ชื่อเพื่อนที่จะคุย

  var microgear = Microgear.create({
    key: KEY,
    secret: SECRET,
    alias : ALIAS
  });

  microgear.on('message',function(topic,msg) {
    console.log('messagemessage>>>>',msg.toString())
    var msg = msg.toString()
    var split_msg = msg.split("/"); //String data = "/" +String(Humidity) + "/" + String(Temp);
    console.log("<<< messagemessagemessage>>>",msg);  // for debug
    if(typeof(split_msg[0])!='undefined' && split_msg[0]==""){
    var data =  {"humidity" : split_msg[1],"temperature": split_msg[2]}
    var dataString = data.toString()
    publish(data);
    }
  });

  microgear.on('connected', function() {
    microgear.setAlias(ALIAS);
  });

  microgear.on('present', function(event) {
    console.log("<<< presentpresentpresent>>>",event);
  });

  microgear.on('absent', function(event) {
    console.log("<<<< absentabsentabsent>>>",event);
  });

  microgear.resettoken(function(err) {
    microgear.connect(APPID);
  });


  let state = Mam.init('https://nodes.devnet.iota.org:443');
  console.log("<<<statestate***>>",state);
  
const publish = async function (packet) {
    console.log('publishpublish>>>>',packet)
    const trytes = Converter.asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(state, trytes);
    state = message.state;
    console.log("<<<<publish = async function (packet>>>>",state);

    await Mam.attach(message.payload, message.address);
    console.log("Mam.attachMam.attachMam.attach>>",message);
    return message.root;
};