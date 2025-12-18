const crypto = require("crypto");
const axios = require("axios");
const https = require("https");

class MoMoUtils {
  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE;
    this.accessKey = process.env.MOMO_ACCESS_KEY;
    this.secretKey = process.env.MOMO_SECRET_KEY;
    this.endpoint = process.env.MOMO_ENDPOINT;
    this.redirectUrl = process.env.MOMO_REDIRECT_URL;
    this.ipnUrl = process.env.MOMO_IPN_URL;
  }

  createSignature(rawSignature) {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(rawSignature)
      .digest("hex");
  }

  async createPayment(orderData) {
    const { orderId, amount, orderInfo } = orderData;

    const requestId = `${orderId}_${Date.now()}`;
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "vi",
    };

    console.log("=== MOMO CREATE PAYMENT ===");
    console.log("Request:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await axios.post(this.endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });

      console.log("=== MOMO RESPONSE ===");
      console.log(response.data);

      if (response.data.resultCode === 0) {
        return {
          success: true,
          payUrl: response.data.payUrl,
          qrCodeUrl: response.data.qrCodeUrl,
          deeplink: response.data.deeplink,
        };
      } else {
        throw new Error(
          response.data.message || "MoMo payment creation failed"
        );
      }
    } catch (error) {
      console.error("=== MOMO ERROR ===");
      console.error(error.response?.data || error.message);
      throw error;
    }
  }

  verifySignature(data) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = data;

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const calculatedSignature = this.createSignature(rawSignature);

    console.log("=== VERIFY SIGNATURE ===");
    console.log("Received:", signature);
    console.log("Calculated:", calculatedSignature);
    console.log("Match:", calculatedSignature === signature);

    return calculatedSignature === signature;
  }

  async processRefund(booking, refundAmount) {
    try {
      if (!booking.momoTransId) {
        throw new Error("Không tìm thấy thông tin giao dịch MoMo");
      }

      const orderId = booking._id.toString();
      const requestId = `REFUND_${orderId}_${Date.now()}`;
      const description = `Hoàn tiền đặt tour - Booking ID: ${orderId}`;

      const rawSignature = `accessKey=${this.accessKey}&amount=${refundAmount}&description=${description}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${requestId}&transId=${booking.momoTransId}`;

      const signature = this.createSignature(rawSignature);

      const requestBody = {
        partnerCode: this.partnerCode,
        accessKey: this.accessKey,
        requestId: requestId,
        amount: refundAmount,
        orderId: orderId,
        transId: booking.momoTransId,
        description: description,
        signature: signature,
        lang: "vi",
      };

      console.log("=== MOMO REFUND REQUEST ===");
      console.log(JSON.stringify(requestBody, null, 2));

      const refundEndpoint =
        process.env.MOMO_REFUND_ENDPOINT ||
        "https://test-payment.momo.vn/v2/gateway/api/refund";

      const response = await axios.post(refundEndpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 30000,
      });

      console.log("=== MOMO REFUND RESPONSE ===");
      console.log(response.data);

      if (response.data.resultCode === 0) {
        return {
          success: true,
          transId: response.data.transId,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Hoàn tiền thất bại",
          resultCode: response.data.resultCode,
        };
      }
    } catch (error) {
      console.error("=== MOMO REFUND ERROR ===");
      console.error(error.response?.data || error.message);
      return {
        success: false,
        error: error.message || "Lỗi kết nối với MoMo",
      };
    }
  }
}

module.exports = new MoMoUtils();
