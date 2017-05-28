/**
 * サービスのUUIDです。
 * @type {string}
 */
//const SERVICE_UUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455";
const SERVICE_UUID = "49535343-8841-43F4-A8D4-ECBE34729BB3";

/**
 * キャラクタリスティックのUUIDです。
 * @type {string}
 */
const CHARACTERISTIC_UUID = "49535343-8841-43F4-A8D4-ECBE34729BB3";

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
  connectButton.addEventListener("click", connectBLE);

  loading = document.querySelector("#loading");
}

/**
 * Web Bluetooth APIでBLEデバイスに接続します。
 */
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

      // LEDを切り替えるボタンを表示
      showLEDButton();

      // loading非表示
      loading.className = "hide";
    })
    .catch(error => {
      console.log("Error : " + error);

      // loading非表示
      loading.className = "hide";
    });
}

window.addEventListener("load", init);