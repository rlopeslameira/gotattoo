"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);

var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);
var _FileController = require('./app/controllers/FileController'); var _FileController2 = _interopRequireDefault(_FileController);
var _ProviderController = require('./app/controllers/ProviderController'); var _ProviderController2 = _interopRequireDefault(_ProviderController);
var _AppointmentController = require('./app/controllers/AppointmentController'); var _AppointmentController2 = _interopRequireDefault(_AppointmentController);
var _ScheduleController = require('./app/controllers/ScheduleController'); var _ScheduleController2 = _interopRequireDefault(_ScheduleController);
var _NotificationController = require('./app/controllers/NotificationController'); var _NotificationController2 = _interopRequireDefault(_NotificationController);
var _AvaliableController = require('./app/controllers/AvaliableController'); var _AvaliableController2 = _interopRequireDefault(_AvaliableController);
var _ClientController = require('./app/controllers/ClientController'); var _ClientController2 = _interopRequireDefault(_ClientController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

const routes = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multer4.default);

routes.post('/users', _UserController2.default.store);
routes.post('/sessions', _SessionController2.default.store);

routes.use(_auth2.default);

routes.put('/users', _UserController2.default.update);

routes.post('/clients', _ClientController2.default.store);

routes.get('/providers', _ProviderController2.default.index);
routes.get('/providers/:providerId/avaliable', _AvaliableController2.default.index);

routes.post('/files', upload.single('file'), _FileController2.default.store);
// routes.post('/files', upload.single('file'), FileController.store);

routes.post('/appointments', _AppointmentController2.default.store);
routes.get('/appointments', _AppointmentController2.default.index);
routes.delete('/appointments/:id', _AppointmentController2.default.delete);

routes.get('/schedules', _ScheduleController2.default.index);

routes.get('/notifications', _NotificationController2.default.index);
routes.put('/notifications/:id', _NotificationController2.default.update);

exports. default = routes;