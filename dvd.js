const frameTimerInterval = 5;

function getPixelValue(stringValue) {
    return parseInt(stringValue.replace("px", ""));
}

//COLOR FOR DVD LOGO
function getRandomColor() {
    const characters = "123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * 15);
        color += characters[randomIndex] + characters[randomIndex];
    }
    return color;
}

//CHANGE COLOR OF DVD LOGO SVG
function changeCubeColor() {
    document.getElementById("logo").setAttribute("fill", getRandomColor());
}

function almostEqual(a, b) {
    return Math.abs(a - b) <= 5;
}

function detectCorner(newX, newY, maxX, maxY, w, h) {
    const newXwidth = newX + w;
    const newYheight = newY + h;

    const topLeft = almostEqual(newX, 0) && almostEqual(newY, 0);
    const topRight = almostEqual(newXwidth, maxX) && almostEqual(newY, 0);
    const bottomRight = almostEqual(newXwidth, maxX) && almostEqual(newYheight, maxY);
    const bottomLeft = almostEqual(newX, 0) && almostEqual(newYheight, maxY);

    return topLeft || topRight || bottomRight || bottomLeft;
}


//ANIMATIONBOX'S MOVEMENT
function movingBox() {
    const animationBox = $("#animationBox");
    let timer = setInterval(frame, frameTimerInterval);

    let oldX = getPixelValue(animationBox.css("left"));
    let oldY = getPixelValue(animationBox.css("top"));

    let directionX = 1.0;
    let directionY = 1.0;

    let cornerDetection = true;
    let framesSinceCorner = 0;

    let maxX = 0;
    let maxY = 0;

    function frame() {
        maxX = $(document).width() - animationBox.width();
        maxY = $(document).height() - animationBox.height();

        let newX = oldX;
        let newY = oldY;

        if (oldX <= 0 || oldX >= maxX) {
            directionX = directionX * -1;
            changeCubeColor();
        }

        newX = newX + 2 * directionX;

        if (oldY <= 0 || oldY >= maxY) {
            directionY = directionY * -1;
            changeCubeColor();
        }

        newY = newY + 2 * directionY;

        oldX = newX;
        oldY = newY;

        animationBox.css("left", newX + "px");
        animationBox.css("top", newY + "px");

        if (cornerDetection && detectCorner(newX, newY, $(document).width(), $(document).height(), animationBox.width(), animationBox.height())) {
            cornerDetection = false;
        } else if (++framesSinceCorner > 50) {
            cornerDetection = true;
            framesSinceCorner = 0;
        }
    }

    let resizeTimer;

    function detectResizeEnd() {
        const newMaxX = Math.floor($(document).width() - animationBox.width());

        if (newMaxX === Math.floor(maxX)) {
            clearInterval(resizeTimer);
            if (timer === null) {
                timer = setInterval(frame, frameTimerInterval);
            }
        }
    }

    $(window).resize(
        function () {
            clearInterval(resizeTimer);
            resizeTimer = setInterval(detectResizeEnd, 10);

            clearInterval(timer);
            timer = null;

            oldX = getPixelValue(animationBox.css("left"));
            oldY = getPixelValue(animationBox.css("top"));

            const newMaxX = $(document).width() - animationBox.width();
            const newMaxY = $(document).height() - animationBox.height();

            const differenceX = maxX - newMaxX;
            const differenceY = maxY - newMaxY;

            let newX = oldX - differenceX;
            let newY = oldY - differenceY;

            newX = (newX > 0) ? newX : 1;
            newY = (newY > 0) ? newY : 1;

            animationBox.css("left", newX + "px");
            animationBox.css("top", newY + "px");

            maxX = newMaxX;
            maxY = newMaxY;

            oldX = newX;
            oldY = newY;
        }); // resize
} // movingBox

$(document).ready(function () {
    document.getElementById("logo").setAttribute("fill", getRandomColor());
    movingBox();
});
