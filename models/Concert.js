const connection = require("../database/db");

module.exports = class Concert {
    // ID Bilgisine Göre Konser Seç
    static getById(concert_id) {
        return connection.execute(`
            SELECT 
                concert.id as concert_id,
                singer.id as singer_id,
                singer.nickname as singer_nickname,
                gender.id as gender_id,
                gender.name as gender_name,
                genre.id as genre_id,
                genre.name as genre_name,

                city.id as city_id,
                city.name as city_name,
                concert.location as concert_location,
                concert.date as concert_date,
                concert.price as concert_price,
                concert.capacity as concert_capacity,
                concert.sold_ticket as concert_sold_ticket
            FROM concert
            LEFT JOIN singer ON concert.singer_id = singer.id 
            LEFT JOIN gender ON singer.gender_id = gender.id
            LEFT JOIN genre ON singer.genre_id = genre.id
			LEFT JOIN city ON concert.city_id = city.id
            WHERE concert.id = ${concert_id}
        `);
    }

    // Konser Hasılatları
    static revenues() {
        return connection.execute(`
            SELECT 
                concert.id as concert_id,
                singer.id as singer_id,
                singer.nickname as singer_nickname,
                gender.id as gender_id,
                gender.name as gender_name,
                genre.id as genre_id,
                genre.name as genre_name,

                city.id as city_id,
                city.name as city_name,
                concert.location as concert_location,
                concert.date as concert_date,
                concert.price as concert_price,
                concert.capacity as concert_capacity,
                concert.sold_ticket as concert_sold_ticket,
                ROUND(concert.price * concert.capacity,2) as target_revenue,
                ROUND(concert.price * concert.sold_ticket,2) as total_revenue, 
                ROUND((concert.capacity-concert.sold_ticket)* concert.price,2) as cost_revenue
            FROM concert
            LEFT JOIN singer ON concert.singer_id = singer.id 
            LEFT JOIN gender ON singer.gender_id = gender.id
            LEFT JOIN genre ON singer.genre_id = genre.id
			LEFT JOIN city ON concert.city_id = city.id
        `);
    }

    // Konser Ekleme
    static create(condition) {
        const { singer, city, location, date, price, capacity } = condition;
        return connection.execute(
            `INSERT INTO concert (singer_id, city_id, location, date, price, capacity) VALUES (?,?,?,?,?,?)`,
            [singer, city, location, date, price, capacity]
        );
    }

    // Konser Güncelleme
    static update(condition) {
        const {
            singer,
            city,
            location,
            date,
            price,
            capacity,
            sold_ticket,
            concert_id,
        } = condition;
        if (date) {
            return connection.execute(
                `UPDATE concert SET singer_id = ?, city_id = ?, location = ?, date = ?, price = ?, capacity = ?, sold_ticket = ? WHERE id = ?`,
                [
                    singer,
                    city,
                    location,
                    date,
                    price,
                    capacity,
                    sold_ticket,
                    concert_id,
                ]
            );
        } else {
            return connection.execute(
                `UPDATE concert SET singer_id = ?, city_id = ?, location = ?, price = ?, capacity = ?, sold_ticket = ? WHERE id = ?`,
                [
                    singer,
                    city,
                    location,
                    price,
                    capacity,
                    sold_ticket,
                    concert_id,
                ]
            );
        }
    }

    // Konser Silme
    static delete(concertId) {
        return connection.execute(`DELETE FROM concert WHERE id =${concertId}`);
    }
};
