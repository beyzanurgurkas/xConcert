const connection = require("../database/db");

module.exports = class Singer {
    // Şarkıcılar
    static getall() {
        return connection.execute(`
            SELECT 
                singer.id as singer_id,
                singer.nickname as singer_nickname,
                gender.id as gender_id,
                gender.name as gender_name,
                genre.id as genre_id,
                genre.name as genre_name
            FROM singer
            LEFT JOIN gender ON singer.gender_id = gender.id
            LEFT JOIN genre ON singer.genre_id = genre.id
            ORDER BY singer.nickname ASC
        `);
    }

    // Şarkıcılara Göre Konser Sayıları
    static number_of_concert_by_singer() {
        return connection.execute(`
            SELECT 
                singer.id as singer_id,
                singer.nickname as singer_nickname,
                COUNT(concert.id) as number
            FROM singer
            LEFT JOIN concert ON singer.id = concert.singer_id
            GROUP BY singer.id
        `);
    }
};
