const db = require("../Database/db");

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
            processedRow[key] = row[key].toString('base64');
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
        const columns = Object.keys(data).join(', '); 
        const values = Object.values(data).map(() => '?').join(', '); 

        const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

        const res = await db.promise().query(query, Object.values(data));
        console.log('Data inserted successfully:', res);
        return res;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}

  

module.exports = { fetchTableData , insertData };
