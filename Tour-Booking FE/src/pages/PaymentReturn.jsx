import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateMoMoPaymentStatus } from '../services/api';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const processPayment = async () => {
      // Get all MoMo callback parameters including signature
      const momoParams = {
        partnerCode: searchParams.get('partnerCode'),
        orderId: searchParams.get('orderId'),
        requestId: searchParams.get('requestId'),
        amount: searchParams.get('amount'),
        orderInfo: searchParams.get('orderInfo'),
        orderType: searchParams.get('orderType'),
        transId: searchParams.get('transId'),
        resultCode: searchParams.get('resultCode'),
        message: searchParams.get('message'),
        payType: searchParams.get('payType'),
        responseTime: searchParams.get('responseTime'),
        extraData: searchParams.get('extraData') || '',
        signature: searchParams.get('signature'),
      };

      if (!momoParams.orderId || !momoParams.resultCode) {
        setStatus('failed');
        return;
      }

      try {
        // Send all params to backend for signature verification
        await updateMoMoPaymentStatus(momoParams);

        if (momoParams.resultCode === '0') {
          setStatus('success');
          // Redirect to booking history after 3 seconds
          setTimeout(() => {
            navigate('/booking-history');
          }, 3000);
        } else {
          setStatus('failed');
          // Redirect to home after 5 seconds
          setTimeout(() => {
            navigate('/');
          }, 5000);
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        setStatus('failed');
      }
    };

    processPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Đặt tour của bạn đã được xác nhận
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển đến lịch sử đặt tour...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-600 mb-4">
              {searchParams.get('message') || 'Đã có lỗi xảy ra trong quá trình thanh toán'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
