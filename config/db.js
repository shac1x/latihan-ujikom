import mysql from "mysql2/promise"

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aplikasi_faktur_penjualan"
})

console.log("Koneksi database pool siap dipake bosku!")

export default db