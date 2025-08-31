import React, { useContext, createRef, useRef, useEffect } from 'react'
import Address from './Address';
import DropDown from './DropDown';
import Options from './Options';
import { AzanCallOptions } from '../data/AzanCallOptions';
import { DeviceModes } from '../data/DeviceModes';
import { FajrAzans, Azans } from '../data/Audios';
import { CalculationMethods, AsrCalculationMethods } from '../data/CalculationMethods';
import { AppContext } from '../AppContext';
import { FontAwesome } from '../data/FontAwesome';
import { format12 } from '../scripts/SmartAzanClock';
import { useLanguage } from '../hooks/useLanguage';


export default function Settings() {

    const { vakits, arcVakits, calculationSettings, locationSettings, deviceSettings, azanSettings,
        offsetSettings, preReminderEnabled, preReminderMinutes, preReminderAudio,
        updateSettings, updateOffset, previewAudio, oneThirdTime, twoThirdTime, midnightTime } = useContext(AppContext)

    const CalculationMethodValues = [];
    Object.keys(CalculationMethods).forEach(k => {
        CalculationMethodValues.push({ id: k, name: CalculationMethods[k].name });
    })

    const { strings, language, changeLanguage } = useLanguage();

    const azanSettingsHTML = [];
    const OnOff = [{ id: 'N', name: 'Off' }, { id: 'Y', name: 'On' }];

    const PRE_MIN_LIMIT = 0;
    const PRE_MAX_LIMIT = 180; // allow up to 3 hours before

    const updatePreReminderMinute = (cVakit, op) => {
        const current = preReminderMinutes[cVakit] ?? 15;
        let newVal = current + (op === '+' ? 1 : -1);
        if (op === '0') newVal = 0;
        if (newVal < PRE_MIN_LIMIT) newVal = PRE_MIN_LIMIT;
        if (newVal > PRE_MAX_LIMIT) newVal = PRE_MAX_LIMIT;
        updateSettings({ preReminderMinutes: { ...preReminderMinutes, [cVakit]: newVal } });
    }

    const updatePreReminderMinuteInput = (cVakit, value) => {
        let v = parseInt(value, 10);
        if (isNaN(v)) v = PRE_MIN_LIMIT;
        if (v < PRE_MIN_LIMIT) v = PRE_MIN_LIMIT;
        if (v > PRE_MAX_LIMIT) v = PRE_MAX_LIMIT;
        updateSettings({ preReminderMinutes: { ...preReminderMinutes, [cVakit]: v } });
    }
    const Vakits = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    Vakits.map((item) => {

        let cVakit = item.toLowerCase();
        let azanValue = azanSettings[cVakit];
        let offsetValue = offsetSettings[cVakit];
        let values = (item === "Fajr") ? FajrAzans : Azans;
        let vTime = vakits.find(v => v.name === item).displayTime;
        let itemName = strings[item.toLowerCase()] || item;
        let adhanLabel = strings["adhan"] || "Adhan";
        const preEnabled = preReminderEnabled[cVakit] || 'N';
        const preMinutes = preReminderMinutes[cVakit] ?? 15;
        const preAudioId = preReminderAudio[cVakit] || '102';
        azanSettingsHTML.push(

            <div key={item} className="mt-2">

                <div className='d-flex flex-row justify-content-between'>
                    <div><span className='badge p-0'>{itemName} {adhanLabel} @ {vTime}</span></div>
                    <div className='col-4'><span className='badge'>Minute Offset</span></div>
                </div>

                <div className='d-flex flex-row gap-1'>

                    <div className='col-6'>
                        <DropDown name={'azanSettings.' + cVakit} selectedValue={azanValue} values={values} />
                    </div>
                    <div className='col-2'>
                        <button onClick={() => { previewAudio(azanValue * 1); document.activeElement.blur(); }}
                            type='button'
                            className='btn btn-sm btn-primary col-12'>{FontAwesome.Play}</button>
                    </div>
                    <div>
                        <div className='d-flex flex-row gap-1 align-items-center'>
                            <div className='col-4'><button type='button' onClick={() => { updateOffset(cVakit, '-'); document.activeElement.blur(); }} className='btn btn-sm btn-light col-12'>{FontAwesome.Minus}</button></div>
                            <div className='col-4'><button type='button' onClick={() => { updateOffset(cVakit, '0'); document.activeElement.blur(); }} className={'btn btn-sm col-12 ' + ((offsetValue === 0) ? 'btn-light' : 'btn-danger')}>{offsetValue}</button></div>
                            <div className='col-4'><button type='button' onClick={() => { updateOffset(cVakit, '+'); document.activeElement.blur(); }} className='btn btn-sm btn-light col-12'>{FontAwesome.Plus}</button></div>
                        </div>
                    </div>
                </div>

                {/* Pre-Reminder controls */}
                <div className='mt-2'>
                    <div className='d-flex flex-row justify-content-between'>
                        <div><span className='badge p-0'>{itemName} {adhanLabel} {strings["preReminder"] || 'Pre-Reminder'}</span></div>
                        <div><span className='badge'>Minutes Before</span></div>
                    </div>
                    <div className='row align-items-center g-1'>
                        <div className='col-12 col-md-3'>
                            <Options name={'preReminderEnabled.' + cVakit} selectedValue={preEnabled} values={OnOff} />
                        </div>
                        <div className='col-12 col-md-5'>
                            <DropDown name={'preReminderAudio.' + cVakit} selectedValue={preAudioId} values={Azans} />
                        </div>
                        <div className='col-6 col-md-2'>
                            <button onClick={() => { previewAudio(preAudioId * 1); document.activeElement.blur(); }}
                                type='button'
                                className='btn btn-sm btn-secondary col-12'>{FontAwesome.Play}</button>
                        </div>
                        <div className='col-6 col-md-2'>
                            <div className='input-group input-group-sm'>
                                <input type='number'
                                    className='form-control'
                                    min={PRE_MIN_LIMIT}
                                    max={PRE_MAX_LIMIT}
                                    step='1'
                                    value={preMinutes}
                                    onChange={(e) => { updatePreReminderMinuteInput(cVakit, e.target.value); }} />
                                <span className='input-group-text'>min</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div >

        )
    })

    return (
        <div>
            <div className="form-group">
            <span className='badge mb-1 p-0'>Choose App Language</span>
            <label>{strings.language}</label>
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="form-control"
            >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
            </select>
            </div>

            <Address value={locationSettings.address} />

            <div className="mt-2">
                <span className='badge mb-1 p-0'>Calculation Method</span>
                <DropDown name="calculationSettings.method" selectedValue={calculationSettings.method} values={CalculationMethodValues} />
            </div>

            <div className="mt-2">
                <span className='badge mb-1 p-0'>Asr Calculation Method</span>
                <Options name="calculationSettings.asrMethod" selectedValue={calculationSettings.asrMethod} values={AsrCalculationMethods} />
            </div>

            <div className="mt-2">
                <span className='badge mb-1 p-0'>Display Mode</span>
                <Options name="deviceSettings.mode" selectedValue={deviceSettings.mode} values={DeviceModes} />
            </div>

            <div className="mt-2">
                <span className='badge mb-1 p-0'>Enable Azan Calls & Alarms</span>
                <Options name="deviceSettings.azanCallsEnabled" selectedValue={deviceSettings.azanCallsEnabled} values={AzanCallOptions} />
            </div>

            {(deviceSettings.azanCallsEnabled === 'Y') && azanSettingsHTML}

            <div className='d-flex flex-row justify-content-start gap-2 mt-3'>
                <div className='badge bg-secondary p-1'>Imsak @ {format12(arcVakits.find(f => f.name == 'Imsak').time)}</div>
                <div className='badge bg-secondary p-1'>Duha @ {format12(arcVakits.find(f => f.name == 'Duha').time)} - {format12(arcVakits.find(f => f.name == 'Duhaend').time)}</div>
            </div>
            <div className='d-flex flex-row justify-content-start gap-2 mt-2'>
                <div className='badge bg-secondary p-1'>1/3 @ {format12(oneThirdTime)}</div>
                <div className='badge bg-secondary p-1'>Midnight @ {format12(midnightTime)}</div>
                <div className='badge bg-secondary p-1'>2/3 @ {format12(twoThirdTime)}</div>
            </div>

        </div >
    )
}
