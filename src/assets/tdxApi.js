import axios from "axios";
import jsSHA from "jssha";

const getAuthorizationHeader = () => {
  //  填入自己 ID、KEY 開始
  let AppID = "f21d51204cac406c9ee417347141f481";
  let AppKey = "RVpawfOTBeSxETHBVd0KTNIdK2I";

  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64");
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
};

export default (url) => {
  return axios.get(url, {
    headers: getAuthorizationHeader(),
  });
};
