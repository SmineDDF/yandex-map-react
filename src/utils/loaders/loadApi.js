import fetchScript from './fetchScript';
import {apiConfig} from '../../configs';

let loadPromise;

const successCallbackName = '_$_api_success';
const errorCallbackName = '_$_api_error';

const defaultOptions = {
    lang: 'ru_RU',
    coordorder: 'latlong',
    load: 'package.full',
    mode: 'release',
    namespace: '',
    onload: successCallbackName,
    onerror: errorCallbackName
};

function generateURL (options) {
    const params = Object.assign({}, defaultOptions);
    Object.keys(options)
        .forEach((key) => {
            params[key] = options[key];
        });

    const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

    return `https://${apiConfig.host}/${options.version || apiConfig.version}/?${queryString}`;
}

export default function loadApi (options) {
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise((resolve, reject) => {

        window[successCallbackName] = (ymaps) => {
            resolve(ymaps);
            window[successCallbackName] = null;
        };

        window[errorCallbackName] = (error) => {
            reject(error);
            window[errorCallbackName] = null;
        };

        fetchScript(generateURL(options));
    });

    return loadPromise;
}
