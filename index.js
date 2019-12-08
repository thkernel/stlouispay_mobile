/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import BackgroundSyncService from '../../services/BackgroundSyncService';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

//AppRegistry.registerHeadlessTask('KoSanteBackgroundService', () => BackgroundSyncService);
