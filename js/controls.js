window.notify = 1

// Retrieve remote BrowserWindow
const {
    BrowserWindow,
    Tray,
    Menu,
    App,
    shell
} = require('electron').remote

function init() {
    window.win = BrowserWindow.getFocusedWindow()

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
                let sl = $('.slider').scrollLeft()
                $('.slider').scrollLeft(sl - 3)
            })
        })
        .on('mouseup', (e) => {
            clearInterval(leftInterval)
        })

    $('.pair-slider .right').on('mousedown', (e) => {
            clearInterval(leftInterval)

            rightInterval = setInterval(() => {
                let sl = $('.slider').scrollLeft()
                $('.slider').scrollLeft(sl + 4)
            }, 1)
        })
        .on('mouseup', (e) => {
            clearInterval(rightInterval)
        })


    //делаем чтобы кнопки скролла погасали
    $('.slider').on('scroll', (e) => {
        if ($('.slider').scrollLeft() <= 0) {
            $('.pair-slider .left').addClass('disabled')
            clearInterval(leftInterval)
        } else {
            $('.pair-slider .left').removeClass('disabled')
        }
        let el = document.getElementsByClassName('slider')[0]
        let scrollEnd = el.scrollWidth - el.offsetWidth

        if ($('.slider').scrollLeft() >= scrollEnd) {
            clearInterval(rightInterval)
            $('.pair-slider .right').addClass('disabled')
        } else {
            $('.pair-slider .right').removeClass('disabled')
        }
    })


    //включаем переключение валютных пар
    $('.pair-slider .pair').on('click', (e) => {
        $('.pair-slider .pair').removeClass('active')

        let pair = $(e.target)
        if (!pair.hasClass('.pair')) {
            pair = pair.parent()
        }

        pair.addClass('active');
    })


    //включаем переключение языка
    $('.lang').on('click', (e) => {
        $('.lang').removeClass('active')
        $(e.target).addClass('active')
        if($(e.target).attr('id'))
        {
            window.language = $(e.target).attr('id')
        }
    })

    window.openExternal = function(link)
    {
        shell.openExternal(link)
    }
};

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        init();
    }
};
