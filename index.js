const Fastify = require("fastify");
const { createCanvas } = require("canvas");
const QRCode = require("qrcode");
require("dotenv").config();

const fastify = Fastify();

fastify.get("/", (req, rep) => {
    const text = req.query.text;

    if (!text) {
        rep.send(
            JSON.stringify({
                status: "error",
                error: "no link provided"
            })
        );
    }

    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    QRCode.toCanvas(canvas, text, err => {
        if (err) {
            console.error(err);
            rep.send(
                JSON.stringify({
                    status: "error",
                    error: "render error"
                })
            );
        } else {
            rep.header("Content-Type", "text/html");
            rep.send(`<img src="${canvas.toDataURL()}" />`);
        }
    });
});

fastify.listen({
    port: 3000
});
