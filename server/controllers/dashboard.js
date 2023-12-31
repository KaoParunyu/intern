const connection = require("../db");
const { months } = require("../constants/common");

const getDashboard = async (req, res) => {
  try {
    const data = {
      total: {},
      totalRepairNotifications: 0,
      totalPendingRepairNotifications: 0,
      totalInProgrssRepairNotifications: 0,
      totalCompletedRepairNotifications: 0,
      graph: {
        labels: months,
        datas: {},
      },
      graph2: {
        labels: months,
        datas: {},
      },
    };

    const [repairNotificationsRows] = await connection
      .promise()
      .execute(
        "SELECT * FROM repair_notifications LEFT JOIN users ON users.id = repair_notifications.user_id"
      );

    repairNotificationsRows.forEach((repairNotification) => {
      data.totalRepairNotifications += 1;
      switch (repairNotification.status_id) {
        case 1:
          data.totalPendingRepairNotifications += 1;
          break;
        case 2:
          data.totalInProgrssRepairNotifications += 1;
          break;
        case 3:
          data.totalCompletedRepairNotifications += 1;
          break;
        default:
          break;
      }
    });

    const [repairTypeRows] = await connection
      .promise()
      .execute("SELECT * FROM repair_types");

    repairTypeRows.forEach((repairTypeRow) => {
      const lowerCaseRepairTypeRowName = repairTypeRow.name.toLowerCase();
      data.graph.datas[lowerCaseRepairTypeRowName] = [];
      data.total[lowerCaseRepairTypeRowName] = repairNotificationsRows.filter(
        (item) => item.repair_type_id === repairTypeRow.id
      ).length;
    });

    for (let i = 0; i < months.length; i++) {
      repairTypeRows.forEach((repairTypeRow) => {
        const lowerRepairTypeRowName = repairTypeRow.name.toLowerCase();
        const filteredRows = repairNotificationsRows.filter(
          (item) =>
            new Date(item.created_at).getMonth() === i &&
            item.repair_type_id === repairTypeRow.id
        );
        const repairCount = filteredRows.length;
        data.graph.datas[lowerRepairTypeRowName].push(repairCount);
      });
    }

    const [departmentRows] = await connection
      .promise()
      .execute("SELECT * FROM departments");

    departmentRows.forEach((departmentRow) => {
      const lowerCaseDepartmentDescription =
        departmentRow.description.toLowerCase();
      data.graph2.datas[lowerCaseDepartmentDescription] = [];
    });

    for (let i = 0; i < months.length; i++) {
      departmentRows.forEach((departmentRow) => {
        const lowerCaseDepartmentDescription =
          departmentRow.description.toLowerCase();
        const filteredRows = repairNotificationsRows.filter(
          (item) =>
            new Date(item.created_at).getMonth() === i &&
            item.departmentId === departmentRow.id
        );
        const repairCount = filteredRows.length;
        data.graph2.datas[lowerCaseDepartmentDescription].push(repairCount);
      });
    }

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDashboard,
};
