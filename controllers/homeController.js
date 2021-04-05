exports.home = (req, res) => {
    res.render('home', {
        nombrePag: 'Inicio'
    });
}