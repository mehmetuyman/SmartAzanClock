export const DefaultSettings = {
    locationSettings: {
        address: 'Al-Masjid An-Nabawi', timeZoneID: 'Asia/Riyadh', lat: '24.4672105', lng: '39.611131'
    },  /* صلى الله عليه وعلى آله وسلم */
    calculationSettings: { method: 'ISNA', asrMethod: 'S' },
    deviceSettings: { azanCallsEnabled: 'Y', mode: 'N' },
    azanSettings: { fajr: '13', dhuhr: '7', asr: '9', maghrib: '6', isha: '3' },
    // Pre-Adhan reminder settings
    preReminderEnabled: { fajr: 'N', sunrise: 'N', dhuhr: 'N', asr: 'N', maghrib: 'N', isha: 'N' },
    preReminderMinutes: { fajr: 15, sunrise: 15, dhuhr: 15, asr: 15, maghrib: 15, isha: 15 },
    preReminderAudio: { fajr: '102', sunrise: '102', dhuhr: '102', asr: '102', maghrib: '102', isha: '102' },
    offsetSettings: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    alarmSettings: [],
    naflAlarmSettings: [],
    settingsVersion: 12
}
