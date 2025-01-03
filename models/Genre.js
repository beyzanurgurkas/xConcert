const connection = require("../database/db");

module.exports = class Genre {
    // Türler Listesi
    static getall() {
        return connection.execute(`
            SELECT 
                genre.id as genre_id,
                genre.name as genre_name
            FROM genre
        `);
    }

    // Tür Bilgisine Göre Sanatçılar Listesi
    static getById_singer(genre_id) {
        return connection.execute(`
            SELECT 
                singer.id as singer_id,
                singer.nickname as singer_nickname,
                gender.id as gender_id,
                gender.name as gender_name,
                genre.id as genre_id,
                genre.name as genre_name

            FROM genre
            INNER JOIN singer ON singer.genre_id = genre.id
            INNER JOIN gender ON singer.gender_id = gender.id
            WHERE genre.id = ${genre_id}
            ORDER BY singer.nickname ASC
        `);
    }
};
