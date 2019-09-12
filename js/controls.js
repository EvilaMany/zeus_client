
// Retrieve remote BrowserWindow
const {
    BrowserWindow,
    Menu,
    App,
    shell
} = require('electron').remote


window.win = BrowserWindow.getAllWindows()[0]


function init() {


    // Minimize task
    $(".btn-minimize").on("click", (e) => {

        win.minimize();

    });

    $(".btn-close").on('click', (e) => {
        win.hide()
    })


    //включаем кнопки скролл валют
    let leftInterval, rightInterval
    $('.pair-slider .left').on('mousedown', (e) => {
            clearInterval(rightInterval)

            leftInterval = setInterval(() => {
                let sl = $('.pair-slider .slider').scrollLeft()
                $('.pair-slider .slider').scrollLeft(sl - 3)
            })
        })
        .on('mouseup', (e) => {
            clearInterval(leftInterval)
        })

    $('.pair-slider .right').on('mousedown', (e) => {
            clearInterval(leftInterval)

            rightInterval = setInterval(() => {
                let sl = $('.pair-slider .slider').scrollLeft()
                $('.pair-slider .slider').scrollLeft(sl + 4)
            }, 1)
        })
        .on('mouseup', (e) => {
            clearInterval(rightInterval)
        })


    //делаем чтобы кнопки скролла погасали
    $('.pair-slider .slider').on('scroll', (e) => {
        if ($('.pair-slider .slider').scrollLeft() <= 0) {
            $('.pair-slider .left').addClass('disabled')
            clearInterval(leftInterval)
        } else {
            $('.pair-slider .left').removeClass('disabled')
        }
        let el = document.getElementsByClassName('slider-main')[0]
        let scrollEnd = el.scrollWidth - el.offsetWidth

        if ($('.pair-slider .slider').scrollLeft() >= scrollEnd) {
            clearInterval(rightInterval)
            $('.pair-slider .right').addClass('disabled')
        } else {
            $('.pair-slider .right').removeClass('disabled')
        }
    })

    window.openExternal = function(link)
    {
        shell.openExternal(link)
    }

    window.slideToCurrency = function(currency)
    {
        $('.slider').scrollLeft(parseInt($('#'+currency).index() * 162.35));
        console.log('evec43')
    }
};

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        init();
    }
};
