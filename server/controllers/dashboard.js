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
      table: {
        serviceRequestsByType: {
          headers: [],
          dataRows: [],
        },
        serviceRequestsByDepartment: {
          headers: [],
          dataRows: [],
        },
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
      data.table.serviceRequestsByType.headers.push(repairTypeRow.name);
      const lowerCaseRepairTypeRowName = repairTypeRow.name.toLowerCase();
      data.graph.datas[lowerCaseRepairTypeRowName] = [];
      data.total[lowerCaseRepairTypeRowName] = repairNotificationsRows.filter(
        (item) => item.repair_type_id === repairTypeRow.id
      ).length;
    });

    for (let i = 0; i < months.length; i++) {
      const month = i + 1;
      const dataRow = [month];
      let grandTotal = 0;
      repairTypeRows.forEach((repairTypeRow) => {
        const lowerRepairTypeRowName = repairTypeRow.name.toLowerCase();
        const filteredRows = repairNotificationsRows.filter(
          (item) =>
            new Date(item.created_at).getMonth() === i &&
            item.repair_type_id === repairTypeRow.id
        );
        const repairCount = filteredRows.length;
        grandTotal += repairCount;
        dataRow.push(repairCount);
        data.graph.datas[lowerRepairTypeRowName].push(repairCount);
      });
      dataRow.push(grandTotal);
      data.table.serviceRequestsByType.dataRows.push(dataRow);
    }
    const grandTotalRow = ["Grand Total"];
    let totalSum = 0;
    for (let i = 1; i <= repairTypeRows.length; i++) {
      let sum = 0;
      for (let j = 0; j < months.length; j++) {
        sum += data.table.serviceRequestsByType.dataRows[j][i];
      }
      totalSum += sum;
      grandTotalRow.push(sum);
    }
    grandTotalRow.push(totalSum);
    data.table.serviceRequestsByType.dataRows.push(grandTotalRow);

    const [departmentRows] = await connection
      .promise()
      .execute("SELECT * FROM departments");

    departmentRows.forEach((departmentRow) => {
      data.table.serviceRequestsByDepartment.headers.push(
        departmentRow.description
      );
      const lowerCaseDepartmentDescription =
        departmentRow.description.toLowerCase();
      data.graph2.datas[lowerCaseDepartmentDescription] = [];
    });

    for (let i = 0; i < months.length; i++) {
      const month = i + 1;
      const dataRow = [month];
      let grandTotal = 0;
      departmentRows.forEach((departmentRow) => {
        const lowerCaseDepartmentDescription =
          departmentRow.description.toLowerCase();
        const filteredRows = repairNotificationsRows.filter(
          (item) =>
            new Date(item.created_at).getMonth() === i &&
            item.departmentId === departmentRow.id
        );
        const repairCount = filteredRows.length;
        grandTotal += repairCount;
        dataRow.push(repairCount);
        data.graph2.datas[lowerCaseDepartmentDescription].push(
          repairNotificationsRows.filter((item) => {
            return (
              new Date(item.created_at).getMonth() === i &&
              item.departmentId === departmentRow.id
            );
          }).length
        );
      });
      dataRow.push(grandTotal);
      data.table.serviceRequestsByDepartment.dataRows.push(dataRow);
    }

    const grandTotalRow2 = ["Grand Total"];
    let totalSum2 = 0;
    for (let i = 1; i <= departmentRows.length; i++) {
      let sum = 0;
      for (let j = 0; j < months.length; j++) {
        sum += data.table.serviceRequestsByDepartment.dataRows[j][i];
      }
      totalSum2 += sum;
      grandTotalRow2.push(sum);
    }
    grandTotalRow2.push(totalSum2);
    data.table.serviceRequestsByDepartment.dataRows.push(grandTotalRow2);

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDashboard,
};
