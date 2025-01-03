const express = require("express");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Admin = require("./models/Admin");
const Singer = require("./models/Singer");
const Concert = require("./models/Concert");
const Count = require("./models/Count");
const City = require("./models/City");
const Genre = require("./models/Genre");

app.get("/", async (req, res) => {
    const revenue = await Count.revenue();
    const tickets = await Count.tickets();
    const singers = await Count.singers();
    const concerts = await Count.concerts();

    const list_singer = await Singer.getall();
    const list_city = await City.getall();
    const list_genre = await Genre.getall();
    const concert_revenues = await Concert.revenues();

    res.render("index", {
        title: "Ana Sayfa | Konser",

        revenue: revenue[0],
        tickets: tickets[0],
        singers: singers[0],
        concerts: concerts[0],

        list_singer: list_singer[0],
        list_city: list_city[0],
        list_genre: list_genre[0],
        concert_revenues: concert_revenues[0],
        singers_by_genre: null,
    });
});

app.get("/login", async (req, res) => {
    res.render("login", {
        title: "Yönetici Giriş | Konser",
    });
});

app.post("/api/login", async (req, res) => {
    const admin = await Admin.login(req.body);
    if (admin[0][0]) res.redirect("/");
    else res.redirect("/login");
});

app.get("/api/singers", async (req, res) => {
    const singers = await Singer.getall();

    res.status(200).json({
        singers: singers[0],
    });
});

app.post("/concert/create", async (req, res) => {
    const concert = await Concert.create(req.body);
    if (concert) res.redirect("/");
});

app.get("/concert/details/:id", async (req, res) => {
    const concertId = Number(req.params.id);
    if (isNaN(concertId)) {
        return res
            .status(400)
            .send("Geçersiz konser ID'si. Sayısal bir değer girin.");
    }
    const concert = await Concert.getById(concertId);
    const list_singer = await Singer.getall();
    const list_city = await City.getall();

    res.render("details", {
        title: "Konser Güncelleme Sayfası | Konser",

        concert: concert[0],
        list_singer: list_singer[0],
        list_city: list_city[0],
        concert_id: concertId,
    });
});

app.post("/concert/update", async (req, res) => {
    const concert = await Concert.update(req.body);
    if (concert) res.redirect("/");
});

app.get("/concert/delete/:id", async (req, res) => {
    const concertId = Number(req.params.id);
    if (isNaN(concertId)) {
        return res
            .status(400)
            .send("Geçersiz konser ID'si. Sayısal bir değer girin.");
    }
    const concert = await Concert.delete(concertId);
    if (concert) res.redirect("/");
});

app.get("/api/number_of_concert_by_city", async (req, res) => {
    const number_of_concert_by_city = await City.number_of_concert_by_city();

    res.status(200).json({
        number_of_concert_by_city: number_of_concert_by_city[0],
    });
});

app.get("/api/number_of_concert_by_singer", async (req, res) => {
    const number_of_concert_by_singer =
        await Singer.number_of_concert_by_singer();

    res.status(200).json({
        number_of_concert_by_singer: number_of_concert_by_singer[0],
    });
});

app.get("/search", async (req, res) => {
    const genre_id = req.query.genre;
    const singers_by_genre = await Genre.getById_singer(genre_id);

    const revenue = await Count.revenue();
    const tickets = await Count.tickets();
    const singers = await Count.singers();
    const concerts = await Count.concerts();

    const list_singer = await Singer.getall();
    const list_city = await City.getall();
    const list_genre = await Genre.getall();
    const concert_revenues = await Concert.revenues();
    // return console.log(singers_by_genre[0]);
    res.render("index", {
        title: "Ana Sayfa | Konser",

        revenue: revenue[0],
        tickets: tickets[0],
        singers: singers[0],
        concerts: concerts[0],

        list_singer: list_singer[0],
        list_city: list_city[0],
        list_genre: list_genre[0],
        concert_revenues: concert_revenues[0],

        singers_by_genre: singers_by_genre[0] ? singers_by_genre[0] : null,
    });
});

const PORT = 3000;
app.locals.baseURL = `http://localhost:${PORT}`;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
