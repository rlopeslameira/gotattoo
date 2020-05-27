import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import {Op} from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class ScheduleController {
  async index(req, res){

    const checkUserProvider = await User.findOne({
      where: {id: req.userId, provider: true}
    });

    if (!checkUserProvider){
      return res.status(401).json({error: 'User is nor a provider.'});
    }
    
    const { date } = req.query;
    const parseDate = parseISO(date);
    
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null, 
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }],
      order: ['date']
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();