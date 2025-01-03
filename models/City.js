const connection = require("../database/db");

module.exports = class City {
    // Şehir Listesi
    static getall() {
        return connection.execute(`
            SELECT 
                city.id as city_id,
                city.name as city_name
            FROM city
        `);
    }

    // Şehir Bazında Konser Sayısı
    static number_of_concert_by_city() {
        return connection.execute(`
            SELECT 
                city.id as city_id,
                city.name as city_name,
                COUNT(concert.id) as number
            FROM concert
            INNER JOIN city ON concert.city_id = city.id
            GROUP BY city.id
        `);
    }
};
