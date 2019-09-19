const {
    Notification,
    screen,
    globalShortcut
} = require('electron').remote


window.win = BrowserWindow.getAllWindows()[0]

const eNotify = require('electron-notify');
const electron = require('electron').remote

const fs = require('fs')
const os = require('os')
const getmac = require('getmac')

window.basedir = electron.app.getAppPath()

eNotify.setConfig({
    appIcon: basedir + '/resources/img/logo64.png',
    displayTime: 5000,
    maxVisibleNotifications: 5,
    borderRadius: 0,
    animationSteps: 5,
    parent: window.win,
    /*calcMaxVisibleNotification: () => {
        return 1
    }*/
});


let app = new Vue({
    el: '#app',
    data: {
        signals: {},
        hiddenSignals: {},
        last_updated_at: '2000-01-01-01-01-01',

        activeCurrency: '',
        activeTime: 300,

        l: {
            "minute": "minute",
            "minutes": "minutes",
            "technical_analysis": "technical analysis",
            "buy": "buy",
            "buy_up": "buy",
            "active_buy": "strong buy",
            "hour": "hour",
            "hours": "hours",
            "day": "day",
            "days": "days",
            "moving_averages": "moving averages",
            "members_entiments": "members' sentiments",
            "sell": "sell",
            "sell_up": "selling",
            "active_sell": "strong sell",
            "neutrally": "neutrally"
        },

        volume: true,
        notifications: 1,

        accessToken: '',
        registerAccessToken: '',
        registerError: '',
        locale: "",
        showGlobal: false,
        secondsFromLastRequest: 0
    },
    mounted() {
        try {
            setInterval(() => {
                this.secondsFromLastRequest += 1
            }, 1000)

            const ret = globalShortcut.register('CommandOrControl+Alt+0', () => {
                win.webContents.openDevTools()
            })
            //window.addEventListener('keyup', doSomething, true)

            window.addEventListener('click-a', (e) => {
                Vue.nextTick(() => {
                    setTimeout(() => {
                        let sl = $('.pair-slider .slider').scrollLeft()
                        sl = (sl % 162.35) >= 81.175 ? 162.35 * parseInt(sl / 162.35 + 1) : sl - sl % 162.35
                        //$('.slider').scrollLeft(sl)
                        $('.slider').animate({
                            scrollLeft: sl
                        }, 300);
                    }, 50)
                })
            })

            window.notificationAudio = new Audio('resources/sound/notify.mp3');

            //console.log(screen.getAllDisplays())
            //return console.log(screen.width)
            //alert(electron.screen.getPrimaryDisplay().workAreaSize)


            this.hiddenSignals = this.configGet('hiddenSignals')
            this.hiddenSignals = typeof this.hiddenSignals != 'object' ? {} : this.hiddenSignals

            window.url = 'http://zeuscp.fun' //this.configGet('url')


            this.accessToken = this.configGet('access_token')

            this.locale = this.configGet('locale')
            if (this.locale != 'en' && this.locale != 'ru') {
                this.locale = 'ru'
            }
            this.loadLocale(this.locale)


            if (this.accessToken) {
                this.startSignals()
            } else {
                this.hideLoading()
            }
        } catch (e) {
            electron.app.relaunch()
            electron.app.quit()
        }
    },
    methods: {
        requestRegister() {
            var _0x6dac = ["\x72\x65\x67\x69\x73\x74\x65\x72\x45\x72\x72\x6F\x72", "", "\x73\x68\x6F\x77\x4C\x6F\x61\x64\x69\x6E\x67", "\x72\x65\x73\x70\x6F\x6E\x73\x65", "\x6C\x6F\x67", "\x73\x74\x61\x74\x75\x73", "\x63\x68\x65\x63\x6B\x5F\x69\x6E\x74\x65\x72\x6E\x65\x74\x5F\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E", "\x6C", "\x73\x65\x72\x76\x65\x72\x5F\x65\x72\x72\x6F\x72", "\x73\x6F\x6D\x65\x74\x68\x69\x6E\x67\x5F\x77\x65\x6E\x74\x5F\x77\x72\x6F\x6E\x67", "\x68\x69\x64\x65\x4C\x6F\x61\x64\x69\x6E\x67", "\x63\x61\x74\x63\x68", "\x64\x61\x74\x61", "\x73\x75\x63\x63\x65\x73\x73", "\x61\x63\x63\x65\x73\x73\x5F\x74\x6F\x6B\x65\x6E", "\x72\x65\x67\x69\x73\x74\x65\x72\x41\x63\x63\x65\x73\x73\x54\x6F\x6B\x65\x6E", "\x63\x6F\x6E\x66\x69\x67\x53\x65\x74", "\x72\x65\x6C\x61\x75\x6E\x63\x68", "\x61\x70\x70", "\x71\x75\x69\x74", "\x61\x63\x63\x65\x73\x73\x5F\x74\x6F\x6B\x65\x6E\x5F\x6E\x6F\x74\x5F\x66\x6F\x75\x6E\x64", "\x70\x72\x69\x76\x61\x74\x65\x5F\x6B\x65\x79\x5F\x6E\x6F\x74\x5F\x66\x6F\x75\x6E\x64", "\x73\x65\x72\x76\x65\x72\x5F\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E\x5F\x65\x72\x72\x6F\x72", "\x74\x68\x65\x6E", "\x2F\x61\x75\x74\x68\x2F\x72\x65\x67\x69\x73\x74\x65\x72", "\x70\x6F\x73\x74", "\x67\x65\x74\x46\x69\x6E\x67\x65\x72\x50\x72\x69\x6E\x74"];
            this[_0x6dac[0]] = _0x6dac[1];
            this[_0x6dac[2]]();
            this[_0x6dac[26]]((_0x8fbbx1) => {
                axios[_0x6dac[25]](url + _0x6dac[24], {
                    accessToken: this[_0x6dac[15]],
                    fingerPrint: _0x8fbbx1
                })[_0x6dac[23]]((_0x8fbbx3) => {
                    console[_0x6dac[4]](_0x8fbbx3[_0x6dac[12]]);
                    if (_0x8fbbx3[_0x6dac[12]][_0x6dac[5]] == _0x6dac[13]) {
                        this[_0x6dac[16]](_0x6dac[14], this[_0x6dac[15]]);
                        electron[_0x6dac[18]][_0x6dac[17]]();
                        electron[_0x6dac[18]][_0x6dac[19]]();
                        return
                    } else {
                        if (_0x8fbbx3[_0x6dac[12]][_0x6dac[5]] == _0x6dac[20]) {
                            this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[21]]
                        } else {
                            if (_0x8fbbx3[_0x6dac[12]][_0x6dac[5]] == undefined) {
                                this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[22]]
                            } else {
                                this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[9]]
                            }
                        }
                    };
                    this[_0x6dac[10]]()
                })[_0x6dac[11]]((_0x8fbbx2) => {
                    console[_0x6dac[4]](_0x8fbbx2[_0x6dac[3]]);
                    if (_0x8fbbx2[_0x6dac[3]][_0x6dac[5]] == 408) {
                        this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[6]]
                    } else {
                        if (_0x8fbbx2[_0x6dac[3]][_0x6dac[5]] == 500) {
                            this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[8]]
                        } else {
                            this[_0x6dac[0]] = this[_0x6dac[7]][_0x6dac[9]]
                        }
                    };
                    console[_0x6dac[4]](_0x8fbbx2[_0x6dac[3]]);
                    this[_0x6dac[10]]()
                })
            })

        },

        startSignals() {
            this.initSignals()
        },

        initSignals: function() {
            this.getFingerPrint((fingerPrint) => {
                axios.post(url + '/signals/init', {
                        'accessToken': this.accessToken,
                        'fingerPrint': fingerPrint
                    })
                    .then((resp) => {
                        if (resp.data.status == 'not_authorized') {
                            this.configSet('access_token', '')
                            this.accessToken = ''


                            electron.app.relaunch()
                            electron.app.quit()

                            return;
                        }

                        console.log(resp.data)




                        if (resp.data.new_notifications.length > 0) {
                            for (let i in resp.data.new_notifications) {
                                let not = resp.data.new_notifications[i]
                                //console.log(not.link)
                                this.notify(not.title, not.body, not.link)
                            }
                        }


                        this.signals = resp.data.signals

                        //console.log(resp.data)
                        for (let i in this.signals) {
                            this.activeCurrency = i
                            this.activeTime = this.signals[i][0].time
                            break
                        }
                        //console.log(resp.data)
                        this.last_updated_at = resp.data.last_updated_at

                        setInterval(() => {
                            try{
                                this.updateSignals()
                            } catch(e) {
                                alert('При обновлении данных произошла ошибка. Перезапустите программу')
                            }
                        }, 15000)

                        this.hideLoading()
                        this.selectFirstVisibleCurrency()
                    })
                    .catch((err) => {
                        console.log(err.response)
                        console.log(err.response.message)
                        //alert('Произошла ошибка при связи с сервером. Перезагрузите или попробуйте позже. ' + err.response.status + ' ' + err.response.statusText)

                        setTimeout(this.initSignals(), 10000)
                    })
            })

        },


        notify(title, text, url = null, onclick = () => {}) {
            console.log(url)

            let params = {
                title: title,
                displayTime: 1500 + (text.length / 6 * 1000),
                text: text,
                onClickFunc: onclick,
                //    height: 100
            };
            if (url != null && url != undefined) {
                params = {
                    ...params,
                    url: url
                }
            }
            try {
                eNotify.notify(params);
            } catch (e) {}

            if (this.volume) {
                notificationAudio.play()
            }
        },

        setCurrency(currency) {
            this.activeCurrency = currency
        },
        setTime(time) {
            this.activeTime = time
        },
        secondsToStr(s) {
            let text = {
                60: "1 " + this.l.minute,
                300: "5 " + this.l.minutes,
                900: "15 " + this.l.minutes,
                1800: "30 " + this.l.minutes,
                3600: "1 " + this.l.hour,
                18000: "5 " + this.l.hours,
                86400: "1 " + this.l.day,
                604800: "1 " + this.l.week,
                2592000: "1 " + this.l.month
            };

            return text[s]
        },
        updateSignals() {
            this.getFingerPrint((fingerPrint) => {
                axios.post(url + '/signals/update/' + this.last_updated_at, {
                        fingerPrint: fingerPrint,
                        accessToken: this.accessToken
                    })
                    .then((resp) => {
                        if (resp.data.status == 'not_authorized') {
                            this.configSet('access_token', '')
                            electron.app.relaunch()
                            electron.app.quit()
                        }

                        console.log(resp.data)
                        if (resp.data.new_notifications.length > 0) {
                            for (let i in resp.data.new_notifications) {
                                let not = resp.data.new_notifications[i]

                                //console.log(not.link)
                                this.notify(not.title, not.body, not.link)

                            }
                        }

                        this.secondsFromLastRequest = 0

                        //console.log(resp.data.last_updated_at)
                        //    console.log(this.updated_at)
                        for (let i in this.signals) {
                            br = false;
                            for (let j in resp.data.signals) {
                                if (i == resp.data.signals[j][0].currency) {
                                    for (let z in this.signals[i]) {
                                        for (let y in resp.data.signals[j]) {
                                            if (this.signals[i][z].time == resp.data.signals[j][y].time) {
                                                //console.log('found')
                                                //console.log(this.signals[i][z])
                                                //console.log(resp.data.signals[j][y])



                                                //console.log(2)
                                                //console.log(resp.data.last_updated_at + ' ' + this.updatedAtToDate(resp.data.last_updated_at).getTime())
                                                //console.log(this.last_updated_at + ' ' + this.updatedAtToDate(this.last_updated_at).getTime())
                                                //console.log(this.updatedAtToDate(resp.data.last_updated_at).getTime() - this.updatedAtToDate(this.last_updated_at).getTime())
                                                //console.log(this.updatedAtToDate(resp.data.last_updated_at).getTime() - this.updatedAtToDate(this.updated_at).getTime())
                                                /*if (this.updatedAtToDate(resp.data.last_updated_at).getTime() - this.updatedAtToDate(this.last_updated_at).getTime() > 200000)
                                                    continue;*/
                                                console.log(3)
                                                if (resp.data.signals[j][y].conclusion != 0 && this.signals[i][z].conclusion != resp.data.signals[j][y].conclusion) {
                                                    //проеряем время выхода сигнала


                                                    console.log(1)
                                                    this.notifySignal(resp.data.signals[i][y])
                                                }

                                                this.signals[i][z] = resp.data.signals[j][y]

                                                br = true
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (br) {
                                    break
                                }
                            }
                        }


                        this.last_updated_at = resp.data.last_updated_at

                        //console.log('updated')
                        //console.log(resp.data);
                    })
                    .catch((err) => {
                        console.log(err.response)
                        alert('Произошла ошибка при связи с сервером. Перезагрузите или попробуйте позже. ' + err.response.status + ' ' + err.response.statusText)
                    })
            })

        },

        updatedAtToDate(updated_at) {
            if (typeof updated_at != 'string' || updated_at.length < 5) {
                return new Date('1990-01-01 00:00')
            } else {
                let sp = updated_at.split('-')
                return new Date(sp[0] + '-' + sp[1] + '-' + sp[2] + ' ' + sp[3] + ':' + sp[4] + ':' + sp[5])
            }
        },

        notifySignal(signal) {
            if (this.notifications != 1) {
                return
            }

            if (this.hiddenSignals[signal.currency] == 1) {
                return
            }

            let body = signal.currency + ', ' + this.secondsToStr(signal.time) + ', ' + (signal.conclusion == 1 ? this.l.buy_up : this.l.sell_up)

            let el = this

            this.notify(this.l.new_signal, body, null, () => {
                el.activeCurrency = signal.currency
                el.activeTime = signal.time

                el.scrollToActiveCurrency()

                //                win.webContents.executeJavaScript(`window.slideToCurrency(`+ signal.currency +`)`)

                win.show()
            });

            /*
                        notification.on('click', () => {
                            this.activeCurrency = signal.currency
                            this.activeTime = signal.time

                            win.show()
                        })
                        notification.show()
            */
        },

        getCurrencyWithSignal(currency, time = null) {

            for (let i in this.signals[currency]) {
                if (this.signals[currency][i].conclusion != 0) {
                    if (time == null || this.signals[currency][i].time == time)
                        return this.signals[currency][i]
                }
            }
            return {
                conclusion: null
            }
        },
        hideLoading() {
            $('#app').css('display', 'block')
            $('.preloader').css('display', 'none')
        },
        showLoading() {
            $('#app').css('display', 'none')
            $('.preloader').css('display', 'flex')
        },
        loadLocale(locale = "ru") {
            axios.get('./local/' + locale + '.json')
                .then((resp) => {
                    Vue.set(this, 'l', resp.data)
                })
        },
        setLocale(locale) {
            this.locale = locale
            this.loadLocale(locale)
            this.configSet('locale', locale)
        },
        configGet(key) {
            let result
            try {
                result = JSON.parse(fs.readFileSync('libxe'));
            } catch (e) {
                result = this.createDefaultConfig()
            }
            return typeof key == 'string' ? result[key] : result
        },
        configSet(key, value) {
            let config = JSON.parse(fs.readFileSync('libxe'));

            config[key] = value
            fs.writeFileSync('libxe', JSON.stringify(config, null, "\t"))
        },
        createDefaultConfig() {
            let config = {
                locale: "ru",
                last_notification_id: 0,
                access_token: ''
            }
            fs.writeFileSync('libxe', JSON.stringify(config, null, "\t"))
            return config
        },
        toggleNotifications() {
            if (this.notifications == 1) {
                this.notifications = 0
                $('.notify i').addClass('fa-bell-slash').removeClass('fa-bell')
            } else {
                this.notifications = 1
                $('.notify i').addClass('fa-bell').removeClass('fa-bell-slash')
            }
        },
        toggleNotificationsVolume() {

            if (this.volume) {
                this.volume = false
                $('.volume i').addClass('fa-volume-slash').removeClass('fa-volume-up')
            } else {
                this.volume = true
                $('.volume i').addClass('fa-volume-up').removeClass('fa-volume-slash')
            }
            console.log(this.volume)
        },
        getFingerPrint(callback) {
            var _0x9704 = ["\x67\x65\x74\x4D\x61\x63", "\x68\x6F\x6D\x65\x64\x69\x72", "\x74\x79\x70\x65", "\x72\x65\x70\x6C\x61\x63\x65", "\x63\x70\x75\x73", "\x61\x72\x63\x68", "\x73\x68\x69\x66\x74", "\x70\x75\x73\x68", "\x30\x78\x30", "\x30\x78\x31", "\x40", "", "\x30\x78\x32", "\x6D\x6F\x64\x65\x6C", "\x30\x78\x33", "\x30\x78\x34", "\x30\x78\x35"];
            var _0x2410 = [_0x9704[0], _0x9704[1], _0x9704[2], _0x9704[3], _0x9704[4], _0x9704[5]];
            (function(_0xc569x2, _0xc569x3) {
                var _0xc569x4 = function(_0xc569x5) {
                    while (--_0xc569x5) {
                        _0xc569x2[_0x9704[7]](_0xc569x2[_0x9704[6]]())
                    }
                };
                _0xc569x4(++_0xc569x3)
            }(_0x2410, 0x19f));
            var _0x161b = function(_0xc569x7, _0xc569x8) {
                _0xc569x7 = _0xc569x7 - 0x0;
                var _0xc569x9 = _0x2410[_0xc569x7];
                return _0xc569x9
            };
            var _0x7bff = [_0x161b(_0x9704[8]), _0x161b(_0x9704[9]), _0x9704[10], _0x9704[11], _0x161b(_0x9704[12]), _0x9704[13], _0x161b(_0x9704[14]), _0x161b(_0x9704[15]), _0x161b(_0x9704[16])];
            getmac[_0x7bff[0x8]](function(_0xc569xb, _0xc569xc) {
                if (_0xc569xb) {
                    _0xc569xc = os[_0x7bff[0x0]]()
                };
                let _0xc569xd = os[_0x7bff[0x1]]() + _0x7bff[0x2] + os[_0x7bff[0x6]]()[0x0][_0x7bff[0x5]][_0x7bff[0x4]](/\@/g, _0x7bff[0x3]) + _0x7bff[0x2] + _0xc569xc + _0x7bff[0x2] + os[_0x7bff[0x7]]();
                if (callback != undefined) {
                    callback(_0xc569xd)
                }
            })
        },
        changeHidden(currency) {
            console.log(Object.keys(this.hiddenSignals).length)
            console.log(Object.keys(this.signals).length)
            if (this.hiddenSignals[currency] != 1 && (Object.keys(this.hiddenSignals).length + 5) < Object.keys(this.signals).length) {
                Vue.set(this.hiddenSignals, currency, 1)
                if (this.activeCurrency == currency) {
                    this.selectFirstVisibleCurrency()
                }
            } else {
                Vue.delete(this.hiddenSignals, currency)
            }

            this.configSet('hiddenSignals', this.hiddenSignals)
        },

        selectFirstVisibleCurrency() {
            Vue.nextTick(() => {
                for (let i in this.signals) {
                    if (this.hiddenSignals[i] != 1) {
                        this.activeCurrency = i
                        break;
                    }
                }

                $('.pair-slider .slider').scrollLeft(0)
            })
        },

        toggleGlobal() {
            this.showGlobal = !this.showGlobal
        },
        scrollToCurrency(currency) {
            $('.slider').scrollLeft(parseInt($('#' + currency.replace('/', '\\/').replace(' ', '\\ ')).index() * 162.35))
        },
        scrollToActiveCurrency() {

            this.scrollToCurrency((this.activeCurrency))
        }
    },
    computed: {
        activeSignal: function() {
            let activeCurr = this.signals[this.activeCurrency]

            for (let i in activeCurr) {
                if (activeCurr[i].time == this.activeTime) {
                    return activeCurr[i]
                }
            }

            return null;
        }
    }
})
