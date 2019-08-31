const {
    Notification,
    screen
} = require('electron').remote
const electron = require('electron').remote

window.url = ' http://7524e97a.ngrok.io'


const fs = require('fs')
const os = require('os')
const getmac = require('getmac')

var app = new Vue({
    el: '#app',
    data: {
        signals: {},
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

        accessToken: '',
        registerAccessToken: '',
        registerError: '',
        locale: ""
    },
    mounted() {
        //console.log(screen.getAllDisplays())
        //return console.log(screen.width)
            //alert(electron.screen.getPrimaryDisplay().workAreaSize)


        window.url = this.configGet('url')

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
    },
    methods: {
        requestRegister() {
            this.registerError = ''

            this.showLoading()

            this.getFingerPrint((fingerPrint) => {
                axios.post(url + '/auth/register', {
                        accessToken: this.registerAccessToken,
                        fingerPrint: fingerPrint
                    })
                    .then((resp) => {
                        console.log(resp.data.status)
                        if (resp.data.status == 'success') {
                            this.configSet('access_token', this.registerAccessToken)

                            electron.app.relaunch()
                            electron.app.quit()

                            return;
                        } else if (resp.data.status == 'access_token_not_found') {
                            this.registerError = this.l.private_key_not_found
                        } else if(resp.data.status == undefined) {
                            this.registerError = this.l.server_connection_error
                        } else {
                            this.registerError = this.l.something_went_wrong
                        }

                        this.hideLoading()
                    })
                    .catch((err) => {
                        if (err.response.status == 408) {
                            this.registerError = this.l.check_internet_connection
                        } else if (err.response.status == 500) {
                            this.registerError = this.l.server_error
                        } else {
                            this.registerError = this.l.something_went_wrong
                        }
                        console.log(err.response)

                        this.hideLoading()
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
                                let notification = new Notification({
                                    title: not.title,
                                    body: not.body,
                                    icon: './resources/img/logo64.png',
                                    sound: './resources/sound/notify.mp3',
                                    silent: !(this.volume)
                                })
                                notification.on('click', () => {
                                    openExternal(not.link)
                                })
                                notification.show()
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
                            this.updateSignals()
                        }, 5000)

                        this.hideLoading()
                    })
                    .catch((err) => {
                        console.log(err.response)
                        alert('Произошла ошибка при связи с сервером. Перезагрузите или попробуйте позже. ' + err.response.status + ' ' + err.response.statusText)

                        setTimeout(this.initSignals(), 3000)
                    })
            })

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
                        if(resp.data.status == 'not_authorized')
                        {
                            this.configSet('access_token', '')
                            electron.app.relaunch()
                            electron.app.quit()
                        }

                        this.last_updated_at = resp.data.last_updated_at

                        console.log(resp.data)
                        if (resp.data.new_notifications.length > 0) {
                            for (let i in resp.data.new_notifications) {
                                let not = resp.data.new_notifications[i]
                                let notification = new Notification({
                                    title: not.title,
                                    body: not.body,
                                    icon: './resources/img/logo64.png',
                                    sound: './resources/sound/notify.mp3',
                                    silent: !(this.volume)
                                })
                                notification.on('click', () => {
                                    openExternal(not.link)
                                })
                                notification.show()
                            }
                        }


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

                                                if (resp.data.signals[j][y].conclusion != 0 && this.signals[i][z].conclusion != resp.data.signals[j][y].conclusion) {
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
                        //console.log('updated')
                        //console.log(resp.data);
                    })
                    .catch((err) => {
                        console.log(err.response)
                        alert('Произошла ошибка при связи с сервером. Перезагрузите или попробуйте позже. ' + err.response.status + ' ' + err.response.statusText)
                    })
            })
        },

        notifySignal(signal) {
            if (window.notify != 1) {
                return
            }

            let notification = new Notification({
                title: this.l.new_signal,
                body: signal.currency + ', ' + this.secondsToStr(signal.time) + ', ' + (signal.conclusion == 1 ? this.l.sell_up : this.l.buy_up),
                icon: './resources/img/logo64.png',
                sound: './resources/sound/notify.mp3',
                silent: !(this.volume)
            })
            notification.on('click', () => {
                this.activeCurrency = signal.currency
                this.activeTime = signal.time

                win.show()
            })
            notification.show()

        },

        getCurrencyWithSignal(currency) {

            for (let i in this.signals[currency]) {
                if (this.signals[currency][i].conclusion != 0) {
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
            axios.get('./locales/' + locale + '.json')
                .then((resp) => {
                    Vue.set(this, 'l', resp.data)
                })
        },
        setLocale(locale) {
            this.loadLocale(locale)
            this.configSet('locale', locale)
        },
        configGet(key) {

            let result
            try {
                result = JSON.parse(fs.readFileSync('./config.json'));
            } catch (e) {
                result = {
                    "locale": "ru",
                    "access_token": "",
                    "url": window.url
                }
                fs.writeFileSync('./config.json', JSON.stringify(result, null, "\t"))
            }
            return typeof key == 'string' ? result[key] : result
        },
        configSet(key, value) {
            let config = JSON.parse(fs.readFileSync('./config.json'));

            config[key] = value
            fs.writeFileSync('./config.json', JSON.stringify(config, null, "\t"))
        },
        createDefaultConfig() {
            let config = {
                locale: "ru",
                last_notification_id: 0,
                access_token: ''
            }
            fs.writeFileSync('./config.json', JSON.stringify(config, null, "\t"))
            return config
        },
        toggleNotifications() {
            if (window.notify == 1) {
                window.notify = 0
                $('.notify i').addClass('fa-bell-slash').removeClass('fa-bell')
            } else {
                window.notify = 1
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
        },
        getFingerPrint(callback) {
            getmac.getMac(function(err, macAddress) {
                if (err) macAddress = os.homedir()

                let val = os.type() + '@' + (os.cpus()[0].model.replace(/\@/g, '')) + '@' + macAddress + '@' + os.arch()

                if (callback != undefined) {
                    callback(val)
                }
            })
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
