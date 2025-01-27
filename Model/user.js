const { json } = require("express");
const db = require("../Database/db");
const becrypt = require("bcrypt");

function buildWhereClause(conditions) {
  if (!conditions || conditions.length === 0) {
    return "";
  }
  return `WHERE ${conditions.join(" AND ")}`;
}
async function fetchTableData(table, where) {
  const query = `SELECT * FROM ${table} ${buildWhereClause(where)}`;

  try {
    const [rows] = await db.promise().query(query);

    return rows.map((row) => {
      const processedRow = {};
      Object.keys(row).forEach((key) => {
        if (Buffer.isBuffer(row[key])) {
          processedRow[key] = row[key].toString("base64");
        } else {
          processedRow[key] = row[key];
        }
      });
      return processedRow;
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function insertData(table, data) {
  try {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map(() => "?")
      .join(", ");

    const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

    const res = await db.promise().query(query, Object.values(data));
    console.log("Data inserted successfully:", res);
    return res;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}
const validateLogin = async (table, email, password) => {
  try {
    const [user] = await db
      .promise()
      .query(`SELECT * FROM ${table} WHERE email='${email}'`);
    // console.log(await becrypt.compare(password, user[0].password));
    if (user && (await becrypt.compare(password, user[0].password))) {
      if (user[0].isDeleted == 1) {
        return { success: false, message: "user deleted" };
      } else if (user[0].isSuspended == 1) {
        return { success: false, message: "user suspended" };
      } else {
        return {
          success: true,
          data: { email: email },
          message: "user verified",
        };
      }
    } else {
      return { success: false, message: "unauthorized user" };
    }
  } catch (err) {
    console.error("", err);
  }
};

const updateTable = async (table, data, where) => {
  if (!table || !data) {
    return null;
  }
  try {
    console.log(data,"hello");
    const columns = Object.keys(data);

    const setClause = columns.map((col) => `${col} = '${data[col]}'`).join(", ");
    console.log(setClause);
    const whereKeys = Object.keys(where);
    const whereClause = whereKeys.map((key) => `${key} = '${where[key]}'`).join(" AND ");
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    console.log(query);
    const [result] = await db.promise().query(query);
    console.log(result);
    return result;
  } catch (err) {
    console.error("error", err);
  }
};
module.exports = { fetchTableData, insertData, validateLogin, updateTable };
