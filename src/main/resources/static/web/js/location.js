var app = new Vue({
    el: "#app",
    data: {
        getIdUrl: null,
        columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        view: {},
        shipLocation: [],
        opponentMail: {},
        mainPlayerMail: {},
    },
    methods: {
        findGame: function () {
            const urlParams = new URLSearchParams(window.location.search);
            app.getIdUrl = urlParams.get('gp');
        },
        findGameView: function () {
            app.findGame();
            $.get('/api/game_view/' + app.getIdUrl, function (data) {
                app.view = data;
                app.locatePlayer();
                app.locateShip();
                app.locateSalvoes();
            })
        },
        locateShip: function () {

        },

        locatePlayer: function () {
            for (i = 0; i < app.view.gamePlayers.length; i++) {
                if (app.view.gamePlayers[i].id == app.getIdUrl)
                    app.mainPlayerMail = app.view.gamePlayers[i].player
                else
                    app.opponentMail = app.view.gamePlayers[i].player

            }
        },
        locateSalvoes: function () {
            for (i = 0; i < app.view.salvoes.length; i++) {
                for (j = 0; j < app.view.salvoes[i].locations.length; j++) {
                    if (app.mainPlayerMail.id == app.view.salvoes[i].playerId) {
                        var elements = document.getElementById(app.view.salvoes[i].locations[j]);
                        elements.classList.add('salvoes')
                    } else {
                        var elements2 = document.getElementById(app.view.salvoes[i].locations[j] + "O");
                        elements2.classList.add('salvoes2');
                        elements2.innerHTML = app.view.salvoes[i].turn;

                    }
                }
            }
        },
        addShips: function () {
            $.post({
                    url: "/api/games/players/" + app.getIdUrl + "/ships",
                    data: JSON.stringify(app.shipLocation),
                    dataType: "text",
                    contentType: "application/json"
                })
                .done(function () {
                    alart("Ships added Succesfully");
                    location.reload();
                })
                .fail(function () {
                    alert("error");
                })
        },
    }
})
app.findGameView()

//NEW GRILL

const options = {
    //grilla de 10 x 10
    column: 10,
    row: 10,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 36,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false
}

//iniciando la grilla en modo libe statidGridFalse
const grid = GridStack.init(options, '#grid');

//todas las funciones se encuentran en la documentación
//https://github.com/gridstack/gridstack.js/tree/develop/doc

//agregando elementos (widget) desde el javascript
//elemento,x,y,width,height
grid.addWidget('<div><div id="submarine" class="grid-stack-item-content submarineHorizontal"></div><div/>',
    1, 1, 3, 1);

grid.addWidget('<div><div id="carrier" class="grid-stack-item-content carrierVertical"></div><div/>',
    9, 1, 1, 4);

grid.addWidget('<div><div id="patrol" class="grid-stack-item-content patrolHorizontal"></div><div/>',
    2, 4, 2, 1);

grid.addWidget('<div><div id="destroyer" class="grid-stack-item-content destroyerVertical"></div><div/>',
    6, 4, 1, 3);

grid.addWidget('<div><div id="battleship" class="grid-stack-item-content battleshipHorizontal"></div><div/>',
    2, 8, 5, 1);


//rotacion de las naves
//obteniendo los ships agregados en la grilla
const ships = document.querySelectorAll("#submarine,#carrier,#patrol,#destroyer,#battleship");
ships.forEach(ship => {
    //asignando el evento de click a cada nave
    ship.parentElement.onclick = function (event) {
        //obteniendo el ship (widget) al que se le hace click
        let itemContent = event.target;
        //obteniendo valores del widget
        let itemX = parseInt(itemContent.parentElement.dataset.gsX);
        let itemY = parseInt(itemContent.parentElement.dataset.gsY);
        let itemWidth = parseInt(itemContent.parentElement.dataset.gsWidth);
        let itemHeight = parseInt(itemContent.parentElement.dataset.gsHeight);

        //si esta horizontal se rota a vertical sino a horizontal
        if (itemContent.classList.contains(itemContent.id + 'Horizontal')) {
            //veiricando que existe espacio disponible para la rotacion
            if (grid.isAreaEmpty(itemX, itemY + 1, itemHeight, itemWidth - 1) && (itemY + (itemWidth - 1) <= 9)) {
                //la rotacion del widget es simplemente intercambiar el alto y ancho del widget, ademas se cambia la clase
                grid.resize(itemContent.parentElement, itemHeight, itemWidth);
                itemContent.classList.remove(itemContent.id + 'Horizontal');
                itemContent.classList.add(itemContent.id + 'Vertical');
            } else {
                alert("Espacio no disponible");
            }
        } else {
            if (grid.isAreaEmpty(itemX + 1, itemY, itemHeight - 1, itemWidth) && (itemX + (itemHeight - 1) <= 9)) {
                grid.resize(itemContent.parentElement, itemHeight, itemWidth);
                itemContent.classList.remove(itemContent.id + 'Vertical');
                itemContent.classList.add(itemContent.id + 'Horizontal');
            } else {
                alert("Espacio no disponible");
            }
        }
    }
})