//http://paperjs.org/examples/

paper.install(window);
$(document).ready(function () {
   
    paper.setup('mainCanvas');

    function setCanvas() {
        var cont = document.getElementById("mainContainer");
        view.viewSize = [$(cont).width(), $(cont).height() + parseFloat($(cont).css('padding-top')) + parseFloat($(cont).css('padding-bottom'))];
    };
    $(window).resize(setCanvas);
    setCanvas();

    var circles = 250;

    for (var i = 0; i < circles; i++) {
        var path = new Path.Circle({
            center: [Math.random() * view.size.width, Math.random() * view.size.height],
            radius: 15,
        });
        path.scale(Math.random() + 0.2);
        path.fillColor = new Color(0, 200, 0, 0.4);
    }
    view.draw();

    view.onFrame = function (event) {
      
        for (var i = 0; i < circles; i++) {
            var item = project.activeLayer.children[i];

            item.position.x += item.bounds.width / 20;

            if (item.bounds.left > view.size.width) {
                item.position.x = -item.bounds.width;
            }
        }
    }

});