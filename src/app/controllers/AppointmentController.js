import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import { startOfHour, isBefore, parseISO, format, subHours } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import * as Yup from 'yup';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { provider_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable', 'detalhes'],
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }]
      }],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      tattoo_id: Yup.number().nullable(true),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' })
    }

    const { user_id, date, tattoo_id, detalhes } = req.body;

    /**
     * Check for past date
     */

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.json({ error: 'Past dates are not permited.' })
    }

    /**
     * Check date avaliability
     */
    const checkAvaliability = await Appointment.findOne({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: hourStart,
      }
    })

    if (checkAvaliability) {
      return res.json({ error: 'Appointment date is not avaliable.' });
    }

    const appointment = await Appointment.create({
      provider_id: req.userId,
      user_id,
      tattoo_id,
      date: hourStart,
      detalhes,
    });

    /**
     * Notify appointment provider
     */
    // const formatedDate = format(hourStart, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", { locale: ptBr });
    // const user = await User.findByPk(user_id);

    // await Notification.create({
    //   content: `Novo agendamento de ${user.name} ${formatedDate}`,
    //   user: req.userId
    // })

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'provider',
        attributes: ['name', 'email']
      }, {
        model: User,
        as: 'user',
        attributes: ['name']
      }]
    });

    if (appointment.provider_id !== req.userId)
      return res.json({ error: 'You don´t have permission to cancel this appointment.' })

    const dateWithSub = subHours(appointment.date, 2);

    // if (isBefore(dateWithSub, new Date()))
    //   return res.json({ error: 'Você só pode cancelar agendamentos com 2 horas de antecedência.' })

    appointment.canceled_at = new Date();
    await appointment.save();

    // return res.json(appointment);
    // console.log(appointment);
    // await Mail.sendMail({
    //   to: `${appointment.provider.name} <${appointment.provider.email}>`,
    //   subject: 'Agendamento cancelado',
    //   template: 'cancellation',
    //   context: {
    //     provider: appointment.provider.name,
    //     user: appointment.user.name,
    //     date: format(appointment.date, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", {locale: ptBr})
    //   }
    // });

    return res.json(appointment);

  }
}

export default new AppointmentController();