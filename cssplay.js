const minangle = -150;
const maxangle = 150;

// to do
// allow option to set initial value
// allow options to set min and max range
// allow func / option to translate to log / linear scale

function setAngle(rotary) {
    rotary.marker.setAttribute('transform', `rotate(${rotary.angle}, 25, 25)`);
    const r = 20 * 2 * Math.PI;
    const offset = rotary.centred ? 360 : 360 + minangle;
    const factor = (offset - rotary.angle) / 360;
    rotary.highlight.style.strokeDashoffset = r * factor;
}

function increase(rotary) {
    if (rotary.angle === 0 && rotary.buffer < 10) {
        rotary.buffer++;
        return;
    }
    if ((rotary.angle + 2) <= maxangle) {
        rotary.angle = rotary.angle + 2;
        setAngle(rotary);
    }
}

function decrease(rotary) {
    if (rotary.angle === 0 && rotary.buffer > -10) {
        rotary.buffer--;
        return;
    }
    if ((rotary.angle - 2) >= minangle) {
        rotary.angle = rotary.angle - 2;
        setAngle(rotary);
    }
}

function reset(rotary) {
    if (rotary.angle === 0) return;
    rotary.angle = 0;
    rotary.buffer = 0;
    setAngle(rotary);
}

export function bindScrolling(control, options) {
    const rotary = {
        angle: options?.centred ? 0 : minangle,
        centred: !!options?.centred,
        buffer: 0,
        marker: control.querySelector('.marker'),
        highlight: control.querySelector('.highlight')
    };

    setAngle(rotary);

    const lookup = {
        "ArrowRight-false": increase,
        "ArrowLeft-false": decrease,
        "ArrowUp-true": reset
    }

    control.onwheel = e => {
        const rotate = e.wheelDelta < 0 ? increase : decrease;
        rotate(rotary);
        return false;
    };

    control.onkeydown = e => {
        const rotate = lookup[`${e.key}-${e.shiftKey}`];
        if (rotate) {
            rotate(rotary);
            return false;
        }

    };
}