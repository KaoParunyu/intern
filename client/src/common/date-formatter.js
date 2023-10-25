import moment from "moment-timezone";

const formatDateThaiStyle = (dateString) => {
  return moment(dateString).tz("Asia/Bangkok").format("DD/MM/YYYY - HH:mm");
};

export { formatDateThaiStyle };
