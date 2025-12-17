/**
 * Tính toán số tiền hoàn lại dựa trên chính sách hủy tour
 * @param {Object} booking - Booking object
 * @returns {Object} - { refundAmount, refundPercentage, daysDiff }
 */
exports.calculateRefundAmount = (booking) => {
  const timeDiff = booking.startDate - Date.now();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  let refundPercentage = 0;

  // Chính sách hoàn tiền theo số ngày trước khi tour bắt đầu
  if (daysDiff >= 30) {
    refundPercentage = 100; // Hoàn 100%
  } else if (daysDiff >= 15) {
    refundPercentage = 75; // Hoàn 75%
  } else if (daysDiff >= 7) {
    refundPercentage = 50; // Hoàn 50%
  } else if (daysDiff >= 3) {
    refundPercentage = 25; // Hoàn 25%
  } else {
    refundPercentage = 0; // Không hoàn tiền
  }

  return {
    refundAmount: Math.round((booking.price * refundPercentage) / 100),
    refundPercentage,
    daysDiff: Math.floor(daysDiff),
  };
};
