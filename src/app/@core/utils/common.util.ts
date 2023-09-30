import { Timestamp } from 'firebase/firestore';

export class CommonUtil {
  static COMMON_ERROR_MESSAGE = 'Có lỗi xảy ra, vui lòng thử lại sau!';

  static dateTimeToTimestamp(date: Date, time: Date | null) {
    const paymentAtEpoch = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time?.getHours() ?? 0,
      time?.getMinutes() ?? 0,
      time?.getSeconds() ?? 0
    ).getTime();

    return new Timestamp(paymentAtEpoch / 1000, 0);
  }

  static getMinDate() {
    return new Date(1, 1, 1, 0, 0, 0);
  }

  static getMinTimestamp() {
    return Timestamp.fromDate(this.getMinDate());
  }

  static getMaxDate() {
    return new Date(9999, 12, 31, 23, 59, 59);
  }

  static getMaxTimestamp() {
    return Timestamp.fromDate(this.getMaxDate());
  }
}
