const Card = require('../models/card');
const DataNotFoundError = require('../errors/DataNotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  const { _id } = req.user;

  Card.find({})
    .populate(['owner'])
    .then((cards) => res.send({ data: cards.filter((card) => card.owner._id.toString() === _id) }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    title,
    description,
    imgLink,
    link,
  } = req.body;
  const { _id } = req.user;

  Card.create({
    title,
    description,
    imgLink,
    link,
    owner: _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new DataNotFoundError('Карточка с указанным _id не найдена.'));
      }
      if (_id !== card.owner.toString()) {
        return next(new ForbiddenError('Недостаточно прав'));
      }

      card.remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

// module.exports.likeCard = (req, res, next) => {
//   const { cardId } = req.params;
//   const { _id } = req.user;

//   Card.findByIdAndUpdate(
//     cardId,
//     { $addToSet: { likes: _id } },
//     { new: true },
//   )
//     .populate(['owner'])
//     .then((card) => {
//       if (!card) {
//         return next(new DataNotFoundError('Передан несуществующий _id карточки.'));
//       }

//       res.send({ data: card });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
//       }

//       next(err);
//     });
// };

// module.exports.dislikeCard = (req, res, next) => {
//   const { cardId } = req.params;
//   const { _id } = req.user;

//   Card.findByIdAndUpdate(
//     cardId,
//     { $pull: { likes: _id } },
//     { new: true },
//   )
//     .populate(['owner''])
//     .then((card) => {
//       if (!card) {
//         return next(new DataNotFoundError('Передан несуществующий _id карточки.'));
//       }

//       res.send({ data: card });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
//       }

//       next(err);
//     });
// };
