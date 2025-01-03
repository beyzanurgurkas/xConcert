const connection = require("../database/db");

module.exports = class Count {
    // Toplam Hasılat
    static revenue() {
        return connection.execute(`
            SELECT
                SUM(concert.price * concert.sold_ticket) as number
            FROM concert
        `);
    }

    // Toplam Satılan Bilet Sayısı
    static tickets() {
        return connection.execute(`
            SELECT
            	SUM(concert.sold_ticket) as number
            FROM concert
        `);
    }

    // Toplam Sanatçı Sayısı
    static singers() {
        return connection.execute(`
            SELECT
            	COUNT(singer.id) as number
            FROM singer    
        `);
    }

    // Toplam Konser Sayısı
    static concerts() {
        return connection.execute(`
            SELECT
            	COUNT(concert.id) as number
            FROM concert 
        `);
    }
};
