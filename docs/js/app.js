/**
 * サービスのUUIDです。
 * @type {string}
 */
//const SERVICE_UUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455";
const SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";

/**
 * キャラクタリスティックのUUIDです。
 * @type {string}
 */
//const CHARACTERISTIC_UUID = "49535343-8841-43F4-A8D4-ECBE34729BB3";
const CHARACTERISTIC_UUID = "49535343-8841-43f4-a8d4-ecbe34729bb3";

/**
 * BLE接続で取得したキャラクタリスティックです。
 */
let printerCharacteristic;

/**
 * BLEに接続するボタンです。
 */
let connectButton;

/**
 * ローディングボタンです。
 */
let loading;

/**
 * 初期化処理です。
 */
function init() {
  connectButton = document.querySelector("#ble-connect-button");
  connectButton.addEventListener("click", connectBLE2);

  loading = document.querySelector("#loading");
}

/**
 * Web Bluetooth APIでBLEデバイスに接続します。
 */
function connectBLE2() {
  console.log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]})
  .then(device => {
    console.log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service...');
    return server.getPrimaryService(SERVICE_UUID);
  })
  .then(service => {
    console.log('Getting Characteristic...');
    return service.getCharacteristic(CHARACTERISTIC_UUID);
  })
  .then(characteristic => {
    console.log('Getting Descriptor...');
    return characteristic.getDescriptor('gatt.characteristic_user_description');
  })
  /*
  .then(descriptor => {
    document.querySelector('#writeButton').disabled =
        !descriptor.characteristic.properties.write;
    myDescriptor = descriptor;
    log('Reading Descriptor...');
    return descriptor.readValue();
  })
  .then(value => {
    let decoder = new TextDecoder('utf-8');
    log('> Characteristic User Description: ' + decoder.decode(value));
  })
  */
  .catch(error => {
    document.querySelector('#writeButton').disabled = true;
    log('Argh! ' + error);
  });
}

function connectBLE() {
  // loading表示
  loading.className = "show";

  navigator.bluetooth.requestDevice({
    filters: [
      {
        services: [
          SERVICE_UUID
        ]
      }
    ]
  })
    .then(device => {
      console.log("デバイスを選択しました。接続します。");
      console.log("デバイス名 : " + device.name);
      console.log("ID : " + device.id);

      // 選択したデバイスに接続
      return device.gatt.connect();
    })
    .then(server => {
      console.log("デバイスへの接続に成功しました。サービスを取得します。");

      // UUIDに合致するサービス(機能)を取得
      return server.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
      console.log("サービスの取得に成功しました。キャラクタリスティックを取得します。");

      // UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得
      return service.getCharacteristic(CHARACTERISTIC_UUID);
    })
    .then(characteristic => {
      console.log("キャラクタリスティックの取得に成功しました。");

      printerCharacteristic = characteristic;

      console.log("BLE接続が完了しました。");

      // loading非表示
      loading.className = "hide";
      // TRANSTER button表示
      //send-button.className = "show";
    })
    .catch(error => {
      console.log("Error : " + error);

      // loading非表示
      loading.className = "hide";
    });
}

function transferData() {
    printerCharacteristic.writeValue(new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x0a]));
}

window.addEventListener("load", init);